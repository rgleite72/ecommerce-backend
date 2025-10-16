import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

export function requestId(req: Request, res: Response, next: NextFunction) {
  const headerId = req.header('x-request-id');
  const id = headerId && headerId.trim() !== '' ? headerId : randomUUID();
  
  req.requestId = id;
  res.setHeader('x-request-id', id);
  next();
}
