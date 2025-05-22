import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { TYPES } from 'src/infrastructure/constant';
import { IUserService } from 'src/infrastructure/serviceInterfaces/user.service.interface';
import { CreateUserInput, ListUserInput } from './dto/userInput.dto';
import { ApiOperation } from '@nestjs/swagger';
import { CreateUserResponse, FindUserResponse } from './dto/userOutput.dto';

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
  // @UseGuards(JwtAuthGuard, RolesGuard)
  // @Roles('admin', 'librarian')
  @ApiOperation({ summary: 'List all user' })
  async listuser(@Body() input: ListUserInput): Promise<FindUserResponse> {
    return this._userService.listUser(input);
  }
}
