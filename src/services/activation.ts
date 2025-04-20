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

export async function getActivations(): Promise<ApiResponse<ActivationData[]>> {
    return fetchWithAuth<ActivationData[]>('/api/activation/list');
}

export async function generateActivation(): Promise<ApiResponse<GenerateActivationResponse>> {
    return fetchWithAuth<GenerateActivationResponse>('/api/activation/generate', {
        method: 'POST'
    });
} 