export interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  duration?: number;
}

class NotificationManager {
  private toasts: Toast[] = [];
  private listeners: ((toasts: Toast[]) => void)[] = [];

  subscribe(listener: (toasts: Toast[]) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener([...this.toasts]));
  }

  addToast(toast: Omit<Toast, 'id'>) {
    const id = Date.now().toString();
    const newToast: Toast = {
      ...toast,
      id,
      duration: toast.duration || 5000
    };

    this.toasts.push(newToast);
    this.notify();

    // Auto remove after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        this.removeToast(id);
      }, newToast.duration);
    }
  }

  removeToast(id: string) {
    this.toasts = this.toasts.filter(toast => toast.id !== id);
    this.notify();
  }

  // Helper methods for common scenarios
  showApiKeyError(provider: string, error: string) {
    this.addToast({
      type: 'error',
      title: `🔑 API Key Error - ${provider}`,
      message: `API Key Error: ${error}`,
      duration: 7000
    });
  }

  showApiKeySuccess(provider: string) {
    this.addToast({
      type: 'success',
      title: `✅ API Key Verified - ${provider}`,
      message: 'API key verified successfully',
      duration: 3000
    });
  }

  showConnectionError(provider: string) {
    this.addToast({
      type: 'warning',
      title: `⚠️ Connection Issue - ${provider}`,
      message: 'Unable to connect to service. Please check your API key and internet connection',
      duration: 6000
    });
  }

  showInvalidApiKey(provider: string) {
    this.addToast({
      type: 'error',
      title: `❌ Invalid API Key - ${provider}`,
      message: 'API key is invalid. Please enter a valid key',
      duration: 5000
    });
  }
}

export const notificationManager = new NotificationManager(); 