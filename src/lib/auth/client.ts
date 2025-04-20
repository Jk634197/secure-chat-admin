'use client';

import { authService } from '@/services/auth';
import type { User } from '@/types/user';
import { removeStorageItem } from '../../utils/storage';

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface SignUpParams {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    return { error: 'Sign up not implemented' };
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const result = await authService.login(params.email, params.password);

    if (!result.success) {
      return { error: result.error };
    }

    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | null; error?: string }> {
    const user: User | null = authService.getUser();
    if (!user || !authService.isAuthenticated()) {
      return { data: null };
    }
    return { data: user };
  }

  async signOut(): Promise<{ error?: string }> {
    removeStorageItem('custom-auth-token');
    authService.logout();
    return {};
  }
}

export const authClient = new AuthClient();
