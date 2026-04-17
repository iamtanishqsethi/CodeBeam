'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react'
import { useEffect } from 'react'

type ToastType = 'success' | 'error' | 'warning' | 'info'

interface ToastProps {
  type: ToastType
  message: string
  isVisible: boolean
  onClose: () => void
  duration?: number
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    className: 'bg-green-500/10 border-green-500/50 text-green-600 dark:text-green-400',
  },
  error: {
    icon: XCircle,
    className: 'bg-red-500/10 border-red-500/50 text-red-600 dark:text-red-400',
  },
  warning: {
    icon: AlertCircle,
    className: 'bg-yellow-500/10 border-yellow-500/50 text-yellow-600 dark:text-yellow-400',
  },
  info: {
    icon: Info,
    className: 'bg-blue-500/10 border-blue-500/50 text-blue-600 dark:text-blue-400',
  },
}

export function Toast({ type, message, isVisible, onClose, duration = 5000 }: ToastProps) {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const config = toastConfig[type]
  const Icon = config.icon

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.3 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={`fixed bottom-6 right-6 z-[100] flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg backdrop-blur-sm ${config.className}`}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25, delay: 0.1 }}
          >
            <Icon className="h-5 w-5" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm font-medium"
          >
            {message}
          </motion.p>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="ml-2 p-1 rounded-full hover:bg-black/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
