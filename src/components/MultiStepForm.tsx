import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

const formSteps = [
  {
    id: "name",
    question: "Qual é o seu nome completo?",
    placeholder: "Digite seu nome completo",
    validation: z.string().trim().min(3, "Nome deve ter pelo menos 3 caracteres").max(100),
  },
  {
    id: "email",
    question: "Qual é o seu melhor e-mail?",
    placeholder: "seu@email.com",
    validation: z.string().trim().email("E-mail inválido").max(255),
  },
  {
    id: "phone",
    question: "Qual é o seu telefone com DDD?",
    placeholder: "(00) 00000-0000",
    validation: z.string().trim().min(10, "Telefone inválido").max(20),
  },
  {
    id: "interest",
    question: "Qual programa você tem interesse?",
    placeholder: "Digite o programa de interesse",
    validation: z.string().trim().min(3, "Por favor, informe o programa").max(200),
  },
];

export const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [inputValue, setInputValue] = useState("");
  const [error, setError] = useState("");
  const { toast } = useToast();

  const currentQuestion = formSteps[currentStep];

  const handleContinue = () => {
    setError("");
    
    try {
      currentQuestion.validation.parse(inputValue);
      
      setFormData({ ...formData, [currentQuestion.id]: inputValue });
      
      if (currentStep < formSteps.length - 1) {
        setCurrentStep(currentStep + 1);
        setInputValue("");
      } else {
        // Formulário completo
        console.log("Formulário completo:", { ...formData, [currentQuestion.id]: inputValue });
        toast({
          title: "Formulário enviado!",
          description: "Obrigado por preencher o formulário.",
        });
        
        // Reset form
        setCurrentStep(0);
        setFormData({});
        setInputValue("");
      }
    } catch (err) {
      if (err instanceof z.ZodError) {
        setError(err.errors[0].message);
      }
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleContinue();
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="mb-8 text-center">
        <p className="text-muted-foreground mb-6">
          Gostaríamos de saber um pouco mais sobre você para indicar
          <br />o programa que melhor se encaixa ao seu perfil
        </p>
        <h2 className="text-2xl font-semibold text-foreground mb-6">
          {currentQuestion.question}
        </h2>
      </div>

      <div className="space-y-4">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={currentQuestion.placeholder}
          className="h-14 text-lg bg-input border-border text-foreground placeholder:text-muted-foreground"
          autoFocus
        />
        
        {error && (
          <p className="text-sm text-destructive">{error}</p>
        )}

        <div className="flex justify-end">
          <Button
            onClick={handleContinue}
            size="lg"
            className="min-w-[140px]"
          >
            Continuar
          </Button>
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-2">
        {formSteps.map((_, index) => (
          <div
            key={index}
            className={`h-2 w-2 rounded-full transition-all ${
              index === currentStep
                ? "bg-primary w-8"
                : index < currentStep
                ? "bg-primary/50"
                : "bg-border"
            }`}
          />
        ))}
      </div>
    </div>
  );
};
