import type { Variants, Easing } from 'framer-motion'

const easeOut: Easing = [0.25, 0.46, 0.45, 0.94]
const easeInOut: Easing = [0.42, 0, 0.58, 1]
const easeOutExpo: Easing = [0.16, 1, 0.3, 1]

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
}

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.2 } },
}

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: easeOut } },
  exit: { opacity: 0, y: -24, transition: { duration: 0.2 } },
}

export const slideFromRight: Variants = {
  hidden: { opacity: 0, x: 32 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: easeOut } },
  exit: { opacity: 0, x: 32, transition: { duration: 0.2 } },
}

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: easeOut } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
}

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } },
}

export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: easeOut } },
  exit: { opacity: 0, y: -8, transition: { duration: 0.2 } },
}

export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
}

export const modalContent: Variants = {
  hidden: { opacity: 0, scale: 0.95, y: 16 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.25, ease: easeOut } },
  exit: { opacity: 0, scale: 0.95, y: 16, transition: { duration: 0.2 } },
}

export const toastEnter: Variants = {
  hidden: { opacity: 0, x: 48, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.3, ease: easeOut } },
  exit: { opacity: 0, x: 48, scale: 0.95, transition: { duration: 0.2 } },
}

export const tooltipEnter: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 8 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15, ease: easeOut } },
  exit: { opacity: 0, scale: 0.9, y: 8, transition: { duration: 0.1 } },
}

export const dropdownEnter: Variants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.15, ease: easeOut } },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.1 } },
}

export const skeletonPulse: Variants = {
  initial: { opacity: 0.4 },
  animate: { opacity: 1, transition: { duration: 1.2, repeat: Infinity, ease: easeInOut } },
}

export const focusRing = {
  whileFocus: { scale: 1.005, transition: { duration: 0.1 } },
}

export const tapScale = {
  whileTap: { scale: 0.97, transition: { duration: 0.05 } },
}

export const hoverLift = {
  whileHover: { y: -4, transition: { duration: 0.2, ease: easeOut } },
}

export const hoverScale = {
  whileHover: { scale: 1.02, transition: { duration: 0.2, ease: easeOut } },
}