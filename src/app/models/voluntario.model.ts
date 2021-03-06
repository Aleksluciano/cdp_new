
export interface Voluntario {
  id?: string;
  nome: string;
  sexo: string;
  email?: string;
  telefone?: string;
  cidade: string;
  congregacao: string;
  privilegio: string;
  observacao?: string;
  dependente?: boolean;
  nomeDependente: any;
  nomeDepString?: string;
  disponibilidade?: any;
  ultimavez?: Date;
  semdispo?: boolean;
  lider?: boolean;
  telegram?: number;
}


export interface PerSet {
  name: string; checked: boolean;
}

export interface PeriodoSet {
dias: string;
periodos: PerSet[];
}
