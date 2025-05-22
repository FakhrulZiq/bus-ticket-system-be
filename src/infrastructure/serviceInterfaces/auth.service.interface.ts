export interface IAuthService {
  validateUser(input: IValidateUserInput): Promise<IValidateUserResponse>;
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
