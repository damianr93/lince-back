import { Request, Response, NextFunction } from 'express';
import { EmailService, SendMailOptions } from '../services/email.service';
import { ContactFormDto } from '../../domain/dtos/contact.dto';

export class SendEmailController {
  constructor(private readonly emailService: EmailService) { }

  sendEmail = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const [error, dto] = ContactFormDto.create(req.body);
      if (error) return res.status(400).json({ error });

      const htmlBody = `
            <!DOCTYPE html>
            <html lang="es">
            <head>
              <meta charset="UTF-8" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              <title>Nuevo Contacto de ${dto!.name}</title>
              <style>
                body { font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 20px; }
                .container { max-width: 600px; background: #ffffff; margin: auto; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
                h1 { color: #6E2864; font-size: 24px; margin-bottom: 10px; }
                .field { margin-bottom: 12px; }
                .label { font-weight: bold; display: inline-block; width: 140px; color: #333333; }
                .value { color: #555555; }
                ul.list { margin: 0; padding-left: 20px; color: #555555; }
                .footer { margin-top: 30px; font-size: 12px; text-align: center; color: #999999; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>📩 Nuevo contacto desde el formulario</h1>
                <div class="field"><span class="label">Nombre:</span><span class="value">${dto!.name}</span></div>
                <div class="field"><span class="label">Email:</span><span class="value">${dto!.email}</span></div>
                ${dto!.localidad ? `<div class="field"><span class="label">Localidad:</span><span class="value">${dto!.localidad}</span></div>` : ''}
                <div class="field"><span class="label">Teléfono:</span><span class="value">${dto!.phone}</span></div>
                ${dto!.empresa ? `<div class="field"><span class="label">Empresa:</span><span class="value">${dto!.empresa}</span></div>` : ''}
                ${dto!.actividad ? `<div class="field"><span class="label">Actividad/Rubro:</span><span class="value">${dto!.actividad}</span></div>` : ''}
                <div class="field">
                  <span class="label">Productos a cotizar:</span>
                  <ul class="list">
                    ${dto!.cotizar.map(item => `<li>${item}</li>`).join('')}
                  </ul>
                </div>
                <div class="field"><span class="label">Mensaje:</span><div class="value">${dto!.message.replace(/\n/g, '<br/>')}</div></div>
                <div class="footer">Este mensaje fue enviado automáticamente desde Autogestión Lince SA.</div>
              </div>
            </body>
            </html>
            `;

      const sendOptions: SendMailOptions = {
        to: 'damian@lincesa.com.ar',
        subject: `Nueva consulta de ${dto!.name} `,
        htmlBody,
      };

      await this.emailService.sendEmail(sendOptions);
      return res.json({ success: true });
    } catch (err) {
      return next(err);
    }
  };

  
}
