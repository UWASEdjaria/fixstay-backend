import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User, UserRole } from '@prisma/client';
import { AuthRepository } from '../repositories/auth.repository';
import {
  LoginRequestDTO,
  RegisterRequestDTO,
  LoginResponseDTO,
  JwtTokenPayload,
} from '../interfaces/auth.interface';

const JWT_SECRET: string = process.env.JWT_SECRET ?? 'stayfix_dev_secret_key';
const TOKEN_EXPIRY_SECONDS: number = 60 * 60 * 8; // 8 hours

export class AuthService {
  private readonly authRepo: AuthRepository;

  constructor(authRepo: AuthRepository) {
    this.authRepo = authRepo;
  }

  public async register(dto: RegisterRequestDTO): Promise<LoginResponseDTO> {
    // 1. Validate Confirm Password!
    if (dto.password !== dto.confirmPassword) {
      throw new Error('Passwords do not match. Please verify your password confirmation.');
    }

    if (dto.password.length < 6) {
      throw new Error('Password must be at least 6 characters long.');
    }

    const emailNormalized: string = dto.email.trim().toLowerCase();

    // 2. Check if email is already in use
    const existingUser: User | null = await this.authRepo.findByEmail(emailNormalized);
    if (existingUser) {
      throw new Error('An account with this email address already exists.');
    }

    // 3. Hash the password securely
    const passwordHash: string = await bcrypt.hash(dto.password, 10);

    // 4. Persist new user
    const newUser: User = await this.authRepo.createUser({
      email: emailNormalized,
      fullName: dto.fullName.trim(),
      phoneNumber: dto.phoneNumber?.trim(),
      passwordHash,
      role: dto.role ?? UserRole.STAFF,
    });

    return this.generateAuthResponse(newUser);
  }

  public async login(dto: LoginRequestDTO): Promise<LoginResponseDTO> {
    const emailNormalized: string = dto.email.trim().toLowerCase();

    const user: User | null = await this.authRepo.findByEmail(emailNormalized);
    if (!user) {
      throw new Error('Invalid email or password.');
    }

    if (!user.isActive) {
      throw new Error('Account has been deactivated. Please contact hotel administration.');
    }

    const isPasswordValid: boolean = await bcrypt.compare(dto.password, user.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid email or password.');
    }

    return this.generateAuthResponse(user);
  }

  private generateAuthResponse(user: User): LoginResponseDTO {
    const payload: JwtTokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken: string = jwt.sign(payload, JWT_SECRET, {
      expiresIn: TOKEN_EXPIRY_SECONDS,
    });

    return {
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
      },
    };
  }
}
