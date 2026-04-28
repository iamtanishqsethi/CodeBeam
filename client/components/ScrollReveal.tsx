'use client'

import React, { useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

interface ScrollRevealProps {
  children: React.ReactNode
  direction?: 'up' | 'down' | 'left' | 'right'
  distance?: number
  duration?: number
  delay?: number
  stagger?: number
  scrub?: boolean | number
  once?: boolean
  start?: string
  end?: string
  className?: string
  as?: React.ElementType
}

export default function ScrollReveal({
  children,
  direction = 'up',
  distance = 60,
  duration = 1,
  delay = 0,
  stagger = 0,
  scrub = false,
  once = true,
  start = 'top 85%',
  end = 'top 20%',
  className = '',
  as: Tag = 'div',
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  const getFrom = () => {
    switch (direction) {
      case 'up':
        return { y: distance, opacity: 0 }
      case 'down':
        return { y: -distance, opacity: 0 }
      case 'left':
        return { x: distance, opacity: 0 }
      case 'right':
        return { x: -distance, opacity: 0 }
    }
  }

  const getTo = () => {
    switch (direction) {
      case 'up':
      case 'down':
        return { y: 0, opacity: 1 }
      case 'left':
      case 'right':
        return { x: 0, opacity: 1 }
    }
  }

  useGSAP(() => {
    if (!containerRef.current) return

    const targets = stagger > 0
      ? containerRef.current.children
      : containerRef.current

    gsap.fromTo(targets, getFrom(), {
      ...getTo(),
      duration,
      delay,
      stagger: stagger > 0 ? stagger : undefined,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: containerRef.current,
        start,
        end,
        scrub: scrub,
        toggleActions: once ? 'play none none none' : 'play reverse play reverse',
      },
    })
  }, { scope: containerRef })

  return (
    <Tag ref={containerRef} className={className}>
      {children}
    </Tag>
  )
}

/**
 * Split text into words wrapped in spans for word-by-word animation.
 * Use with GSAP SplitText-style reveals.
 */
export function SplitWords({
  text,
  className = '',
  wordClassName = '',
}: {
  text: string
  className?: string
  wordClassName?: string
}) {
  const words = text.split(' ')
  return (
    <span className={className}>
      {words.map((word, i) => (
        <span
          key={i}
          className={`inline-block overflow-hidden ${i < words.length - 1 ? 'mr-[0.3em]' : ''}`}
        >
          <span className={`inline-block split-word ${wordClassName}`}>
            {word}
          </span>
        </span>
      ))}
    </span>
  )
}

/**
 * Split text into individual characters wrapped in spans.
 */
export function SplitChars({
  text,
  className = '',
  charClassName = '',
}: {
  text: string
  className?: string
  charClassName?: string
}) {
  return (
    <span className={className}>
      {text.split('').map((char, i) => (
        <span
          key={i}
          className="inline-block overflow-hidden"
        >
          <span className={`inline-block split-char ${charClassName}`}>
            {char === ' ' ? '\u00A0' : char}
          </span>
        </span>
      ))}
    </span>
  )
}
