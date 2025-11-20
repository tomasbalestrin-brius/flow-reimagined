export type LeadStatus = 'formulario_preenchido' | 'qualificado' | 'em_agendamento' | 'agendado';

export interface Lead {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  instagram?: string;
  nicho?: string;
  cargo?: string;
  faturamento?: string;
  dificuldade?: string;
  investimento?: string;
  data_agendamento?: string;
  horario_agendamento?: string;
  status: LeadStatus;
  created_at: string;
  updated_at: string;
}

export interface LeadFilters {
  search: string;
  faturamento: string;
  cargo: string;
  nicho: string;
  dateRange: string;
}
