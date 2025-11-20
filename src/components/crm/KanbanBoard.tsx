import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Lead, LeadStatus } from "@/types/crm";
import { LeadCard } from "./LeadCard";
import { LeadModal } from "./LeadModal";
import { AgendarModal } from "./AgendarModal";
import { supabase } from "@/lib/supabase";
import { toast } from "@/hooks/use-toast";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

interface KanbanBoardProps {
  leads: Lead[];
  onUpdate: () => void;
}

const columns: { id: LeadStatus; title: string; color: string }[] = [
  { id: 'formulario_preenchido', title: 'Formulário Preenchido', color: 'blue' },
  { id: 'qualificado', title: 'Qualificado', color: 'green' },
  { id: 'em_agendamento', title: 'Em Processo de Agendamento', color: 'yellow' },
  { id: 'agendado', title: 'Agendado', color: 'purple' },
];

export const KanbanBoard = ({ leads, onUpdate }: KanbanBoardProps) => {
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [agendarModalOpen, setAgendarModalOpen] = useState(false);
  const [activeLead, setActiveLead] = useState<Lead | null>(null);
  const [pendingStatus, setPendingStatus] = useState<LeadStatus | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const lead = leads.find(l => l.id === event.active.id);
    if (lead) {
      setActiveLead(lead);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveLead(null);
    
    const { active, over } = event;
    if (!over) return;

    const leadId = active.id as string;
    const newStatus = over.id as LeadStatus;
    const lead = leads.find(l => l.id === leadId);

    if (!lead || lead.status === newStatus) return;

    // Se for para status "agendado", abrir modal de agendamento
    if (newStatus === 'agendado') {
      setPendingStatus(newStatus);
      setSelectedLead(lead);
      setAgendarModalOpen(true);
      return;
    }

    // Atualizar status diretamente para outros casos
    await updateLeadStatus(leadId, newStatus);
  };

  const updateLeadStatus = async (leadId: string, newStatus: LeadStatus) => {
    const { error } = await supabase
      .from('aplicacoes_mentoria')
      .update({
        status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', leadId);

    if (error) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Status atualizado!",
      description: "O lead foi movido com sucesso.",
    });

    onUpdate();
  };

  const getLeadsByStatus = (status: LeadStatus) => {
    return leads.filter(lead => lead.status === status);
  };

  const getColumnColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-500/10 border-blue-500/20',
      green: 'bg-green-500/10 border-green-500/20',
      yellow: 'bg-yellow-500/10 border-yellow-500/20',
      purple: 'bg-purple-500/10 border-purple-500/20',
    };
    return colors[color as keyof typeof colors] || '';
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {columns.map((column) => {
            const columnLeads = getLeadsByStatus(column.id);
            
            return (
              <SortableContext
                key={column.id}
                id={column.id}
                items={columnLeads.map(l => l.id)}
                strategy={verticalListSortingStrategy}
              >
                <Card className={getColumnColor(column.color)}>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center justify-between">
                      <span>{column.title}</span>
                      <span className="text-sm font-normal">({columnLeads.length})</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 min-h-[400px]">
                    {columnLeads.map((lead) => (
                      <LeadCard
                        key={lead.id}
                        lead={lead}
                        onClick={() => {
                          setSelectedLead(lead);
                          setModalOpen(true);
                        }}
                      />
                    ))}
                  </CardContent>
                </Card>
              </SortableContext>
            );
          })}
        </div>

        <DragOverlay>
          {activeLead ? (
            <div className="opacity-50">
              <LeadCard lead={activeLead} onClick={() => {}} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      <LeadModal
        lead={selectedLead}
        open={modalOpen}
        onOpenChange={setModalOpen}
        onUpdate={onUpdate}
      />

      {selectedLead && (
        <AgendarModal
          lead={selectedLead}
          open={agendarModalOpen}
          onOpenChange={setAgendarModalOpen}
          onSuccess={() => {
            onUpdate();
            setPendingStatus(null);
          }}
        />
      )}
    </>
  );
};
