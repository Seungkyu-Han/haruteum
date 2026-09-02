import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Put,
  UseGuards,
} from '@nestjs/common';
import {
  USER_COMMAND_SERVICE,
  USER_QUERY_SERVICE,
} from '../../user-core/user.token';
import type { IUserQueryService } from '../../user-core/input/services/user-query.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserMeResponseDto } from '../dto/response/user-me.response.dto';
import {
  Authentication,
  AuthenticationGuard,
  Principal,
} from '@seungkyu/guardian';
import { MapError } from '@seungkyu/error-mapper';
import { UserNotFoundException } from '../../user-core/exceptions/user-not-found.exception';
import { UserMeRequestDto } from '../dto/request/user-me.request.dto';
import type { IUserCommandService } from '../../user-core/input/services/user-command.service';

@ApiTags('사용자 API')
@Controller({ path: 'user', version: '1' })
@ApiBearerAuth('jwt')
@UseGuards(AuthenticationGuard)
export class UserV1Controller {
  constructor(
    @Inject(USER_QUERY_SERVICE)
    private readonly userQueryService: IUserQueryService,
    @Inject(USER_COMMAND_SERVICE)
    private readonly userCommandService: IUserCommandService,
  ) {}

  @Get('/me')
  @ApiOperation({
    summary: '토큰을 통해 해당 사용자의 정보를 조회합니다',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '정보 조회 성공',
    type: UserMeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '해당 사용자가 존재하지 않습니다.',
  })
  @MapError({
    sourceError: UserNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  async userMeApi(
    @Authentication() principal: Principal,
  ): Promise<UserMeResponseDto> {
    const user = await this.userQueryService.userInfoById(principal.id);

    return {
      name: user.name,
      email: user.email,
    };
  }

  @Put('/me')
  @ApiOperation({
    summary: '해당 사용자 정보를 업데이트 합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '정보 업데이트 성공',
    type: UserMeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '해당 사용자가 존재하지 않습니다.',
  })
  @MapError({
    sourceError: UserNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  async patchUserMeApi(
    @Body() userMeRequestDto: UserMeRequestDto,
    @Authentication() principal: Principal,
  ): Promise<UserMeResponseDto> {
    const user = await this.userCommandService.updateUserInfo(
      principal.id,
      userMeRequestDto.name,
      userMeRequestDto.email,
    );

    return {
      name: user.name,
      email: user.email,
    };
  }
}
