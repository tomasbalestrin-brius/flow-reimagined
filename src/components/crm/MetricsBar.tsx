import { Card, CardContent } from "@/components/ui/card";
import { Lead } from "@/types/crm";
import { TrendingUp, Users, Calendar, AlertCircle } from "lucide-react";
import { format, isToday, isThisWeek, differenceInDays } from "date-fns";

interface MetricsBarProps {
  leads: Lead[];
}

export const MetricsBar = ({ leads }: MetricsBarProps) => {
  const formularioCount = leads.filter(l => l.status === 'formulario_preenchido').length;
  const qualificadoCount = leads.filter(l => l.status === 'qualificado').length;
  const emAgendamentoCount = leads.filter(l => l.status === 'em_agendamento').length;
  const agendadoCount = leads.filter(l => l.status === 'agendado').length;

  const agendadosHoje = leads.filter(l => 
    l.status === 'agendado' && 
    l.data_agendamento && 
    isToday(new Date(l.data_agendamento))
  ).length;

  const agendadosSemana = leads.filter(l => 
    l.status === 'agendado' && 
    l.data_agendamento && 
    isThisWeek(new Date(l.data_agendamento))
  ).length;

  const leadsSemAtualizacao = leads.filter(l => {
    const daysSinceUpdate = differenceInDays(new Date(), new Date(l.updated_at));
    return daysSinceUpdate > 3;
  }).length;

  const conversao = leads.length > 0 
    ? ((agendadoCount / leads.length) * 100).toFixed(1) 
    : '0';

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-6">
      <Card className="bg-blue-500/10 border-blue-500/20">
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Novos</span>
            <span className="text-2xl font-bold text-blue-500">{formularioCount}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-green-500/10 border-green-500/20">
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Qualificados</span>
            <span className="text-2xl font-bold text-green-500">{qualificadoCount}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-500/10 border-yellow-500/20">
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Em Agendamento</span>
            <span className="text-2xl font-bold text-yellow-500">{emAgendamentoCount}</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-purple-500/10 border-purple-500/20">
        <CardContent className="p-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Agendados</span>
            <span className="text-2xl font-bold text-purple-500">{agendadoCount}</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Conversão</span>
              <span className="text-2xl font-bold">{conversao}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Hoje</span>
              <span className="text-2xl font-bold">{agendadosHoje}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <div className="flex flex-col">
              <span className="text-sm text-muted-foreground">Sem Atualização</span>
              <span className="text-2xl font-bold">{leadsSemAtualizacao}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
