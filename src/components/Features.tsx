import { Calendar, MessageSquare, BarChart3, Target, Award, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Calendar,
    title: "Agendamento Fácil",
    description: "Agende sessões de mentoria com apenas alguns cliques e gerencie sua disponibilidade.",
  },
  {
    icon: MessageSquare,
    title: "Comunicação Direta",
    description: "Chat integrado para manter contato com seu mentor ou mentorando entre as sessões.",
  },
  {
    icon: BarChart3,
    title: "Acompanhamento de Progresso",
    description: "Visualize métricas e acompanhe o desenvolvimento ao longo do tempo.",
  },
  {
    icon: Target,
    title: "Metas Personalizadas",
    description: "Defina e acompanhe metas específicas adaptadas ao seu percurso profissional.",
  },
  {
    icon: Award,
    title: "Certificações",
    description: "Conquiste certificados ao completar programas de mentoria.",
  },
  {
    icon: Clock,
    title: "Histórico Completo",
    description: "Acesse todas as suas sessões passadas, notas e materiais compartilhados.",
  },
];

export const Features = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Tudo que você precisa para mentoria de excelência
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Ferramentas completas para uma experiência de mentoria eficiente e enriquecedora.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="border-border hover:shadow-soft transition-shadow duration-300">
              <CardHeader>
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
