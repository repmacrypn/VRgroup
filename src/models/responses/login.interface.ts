interface IUserData {
    firstName: string;
    lastName: string;
}

export interface ILoginResponse {
    accessToken: string;
    refreshToken: string;
    user: IUserData;
}