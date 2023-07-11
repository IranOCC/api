import { Logger } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

export function userOfficeMiddleware(req: Request, res: Response, next: NextFunction) {
    console.log("MMMM", req?.user);

    next();
}
