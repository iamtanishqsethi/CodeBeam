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
    <div className="flex flex-col items-center gap-4 rounded-lg border bg-card p-6 text-center shadow-sm">
      <Skeleton className="size-12 rounded-lg" />
      <div className="flex w-full flex-col gap-2">
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
    <div className="flex flex-col gap-2">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-12 w-full rounded-lg" />
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
      className="min-h-screen bg-background px-6 pt-20"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-8 py-12">
        <div className="flex flex-col gap-2 text-center">
          <Skeleton className="h-10 w-48 mx-auto" />
          <Skeleton className="h-5 w-64 mx-auto" />
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    </motion.div>
  )
}
