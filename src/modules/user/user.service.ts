import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Audit } from 'src/infrastructure/audit/audit';
import {
  CRUD_ACTION,
  DEFAULT_CACHE_TIME_TO_LIVE,
  PAGINATION,
  TYPES,
} from 'src/utilities/constant';
import { IUserRepository } from 'src/infrastructure/dataAccess/repositories/interfaces/user.repository.interface';
import { UserDocument } from 'src/infrastructure/dataAccess/schemas/user.schema';
import { IContextAwareLogger } from 'src/infrastructure/logger';
import { IRedisService } from 'src/infrastructure/redis/redisInterface';
import { IAudit } from 'src/infrastructure/serviceInterfaces/audit.interface';
import {
  ICreateUserInput,
  IDeleteResponse,
  IFindUserResponse,
  IListUserInput,
  IRegisterResponse,
  IUpdateUserInput,
  IUserByID,
  IUserService,
} from 'src/infrastructure/serviceInterfaces/user.service.interface';
import { UserParser } from './user.parser';
import { pagination } from 'src/utilities/utility';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
    @Inject(TYPES.IRedisService)
    protected readonly _redisCacheService: IRedisService,
  ) {}

  async createUser(input: ICreateUserInput): Promise<IRegisterResponse> {
    try {
      const { email, password } = input;

      const existingUser = await this._userRepository.findOne({ email });
      if (existingUser) {
        throw new ConflictException(`This email ${email} already registered`);
      }

      const hashedPassword: string = await bcrypt.hash(password, 10);

      const auditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.create,
      );

      const userToSave = { ...input, password: hashedPassword, ...auditProps };

      const savedUser: UserDocument =
        await this._userRepository.save(userToSave);

      if (!savedUser) {
        throw new BadRequestException(
          `Unable to create a new user with this ${email} email`,
        );
      }

      await this._deleteUserPageCache();

      return { message: 'User registration successfully' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async listUser(input: IListUserInput): Promise<IFindUserResponse> {
    try {
      const { pageNum, pageSize, search, roles } = input;

      const defaultPageSize = PAGINATION.defaultRecords;
      input.pageSize = pageSize ?? defaultPageSize;

      const cacheKey = `list_user_page${pageNum}_limit${pageSize}_searchBy${search}_role${roles}`;

      const cachedData = await this._getCachedData(cacheKey);

      if (cachedData && !input.search) {
        return cachedData;
      }
      const users = await this._userRepository.listUserByPagination(input);

      const parsedUser = UserParser.listUser(users.data);

      const paginatedBook: IFindUserResponse = pagination(
        parsedUser,
        input,
        users.total,
      ) as unknown as IFindUserResponse;

      await this._cacheResponse(paginatedBook, cacheKey);

      return paginatedBook;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async clearRefreshToken(id: string): Promise<void> {
    try {
      const user = await this._userRepository.findOne({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      await this._userRepository.update({ id }, { refreshToken: null });
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async findById(id: string): Promise<IUserByID> {
    try {
      const user = await this._userRepository.findOne({ id });
      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const userById = UserParser.userById(user);

      return userById;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async deleteUser(id: string, email: string): Promise<IDeleteResponse> {
    try {
      const user = await this._userRepository.findOne({ id });
      if (!user) {
        throw new NotFoundException('User not found');
      }

      const deleteAuditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.delete,
      );

      const deleteUser = await this._userRepository.update(
        { id },
        { ...deleteAuditProps },
      );
      if (!deleteUser) {
        throw new InternalServerErrorException(`Failed to delete book`);
      }

      await this._deleteUserPageCache();

      return { message: 'User deleted successfully!' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async updateUser(
    id: string,
    input: IUpdateUserInput,
    email: string,
  ): Promise<IUserByID> {
    try {
      const user = await this._userRepository.findOne({ id });
      if (!user) {
        throw new NotFoundException(`There is no user with ID ${id}`);
      }

      const auditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.update,
      );

      const userUpdate = await this._userRepository.update(
        { id },
        { ...auditProps, ...input },
      );
      if (!userUpdate) {
        throw new InternalServerErrorException(`Failed to update user`);
      }

      await this._deleteUserPageCache();

      return UserParser.userById(userUpdate);
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  private async _getCachedData(cacheKey: string): Promise<any> {
    return (await this._redisCacheService.get(cacheKey)) as any;
  }

  private async _cacheResponse(data: any, cacheKey: string): Promise<void> {
    await this._redisCacheService.set(
      cacheKey,
      data,
      DEFAULT_CACHE_TIME_TO_LIVE,
    );
  }

  private async _deleteUserPageCache(): Promise<void> {
    const keys = await this._redisCacheService.keys('*list_user_page*');
    if (keys.length > 0) {
      await this._redisCacheService.deleteMany(keys);
    }
  }
}
