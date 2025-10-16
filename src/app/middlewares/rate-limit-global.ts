import rateLimit from "express-rate-limit";

export const rateLimitGlobal = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,                 // limite por IP
  standardHeaders: true,    // retorna info nos headers RateLimit-*
  legacyHeaders: false,     // desabilita headers antigos
  message: { error: { message: "Too many requests. Try again later." } },
});
