import { UserRole } from '../entities/user.entity';

export class UpdateUserDto {
  first_name?: string;
  last_name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
  address?: string;
}
