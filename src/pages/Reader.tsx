import { useEffect, useRef, useState, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { usePurchases } from '@/hooks/usePurchases'
import { getSignedUrlForPDF } from '@/services/storage'
import { Button } from '@/components/Button'
import { formatCurrency } from '@/utils/format'
import { ArrowLeft, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize, Minimize, RotateCcw, Download, X } from 'lucide-react'
import { cn } from '@/utils/format'

export function Reader() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { user, profile } = useAuth()
  const { data: purchases } = usePurchases()
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [numPages, setNumPages] = useState(0)
  const [pageNumber, setPageNumber] = useState(1)
  const [scale, setScale] = useState(1)
  const [containerWidth, setContainerWidth] = useState(0)
  const pdfjsLib = useRef<any>(null)
  const pdfDoc = useRef<any>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const hasAccess = purchases?.some(p => p.product_id === id && p.status === 'active')
  const product = purchases?.find(p => p.product_id === id)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }

    if (!hasAccess) {
      navigate('/dashboard')
      return
    }

    loadPDF()
  }, [user, hasAccess, id, navigate])

  const loadPDF = async () => {
    if (!product?.product?.storage_path) {
      setError('PDF file not found')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const url = await getSignedUrlForPDF(product.product.storage_path)
      setPdfUrl(url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load PDF')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!pdfUrl) return

    const loadPdfjs = async () => {
      const pdfjs = await import('pdfjs-dist')
      pdfjsLib.current = pdfjs
      
      pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
      
      try {
        const loadingTask = pdfjs.getDocument({ url: pdfUrl })
        const doc = await loadingTask.promise
        pdfDoc.current = doc
        setNumPages(doc.numPages)
        renderPage(1)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load PDF document')
      }
    }

    loadPdfjs()

    return () => {
      if (pdfDoc.current) {
        pdfDoc.current.destroy()
        pdfDoc.current = null
      }
    }
  }, [pdfUrl])

  const renderPage = async (num: number) => {
    if (!pdfDoc.current || !canvasRef.current || !pdfjsLib.current) return

    try {
      const page = await pdfDoc.current.getPage(num)
      const viewport = page.getViewport({ scale })
      
      const canvas = canvasRef.current
      const context = canvas.getContext('2d')
      if (!context) return

      canvas.width = viewport.width
      canvas.height = viewport.height

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
      }

      await page.render(renderContext).promise
      setPageNumber(num)
    } catch (err) {
      console.error('Error rendering page:', err)
    }
  }

  const handleResize = useCallback(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth)
    }
  }, [])

  useEffect(() => {
    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [handleResize])

  const goToPage = (num: number) => {
    if (num >= 1 && num <= numPages) {
      renderPage(num)
    }
  }

  const zoomIn = () => {
    const newScale = Math.min(scale + 0.25, 3)
    setScale(newScale)
    if (pageNumber > 0) renderPage(pageNumber)
  }

  const zoomOut = () => {
    const newScale = Math.max(scale - 0.25, 0.5)
    setScale(newScale)
    if (pageNumber > 0) renderPage(pageNumber)
  }

  const fitToWidth = () => {
    if (!containerRef.current || !pdfDoc.current) return
    
    const containerWidth = containerRef.current.clientWidth - 32
    pdfDoc.current.getPage(pageNumber).then((page: any) => {
      const viewport = page.getViewport({ scale: 1 })
      const newScale = containerWidth / viewport.width
      setScale(Math.min(Math.max(newScale, 0.5), 3))
      renderPage(pageNumber)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="max-w-md text-center">
          <X className="mx-auto h-12 w-12 text-danger mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Unable to Load PDF</h1>
          <p className="mt-2 text-gray-600">{error}</p>
          <Link to="/dashboard" className="mt-6 inline-block">
            <Button>Back to Dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <header className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-10">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-5 w-5" />
            Back to Dashboard
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {product?.product?.title}
            </span>
            <span className="px-2 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full">
              {formatCurrency(product?.product?.price || 0)}
            </span>
          </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-gray-200 border-b border-gray-300 px-4 py-3 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => goToPage(pageNumber - 1)} disabled={pageNumber <= 1}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="px-3 py-1 text-sm font-medium bg-white border border-gray-300 rounded min-w-[80px] text-center">
              Page {pageNumber} of {numPages}
            </span>
            <Button variant="outline" size="sm" onClick={() => goToPage(pageNumber + 1)} disabled={pageNumber >= numPages}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={zoomOut} disabled={scale <= 0.5} title="Zoom Out">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="px-3 py-1 text-sm font-medium bg-white border border-gray-300 rounded min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <Button variant="outline" size="sm" onClick={zoomIn} disabled={scale >= 3} title="Zoom In">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={fitToWidth} title="Fit to Width">
              <Maximize className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div 
          ref={containerRef}
          className="flex-1 flex items-center justify-center overflow-auto p-4 bg-gray-200"
          style={{ minHeight: 0 }}
        >
          <div className="bg-white shadow-lg" style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}>
            <canvas
              ref={canvasRef}
              className="pdf-canvas"
              style={{ display: 'block' }}
            />
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Page</span>
            <input
              type="number"
              min="1"
              max={numPages}
              value={pageNumber}
              onChange={(e) => goToPage(parseInt((e.target as HTMLInputElement).value) || 1)}
              onBlur={(e) => goToPage(parseInt((e.target as HTMLInputElement).value) || 1)}
              onKeyDown={(e) => e.key === 'Enter' && goToPage(parseInt((e.target as HTMLInputElement).value) || 1)}
              className="w-20 px-2 py-1 border border-gray-300 rounded text-center focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <span>of {numPages}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Zoom:</span>
            <select
              value={Math.round(scale * 100)}
              onChange={(e) => {
                const newScale = parseInt(e.target.value) / 100
                setScale(newScale)
                if (pageNumber > 0) renderPage(pageNumber)
              }}
              className="px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value={50}>50%</option>
              <option value={75}>75%</option>
              <option value={100}>100%</option>
              <option value={125}>125%</option>
              <option value={150}>150%</option>
              <option value={200}>200%</option>
              <option value={300}>300%</option>
            </select>
          </div>
        </div>
      </main>
    </div>
  )
}