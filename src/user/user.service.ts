import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as Bcrypt from 'bcryptjs';
import { randomUUID } from 'crypto';
import { MailService } from '../mail/mail.service';
import { QueueService } from '../queue/queue.service';
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly queueService: QueueService,
    private readonly mailService: MailService,
  ) {}

  async findOne(email: string) {
    const user = await this.userRepository.findOne({ email });
    if (!user) throw new NotFoundException();
    return user;
  }

  /**
   * Admin-only method, sends email notification to user and requires password change to activate an account.
   * @param createUserDto
   */
  async create(createUserDto: CreateUserDto) {
    const user = await this.createUser(createUserDto);
    user.passwordExpired = true;
    user.active = true;
    this.queueService.enqueueMail(this.mailService.accountCreated(user));
    return await this.userRepository.save(user);
  }

  /**
   * public method, requires only mail confirmation to activate an account.
   * @param createUserDto
   */
  async register(createUserDto: CreateUserDto) {
    const user = await this.createUser(createUserDto);
    this.queueService.enqueueMail(this.mailService.accountConfirmation(user));
    return await this.userRepository.save(user);
  }

  async getPasswordResetId(email: string) {
    const user = await this.findOne(email);
    this.queueService.enqueueMail(this.mailService.passwordReset(user));
    return user.passwordResetId;
  }

  async resetPassword(password: string, passwordResetId: string) {
    const user = await this.userRepository.findOne({ passwordResetId });
    if (!user) throw new NotFoundException();
    user.passwordHash = await Bcrypt.hash(password, 10);
    user.passwordResetId = randomUUID();
    user.passwordExpired = false;
    return await this.userRepository.save(user);
  }

  private async createUser(createUserDto: CreateUserDto) {
    const { password, ...userData } = createUserDto;
    const passwordHash = await Bcrypt.hash(password, 10);
    const confirmationId = randomUUID();
    const passwordResetId = randomUUID();
    return this.userRepository.create({
      ...userData,
      passwordHash,
      confirmationId,
      passwordResetId,
    });
  }

  async confirm(confirmationId: string) {
    const user = await this.userRepository.findOne({ confirmationId });
    if (!user) {
      throw new BadRequestException();
    }
    user.active = true;
    return await this.userRepository.save(user);
  }
}
