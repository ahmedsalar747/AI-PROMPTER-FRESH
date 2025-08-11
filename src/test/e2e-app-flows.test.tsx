import App from '@/App'
import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it } from 'vitest'

// Helper to render the app at a specific route
const renderAtRoute = (initialRoute: string = '/') => {
  return render(
    <MemoryRouter initialEntries={[initialRoute]}>
      <App />
    </MemoryRouter>
  )
}

describe('🧭 E2E App Flows - Navigation & Layout', () => {
  beforeEach(() => {
    // Reset viewport to desktop by default
    ;(window as any).innerWidth = 1024
  })

  it('should show Dashboard by default', () => {
    renderAtRoute('/')
    expect(screen.getByRole('heading', { level: 2, name: 'Dashboard' })).toBeInTheDocument()
  })

  it('should navigate to AI Generator via sidebar', () => {
    const { container } = renderAtRoute('/')
    fireEvent.click(screen.getByRole('link', { name: 'AI Generator' }))
    const active = container.querySelector('a.nav-item.active .nav-label')
    expect(active?.textContent).toBe('AI Generator')
  })

  it('should navigate to Manual Builder', () => {
    renderAtRoute('/')
    fireEvent.click(screen.getByText('Manual Builder'))
    expect(screen.getByRole('heading', { level: 2, name: 'Manual Builder' })).toBeInTheDocument()
  })

  it('should navigate to My Prompts', () => {
    const { container } = renderAtRoute('/')
    fireEvent.click(screen.getByRole('link', { name: 'My Prompts' }))
    const active = container.querySelector('a.nav-item.active .nav-label')
    expect(active?.textContent).toBe('My Prompts')
  })

  it('should navigate to Conversational Wizard', () => {
    const { container } = renderAtRoute('/')
    fireEvent.click(screen.getByRole('link', { name: 'Conversational Wizard' }))
    const active = container.querySelector('a.nav-item.active .nav-label')
    expect(active?.textContent).toBe('Conversational Wizard')
  })

  it('should navigate to Settings', () => {
    const { container } = renderAtRoute('/')
    fireEvent.click(screen.getByRole('link', { name: 'Settings' }))
    const active = container.querySelector('a.nav-item.active .nav-label')
    expect(active?.textContent).toBe('Settings')
  })
})

describe('🔗 Hidden routes are accessible directly', () => {
  it('should render Billing Test when navigating directly', () => {
    renderAtRoute('/billing-test')
    expect(screen.getByRole('heading', { level: 2, name: 'Billing Test' })).toBeInTheDocument()
  })

  it('should render Premium when navigating directly', () => {
    renderAtRoute('/premium')
    expect(screen.getByRole('heading', { level: 2, name: 'Premium' })).toBeInTheDocument()
  })

  it('should render User Profile when navigating directly', () => {
    renderAtRoute('/profile')
    expect(screen.getByRole('heading', { level: 2, name: 'User Profile' })).toBeInTheDocument()
  })
})

describe('📱 Mobile sidebar behavior', () => {
  it('should toggle sidebar on mobile via menu button and show overlay', () => {
    ;(window as any).innerWidth = 375
    const { container } = renderAtRoute('/')

    // Sidebar should be closed initially on mobile, open when menu is clicked
    const toggleBtn = container.querySelector('.menu-toggle') as HTMLButtonElement
    expect(toggleBtn).toBeTruthy()
    fireEvent.click(toggleBtn)

    // Overlay should appear when sidebar is open on mobile
    const overlay = container.querySelector('.mobile-overlay')
    expect(overlay).toBeTruthy()

    // Clicking overlay should close sidebar
    overlay && fireEvent.click(overlay)
    expect(container.querySelector('.mobile-overlay')).toBeNull()
  })
})

