import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lead } from "@/types/crm";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { LeadModal } from "./LeadModal";
import { cn } from "@/lib/utils";

interface CalendarViewProps {
  leads: Lead[];
  onUpdate: () => void;
}

export const CalendarView = ({ leads, onUpdate }: CalendarViewProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const agendados = leads.filter(
    (lead) => lead.status === 'agendado' && lead.data_agendamento
  );

  const leadsOnDate = agendados.filter((lead) =>
    isSameDay(new Date(lead.data_agendamento!), selectedDate)
  );

  const datesWithLeads = agendados.map((lead) => new Date(lead.data_agendamento!));

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>Calendário de Agendamentos</CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className={cn("rounded-md border pointer-events-auto")}
            modifiers={{
              booked: datesWithLeads,
            }}
            modifiersClassNames={{
              booked: "bg-purple-500/20 font-bold",
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {format(selectedDate, "dd 'de' MMMM", { locale: ptBR })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {leadsOnDate.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              Nenhum agendamento nesta data
            </p>
          ) : (
            <div className="space-y-3">
              {leadsOnDate
                .sort((a, b) => {
                  const timeA = a.horario_agendamento || "";
                  const timeB = b.horario_agendamento || "";
                  return timeA.localeCompare(timeB);
                })
                .map((lead) => (
                  <Card
                    key={lead.id}
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => {
                      setSelectedLead(lead);
                      setModalOpen(true);
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{lead.nome}</h4>
                        <Badge variant="secondary">
                          {lead.horario_agendamento}
                        </Badge>
                      </div>
                      {lead.nicho && (
                        <p className="text-xs text-muted-foreground">{lead.nicho}</p>
                      )}
                    </CardContent>
                  </Card>
                ))}
            </div>
          )}
        </CardContent>
      </Card>

      <LeadModal
        lead={selectedLead}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onUpdate={onUpdate}
      />
    </div>
  );
};
