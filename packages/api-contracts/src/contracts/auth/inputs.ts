export interface SignInData {
    email: string;
    password: string;
}

export interface RegisterData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export interface Validate2FAData {
    pinCode: string;
}

export interface RefreshTokenData {
    refreshToken: string;
}