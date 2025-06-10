import {
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { IUserService } from 'src/infrastructure/serviceInterfaces/user.service.interface';
import { TYPES } from 'src/utilities/constant';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import {
  CreateUserInput,
  ListUserInput,
  UpdateUserInput,
} from './dto/userInput.dto';
import {
  CreateUserResponse,
  DeleteResponse,
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

  @Post('list')
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

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Delete User by ID' })
  deleteUser(@Param('id') id: string, @Req() req): Promise<DeleteResponse> {
    const email = req.user.email;
    return this._userService.deleteUser(id, email);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update user' })
  async updateUser(
    @Param('id') id: string,
    @Body() input: UpdateUserInput,
    @Req() req,
  ): Promise<UserByIdResponse> {
    const email = req.user.email;
    return await this._userService.updateUser(id, input, email);
  }
}
