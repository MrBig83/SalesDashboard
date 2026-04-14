import type { PropsWithChildren } from 'react'

import { useRevealOnScroll } from '../../../hooks/useRevealOnScroll'
import './Reveal.css'

interface RevealProps {
  className?: string
}

export const Reveal = ({
  children,
  className = '',
}: PropsWithChildren<RevealProps>) => {
  const { elementRef, isVisible } = useRevealOnScroll<HTMLDivElement>()

  return (
    <div
      ref={elementRef}
      className={`reveal ${isVisible ? 'reveal--visible' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  )
}
