import { User } from 'src/infrastructure/dataAccess/schemas/user.schema';
import { IUserByID } from 'src/infrastructure/serviceInterfaces/user.service.interface';

export class UserParser {
  static listUser(users: User[]): IUserByID[] {
    const data = users.map((user: User) => {
      const { id, name, email, role, phoneNumber } = user;
      return {
        id,
        email,
        role,
        name,
        phoneNumber,
      };
    });
    return data;
  }
}
