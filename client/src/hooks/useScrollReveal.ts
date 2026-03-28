/**
 * useScrollReveal — Hook for scroll-triggered reveal animations
 * Uses IntersectionObserver for performance
 */
import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useScrollReveal<T extends HTMLElement = HTMLDivElement>(
  options: UseScrollRevealOptions = {}
) {
  const { threshold = 0.15, rootMargin = '0px 0px -40px 0px', once = true } = options;
  const ref = useRef<T>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return { ref, isVisible };
}

/**
 * useStaggerReveal — Hook for staggered reveal of multiple items
 */
export function useStaggerReveal(itemCount: number, baseDelay = 80) {
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();
  
  const getDelay = (index: number) => ({
    transitionDelay: isVisible ? `${index * baseDelay}ms` : '0ms',
    opacity: isVisible ? 1 : 0,
    transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
    transition: 'all 0.6s cubic-bezier(0.22, 1, 0.36, 1)',
  });

  return { ref, isVisible, getDelay };
}

/**
 * useCountUp — Hook for animated counting
 */
export function useCountUp(end: number, duration = 2000) {
  const [count, setCount] = useState(0);
  const { ref, isVisible } = useScrollReveal<HTMLDivElement>();

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // easeOutCubic
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    
    requestAnimationFrame(step);
  }, [isVisible, end, duration]);

  return { ref, count, isVisible };
}
