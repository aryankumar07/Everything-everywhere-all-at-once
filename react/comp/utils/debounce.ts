export function debounce<T extends (...args: Parameters<T>) => void>(fn: T, delay: number) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    timer = setTimeout(() => {
      clearTimeout(timer)
      fn(...args)
    }, delay)
  }
}
