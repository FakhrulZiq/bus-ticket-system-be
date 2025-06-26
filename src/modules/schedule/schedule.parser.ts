import { IScheduleList } from 'src/infrastructure/dataAccess/repositories/interfaces/schedule.repository.interface';
import { IScheduleByID } from 'src/infrastructure/serviceInterfaces/schedule.service.interface';

export class ScheduleParser {
  static listSchedule(schedules: IScheduleList[]): IScheduleByID[] {
    const data = schedules.map((schedule: IScheduleList) => {
      const {
        id,
        busDetails,
        routeDetails,
        departureDateTime,
        arrivalDateTime,
        price,
        availableSeats,
        bookedSeats,
      } = schedule;
      const { busType, operatorName, plateNumber, totalSeats } = busDetails;
      const { departure, destination, distanceKm, estimatedTime } =
        routeDetails;
      return {
        id,
        bus: {
          busType,
          operatorName,
          plateNumber,
          totalSeats,
        },
        route: {
          routeName: `${departure?.shortForm} - ${destination?.shortForm}`,
          distanceKm,
          estimatedTime,
        },
        departureDateTime,
        arrivalDateTime,
        price,
        availableSeats,
        bookedSeats,
      };
    });
    return data;
  }

  static scheduleById(schedule: IScheduleList): IScheduleByID {
    const {
      id,
      busDetails,
      routeDetails,
      departureDateTime,
      arrivalDateTime,
      price,
      availableSeats,
      bookedSeats,
    } = schedule;
    const { busType, operatorName, plateNumber, totalSeats } = busDetails;
    const { departure, destination, distanceKm, estimatedTime } = routeDetails;
    return {
      id,
      bus: {
        busType,
        operatorName,
        plateNumber,
        totalSeats,
      },
      route: {
        routeName: `${departure?.shortForm} - ${destination?.shortForm}`,
        distanceKm,
        estimatedTime,
      },
      departureDateTime,
      arrivalDateTime,
      price,
      availableSeats,
      bookedSeats,
    };
  }
}
