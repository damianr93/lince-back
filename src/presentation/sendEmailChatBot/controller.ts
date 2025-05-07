import { Request, Response, NextFunction } from 'express';
import { EmailService, SendMailOptions } from '../services/email.service';
import { ContactFromChatBotDto } from '../../domain/dtos/contactFromChatbot';
import { envs } from '../../config/envs';

export class SendEmailChatBotController {
  constructor(private readonly emailService: EmailService) { }

  sendEmailChatBot = async (req: Request, res: Response, next: NextFunction) => {
    try {

      const [error, dto] = ContactFromChatBotDto.create(req.body);
      if (error) return res.status(400).json({ error });

      const htmlBody = this.generateEmailTemplate(dto!)

      this.setCustomField('tel_cliente', dto?.telefono!);
      this.setCustomField('tipo', dto?.asunto!);
      this.sendFlow()

      const sendOptions: SendMailOptions = {
        to: 'damian@lincesa.com.ar',
        subject: 'Consulta desde el ChatBot',
        htmlBody,
      };

      await this.emailService.sendEmail(sendOptions);
      return res.json({ success: true });
    } catch (err) {
      return next(err);
    }
  };

  sendFlow = async () => {
    const resp = await fetch(`https://api.manychat.com/fb/sending/sendFlow`, {
      method: 'POST',
      headers: {
        'Authorization': envs.TOKEN_USER_MANYCHAT,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscriber_id: envs.ID_USER_MANYCHAT,
        flow_ns: 'content20250506120150_094246'
      })
    });
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(`Error al enviar el flow: ${JSON.stringify(err)}`);
    }
  };


  setCustomField = async (fieldName: string, fieldValue: string) => {

    if (!fieldName || !fieldValue) throw new Error('setCustomField: fieldName and fieldValue are required');

    const resp = await fetch(`https://api.manychat.com/fb/subscriber/setCustomFieldByName`, {
      method: 'POST',
      headers: {
        'Authorization': envs.TOKEN_USER_MANYCHAT,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        subscriber_id: envs.ID_USER_MANYCHAT,
        field_name: fieldName,
        field_value: fieldValue
      })
    });
    if (!resp.ok) {
      const err = await resp.json();
      throw new Error(`Error setCustomField(${fieldName}): ${JSON.stringify(err)}`);
    }
  };

  generateEmailTemplate = (dto: ContactFromChatBotDto) => {
    // Función auxiliar para crear campos condicionales
    const createFieldIfExists = (label: string, value: string | undefined) => {
      return value ? `<div class="field"><span class="label">${label}:</span><span class="value">${value}</span></div>` : '';
    };

    const htmlBody = `
          <!DOCTYPE html>
          <html lang="es">
          <head>
            <meta charset="UTF-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Solicitud de Cotización - ${dto.nombreCliente || dto.asunto}</title>
            <style>
              body { font-family: Arial, sans-serif; background-color: #f7f7f7; margin: 0; padding: 20px; }
              .container { max-width: 600px; background: #ffffff; margin: auto; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
              h1 { color: #6E2864; font-size: 24px; margin-bottom: 20px; }
              .field { margin-bottom: 12px; }
              .label { font-weight: bold; display: inline-block; width: 160px; color: #333333; }
              .value { color: #555555; }
              ul.list { margin: 0; padding-left: 20px; color: #555555; }
              .footer { margin-top: 30px; font-size: 12px; text-align: center; color: #999999; }
            </style>
          </head>
          <body>
            <div class="container">
              <h1>📩 Nueva solicitud de cotización</h1>
              ${createFieldIfExists('Asunto', dto.asunto)}
              ${createFieldIfExists('Nombre del cliente', dto.nombreCliente)}
              ${createFieldIfExists('Teléfono', dto.telefono)}
              ${createFieldIfExists('Producto', dto.producto)}
              ${createFieldIfExists('Tipo de animal', dto.tipoAnimal)}
              ${createFieldIfExists('Categoría animal', dto.categoriaAnimal)}
              ${createFieldIfExists('Tipo bovino', dto.tipoBovino)}
              ${createFieldIfExists('Cantidad de animales', dto.cantidadAnimales)}
              ${createFieldIfExists('Tiempo requerido', dto.tiempoRequerido)}
              ${createFieldIfExists('Zona', dto.zona)}
              <div class="footer">Este mensaje fue enviado automáticamente desde el Chatbot de Lince SA.</div>
            </div>
          </body>
          </html>
        `;

    return htmlBody;
  };

}
