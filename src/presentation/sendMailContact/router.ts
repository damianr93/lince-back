// File: src/routes/sendEmailRouter.ts
import { Router, Request, Response, NextFunction } from 'express';
import { EmailService } from '../services/email.service';
import { envs } from '../../config/envs';
import { SendEmailController } from './controller';


const emailService = new EmailService(envs.SEND_EMAIL);


const controller = new SendEmailController(emailService);


const sendEmailRouter = Router();
sendEmailRouter.post(
  '/sendMailerContact',
  (req: Request, res: Response, next: NextFunction) => {
    controller.sendEmail(req, res, next).catch(next);
  }
);

export default sendEmailRouter;