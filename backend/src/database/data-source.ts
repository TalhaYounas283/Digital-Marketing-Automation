import 'dotenv/config';
import { DataSource } from 'typeorm';
import { join } from 'path';

const isCompiled = __filename.endsWith('.js');

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST ?? 'localhost',
  port: parseInt(process.env.DATABASE_PORT ?? '5432', 10),
  username: process.env.DATABASE_USER ?? 'automarketer',
  password: process.env.DATABASE_PASSWORD ?? 'automarketer',
  database: process.env.DATABASE_NAME ?? 'automarketer',
  entities: [join(__dirname, '..', 'modules', '**', '*.entity.{ts,js}')],
  migrations: [
    join(__dirname, 'migrations', isCompiled ? '*.js' : '*.ts'),
  ],
  synchronize: false,
  logging: process.env.DATABASE_LOGGING === 'true',
});
