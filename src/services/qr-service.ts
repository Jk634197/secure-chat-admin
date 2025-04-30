import { fetchWithAuth } from '@/utils/api';

export interface QRCode {
    qrCode: string;
}

export class QRServiceError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'QRServiceError';
    }
}

export async function uploadQRCode(file: File): Promise<void> {
    try {
        const formData = new FormData();
        formData.append('file', file);

        await fetchWithAuth('/api/upload-qr', {
            method: 'POST',
            body: formData
            // Don't set Content-Type header, let the browser set it with the boundary
        });
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('413')) {
                throw new QRServiceError('File size is too large. Please upload a smaller file.');
            } else if (error.message.includes('415')) {
                throw new QRServiceError('Invalid file format. Please upload a PNG, JPG, or JPEG file.');
            } else {
                throw new QRServiceError('Failed to upload QR code. Please try again.');
            }
        }
        throw new QRServiceError('An unexpected error occurred. Please try again.');
    }
}

export async function getQRCode(): Promise<QRCode | null> {
    try {
        const response = await fetchWithAuth<QRCode>('/api/qr');
        return response.data;
    } catch (error) {
        if (error instanceof Error && error.message.includes('404')) {
            return null;
        }
        throw new QRServiceError('Failed to fetch QR code. Please try again.');
    }
}

export async function deleteQRCode(): Promise<void> {
    try {
        await fetchWithAuth('/api/upload-qr', {
            method: 'DELETE'
        });
    } catch (error) {
        throw new QRServiceError('Failed to delete QR code. Please try again.');
    }
} 