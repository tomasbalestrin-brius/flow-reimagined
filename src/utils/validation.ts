export const validateNome = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return 'Por favor, digite seu nome completo';
  if (trimmed.length < 3) return 'Nome deve ter pelo menos 3 caracteres';
  return null;
};

export const validateTelefone = (value: string): string | null => {
  const digits = value.replace(/\D/g, '');
  if (digits.length < 10) return 'Por favor, digite um telefone válido com DDD';
  return null;
};

export const validateEmail = (value: string): string | null => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(value.trim())) return 'Por favor, digite um e-mail válido';
  return null;
};

export const validateInstagram = (value: string): string | null => {
  const trimmed = value.trim();
  if (!trimmed) return 'Por favor, digite seu Instagram';
  return null;
};

export const validateRequired = (value: string): string | null => {
  if (!value.trim()) return 'Este campo é obrigatório';
  return null;
};

export const formatTelefone = (value: string): string => {
  const digits = value.replace(/\D/g, '');
  if (digits.length <= 2) return digits;
  if (digits.length <= 7) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7, 11)}`;
};

export const getNextBusinessDays = (count: number): Date[] => {
  const days: Date[] = [];
  let current = new Date();
  current.setHours(0, 0, 0, 0);
  
  while (days.length < count) {
    current.setDate(current.getDate() + 1);
    const dayOfWeek = current.getDay();
    
    // Skip weekends (0 = Sunday, 6 = Saturday)
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      days.push(new Date(current));
    }
  }
  
  return days;
};

export const formatDateLong = (date: Date): string => {
  const days = ['domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 'quinta-feira', 'sexta-feira', 'sábado'];
  const months = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
  
  const dayName = days[date.getDay()];
  const day = date.getDate();
  const month = months[date.getMonth()];
  
  return `${dayName}, ${day} de ${month}`;
};

export const formatDateISO = (date: Date): string => {
  return date.toISOString().split('T')[0];
};
