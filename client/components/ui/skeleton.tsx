'use client'

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <motion.div
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
      }}
      className={cn('animate-pulse rounded-md bg-muted', className)}
    />
  )
}

export function CardSkeleton() {
  return (
    <div className="border rounded-2xl p-6 bg-card shadow-sm flex flex-col gap-4 items-center text-center">
      <Skeleton className="h-12 w-12 rounded-xl" />
      <div className="space-y-2 w-full">
        <Skeleton className="h-6 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
      </div>
      <Skeleton className="h-10 w-full mt-2" />
    </div>
  )
}

export function InputSkeleton() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  )
}

export function ButtonSkeleton() {
  return <Skeleton className="h-10 w-32 rounded-md" />
}

export function PageSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background pt-20 px-6"
    >
      <div className="max-w-4xl mx-auto py-12 space-y-8">
        <div className="text-center space-y-2">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </motion.div>
  )
}
