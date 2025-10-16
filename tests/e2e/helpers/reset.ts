// tests/e2e/helpers/reset.ts
import { AppDataSource } from "../../../src/app/db/data-source";

export async function truncateAll() {
  const tables = ["addresses", "customers", "users", "roles_permissions", "permissions"]; // ordene por FK ou use CASCADE
  const qr = AppDataSource.createQueryRunner();
  await qr.startTransaction();
  try {
    await qr.query(`TRUNCATE ${tables.map(t => `"${t}"`).join(", ")} RESTART IDENTITY CASCADE;`);
    await qr.commitTransaction();
  } catch (e) {
    await qr.rollbackTransaction();
    throw e;
  } finally {
    await qr.release();
  }
}
