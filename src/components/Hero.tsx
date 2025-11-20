import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Calendar, TrendingUp } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6 animate-fade-in">
            Conectando Mentores e
            <span className="bg-gradient-primary bg-clip-text text-transparent"> Mentorandos</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up">
            Transforme o potencial em realidade. Agende sessões, acompanhe progresso e alcance seus objetivos profissionais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button size="lg" className="shadow-soft">
              Começar Agora
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline">
              Saiba Mais
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-card p-6 rounded-lg shadow-card border border-border">
              <div className="flex items-center justify-center mb-2">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">1,200+</div>
              <div className="text-sm text-muted-foreground">Mentores Ativos</div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-card border border-border">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="h-8 w-8 text-primary" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">5,000+</div>
              <div className="text-sm text-muted-foreground">Sessões Realizadas</div>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-card border border-border">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-success" />
              </div>
              <div className="text-3xl font-bold text-foreground mb-1">95%</div>
              <div className="text-sm text-muted-foreground">Taxa de Sucesso</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
