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

    // Only set Content-Type to application/json if not FormData
    const isFormData = options.body instanceof FormData;
    const headers = {
        ...(!isFormData && { 'Content-Type': 'application/json' }),
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

    // If the response is empty (like for file uploads), return a success response
    if (response.status === 204 || response.headers.get('content-length') === '0') {
        return {
            data: {} as T,
            success: true,
            statusCode: response.status
        };
    }

    return response.json() as Promise<ApiResponse<T>>;
}
