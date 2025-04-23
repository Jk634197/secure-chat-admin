import { getStorageItem, setStorageItem, removeStorageItem } from '../utils/storage';

interface LoginResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: {
        token: string;
        role: string
        id?: string;
        email?: string;
        firstName?: string;
        lastName?: string;
        avatar?: string;
    };
}

class AuthService {
    private token: string | null = null;

    constructor() {
        // Initialize token from storage if exists
        this.token = getStorageItem('auth-token');
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (this.token) {
            headers['Authorization'] = `Bearer ${this.token}`;
        }

        return headers;
    }

    async login(email: string, password: string): Promise<{ success: boolean; error?: string; user?: LoginResponse['data'] }> {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({ username: email, passcode: password }),
            });

            const LoginApiResponse = await response.json() as LoginResponse;
            const { data, success, message } = LoginApiResponse;

            if (success && data?.token && data.role === 'superadmin') {
                this.token = data.token;
                setStorageItem('auth-token', data.token);
                setStorageItem('user-role', data.role);
                setStorageItem('user-data', JSON.stringify(data));
                return { success: true, user: data };
            }

            return {
                success: false,
                error: message || 'Unauthorized access. Only superadmin users are allowed.'
            };
        } catch (error) {
            return {
                success: false,
                error: error instanceof Error ? error.message : 'An error occurred during login. Please try again.'
            };
        }
    }

    getToken(): string | null {
        return this.token;
    }

    isAuthenticated(): boolean {
        return Boolean(this.token) && getStorageItem('user-role') === 'superadmin';
    }

    logout(): void {
        this.token = null;
        removeStorageItem('auth-token');
        removeStorageItem('user-role');
        removeStorageItem('user-data');
    }

    getUser(): LoginResponse['data'] | null {
        const userData = getStorageItem('user-data');
        if (!userData) return null;
        try {
            return JSON.parse(userData) as LoginResponse['data'];
        } catch {
            return null;
        }
    }
}

export const authService = new AuthService();

