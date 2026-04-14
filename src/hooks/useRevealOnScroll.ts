import { useEffect, useRef, useState } from 'react'

export const useRevealOnScroll = <T extends HTMLElement>() => {
  const elementRef = useRef<T | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current

    if (!element) {
      return undefined
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0.2 },
    )

    observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return { elementRef, isVisible }
}
