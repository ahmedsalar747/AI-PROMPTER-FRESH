import '@testing-library/jest-dom'

// Mock localStorage
// const localStorageMock = {
//   getItem: vi.fn(),
//   setItem: vi.fn(),
//   removeItem: vi.fn(),
//   clear: vi.fn(),
// }

// Mock sessionStorage
// const sessionStorageMock = {
//   getItem: vi.fn(),
//   setItem: vi.fn(),
//   removeItem: vi.fn(),
//   clear: vi.fn(),
// }

// Object.defineProperty(window, 'localStorage', {
//   value: localStorageMock,
// })

// Object.defineProperty(window, 'sessionStorage', {
//   value: sessionStorageMock,
// })

// Mock environment variables
// Object.defineProperty(import.meta, 'env', {
//   value: {
//     DEV: false,
//     PROD: true,
//     VITE_APP_TITLE: 'Prompter Fresh',
//     VITE_APP_VERSION: '1.0.0',
//     VITE_FREE_API_MAX_TOKENS: '200',
//     VITE_FREE_API_MAX_REQUESTS: '3',
//     VITE_OPENAI_MODEL: 'gpt-3.5-turbo',
//   },
// })

// Mock Capacitor
// vi.mock('@capacitor/core', () => ({
//   Capacitor: {
//     getPlatform: () => 'web',
//     isPluginAvailable: () => false,
//   },
// }))

// Mock IntersectionObserver
// global.IntersectionObserver = class IntersectionObserver {
//   constructor() {}
//   disconnect() {}
//   observe() {}
//   unobserve() {}
// }

// Mock ResizeObserver
// global.ResizeObserver = class ResizeObserver {
//   constructor() {}
//   disconnect() {}
//   observe() {}
//   unobserve() {}
// }

// Mock fetch
// global.fetch = vi.fn()

// Cleanup after each test
// afterEach(() => {
//   cleanup()
//   vi.clearAllMocks()
//   localStorageMock.clear()
//   sessionStorageMock.clear()
// })

// Setup before all tests
// beforeAll(() => {
//   // Mock console methods in tests
//   vi.spyOn(console, 'error').mockImplementation(() => {})
//   vi.spyOn(console, 'warn').mockImplementation(() => {})
//   vi.spyOn(console, 'log').mockImplementation(() => {})
// })

// Cleanup after all tests
// afterAll(() => {
//   vi.restoreAllMocks()
// }) 