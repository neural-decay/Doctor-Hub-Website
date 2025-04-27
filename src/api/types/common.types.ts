export interface ApiResponse<T> {
    code: number;
    result: T;
}

export interface ApiErrorResponse {
    code: number;
    message: string;
}

export function isApiError(response: any): response is ApiErrorResponse {
    return response.code !== 1000 && response.message !== undefined;
}