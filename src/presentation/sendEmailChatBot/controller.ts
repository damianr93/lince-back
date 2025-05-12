import { Request, Response, NextFunction } from 'express';
import { EmailService, SendMailOptions } from '../services/email.service';
import { ContactFromChatBotDto } from '../../domain/dtos/contactFromChatbot';
import { envs } from '../../config/envs';

interface ManyChartResponse {
  success?: boolean;
  status?: string;
  error_message?: string;
  error_code?: string;
  // Otros campos que puedan ser devueltos por la API de ManyChat
}

export class SendEmailChatBotController {
  constructor(private readonly emailService: EmailService) { }

  sendEmailChatBot = async (req: Request, res: Response, next: NextFunction) => {
    try {
      // Validar el DTO
      const [error, dto] = ContactFromChatBotDto.create(req.body);
      if (error) return res.status(400).json({ error });

      // Generar el cuerpo del correo electrónico
      const htmlBody = this.generateEmailTemplate(dto!);

      // Interactuar con ManyChat - registramos los resultados
      // const manyChatResults = await this.processManyChatOperations(dto!);

      // Enviar el correo electrónico
      const sendOptions: SendMailOptions = {
        to: 'damian@lincesa.com.ar',
        subject: 'Consulta desde el ChatBot',
        htmlBody,
      };

      await this.emailService.sendEmail(sendOptions);

      // Responder con los resultados de todas las operaciones
      return res.json({ 
        success: true,
        email: { sent: true },
        // manyChat: manyChatResults
      });
    } catch (err: unknown) {
      console.error('Error en sendEmailChatBot:', err);
      return next(err);
    }
  };

  /**
   * Procesa todas las operaciones de ManyChat y devuelve los resultados
   */
  // private async processManyChatOperations(dto: ContactFromChatBotDto) {
  //   try {
  //     // Configuramos los campos personalizados primero
  //     const customFieldResults: Record<string, { success: boolean; response?: any }> = {};
      
  //     if (dto.telefono) {
  //       customFieldResults['tel_cliente'] = await this.setCustomField('tel_cliente', dto.telefono);
  //     }
      
  //     if (dto.asunto) {
  //       customFieldResults['tipo'] = await this.setCustomField('tipo', dto.asunto);
  //     }

  //     // Enviamos el flow después de configurar los campos
  //     const flowResult = await this.sendFlow();

  //     return {
  //       customFields: customFieldResults,
  //       flowSent: flowResult
  //     };
  //   } catch (error: unknown) {
  //     console.error('Error en operaciones de ManyChat:', error);
  //     const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
  //     throw new Error(`Error en operaciones de ManyChat: ${errorMessage}`);
  //   }
  // }

  /**
   * Envía un flow a través de la API de ManyChat
   * @returns Objeto con el resultado de la operación
   */
  // private async sendFlow(): Promise<{ success: boolean; response?: any }> {
  //   try {
  //     const resp = await fetch(`https://api.manychat.com/fb/sending/sendFlow`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': envs.TOKEN_USER_MANYCHAT,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         subscriber_id: envs.ID_USER_MANYCHAT,
  //         flow_ns: 'content20250506120150_094246'
  //       })
  //     });

  //     const data: ManyChartResponse = await resp.json();

  //     // Un código HTTP 200 con cualquier respuesta se considera exitoso
  //     if (!resp.ok) {
  //       const errorMessage = data.error_message || `Error HTTP: ${resp.status}`;
  //       console.error('Error al enviar el flow:', errorMessage);
  //       return { 
  //         success: false, 
  //         response: { 
  //           statusCode: resp.status,
  //           ...data
  //         } 
  //       };
  //     }

  //     return { success: true, response: data };
  //   } catch (error: unknown) {
  //     console.error('Error en sendFlow:', error);
  //     const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
  //     return { success: false, response: { error: errorMessage } };
  //   }
  // }

  // /**
  //  * Establece un campo personalizado en ManyChat
  //  * @param fieldName Nombre del campo
  //  * @param fieldValue Valor del campo
  //  * @returns Objeto con el resultado de la operación
  //  */
  // private async setCustomField(fieldName: string, fieldValue: string): Promise<{ success: boolean; response?: any }> {
  //   try {
  //     if (!fieldName || !fieldValue) {
  //       return { success: false, response: { error: 'fieldName y fieldValue son obligatorios' } };
  //     }

  //     const resp = await fetch(`https://api.manychat.com/fb/subscriber/setCustomFieldByName`, {
  //       method: 'POST',
  //       headers: {
  //         'Authorization': envs.TOKEN_USER_MANYCHAT,
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({
  //         subscriber_id: envs.ID_USER_MANYCHAT,
  //         field_name: fieldName,
  //         field_value: fieldValue
  //       })
  //     });

  //     const data: ManyChartResponse = await resp.json();

  //     // Un código HTTP 200 con cualquier respuesta se considera exitoso
  //     if (!resp.ok) {
  //       const errorMessage = data.error_message || `Error HTTP: ${resp.status}`;
  //       console.error(`Error en setCustomField(${fieldName}):`, errorMessage);
  //       return { 
  //         success: false, 
  //         response: { 
  //           statusCode: resp.status,
  //           ...data
  //         } 
  //       };
  //     }

  //     return { success: true, response: data };
  //   } catch (error: unknown) {
  //     console.error(`Error en setCustomField(${fieldName}):`, error);
  //     const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
  //     return { success: false, response: { error: errorMessage } };
  //   }
  // }

  /**
   * Genera la plantilla HTML para el correo electrónico
   */
  private generateEmailTemplate = (dto: ContactFromChatBotDto) => {
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