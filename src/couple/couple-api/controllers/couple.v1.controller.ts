import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  Authentication,
  AuthenticationGuard,
  Principal,
} from '@seungkyu/guardian';
import { MapError } from '@seungkyu/error-mapper';
import {
  COUPLE_COMMAND_SERVICE,
  COUPLE_QUERY_SERVICE,
} from '../../couple-core/couple.token';
import type { ICoupleCommandService } from '../../couple-core/input/services/couple-command.service';
import type { ICoupleQueryService } from '../../couple-core/input/services/couple-query.service';
import { USER_QUERY_SERVICE } from '../../../user/user-core/user.token';
import type { IUserQueryService } from '../../../user/user-core/input/services/user-query.service';
import { ConnectCoupleRequestDto } from '../dto/request/connect-couple.request.dto';
import { CheckInviteCodeRequestDto } from '../dto/request/check-invite-code.request.dto';
import { InviteCodeResponseDto } from '../dto/response/invite-code.response.dto';
import { CoupleInfoResponseDto } from '../dto/response/couple-info.response.dto';
import { AlreadyInCoupleException } from '../../couple-core/exceptions/already-in-couple.exception';
import { InvalidCoupleCodeException } from '../../couple-core/exceptions/invalid-couple-code.exception';
import { CoupleCodeExpiredException } from '../../couple-core/exceptions/couple-code-expired.exception';
import { CoupleCodeAlreadyUsedException } from '../../couple-core/exceptions/couple-code-already-used.exception';
import { CannotCoupleWithSelfException } from '../../couple-core/exceptions/cannot-couple-with-self.exception';
import { CoupleNotFoundException } from '../../couple-core/exceptions/couple-not-found.exception';

@ApiTags('커플 API')
@Controller({ path: 'couple', version: '1' })
@ApiBearerAuth('jwt')
@UseGuards(AuthenticationGuard)
export class CoupleV1Controller {
  constructor(
    @Inject(COUPLE_COMMAND_SERVICE)
    private readonly coupleCommandService: ICoupleCommandService,
    @Inject(COUPLE_QUERY_SERVICE)
    private readonly coupleQueryService: ICoupleQueryService,
    @Inject(USER_QUERY_SERVICE)
    private readonly userQueryService: IUserQueryService,
  ) {}

  @Post('/invite-code')
  @ApiOperation({
    summary: '상대방에게 전달할 커플 초대 코드를 생성합니다.',
    description:
      '이미 생성된 유효한 코드가 있는 경우 기존 코드를 반환합니다. 코드는 24시간 동안 유효합니다.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '초대 코드 생성 성공',
    type: InviteCodeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 다른 사용자와 커플로 연결되어 있습니다.',
  })
  @MapError({
    sourceError: AlreadyInCoupleException,
    status: HttpStatus.CONFLICT,
  })
  async generateInviteCode(
    @Authentication() principal: Principal,
  ): Promise<InviteCodeResponseDto> {
    const inviteCode = await this.coupleCommandService.generateInviteCode(
      principal.id,
    );
    return {
      code: inviteCode.code,
      expiresAt: inviteCode.expiresAt,
    };
  }

  @Get('/invite-code')
  @ApiOperation({
    summary: '커플 초대 코드의 유효성을 검증합니다.',
    description: '입력받은 초대 코드가 현재 유효한지 체크합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '유효한 초대 코드 검증 성공',
    type: InviteCodeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '유효하지 않은 코드이거나 본인 코드입니다.',
  })
  @ApiResponse({
    status: HttpStatus.GONE,
    description: '초대 코드가 만료되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 사용된 코드이거나 이미 커플 상태입니다.',
  })
  @MapError({
    sourceError: InvalidCoupleCodeException,
    status: HttpStatus.BAD_REQUEST,
  })
  @MapError({
    sourceError: CannotCoupleWithSelfException,
    status: HttpStatus.BAD_REQUEST,
  })
  @MapError({
    sourceError: CoupleCodeExpiredException,
    status: HttpStatus.GONE,
  })
  @MapError({
    sourceError: CoupleCodeAlreadyUsedException,
    status: HttpStatus.CONFLICT,
  })
  @MapError({
    sourceError: AlreadyInCoupleException,
    status: HttpStatus.CONFLICT,
  })
  async validateInviteCode(
    @Authentication() principal: Principal,
    @Query() query: CheckInviteCodeRequestDto,
  ): Promise<InviteCodeResponseDto> {
    const inviteCode = await this.coupleQueryService.validateInviteCode(
      principal.id,
      query.code,
    );
    return {
      code: inviteCode.code,
      expiresAt: inviteCode.expiresAt,
    };
  }

  @Post('/connect')
  @ApiOperation({
    summary: '초대 코드를 입력하여 상대방과 커플을 성사(연결)합니다.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: '커플 연결 성사 성공',
    type: CoupleInfoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: '유효하지 않은 코드이거나 본인 코드입니다.',
  })
  @ApiResponse({
    status: HttpStatus.GONE,
    description: '초대 코드가 만료되었습니다.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: '이미 사용된 코드이거나 이미 커플 상태입니다.',
  })
  @MapError({
    sourceError: InvalidCoupleCodeException,
    status: HttpStatus.BAD_REQUEST,
  })
  @MapError({
    sourceError: CannotCoupleWithSelfException,
    status: HttpStatus.BAD_REQUEST,
  })
  @MapError({
    sourceError: CoupleCodeExpiredException,
    status: HttpStatus.GONE,
  })
  @MapError({
    sourceError: CoupleCodeAlreadyUsedException,
    status: HttpStatus.CONFLICT,
  })
  @MapError({
    sourceError: AlreadyInCoupleException,
    status: HttpStatus.CONFLICT,
  })
  async connectCouple(
    @Authentication() principal: Principal,
    @Body() connectDto: ConnectCoupleRequestDto,
  ): Promise<CoupleInfoResponseDto> {
    const couple = await this.coupleCommandService.connectCouple(
      principal.id,
      connectDto.code,
    );
    const partnerId = couple.getPartnerId(principal.id);
    const partnerNickname = await this.fetchPartnerNickname(partnerId);

    return {
      id: couple.id,
      partnerId,
      partnerNickname,
      createdAt: couple.createdAt,
    };
  }

  @Get('/me')
  @ApiOperation({
    summary: '현재 로그인한 사용자의 커플 정보를 조회합니다.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: '커플 정보 조회 성공',
    type: CoupleInfoResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '커플로 연결되어 있지 않습니다.',
  })
  @MapError({
    sourceError: CoupleNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  async getMyCouple(
    @Authentication() principal: Principal,
  ): Promise<CoupleInfoResponseDto> {
    const couple = await this.coupleQueryService.getMyCouple(principal.id);
    const partnerId = couple.getPartnerId(principal.id);
    const partnerNickname = await this.fetchPartnerNickname(partnerId);

    return {
      id: couple.id,
      partnerId,
      partnerNickname,
      createdAt: couple.createdAt,
    };
  }

  @Delete('/me')
  @ApiOperation({
    summary: '현재 커플 연결을 해제합니다.',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: '커플 연결 해제 성공',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: '커플로 연결되어 있지 않습니다.',
  })
  @MapError({
    sourceError: CoupleNotFoundException,
    status: HttpStatus.NOT_FOUND,
  })
  async disconnectCouple(
    @Authentication() principal: Principal,
  ): Promise<void> {
    await this.coupleCommandService.disconnectCouple(principal.id);
  }

  private async fetchPartnerNickname(partnerId: string): Promise<string | undefined> {
    try {
      const partner = await this.userQueryService.userInfoById(partnerId);
      return partner?.nickname;
    } catch {
      return undefined;
    }
  }
}
