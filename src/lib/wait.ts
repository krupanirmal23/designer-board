export function prefersReducedMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}

export function wait(ms: number): Promise<void> {
  if (prefersReducedMotion()) return Promise.resolve()
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}
