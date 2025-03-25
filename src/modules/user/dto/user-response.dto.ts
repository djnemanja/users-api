import { UserRole } from '../entities/user.entity';

export class UserResponseDto {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  role?: UserRole;
  address?: string;
  created_at: Date;
  updated_at: Date;
}
