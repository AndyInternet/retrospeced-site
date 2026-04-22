export function tokenColor(n: number): 'red' | 'yellow' | 'dim' {
  return n > 20000 ? 'red' : n >= 15000 ? 'yellow' : 'dim';
}
