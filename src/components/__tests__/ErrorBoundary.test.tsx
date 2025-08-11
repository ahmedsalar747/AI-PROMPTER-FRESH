import { render, screen } from '@testing-library/react'
import { userEvent } from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { ErrorBoundary } from '../ErrorBoundary'

// Component that throws error for testing
const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error')
  }
  return <div>No error</div>
}

describe('ErrorBoundary', () => {
  it('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={false} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('No error')).toBeInTheDocument()
  })

  it('renders error UI when there is an error', () => {
    // Suppress console.error for this test
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('🚨 Unexpected Error')).toBeInTheDocument()
    expect(screen.getByText('Unfortunately, an issue occurred in the application.')).toBeInTheDocument()
    expect(screen.getByText('🔄 Retry')).toBeInTheDocument()
    expect(screen.getByText('🔄 Reload')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('renders custom fallback when provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const customFallback = <div>Custom error message</div>
    
    render(
      <ErrorBoundary fallback={customFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Custom error message')).toBeInTheDocument()
    expect(screen.queryByText('🚨 Unexpected Error')).not.toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('handles retry button click', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const user = userEvent.setup()
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    // Error UI should be visible
    expect(screen.getByText('🚨 Unexpected Error')).toBeInTheDocument()
    
    const retryButton = screen.getByText('🔄 Retry')
    
    // Test that retry button exists and is clickable
    expect(retryButton).toBeInTheDocument()
    await user.click(retryButton)
    
    // After retry click, the error boundary should attempt to reset
    // The retry button should still be there since the component will throw again
    expect(screen.getByText('🚨 Unexpected Error')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('handles reload button click', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    // Mock window.location.reload properly
    const originalLocation = window.location
    Object.defineProperty(window, 'location', {
      value: { ...originalLocation, reload: vi.fn() },
      writable: true,
    })
    
    const user = userEvent.setup()
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    const reloadButton = screen.getByText('🔄 Reload')
    await user.click(reloadButton)
    
    expect(window.location.reload).toHaveBeenCalled()
    
    // Restore original location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    })
    
    consoleSpy.mockRestore()
  })

  it('calls custom error handler when provided', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    const onErrorSpy = vi.fn()
    
    render(
      <ErrorBoundary onError={onErrorSpy}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(onErrorSpy).toHaveBeenCalledWith(
      expect.any(Error),
      expect.objectContaining({
        componentStack: expect.any(String)
      })
    )
    
    consoleSpy.mockRestore()
  })

  it('shows error details in development mode', () => {
    const originalNodeEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Error details (development only)')).toBeInTheDocument()
    
    process.env.NODE_ENV = originalNodeEnv
    consoleSpy.mockRestore()
  })
}) 