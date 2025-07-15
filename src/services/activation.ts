import { fetchWithAuth, type ApiResponse } from '@/utils/api';

export interface ActivationData {
    _id: string;
    code: string;
    expiresAt: string;
    status: string;
    createdBy: string;
    userId: {
        _id: string;
        username: string;
        email: string;
        sid: string;
    }
}

export interface ActivationResponse {
    success: boolean;
    statusCode: number;
    message: string;
    data: ActivationData[];
}

export interface GenerateActivationResponse {
    code: string;
    qrCode: string;
    email: string;
}

export interface ActivationStatusResponse {
    success: boolean;
    statusCode: number;
    data: {
        isActive: boolean;
        message: string;
    };
    message?: string;
}

export interface ExtendExpirationResponse {
    success: boolean;
    statusCode: number;
    data: {
        newExpirationDate: string;
        message: string;
    };
    message?: string;
}

export interface ExtendExpirationParams {
    months: number;
}

export async function getActivations(): Promise<ApiResponse<ActivationData[]>> {
    return fetchWithAuth<ActivationData[]>('/api/activation/list');
}

export async function generateActivation(plan?: string, expiresIn?: number): Promise<ApiResponse<GenerateActivationResponse>> {
    return fetchWithAuth<GenerateActivationResponse>('/api/activation/generate', {
        method: 'POST',
        body: JSON.stringify({ ...(plan && { plan }), ...(expiresIn && { expiresIn }) })
    });
}

export const activationService = {
    async updateStatus(activationId: string, status: string): Promise<ApiResponse<ActivationStatusResponse>> {
        return fetchWithAuth<ActivationStatusResponse>(`/api/activation/status`, {
            method: 'PUT',
            body: JSON.stringify({ activationId, status })
        });
    },

    async extendExpiration(activationId: string, offset: number, unit: string): Promise<ApiResponse<ExtendExpirationResponse>> {
        return fetchWithAuth<ExtendExpirationResponse>(`/api/activation/extend-expiration`, {
            method: 'PUT',
            body: JSON.stringify({ activationId, offset, unit })
        });
    }
}; 