import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const { ip, method, url } = req
  const userAgent = req.get("user-agent") || ""
  const startAt = process.hrtime()
  res.on("finish", () => {
    const { statusCode } = res
    const contentLength = res.get("content-length")
    const diff = process.hrtime(startAt)
    const responseTime = diff[0] * 1e3 + diff[1] * 1e-6
    Logger.log(`${method} ${url} ${statusCode} ${contentLength || "0"} -> ${responseTime.toFixed(2)}ms ${userAgent} ${ip}`)
  })
  next();
}
