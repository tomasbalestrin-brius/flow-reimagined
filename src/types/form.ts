export interface FormData {
  nome: string;
  telefone: string;
  email: string;
  instagram: string;
  nicho: string;
  cargo: string;
  faturamento: string;
  dificuldade: string;
  outraDificuldade?: string;
  investimento: string;
  dataAgendamento: string;
  horarioAgendamento: string;
}

export interface FormStep {
  id: number;
  question: string;
  subtitle?: string;
  type: 'text' | 'tel' | 'email' | 'instagram' | 'radio' | 'date' | 'time';
  field: keyof FormData;
  options?: string[];
  placeholder?: string;
  validation: (value: string, formData?: FormData) => string | null;
}
