'use client'

import React, { useRef, useState, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger)

interface HorizontalScrollProps {
  children: React.ReactNode
  className?: string
  innerClassName?: string
  speed?: number
}

export default function HorizontalScroll({
  children,
  className = '',
  innerClassName = '',
  speed = 1,
}: HorizontalScrollProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useGSAP(() => {
    if (isMobile || !sectionRef.current || !trackRef.current) return

    const track = trackRef.current
    const totalWidth = track.scrollWidth - window.innerWidth

    if (totalWidth <= 0) return

    const horizontalTween = gsap.to(track, {
      x: -totalWidth,
      ease: 'none',
      scrollTrigger: {
        id: 'horizontalScroll',
        trigger: sectionRef.current,
        start: 'top top',
        end: () => `+=${totalWidth * speed}`,
        scrub: 1,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
      },
    })

    // Animate individual cards as they enter the viewport
    const cards = track.querySelectorAll('.hscard')
    cards.forEach((card, i) => {
      gsap.fromTo(
        card,
        {
          scale: 0.88,
          opacity: 0.4,
          rotateY: 4,
        },
        {
          scale: 1,
          opacity: 1,
          rotateY: 0,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalTween,
            start: 'left 80%',
            end: 'left 30%',
            scrub: 1,
            // Use the parent horizontal animation context
            horizontal: true,
          },
        }
      )
    })
  }, { scope: sectionRef, dependencies: [isMobile] })

  // Mobile: vertical stack
  if (isMobile) {
    return (
      <div className={`flex flex-col gap-4 px-4 ${className}`}>
        {React.Children.map(children, (child) => (
          <div className="w-full">{child}</div>
        ))}
      </div>
    )
  }

  return (
    <div ref={sectionRef} className={`relative overflow-hidden ${className}`}>
      <div
        ref={trackRef}
        className={`flex items-stretch gap-6 will-change-transform ${innerClassName}`}
        style={{ width: 'max-content' }}
      >
        {React.Children.map(children, (child) => (
          <div
            className="hscard flex-shrink-0"
            style={{
              width: 'clamp(320px, 36vw, 480px)',
              perspective: '1200px',
            }}
          >
            {child}
          </div>
        ))}
      </div>
    </div>
  )
}
