import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Lead } from "@/types/crm";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";

interface AgendarModalProps {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const AgendarModal = ({ lead, open, onOpenChange, onSuccess }: AgendarModalProps) => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAgendar = async () => {
    if (!date || !time) {
      toast({
        title: "Campos obrigatórios",
        description: "Selecione a data e o horário do agendamento",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    const { error } = await supabase
      .from('aplicacoes_mentoria')
      .update({
        status: 'agendado',
        data_agendamento: format(date, 'yyyy-MM-dd'),
        horario_agendamento: time,
        updated_at: new Date().toISOString(),
      })
      .eq('id', lead.id);

    setLoading(false);

    if (error) {
      toast({
        title: "Erro ao agendar",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Agendamento confirmado!",
      description: `Mentoria agendada para ${format(date, "dd 'de' MMMM", { locale: ptBR })} às ${time}`,
    });

    onSuccess();
    onOpenChange(false);
    setDate(undefined);
    setTime("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Agendar Mentoria</DialogTitle>
          <DialogDescription>
            Agendando para: {lead.nome}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Data do Agendamento</Label>
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => date < new Date()}
              initialFocus
              className={cn("rounded-md border pointer-events-auto")}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Horário</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="Ex: 14:00"
            />
          </div>

          <div className="flex gap-3">
            <Button
              onClick={handleAgendar}
              disabled={loading || !date || !time}
              className="flex-1"
            >
              {loading ? "Agendando..." : "Confirmar Agendamento"}
            </Button>
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
