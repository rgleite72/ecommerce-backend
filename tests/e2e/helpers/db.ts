// tests/e2e/helpers/db.ts
import type { DataSource } from "typeorm";

let ds: DataSource | null = null;

export async function initTestDB() {
  // Garante modo teste antes de carregar o DataSource
  process.env.NODE_ENV = "test";

  // Import dinâmico — respeita .env.test e variáveis
  const { AppDataSource } = await import("../../../src/app/db/data-source");

  // Override defensivo (útil no CI/local)
  AppDataSource.setOptions({
    host: process.env.DB_HOST ?? "localhost",
    port: Number(process.env.DB_PORT ?? "5444"),
    username: process.env.DB_USER ?? "app",
    password: process.env.DB_PASS ?? "app",
    database: process.env.DB_NAME ?? "app_test",
    // logging: false,
  });

  ds = AppDataSource;

  await ds.initialize();
  await ds.runMigrations();

  // Seeds usam AppDataSource internamente (sem parâmetros)
  const { seedPermissionsAndRoles, seedUsers } = await import("./seed");
  await seedPermissionsAndRoles();
  await seedUsers();
}

export async function closeTestDB() {
  if (ds?.isInitialized) {
    await ds.destroy();
  }
}
