export const isBrowser = typeof window !== 'undefined';

export const getStorageItem = (key: string): string | null => {
    if (!isBrowser) return null;
    return localStorage.getItem(key);
};

export const setStorageItem = (key: string, value: string): void => {
    if (!isBrowser) return;
    localStorage.setItem(key, value);
};

export const removeStorageItem = (key: string): void => {
    if (!isBrowser) return;
    localStorage.removeItem(key);
};

export const clearStorage = (): void => {
    if (!isBrowser) return;
    localStorage.clear();
}; 