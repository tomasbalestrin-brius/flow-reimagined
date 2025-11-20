import { UserPlus, Search, CalendarCheck, Rocket } from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    title: "1. Crie sua conta",
    description: "Cadastre-se gratuitamente como mentor ou mentorando em menos de 2 minutos.",
  },
  {
    icon: Search,
    title: "2. Encontre seu match",
    description: "Use nossos filtros avançados para encontrar o mentor ou mentorando ideal.",
  },
  {
    icon: CalendarCheck,
    title: "3. Agende sessões",
    description: "Escolha horários que funcionem para ambos e comece sua jornada.",
  },
  {
    icon: Rocket,
    title: "4. Cresça junto",
    description: "Acompanhe o progresso, alcance metas e transforme carreiras.",
  },
];

export const HowItWorks = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            Como funciona
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Começar é simples. Siga estes passos e transforme sua carreira.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-primary flex items-center justify-center mb-4 shadow-soft">
                  <step.icon className="h-8 w-8 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-8 left-full w-full h-0.5 bg-border -z-10" />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
