import { IRouteList } from 'src/infrastructure/dataAccess/repositories/interfaces/Route.repository.interface';
import { IRouteByID } from 'src/infrastructure/serviceInterfaces/Route.service.interface';

export class RouteParser {
  static listRoute(routes: IRouteList[]): IRouteByID[] {
    const data = routes.map((route: IRouteList) => {
      const {
        id,
        distanceKm,
        estimatedTime,
        departureDetails,
        destinationDetails,
      } = route;
      return {
        id,
        routeName: `${departureDetails.shortForm} - ${destinationDetails.shortForm}`,
        departureTerminal: departureDetails.terminal,
        destinationTerminal: destinationDetails.terminal,
        distanceKm,
        estimatedTime,
      };
    });
    return data;
  }

  static routeById(route: IRouteList): IRouteByID {
    const {
      id,
      distanceKm,
      estimatedTime,
      departureDetails,
      destinationDetails,
    } = route;
    return {
      id,
      routeName: `${departureDetails.shortForm} - ${destinationDetails.shortForm}`,
      departureTerminal: departureDetails.terminal,
      destinationTerminal: destinationDetails.terminal,
      distanceKm,
      estimatedTime,
    };
  }
}
