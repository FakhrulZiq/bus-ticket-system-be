import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Audit } from 'src/infrastructure/audit/audit';
import {
  IListScheduleByPaginationResponse,
  IScheduleRepository,
} from 'src/infrastructure/dataAccess/repositories/interfaces/schedule.repository.interface';
import { IContextAwareLogger } from 'src/infrastructure/logger';
import { IRedisService } from 'src/infrastructure/redis/redisInterface';
import { IAudit } from 'src/infrastructure/serviceInterfaces/audit.interface';
import {
  ICreateScheduleInput,
  ICreateScheduleResponse,
  IDeleteScheduleResponse,
  IFindScheduleResponse,
  IListScheduleInput,
  IScheduleByID,
  IScheduleService,
  IUpdateScheduleInput,
} from 'src/infrastructure/serviceInterfaces/schedule.service.interface';
import {
  CRUD_ACTION,
  DEFAULT_CACHE_TIME_TO_LIVE,
  PAGINATION,
  TYPES,
} from 'src/utilities/constant';
import { pagination } from 'src/utilities/utility';
import { ScheduleParser } from './schedule.parser';

@Injectable()
export class ScheduleService implements IScheduleService {
  constructor(
    @Inject(TYPES.IScheduleRepository)
    private readonly _scheduleRepository: IScheduleRepository,
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
    @Inject(TYPES.IRedisService)
    protected readonly _redisCacheService: IRedisService,
  ) {}

  async createSchedule(
    input: ICreateScheduleInput,
    email: string,
  ): Promise<ICreateScheduleResponse> {
    try {
      const existingSchedule =
        await this._scheduleRepository.isDuplicateSchedule(input);
      if (existingSchedule) {
        throw new ConflictException(
          'A schedule for this bus at the same time already exists',
        );
      }

      const availableSeats: string[] = this._generateSeatLabels(
        input.seatLayout,
        input.bookedSeats,
      );

      const auditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.create,
      );

      const scheduleToSave = { ...input, ...auditProps, availableSeats };

      const savedSchedule = await this._scheduleRepository.save(scheduleToSave);

      if (!savedSchedule) {
        throw new BadRequestException(`Unable to create a new schedule`);
      }

      await this._deleteSchedulePageCache();

      return { message: 'Schedule added successfully' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async listSchedule(
    input: IListScheduleInput,
  ): Promise<IFindScheduleResponse> {
    try {
      const { pageNum, pageSize, search } = input;

      const defaultPageSize = PAGINATION.defaultRecords;
      input.pageSize = pageSize ?? defaultPageSize;

      const cacheKey = `list_schedule_page${pageNum}_limit${pageSize}_searchBy${search}`;

      const cachedData = await this._getCachedData(cacheKey);

      if (cachedData && !input.search) {
        return cachedData;
      }
      const schedules: IListScheduleByPaginationResponse =
        await this._scheduleRepository.listScheduleByPagination(input);

      const parsedSchedule = ScheduleParser.listSchedule(schedules.data);

      const paginatedBook: IFindScheduleResponse = pagination(
        parsedSchedule,
        input,
        schedules.total,
      ) as unknown as IFindScheduleResponse;

      await this._cacheResponse(paginatedBook, cacheKey);

      return paginatedBook;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async findScheduleById(id: string): Promise<IScheduleByID> {
    try {
      const schedule = await this._scheduleRepository.getScheduleById(id);
      if (!schedule) {
        throw new NotFoundException(`Schedule with ID ${id} not found`);
      }

      const ScheduleById = ScheduleParser.scheduleById(schedule);

      return ScheduleById;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async updateSchedule(
    id: string,
    input: IUpdateScheduleInput,
    email: string,
  ): Promise<IScheduleByID> {
    try {
      const schedule = await this._scheduleRepository.findOne({ id });
      if (!schedule) {
        throw new NotFoundException(`There is no Schedule with ID ${id}`);
      }

      let seatLayout: string;
      if (input.seatLayout === schedule.seatLayout) {
        seatLayout = input.seatLayout;
      }
      let bookedSeats: string[];
      if (input.seatLayout === schedule.seatLayout) {
        bookedSeats = input.bookedSeats;
      }

      const availableSeats: string[] = this._generateSeatLabels(
        seatLayout ?? schedule.seatLayout,
        bookedSeats ?? schedule.bookedSeats,
      );

      const auditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.update,
      );

      const ScheduleUpdate = await this._scheduleRepository.update(
        { id },
        { ...auditProps, ...input, availableSeats },
      );
      if (!ScheduleUpdate) {
        throw new InternalServerErrorException(`Failed to update schedule`);
      }

      await this._deleteSchedulePageCache();

      const ScheduleResponse = await this._scheduleRepository.getScheduleById(
        ScheduleUpdate.id,
      );

      return ScheduleParser.scheduleById(ScheduleResponse);
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async deleteSchedule(
    id: string,
    email: string,
  ): Promise<IDeleteScheduleResponse> {
    try {
      const user = await this._scheduleRepository.findOne({ id });
      if (!user) {
        throw new NotFoundException('Schedule not found');
      }

      const deleteAuditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.delete,
      );

      const deleteUser = await this._scheduleRepository.update(
        { id },
        { ...deleteAuditProps },
      );
      if (!deleteUser) {
        throw new InternalServerErrorException(`Failed to delete Schedule`);
      }

      await this._deleteSchedulePageCache();

      return { message: 'Schedule deleted successfully!' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  private _generateSeatLabels(
    seatLayout: string,
    bookedSeats: string[],
  ): string[] {
    const [columnCount, rowCount] = seatLayout.split('x').map(Number);
    const seatLabels: string[] = [];

    const seatLetters = Array.from({ length: columnCount }, (_, i) =>
      String.fromCharCode(65 + i),
    );

    for (let row = 1; row <= rowCount; row++) {
      for (const letter of seatLetters) {
        const seat = `${row}${letter}`;
        if (!bookedSeats.includes(seat)) {
          seatLabels.push(seat);
        }
      }
    }

    return seatLabels;
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

  private async _deleteSchedulePageCache(): Promise<void> {
    const keys = await this._redisCacheService.keys('*list_schedule_page*');
    if (keys.length > 0) {
      await this._redisCacheService.deleteMany(keys);
    }
  }
}
