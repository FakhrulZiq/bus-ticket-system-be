export interface IAuthService {
  validateUser(input: IValidateUserInput): Promise<IValidateUserResponse>;
  logout(input: ILogoutInput): Promise<ILogOutResponse>;
  resetPassword(input: IResetPasswordInput): Promise<IResetPasswordResponse>;
}

export interface IValidateUserInput {
  email: string;
  password: string;
}

export interface IValidateUserResponse {
  accessToken: string;
  refreshToken: string;
  email: string;
  role: string;
  name: string;
  id: string;
}

export interface ILogoutInput {
  refreshToken: string;
}

export interface ILogOutResponse {
  message: string;
}

export interface IResetPasswordInput extends IValidateUserInput {}

export interface IResetPasswordResponse extends ILogOutResponse {}
