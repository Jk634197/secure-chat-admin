
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
        // Initialize token from localStorage if exists
        this.token = localStorage.getItem('auth-token');
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

            if (!response.ok) {
                return { success: false, error: 'Login failed' };
            }

            const LoginApiResponse = await response.json() as LoginResponse;
            const { data, success } = LoginApiResponse;
            if (success && data?.token && data.role === 'superadmin') {
                this.token = data.token;
                localStorage.setItem('auth-token', data.token);
                localStorage.setItem('user-role', data.role);
                localStorage.setItem('user-data', JSON.stringify(data));
                return { success: true, user: data };
            }

            return { success: false, error: 'Unauthorized access' };
        } catch (error) {
            return { success: false, error: 'Login failed' };
        }
    }

    getToken(): string | null {
        return this.token;
    }

    isAuthenticated(): boolean {
        return Boolean(this.token) && localStorage.getItem('user-role') === 'superadmin';
    }

    logout(): void {
        this.token = null;
        localStorage.removeItem('auth-token');
        localStorage.removeItem('user-role');
        localStorage.removeItem('user-data');
    }

    getUser(): LoginResponse['data'] | null {
        const userData = localStorage.getItem('user-data');
        if (!userData) return null;
        try {
            return JSON.parse(userData) as LoginResponse['data'];
        } catch {
            return null;
        }
    }
}

export const authService = new AuthService();

