export interface IUserService {
  createUser(input: ICreateUserInput): Promise<IRegisterResponse>;
  listUser(input: IListUserInput): Promise<IFindUserResponse>;
  clearRefreshToken(id: string): Promise<void>;
  findById(id: string): Promise<IUserByID>;
  deleteUser(id: string, email: string): Promise<IDeleteResponse>;
  updateUser(
    id: string,
    input: IUpdateUserInput,
    email: string,
  ): Promise<IUserByID>;
}

export interface ICreateUserInput {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
}

interface IMessageResponse {
  message: string;
}

export interface IRegisterResponse extends IMessageResponse {}

export interface IDeleteResponse extends IMessageResponse {}

export interface IListUserInput {
  search?: string;
  pageNum?: number;
  pageSize?: number;
  roles?: string[];
}

export interface IFindUserResponse {
  data: IUserByID[];
  startRecord: number;
  endRecord: number;
  total?: number;
  pageSize?: number;
  totalPages?: number;
  nextPage?: number;
}

export interface IUserByID {
  id: string;
  email: string;
  role: string;
  name: string;
  phoneNumber: string;
}

export interface IUpdateUserInput {
  name: string;
  role: string;
  phoneNumber: string;
  status: string;
}
