import { useLocation, Navigate } from 'react-router-dom';
import { Check } from 'lucide-react';
import FormHeader from '@/components/FormHeader';
import { Button } from '@/components/ui/button';
import { formatDateLong } from '@/utils/validation';

const ThankYou = () => {
  const location = useLocation();
  const formData = location.state?.formData;

  if (!formData) {
    return <Navigate to="/" replace />;
  }

  const firstName = formData.nome.split(' ')[0];
  const selectedDate = new Date(formData.dataAgendamento + 'T00:00:00');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#020716' }}>
      <FormHeader />
      
      <div className="max-w-xl mx-auto px-4 md:px-8 pb-12">
        <div className="text-center space-y-6">
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(34, 197, 94, 0.2)', border: '2px solid rgb(34, 197, 94)' }}>
              <Check className="w-10 h-10 text-green-500" />
            </div>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white">
            Obrigado, {firstName}!
          </h1>

          <p className="text-xl text-gray-300">
            Sua aplicação foi recebida com sucesso.
          </p>

          <div className="bg-white bg-opacity-5 border border-white border-opacity-20 rounded-lg p-6 space-y-3">
            <p className="text-gray-300">Sua call está agendada para:</p>
            <p className="text-2xl font-bold text-white capitalize">
              {formatDateLong(selectedDate)}
            </p>
            <p className="text-3xl font-bold" style={{ color: '#5D99F8' }}>
              {formData.horarioAgendamento}
            </p>
          </div>

          <p className="text-gray-400">
            Entraremos em contato pelo WhatsApp para confirmar sua participação.
          </p>

          <Button
            onClick={() => window.location.href = 'https://betheleducacao.com.br'}
            className="mt-8 px-8 py-6 text-lg font-semibold rounded-lg"
            style={{ backgroundColor: '#5D99F8', color: 'white' }}
          >
            Voltar para o site
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
