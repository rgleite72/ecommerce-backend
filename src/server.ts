import "reflect-metadata";
import { AppDataSource } from "./app/db/data-source";
import { createApp } from "./app/app";

async function bootstrap() {
  await AppDataSource.initialize(); // ✅ inicializa o TypeORM

  const app = createApp();          // ✅ sua assinatura original, sem argumentos
  const PORT = Number(process.env.PORT ?? 3000);

  app.listen(PORT, () => {
    console.log(`[HTTP] Servidor rodando na porta ${PORT}`);
  });
}

bootstrap().catch((err) => {
  console.error("Falha ao iniciar:", err);
  process.exit(1);
});
