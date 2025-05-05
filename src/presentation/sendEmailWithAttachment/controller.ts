import { Request, Response, NextFunction } from 'express';
import { ContactFormWithAttachmentDto } from '../../domain/dtos/cvAttachment';
import { EmailService, SendMailOptions } from '../services/email.service';

export class SendEmailController {
  constructor(private readonly emailService: EmailService) {}

  sendEmailWithAttachment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {

      if (!req.file) {
        return res.status(400).json({ error: 'No se proporcionó ningún archivo' });
      }

      const [error, dto] = ContactFormWithAttachmentDto.create({
        file: req.file,
        ...req.body
      });

      if (error) {
        return res.status(400).json({ error });
      }

      const htmlBody = `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body>
          <h1>Nuevo CV recibido</h1>
          <p>Se ha recibido un nuevo curriculum vitae.</p>
          <!-- Aquí puedes incluir más información del formulario si la necesitas -->
        </body>
        </html>
      `;

      const mailOptions: SendMailOptions = {
        to: 'damian@lincesa.com.ar',
        subject: `Se recibió un nuevo CV`,
        htmlBody,
        attachments: [
          {
            filename: req.file.originalname,
            content: req.file.buffer,
            contentType: req.file.mimetype,
          },
        ],
      };

      await this.emailService.sendEmail(mailOptions);
      return res.status(200).json({ success: true, message: 'Email enviado correctamente' });
    } catch (err) {
      console.error('Error al enviar email:', err);
      return next(err);
    }
  };
}