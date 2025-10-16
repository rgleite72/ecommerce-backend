
import pinoHttp from 'pino-http';
import logger from '../../shared/logger';



export function loggerHttp() {
  return pinoHttp({
    logger,
    // Vincula o requestId ao logger da requisição
    genReqId: (req) => {
      // @ts-expect-error: campo custom que setamos no requestId middleware
      return req.requestId || undefined;
    },
    customProps: (req) => {
      // Estes campos aparecem em todos os logs dessa req
      // @ts-expect-error: campo custom
      const requestId = req.requestId;
      return { requestId };
    },
    serializers: {
      // Deixa o log mais limpo
      req(req) {
        return {
          method: req.method,
          url: req.url,
  
          requestId: req.requestId,
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  });
}
