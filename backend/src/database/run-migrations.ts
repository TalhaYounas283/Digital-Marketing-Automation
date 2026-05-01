import 'dotenv/config';
import { AppDataSource } from './data-source';

async function main() {
  await AppDataSource.initialize();
  const migrations = await AppDataSource.runMigrations();
  console.log(`✓ Ran ${migrations.length} migration(s)`);
  await AppDataSource.destroy();
}

main().catch((err) => {
  console.error('Migration runner failed:', err);
  process.exit(1);
});
