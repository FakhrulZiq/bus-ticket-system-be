export const TYPES = {
  IApplicationLogger: 'IApplicationLogger',
  IUserService: 'IUserService',
  IUserRepository: 'IUserRepository',
  IRedisService: 'IRedisService',
  IAuthService: 'IAuthService',
  IScheduleRepository: 'IScheduleRepository',
  IScheduleService: 'IScheduleService',
};

export const CRUD_ACTION = {
  create: 'create',
  retrieve: 'retrieve',
  update: 'update',
  delete: 'delete',
};

export const DEFAULT_CACHE_TIME_TO_LIVE = 60 * 60 * 24;

export const PAGINATION = {
  defaultRecords: 10,
};

export const ROLES_KEY = 'roles';

export interface IMessageResponse {
  message: string;
}
