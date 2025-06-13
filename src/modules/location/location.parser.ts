import { Location } from 'src/infrastructure/dataAccess/schemas/Location.schema';
import { ILocationByID } from 'src/infrastructure/serviceInterfaces/location.service.interfac';

export class LocationParser {
  static listLocation(locations: Location[]): ILocationByID[] {
    const data = locations.map((Location: Location) => {
      const { id, state, terminal, shortForm } = Location;
      return {
        id,
        state,
        terminal,
        shortForm,
      };
    });
    return data;
  }

  static locationById(Location: Location): ILocationByID {
    const { id, state, terminal, shortForm } = Location;
    return {
      id,
      state,
      terminal,
      shortForm,
    };
  }
}
