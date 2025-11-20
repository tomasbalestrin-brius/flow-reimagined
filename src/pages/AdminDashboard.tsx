import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Aplicacao {
  id: string;
  nome: string;
  email: string;
  telefone: string;
  nicho: string;
  cargo: string;
  faturamento: string;
  status: string;
  data_agendamento: string;
  horario_agendamento: string;
  created_at: string;
}

interface Agendamento {
  id: string;
  data_agendamento: string;
  horario_agendamento: string;
  nome_cliente: string;
  email_cliente: string;
  telefone_cliente: string;
  status: string;
  created_at: string;
}

export default function AdminDashboard() {
  const [aplicacoes, setAplicacoes] = useState<Aplicacao[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [loading, setLoading] = useState(true);
  
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [aplicacoesRes, agendamentosRes] = await Promise.all([
        supabase.from('aplicacoes_mentoria').select('*').order('created_at', { ascending: false }),
        supabase.from('agendamentos').select('*').order('created_at', { ascending: false })
      ]);

      if (aplicacoesRes.error) throw aplicacoesRes.error;
      if (agendamentosRes.error) throw agendamentosRes.error;

      setAplicacoes(aplicacoesRes.data || []);
      setAgendamentos(agendamentosRes.data || []);
    } catch (error: any) {
      toast({
        title: "Erro ao carregar dados",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const updateStatus = async (id: string, newStatus: string, type: 'aplicacao' | 'agendamento') => {
    try {
      const table = type === 'aplicacao' ? 'aplicacoes_mentoria' : 'agendamentos';
      const { error } = await supabase
        .from(table)
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Status atualizado!",
        description: `Status alterado para ${newStatus}`,
      });

      fetchData();
    } catch (error: any) {
      toast({
        title: "Erro ao atualizar status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#020716' }}>
        <div className="text-white">Carregando dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#020716' }}>
      <header className="border-b border-white/10 bg-white/5">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-white">Dashboard Administrativo</h1>
          <div className="flex items-center gap-4">
            <span className="text-gray-400 text-sm">{user?.email}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Sair
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="aplicacoes" className="w-full">
          <TabsList className="mb-8">
            <TabsTrigger value="aplicacoes">
              Aplicações ({aplicacoes.length})
            </TabsTrigger>
            <TabsTrigger value="agendamentos">
              Agendamentos ({agendamentos.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="aplicacoes">
            <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-gray-300">Nome</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Telefone</TableHead>
                    <TableHead className="text-gray-300">Nicho</TableHead>
                    <TableHead className="text-gray-300">Cargo</TableHead>
                    <TableHead className="text-gray-300">Faturamento</TableHead>
                    <TableHead className="text-gray-300">Data</TableHead>
                    <TableHead className="text-gray-300">Horário</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {aplicacoes.map((app) => (
                    <TableRow key={app.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white">{app.nome}</TableCell>
                      <TableCell className="text-gray-300">{app.email}</TableCell>
                      <TableCell className="text-gray-300">{app.telefone}</TableCell>
                      <TableCell className="text-gray-300">{app.nicho}</TableCell>
                      <TableCell className="text-gray-300">{app.cargo}</TableCell>
                      <TableCell className="text-gray-300">{app.faturamento}</TableCell>
                      <TableCell className="text-gray-300">
                        {app.data_agendamento ? format(new Date(app.data_agendamento), 'dd/MM/yyyy', { locale: ptBR }) : '-'}
                      </TableCell>
                      <TableCell className="text-gray-300">{app.horario_agendamento || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={app.status === 'completo' ? 'default' : 'secondary'}>
                          {app.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <select
                          value={app.status}
                          onChange={(e) => updateStatus(app.id, e.target.value, 'aplicacao')}
                          className="bg-white/5 border border-white/10 text-white rounded px-2 py-1 text-sm"
                        >
                          <option value="incompleto">Incompleto</option>
                          <option value="completo">Completo</option>
                          <option value="confirmado">Confirmado</option>
                          <option value="cancelado">Cancelado</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          <TabsContent value="agendamentos">
            <div className="bg-white/5 rounded-lg border border-white/10 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="border-white/10 hover:bg-white/5">
                    <TableHead className="text-gray-300">Nome</TableHead>
                    <TableHead className="text-gray-300">Email</TableHead>
                    <TableHead className="text-gray-300">Telefone</TableHead>
                    <TableHead className="text-gray-300">Data</TableHead>
                    <TableHead className="text-gray-300">Horário</TableHead>
                    <TableHead className="text-gray-300">Status</TableHead>
                    <TableHead className="text-gray-300">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {agendamentos.map((agendamento) => (
                    <TableRow key={agendamento.id} className="border-white/10 hover:bg-white/5">
                      <TableCell className="text-white">{agendamento.nome_cliente}</TableCell>
                      <TableCell className="text-gray-300">{agendamento.email_cliente}</TableCell>
                      <TableCell className="text-gray-300">{agendamento.telefone_cliente}</TableCell>
                      <TableCell className="text-gray-300">
                        {format(new Date(agendamento.data_agendamento), 'dd/MM/yyyy', { locale: ptBR })}
                      </TableCell>
                      <TableCell className="text-gray-300">{agendamento.horario_agendamento}</TableCell>
                      <TableCell>
                        <Badge variant={agendamento.status === 'confirmado' ? 'default' : 'secondary'}>
                          {agendamento.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <select
                          value={agendamento.status}
                          onChange={(e) => updateStatus(agendamento.id, e.target.value, 'agendamento')}
                          className="bg-white/5 border border-white/10 text-white rounded px-2 py-1 text-sm"
                        >
                          <option value="confirmado">Confirmado</option>
                          <option value="cancelado">Cancelado</option>
                          <option value="concluido">Concluído</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
