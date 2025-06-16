import { Controller, Inject } from '@nestjs/common';
import { IRouteService } from 'src/infrastructure/serviceInterfaces/Route.service.interface';
import { TYPES } from 'src/utilities/constant';

@Controller('routes')
export class RouteController {
  constructor(
    @Inject(TYPES.IRouteService)
    private readonly _routeService: IRouteService,
  ) {}
}
