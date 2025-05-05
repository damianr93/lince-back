import { Router, Request, Response, NextFunction } from 'express';
import { IaOpenAI } from './controller';

const controller = new IaOpenAI();

const IaOpenAIRoutes = Router();

IaOpenAIRoutes.post('/iaOpenAI', (req: Request, res: Response, next: NextFunction) => {
    controller.iaOpenai(req, res, next).catch(next);
}
);

export default IaOpenAIRoutes;
