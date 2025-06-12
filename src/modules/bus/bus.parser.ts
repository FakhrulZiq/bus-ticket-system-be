import { Bus } from 'src/infrastructure/dataAccess/schemas/Bus.schema';
import { IBusByID } from 'src/infrastructure/serviceInterfaces/Bus.service.interface';

export class BusParser {
  static listBus(buses: Bus[]): IBusByID[] {
    const data = buses.map((Bus: Bus) => {
      const { id, plateNumber, busType, totalSeats, operatorName } = Bus;
      return {
        id,
        plateNumber,
        busType,
        totalSeats,
        operatorName,
      };
    });
    return data;
  }

  static BusById(Bus: Bus): IBusByID {
    const { id, plateNumber, busType, totalSeats, operatorName } = Bus;
    return {
      id,
      plateNumber,
      busType,
      totalSeats,
      operatorName,
    };
  }
}
