export interface Person {
  [key: string]: any;
  ID: number;
  ID_FOTO_USUARIO: number;
  ID_TIPO_DOC: number;
  // ROLES: Role[];
  NUMERO_DOC: string;
  CODIGO_ESTUDIANTE?: string;
  PRIMER_NOMBRE: string;
  SEGUNDO_NOMBRE: string;
  PRIMER_APELLIDO: string;
  SEGUNDO_APELLIDO: string;
  EMAIL_CORP?: string | null;
  EMAIL_PER: string;
}
