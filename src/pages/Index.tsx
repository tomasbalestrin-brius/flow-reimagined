import { FormHeader } from "@/components/FormHeader";
import { MultiStepForm } from "@/components/MultiStepForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background dark flex flex-col">
      <FormHeader mentorName="Cleiton Querobin" />
      
      <main className="flex-1 flex items-center justify-center pt-20 pb-12">
        <MultiStepForm />
      </main>
    </div>
  );
};

export default Index;
