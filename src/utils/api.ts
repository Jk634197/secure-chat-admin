import { getStorageItem, removeStorageItem } from './storage';

export interface ApiResponse<T> {
    success: boolean;
    statusCode: number;
    data: T;
    message?: string;
}

export async function fetchWithAuth<T>(
    endpoint: string,
    options: RequestInit = {}
): Promise<ApiResponse<T>> {
    // Get token from localStorage or your auth storage
    const token = getStorageItem('auth-token');

    const headers = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...options.headers,
    };

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        // Handle 401 Unauthorized
        if (response.status === 401 || response.status === 403) {
            // Use same logout cleanup as auth.logout()
            removeStorageItem('auth-token');
            removeStorageItem('user-role');
            removeStorageItem('user-data');
            window.location.href = '/';
            throw new Error('Session expired. Please login again.');
        }
        throw new Error(`API call failed: ${response.statusText}`);
    }

    return response.json() as Promise<ApiResponse<T>>;
}
