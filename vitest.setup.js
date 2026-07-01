import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock next/navigation globally so components that import it don't break
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))
