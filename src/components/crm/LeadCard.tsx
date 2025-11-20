import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lead } from "@/types/crm";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar, Clock } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface LeadCardProps {
  lead: Lead;
  onClick: () => void;
}

export const LeadCard = ({ lead, onClick }: LeadCardProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lead.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="cursor-move hover:shadow-lg transition-shadow"
      onClick={onClick}
    >
      <CardContent className="p-4">
        <h4 className="font-semibold text-sm mb-2 line-clamp-1">{lead.nome}</h4>
        
        {lead.data_agendamento && (
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Calendar className="h-3 w-3" />
              <span>
                {format(new Date(lead.data_agendamento), "dd 'de' MMMM", { locale: ptBR })}
              </span>
            </div>
            {lead.horario_agendamento && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{lead.horario_agendamento}</span>
              </div>
            )}
          </div>
        )}

        {lead.nicho && (
          <Badge variant="secondary" className="mt-2 text-xs">
            {lead.nicho}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
};
