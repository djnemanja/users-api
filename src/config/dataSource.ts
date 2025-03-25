import { DataSource, DataSourceOptions } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../modules/user/entities/user.entity';

dotenv.config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'admin',
  password: process.env.DB_PASSWORD || 'admin',
  database: process.env.DB_NAME || 'users_db_dev',
  entities: [User],
  migrations: ['dist/migrations/*.js'],
  synchronize: true,
  migrationsRun: false,
  logging: process.env.NODE_ENV !== 'production',
};

const AppDataSource = new DataSource(dataSourceOptions);
export default AppDataSource;
