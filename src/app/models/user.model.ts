export interface User {
  id: string;
  nome: string;
  email: string;
  role: {
    admin: boolean,
    user: boolean
  }
}
