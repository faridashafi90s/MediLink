export interface AuthResponse {
    token: string;
    userId: number;
    role: string;
    email: string;
    fullName: string;
}