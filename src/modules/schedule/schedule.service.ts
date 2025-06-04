import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Audit } from 'src/infrastructure/audit/audit';
import { IScheduleRepository } from 'src/infrastructure/dataAccess/repositories/interfaces/schedule.repository.interface';
import { IContextAwareLogger } from 'src/infrastructure/logger';
import { IRedisService } from 'src/infrastructure/redis/redisInterface';
import { IAudit } from 'src/infrastructure/serviceInterfaces/audit.interface';
import {
  ICreateScheduleInput,
  ICreateScheduleResponse,
  IScheduleService,
} from 'src/infrastructure/serviceInterfaces/schedule.service.interface';
import { CRUD_ACTION, TYPES } from 'src/utilities/constant';

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

      const seatLayout = this._generateSeatLabels(input.seatLayout);

      const auditProps: IAudit = Audit.createAuditProperties(
        email,
        CRUD_ACTION.create,
      );

      const scheduleToSave = { ...input, ...auditProps, seatLayout };

      const savedSchedule = await this._scheduleRepository.save(scheduleToSave);

      if (!savedSchedule) {
        throw new BadRequestException(`Unable to create a new schedule`);
      }

      await this._deleteSchedulePageCache();

      return { message: 'User registration successfully' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  private _generateSeatLabels(seatLayout: string): string[] {
    const [columnCount, rowCount] = seatLayout.split('x').map(Number);
    const seatLabels: string[] = [];

    const seatLetters = Array.from({ length: columnCount }, (_, i) =>
      String.fromCharCode(65 + i),
    );

    for (let row = 1; row <= rowCount; row++) {
      for (const letter of seatLetters) {
        seatLabels.push(`${row}${letter}`);
      }
    }

    return seatLabels;
  }

  private async _deleteSchedulePageCache(): Promise<void> {
    const keys = await this._redisCacheService.keys('*list_schedule_page*');
    if (keys.length > 0) {
      await this._redisCacheService.deleteMany(keys);
    }
  }
}
