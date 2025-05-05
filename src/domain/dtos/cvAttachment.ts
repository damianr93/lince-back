
export interface ContactFormWithAttachmentProps {
  file: Express.Multer.File;

  name?: string;
  email?: string;
  phone?: string;
  message?: string;
}

export class ContactFormWithAttachmentDto {
  public readonly file: Express.Multer.File;
  public readonly attachmentContent: Buffer;
  public readonly filename: string;
  public readonly mimetype: string;
  public readonly name?: string;
  public readonly email?: string;
  public readonly phone?: string;
  public readonly message?: string;

  private constructor(props: ContactFormWithAttachmentProps) {
    this.file = props.file;
    this.attachmentContent = props.file.buffer;
    this.filename = props.file.originalname;
    this.mimetype = props.file.mimetype;
    
    this.name = props.name;
    this.email = props.email;
    this.phone = props.phone;
    this.message = props.message;
  }

  static create(props: ContactFormWithAttachmentProps): [string?, ContactFormWithAttachmentDto?] {

    if (!props.file) {
      return ['El archivo es obligatorio'];
    }

    const allowedMimeTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedMimeTypes.includes(props.file.mimetype)) {
      return [`Tipo de archivo no permitido. Por favor, sube un archivo PDF o Word (${props.file.mimetype})`];
    }

    const maxSize = 5 * 1024 * 1024;
    if (props.file.size > maxSize) {
      return ['El archivo es demasiado grande. El tamaño máximo permitido es 5MB'];
    }

    return [undefined, new ContactFormWithAttachmentDto(props)];
  }
}