import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { Lead, LeadFilters } from "@/types/crm";
import { KanbanBoard } from "@/components/crm/KanbanBoard";
import { CalendarView } from "@/components/crm/CalendarView";
import { MetricsBar } from "@/components/crm/MetricsBar";
import { SearchAndFilters } from "@/components/crm/SearchAndFilters";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogOut, Target } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { isToday, isWithinInterval, subDays } from "date-fns";

const CRM = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<LeadFilters>({
    search: "",
    faturamento: "",
    cargo: "",
    nicho: "",
    dateRange: "",
  });

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    fetchLeads();
    setupRealtimeSubscription();
  }, [user, navigate]);

  useEffect(() => {
    applyFilters();
  }, [leads, filters]);

  const fetchLeads = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('aplicacoes_mentoria')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: "Erro ao carregar leads",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    setLeads(data || []);
    setLoading(false);
  };

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('crm-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'aplicacoes_mentoria',
        },
        () => {
          fetchLeads();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const applyFilters = () => {
    let filtered = [...leads];

    // Busca por texto
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.nome?.toLowerCase().includes(searchLower) ||
          lead.email?.toLowerCase().includes(searchLower) ||
          lead.telefone?.includes(filters.search)
      );
    }

    // Filtro por faturamento
    if (filters.faturamento) {
      filtered = filtered.filter((lead) => lead.faturamento === filters.faturamento);
    }

    // Filtro por cargo
    if (filters.cargo) {
      filtered = filtered.filter((lead) => lead.cargo === filters.cargo);
    }

    // Filtro por nicho
    if (filters.nicho) {
      filtered = filtered.filter((lead) => lead.nicho === filters.nicho);
    }

    // Filtro por período
    if (filters.dateRange) {
      const now = new Date();
      filtered = filtered.filter((lead) => {
        const createdAt = new Date(lead.created_at);
        
        if (filters.dateRange === "today") {
          return isToday(createdAt);
        }
        
        if (filters.dateRange === "7days") {
          return isWithinInterval(createdAt, {
            start: subDays(now, 7),
            end: now,
          });
        }
        
        if (filters.dateRange === "30days") {
          return isWithinInterval(createdAt, {
            start: subDays(now, 30),
            end: now,
          });
        }
        
        return true;
      });
    }

    setFilteredLeads(filtered);
  };

  const handleLogout = async () => {
    await signOut();
    navigate("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#020716' }}>
        <div className="text-white">Carregando CRM...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Target className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold">CRM - Gestão de Leads</h1>
              <p className="text-sm text-muted-foreground">Sistema de acompanhamento de mentoria</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <MetricsBar leads={filteredLeads} />

        <Tabs defaultValue="board" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="board">Board</TabsTrigger>
            <TabsTrigger value="agenda">Agenda</TabsTrigger>
          </TabsList>

          <TabsContent value="board" className="space-y-6">
            <SearchAndFilters filters={filters} onFiltersChange={setFilters} />
            <KanbanBoard leads={filteredLeads} onUpdate={fetchLeads} />
          </TabsContent>

          <TabsContent value="agenda">
            <CalendarView leads={leads} onUpdate={fetchLeads} />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default CRM;
