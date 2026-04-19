'use client'

import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { Button } from './button'
import { useRouter } from 'next/navigation'

interface AnimatedCardProps {
  icon: LucideIcon
  title: string
  description: string
  buttonText: string
  buttonIcon?: LucideIcon
  variant?: 'default' | 'outline'
  href: string
  delay?: number
}

export function AnimatedCard({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonIcon: ButtonIcon,
  variant = 'default',
  href,
  delay = 0,
}: AnimatedCardProps) {
  const router = useRouter()

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <div className="absolute -inset-0 rounded-lg bg-primary/10 opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100" />
      
      <div className="relative flex flex-col items-center gap-4 overflow-hidden rounded-lg border bg-card p-6 text-center shadow-sm">
        <div className="absolute inset-0 bg-primary/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
        
        <motion.div
          className="relative flex size-12 items-center justify-center rounded-lg bg-primary/10"
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
        >
          <Icon className="text-primary" />
        </motion.div>

        <div className="relative flex flex-col gap-2">
          <h2 className="text-xl font-semibold group-hover:text-primary transition-colors">
            {title}
          </h2>
          <p className="text-muted-foreground text-sm group-hover:text-foreground/80 transition-colors">
            {description}
          </p>
        </div>

        <Button
          onClick={() => router.push(href)}
          variant={variant}
          className="relative mt-2 w-full overflow-hidden group/button"
        >
          <span className="relative z-10 flex items-center">
            {ButtonIcon && <ButtonIcon data-icon="inline-start" />}
            {buttonText}
          </span>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
            initial={{ x: '-100%' }}
            whileHover={{ x: '100%' }}
            transition={{ duration: 0.6 }}
          />
        </Button>
      </div>
    </motion.div>
  )
}

export const cardHoverEffect = {
  scale: 1.02,
  transition: { type: 'spring' as const, stiffness: 400, damping: 25 },
}
