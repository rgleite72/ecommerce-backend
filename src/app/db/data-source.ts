// src/app/db/data-source.ts
import "reflect-metadata";
import { DataSource } from "typeorm";
import dotenv from "dotenv";

// Determina se está em modo de teste
const isTest = process.env.NODE_ENV === "test";

// Carrega o .env correto antes de acessar as variáveis
dotenv.config({ path: isTest ? ".env.test" : ".env.development" });

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME, // .env.test -> commerceBackdb_test
  synchronize: isTest, // Em testes, recria automaticamente o schema
  logging: false,
  entities: [__dirname + "/../../**/*.entity.{ts,js}"],
  migrations: [__dirname + "/migrations/*.{ts,js}"],  // <<< AQUI
  migrationsTableName: "migrations",                  // (opcional, mas bom)
});


