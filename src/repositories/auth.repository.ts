import { PrismaClient, User, UserRole } from '@prisma/client';

export class AuthRepository {
  private readonly prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  public async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  public async createUser(data: {
    email: string;
    fullName: string;
    passwordHash: string;
    phoneNumber?: string;
    role?: UserRole;
  }): Promise<User> {
    return this.prisma.user.create({
      data: {
        email: data.email,
        fullName: data.fullName,
        passwordHash: data.passwordHash,
        phoneNumber: data.phoneNumber,
        role: data.role ?? UserRole.STAFF,
        isActive: true,
      },
    });
  }
}
