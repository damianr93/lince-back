import { Router } from 'express';
import sendEmailRouter from './sendMailContact/router';
import sendMailWithAttachment from './sendEmailWithAttachment/router';
import IaOpenAIRoutes from './iaChatBot/router';
import sendEmailFromChatbotRouter from './sendEmailChatBot/router';


export class AppRoutes {


  static get routes(): Router {

    const router = Router();
    
    router.use('/', sendEmailRouter );
    router.use('/',  sendMailWithAttachment);
    router.use('/',  IaOpenAIRoutes);
    router.use('/', sendEmailFromChatbotRouter)

    return router;
  }


}
