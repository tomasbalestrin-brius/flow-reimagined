import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Ana Silva",
    role: "Desenvolvedora Full Stack",
    content: "A plataforma transformou minha carreira. Encontrei uma mentora incrível que me ajudou a conquistar uma promoção em apenas 6 meses!",
    rating: 5,
  },
  {
    name: "Carlos Oliveira",
    role: "Gerente de Produtos",
    content: "Como mentor, consigo impactar positivamente a carreira de diversos profissionais. A ferramenta facilita muito o acompanhamento do progresso.",
    rating: 5,
  },
  {
    name: "Mariana Costa",
    role: "Designer UX/UI",
    content: "Adorei a facilidade de agendamento e o sistema de metas. Meu mentor me ajudou a estruturar minha transição de carreira com sucesso.",
    rating: 5,
  },
];

export const Testimonials = () => {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
            O que dizem nossos usuários
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Histórias reais de transformação profissional através da mentoria.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border-border shadow-card">
              <CardContent className="pt-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                  ))}
                </div>
                <p className="text-foreground mb-6 italic">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      {testimonial.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
