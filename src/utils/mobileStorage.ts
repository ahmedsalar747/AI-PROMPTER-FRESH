
class MobileStorage {
  private static instance: MobileStorage;
  private isAvailable: boolean = false;

  private constructor() {
    this.checkAvailability();
  }

  static getInstance(): MobileStorage {
    if (!MobileStorage.instance) {
      MobileStorage.instance = new MobileStorage();
    }
    return MobileStorage.instance;
  }

  private checkAvailability(): void {
    try {
      if (typeof Storage !== 'undefined' && localStorage) {
        localStorage.setItem('__test__', 'test');
        localStorage.removeItem('__test__');
        this.isAvailable = true;
      }
    } catch (e) {
      console.warn('localStorage غیرقابل دسترس:', e);
      this.isAvailable = false;
    }
  }

  setItem(key: string, value: string): boolean {
    try {
      if (this.isAvailable) {
        localStorage.setItem(key, value);
        return true;
      }
      return false;
    } catch (e) {
      console.warn(`خطا در ذخیره ${key}:`, e);
      return false;
    }
  }

  getItem(key: string): string | null {
    try {
      if (this.isAvailable) {
        return localStorage.getItem(key);
      }
      return null;
    } catch (e) {
      console.warn(`خطا در خواندن ${key}:`, e);
      return null;
    }
  }

  removeItem(key: string): boolean {
    try {
      if (this.isAvailable) {
        localStorage.removeItem(key);
        return true;
      }
      return false;
    } catch (e) {
      console.warn(`خطا در حذف ${key}:`, e);
      return false;
    }
  }

  clear(): boolean {
    try {
      if (this.isAvailable) {
        localStorage.clear();
        return true;
      }
      return false;
    } catch (e) {
      console.warn('خطا در پاک کردن storage:', e);
      return false;
    }
  }

  isStorageAvailable(): boolean {
    return this.isAvailable;
  }
}

export default MobileStorage.getInstance(); 