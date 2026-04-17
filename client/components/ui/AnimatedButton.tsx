'use client'

import { motion, type HTMLMotionProps } from 'framer-motion'
import { cn } from '@/lib/utils'
import { buttonVariants } from './button'

interface AnimatedButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'xs' | 'sm' | 'lg' | 'icon' | 'icon-xs' | 'icon-sm' | 'icon-lg'
  children: React.ReactNode
  className?: string
  enableHoverEffect?: boolean
}

export function AnimatedButton({
  variant = 'default',
  size = 'default',
  children,
  className,
  enableHoverEffect = true,
  ...props
}: AnimatedButtonProps) {
  return (
    <motion.button
      whileHover={enableHoverEffect ? { scale: 1.02, y: -1 } : {}}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className={cn(
        buttonVariants({ variant, size }),
        'relative overflow-hidden',
        className
      )}
      {...props}
    >
      {enableHoverEffect && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          initial={{ x: '-100%' }}
          whileHover={{ x: '100%' }}
          transition={{ duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
