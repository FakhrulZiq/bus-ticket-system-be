import {
  Body,
  Controller,
  Get,
  Inject,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IUserService } from 'src/infrastructure/serviceInterfaces/user.service.interface';
import { TYPES } from 'src/utilities/constant';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CreateUserInput, ListUserInput } from './dto/userInput.dto';
import {
  CreateUserResponse,
  FindUserResponse,
  UserByIdResponse,
} from './dto/userOutput.dto';

@Controller('users')
export class UserController {
  constructor(
    @Inject(TYPES.IUserService)
    private readonly _userService: IUserService,
  ) {}

  @Post('register')
  @UseGuards()
  @ApiOperation({ summary: 'Register a new user' })
  createUser(@Body() input: CreateUserInput): Promise<CreateUserResponse> {
    return this._userService.createUser(input);
  }

  @Post('listUser')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'List all user' })
  async listuser(@Body() input: ListUserInput): Promise<FindUserResponse> {
    return this._userService.listUser(input);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get user by ID' })
  getUser(@Param('id') id: string): Promise<UserByIdResponse> {
    return this._userService.findById(id);
  }
}
