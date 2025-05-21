import { BadRequestException } from '@nestjs/common';
import { CRUD_ACTION } from '../constant';
import { IAudit } from '../serviceInterfaces/audit.interface';

export class Audit implements IAudit {
  static createAuditProperties(email: string, action: string): IAudit {
    const dateTime = new Date().toISOString();
    switch (action) {
      case CRUD_ACTION.create:
        return {
          createdBy: email,
          createdAt: dateTime,
        };
      case CRUD_ACTION.update:
        return {
          updatedBy: email,
          updatedAt: dateTime,
        };
      case CRUD_ACTION.delete:
        return {
          deletedBy: email,
          deletedAt: dateTime,
        };
      default:
        throw new BadRequestException(`Invalid action: ${action}`);
    }
  }
}
