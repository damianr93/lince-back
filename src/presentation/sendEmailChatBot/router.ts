// File: src/routes/sendEmailRouter.ts
import { Router, Request, Response, NextFunction } from 'express';
import { EmailService } from '../services/email.service';
import { envs } from '../../config/envs';
import { SendEmailChatBotController } from './controller';


const emailService = new EmailService(envs.SEND_EMAIL);


const controller = new SendEmailChatBotController(emailService);


const sendEmailFromChatbotRouter = Router();
sendEmailFromChatbotRouter.post(
  '/sendMailerChatBot',
  (req: Request, res: Response, next: NextFunction) => {
    controller.sendEmailChatBot(req, res, next).catch(next);
  }
);

export default sendEmailFromChatbotRouter;