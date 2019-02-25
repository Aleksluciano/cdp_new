import { Circuito } from './circuito.model';
export interface Congregacao {
  id?: string;
  name: string;
  circuito: string;
  secretario: string;
  contatoSecretario: string;
}
