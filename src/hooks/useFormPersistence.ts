import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { FormData } from '@/types/form';
import { useToast } from '@/hooks/use-toast';

export const useFormPersistence = () => {
  const [recordId, setRecordId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const saveProgress = useCallback(async (formData: Partial<FormData>, step: number) => {
    setIsLoading(true);
    try {
      const dataToSave = {
        nome: formData.nome || null,
        telefone: formData.telefone || null,
        email: formData.email || null,
        instagram: formData.instagram || null,
        nicho: formData.nicho || null,
        cargo: formData.cargo || null,
        faturamento: formData.faturamento || null,
        dificuldade: formData.dificuldade === 'Outro' ? formData.outraDificuldade : formData.dificuldade || null,
        investimento: formData.investimento || null,
        data_agendamento: formData.dataAgendamento || null,
        horario_agendamento: formData.horarioAgendamento || null,
        status: 'incompleto',
        ultima_pergunta: step,
        updated_at: new Date().toISOString()
      };

      if (recordId) {
        const { error } = await supabase
          .from('aplicacoes_mentoria')
          .update(dataToSave)
          .eq('id', recordId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('aplicacoes_mentoria')
          .insert([dataToSave])
          .select()
          .single();

        if (error) throw error;
        if (data) setRecordId(data.id);
      }
    } catch (error) {
      console.error('Erro ao salvar progresso:', error);
    } finally {
      setIsLoading(false);
    }
  }, [recordId]);

  const completeForm = useCallback(async (formData: FormData) => {
    setIsLoading(true);
    try {
      const dataToSave = {
        nome: formData.nome,
        telefone: formData.telefone,
        email: formData.email,
        instagram: formData.instagram,
        nicho: formData.nicho,
        cargo: formData.cargo,
        faturamento: formData.faturamento,
        dificuldade: formData.dificuldade === 'Outro' ? formData.outraDificuldade : formData.dificuldade,
        investimento: formData.investimento,
        data_agendamento: formData.dataAgendamento,
        horario_agendamento: formData.horarioAgendamento,
        status: 'completo',
        ultima_pergunta: 11,
        updated_at: new Date().toISOString()
      };

      // Update application
      const { error: updateError } = await supabase
        .from('aplicacoes_mentoria')
        .update(dataToSave)
        .eq('id', recordId);

      if (updateError) throw updateError;

      // Create appointment
      const { error: appointmentError } = await supabase
        .from('agendamentos')
        .insert([{
          data_agendamento: formData.dataAgendamento,
          horario_agendamento: formData.horarioAgendamento,
          nome_cliente: formData.nome,
          email_cliente: formData.email,
          telefone_cliente: formData.telefone,
          status: 'confirmado'
        }]);

      if (appointmentError) throw appointmentError;

      // Send to Google Sheets
      try {
        const { data: sheetsData, error: sheetsError } = await supabase.functions.invoke('send-to-sheets', {
          body: formData
        });

        if (sheetsError) {
          console.error('Erro ao enviar para Google Sheets:', sheetsError);
        } else {
          console.log('Enviado com sucesso para Google Sheets:', sheetsData);
        }
      } catch (sheetsError) {
        console.error('Erro ao chamar função sheets:', sheetsError);
        // Don't fail the entire form submission if sheets fails
      }

      toast({
        title: "Sucesso!",
        description: "Sua aplicação foi enviada com sucesso.",
      });

      return true;
    } catch (error) {
      console.error('Erro ao completar formulário:', error);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao enviar sua aplicação. Tente novamente.",
        variant: "destructive"
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [recordId, toast]);

  const checkAvailableSlots = useCallback(async (date: string) => {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select('horario_agendamento')
        .eq('data_agendamento', date)
        .eq('status', 'confirmado');

      if (error) throw error;

      return data?.map(item => item.horario_agendamento) || [];
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
      return [];
    }
  }, []);

  return {
    saveProgress,
    completeForm,
    checkAvailableSlots,
    isLoading
  };
};
