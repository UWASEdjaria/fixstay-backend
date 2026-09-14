import {
  Controller,
  Route,
  Tags,
  Post,
  Body,
  SuccessResponse,
  Response,
} from 'tsoa';
import { prisma } from '../lib/prisma';
import { AuthRepository } from '../repositories/auth.repository';
import { AuthService } from '../services/auth.service';
import {
  LoginRequestDTO,
  RegisterRequestDTO,
  LoginResponseDTO,
  ErrorResponseDTO,
} from '../interfaces/auth.interface';

const defaultAuthRepo = new AuthRepository(prisma);
const defaultAuthService = new AuthService(defaultAuthRepo);

@Route('api/v1/auth')
@Tags('Authentication')
export class AuthController extends Controller {
  private readonly authService: AuthService;

  constructor(authService: AuthService = defaultAuthService) {
    super();
    this.authService = authService;
  }

  @Post('register')
  @SuccessResponse(201, 'Account successfully created')
  @Response<ErrorResponseDTO>(400, 'Bad Request')
  public async register(
    @Body() requestBody: RegisterRequestDTO
  ): Promise<LoginResponseDTO> {
    this.setStatus(201);
    return this.authService.register(requestBody);
  }

  @Post('login')
  @SuccessResponse(200, 'Login successful')
  @Response<ErrorResponseDTO>(401, 'Unauthorized')
  public async login(
    @Body() requestBody: LoginRequestDTO
  ): Promise<LoginResponseDTO> {
    this.setStatus(200);
    return this.authService.login(requestBody);
  }
}
