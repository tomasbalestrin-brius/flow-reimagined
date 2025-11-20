import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lead } from "@/types/crm";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Mail, Phone, Instagram, Building2, DollarSign, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { AgendarModal } from "./AgendarModal";

interface LeadModalProps {
  lead: Lead | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: () => void;
}

export const LeadModal = ({ lead, open, onOpenChange, onUpdate }: LeadModalProps) => {
  const [agendarOpen, setAgendarOpen] = useState(false);

  if (!lead) return null;

  const telefoneFormatado = lead.telefone.replace(/\D/g, '');
  const instagramHandle = lead.instagram?.replace('@', '');

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl">{lead.nome}</DialogTitle>
            <DialogDescription>
              Cadastrado em {format(new Date(lead.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6">
            {/* Informações de Contato */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Contato</h3>
              
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{lead.telefone}</span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => window.open(`https://wa.me/55${telefoneFormatado}`, '_blank')}
                >
                  WhatsApp
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span>{lead.email}</span>
              </div>

              {lead.instagram && (
                <div className="flex items-center gap-3">
                  <Instagram className="h-4 w-4 text-muted-foreground" />
                  <span>{lead.instagram}</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://instagram.com/${instagramHandle}`, '_blank')}
                  >
                    Abrir
                  </Button>
                </div>
              )}
            </div>

            {/* Informações Profissionais */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Informações Profissionais</h3>
              
              {lead.nicho && (
                <div className="flex items-center gap-3">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Nicho:</span>
                  <Badge variant="secondary">{lead.nicho}</Badge>
                </div>
              )}

              {lead.cargo && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Cargo:</span>
                  <span>{lead.cargo}</span>
                </div>
              )}

              {lead.faturamento && (
                <div className="flex items-center gap-3">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Faturamento:</span>
                  <span>{lead.faturamento}</span>
                </div>
              )}

              {lead.investimento && (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-muted-foreground">Investimento:</span>
                  <span>{lead.investimento}</span>
                </div>
              )}
            </div>

            {/* Dificuldade */}
            {lead.dificuldade && (
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">Dificuldade Relatada</h3>
                <p className="text-sm bg-muted p-3 rounded-md">{lead.dificuldade}</p>
              </div>
            )}

            {/* Agendamento */}
            {lead.data_agendamento && (
              <div className="space-y-3 bg-purple-500/10 border border-purple-500/20 p-4 rounded-md">
                <h3 className="font-semibold text-lg">Agendamento</h3>
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-purple-500" />
                  <span>{format(new Date(lead.data_agendamento), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                </div>
                {lead.horario_agendamento && (
                  <div className="flex items-center gap-3">
                    <Clock className="h-4 w-4 text-purple-500" />
                    <span>{lead.horario_agendamento}</span>
                  </div>
                )}
              </div>
            )}

            {/* Ações */}
            <div className="flex gap-3">
              {lead.status !== 'agendado' && (
                <Button 
                  onClick={() => setAgendarOpen(true)}
                  className="flex-1"
                >
                  Agendar Mentoria
                </Button>
              )}
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Fechar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AgendarModal
        lead={lead}
        open={agendarOpen}
        onOpenChange={setAgendarOpen}
        onSuccess={() => {
          onUpdate();
          onOpenChange(false);
        }}
      />
    </>
  );
};
