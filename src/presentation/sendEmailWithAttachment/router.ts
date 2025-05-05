import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import { EmailService } from '../services/email.service';
import { envs } from '../../config/envs';
import { SendEmailController } from './controller';

const upload = multer({ storage: multer.memoryStorage() });
const emailService = new EmailService(envs.SEND_EMAIL);
const controller    = new SendEmailController(emailService);

const sendMailWithAttachment = Router();

sendMailWithAttachment.post(
  '/sendMailerWithAttachment',
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    controller
      .sendEmailWithAttachment(req, res, next)
      .catch(next);
  }
);

export default sendMailWithAttachment;