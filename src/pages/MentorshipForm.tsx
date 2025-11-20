import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FormHeader from '@/components/FormHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { FormData } from '@/types/form';
import { useFormPersistence } from '@/hooks/useFormPersistence';
import {
  validateNome,
  validateTelefone,
  validateEmail,
  validateInstagram,
  validateRequired,
  formatTelefone,
  getNextBusinessDays,
  formatDateLong,
  formatDateISO
} from '@/utils/validation';

const availableHours = ['08:45', '09:45', '10:45', '11:45', '13:45', '14:45', '15:45', '16:45', '17:45'];

const cargoOptions = ['Dono', 'Gerente', 'Autônomo', 'Colaborador', 'Vendedor'];
const faturamentoOptions = [
  'Ainda não fatura',
  '5-15k',
  '15-50k',
  '50-100k',
  '100-200k',
  '200-500k',
  'Acima de 500k'
];
const dificuldadeOptions = [
  'Não consigo atrair leads qualificados de forma consistente.',
  'Tenho dificuldade em converter os leads que chegam em vendas.',
  'Estou preso demais na operação e não consigo focar no crescimento.',
  'Meu negócio até cresce, mas sem estrutura, equipe ou processos sólidos.',
  'Não tenho clareza dos números e isso trava minhas decisões.',
  'Outro'
];
const investimentoOptions = [
  'Quero avaliar opções de parcelamento',
  'Ainda não estou decidido, quero mais Informações',
  'Pagamento à vista'
];

const MentorshipForm = () => {
  const navigate = useNavigate();
  const { saveProgress, completeForm, checkAvailableSlots } = useFormPersistence();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    nome: '',
    telefone: '',
    email: '',
    instagram: '',
    nicho: '',
    cargo: '',
    faturamento: '',
    dificuldade: '',
    outraDificuldade: '',
    investimento: '',
    dataAgendamento: '',
    horarioAgendamento: ''
  });
  
  const [availableDates, setAvailableDates] = useState<Date[]>([]);
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);

  useEffect(() => {
    setAvailableDates(getNextBusinessDays(2));
  }, []);

  useEffect(() => {
    if (currentStep === 11 && formData.dataAgendamento) {
      loadAvailableSlots(formData.dataAgendamento);
    }
  }, [currentStep, formData.dataAgendamento]);

  const loadAvailableSlots = async (date: string) => {
    const bookedSlots = await checkAvailableSlots(date);
    const now = new Date();
    const selectedDate = new Date(date);
    
    let filtered = availableHours.filter(hour => !bookedSlots.includes(hour));
    
    // If selected date is today, remove past hours
    if (selectedDate.toDateString() === now.toDateString()) {
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      
      filtered = filtered.filter(hour => {
        const [h, m] = hour.split(':').map(Number);
        return h > currentHour || (h === currentHour && m > currentMinute);
      });
    }
    
    setAvailableSlots(filtered);
  };

  const validateCurrentStep = (): boolean => {
    setError(null);
    
    switch (currentStep) {
      case 1: {
        const err = validateNome(formData.nome);
        if (err) {
          setError(err);
          return false;
        }
        break;
      }
      case 2: {
        const err = validateTelefone(formData.telefone);
        if (err) {
          setError(err);
          return false;
        }
        break;
      }
      case 3: {
        const err = validateEmail(formData.email);
        if (err) {
          setError(err);
          return false;
        }
        break;
      }
      case 4: {
        const err = validateInstagram(formData.instagram);
        if (err) {
          setError(err);
          return false;
        }
        break;
      }
      case 5: {
        const err = validateRequired(formData.nicho);
        if (err) {
          setError(err);
          return false;
        }
        break;
      }
      case 6: {
        if (!formData.cargo) {
          setError('Por favor, selecione uma opção');
          return false;
        }
        break;
      }
      case 7: {
        if (!formData.faturamento) {
          setError('Por favor, selecione uma opção');
          return false;
        }
        break;
      }
      case 8: {
        if (!formData.dificuldade) {
          setError('Por favor, selecione uma opção');
          return false;
        }
        if (formData.dificuldade === 'Outro' && !formData.outraDificuldade?.trim()) {
          setError('Por favor, descreva sua dificuldade');
          return false;
        }
        break;
      }
      case 9: {
        if (!formData.investimento) {
          setError('Por favor, selecione uma opção');
          return false;
        }
        break;
      }
      case 10: {
        if (!formData.dataAgendamento) {
          setError('Por favor, selecione uma data');
          return false;
        }
        break;
      }
      case 11: {
        if (!formData.horarioAgendamento) {
          setError('Por favor, selecione um horário');
          return false;
        }
        break;
      }
    }
    
    return true;
  };

  const handleContinue = async () => {
    if (!validateCurrentStep()) return;
    
    if (currentStep < 11) {
      await saveProgress(formData, currentStep + 1);
      setCurrentStep(currentStep + 1);
      setError(null);
    } else {
      const success = await completeForm(formData);
      if (success) {
        navigate('/obrigado', { state: { formData } });
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && currentStep <= 5) {
      e.preventDefault();
      handleContinue();
    }
  };

  const updateFormData = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <p className="text-lg text-gray-300">
              Gostaríamos de saber um pouco mais sobre você para indicar o programa que melhor se encaixa ao seu perfil
            </p>
            <div className="space-y-4">
              <h2 className="text-2xl font-bold text-white">Qual é o seu nome completo?</h2>
              <Input
                value={formData.nome}
                onChange={(e) => updateFormData('nome', e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Digite seu nome completo"
                className="w-full px-4 py-6 text-lg rounded-lg focus:ring-2 focus:ring-[#5D99F8] focus:outline-none"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  color: 'white',
                  border: '2px solid #5D99F8'
                }}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Qual é o seu telefone?</h2>
            <p className="text-gray-300">Inclua o DDD</p>
            <div className="flex items-center gap-2">
              <span className="text-white text-lg font-semibold px-3 py-6 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                +55
              </span>
              <Input
                value={formatTelefone(formData.telefone)}
                onChange={(e) => updateFormData('telefone', e.target.value.replace(/\D/g, ''))}
                onKeyPress={handleKeyPress}
                placeholder="(00) 00000-0000"
                maxLength={15}
                className="flex-1 px-4 py-6 text-lg rounded-lg focus:ring-2 focus:ring-[#5D99F8] focus:outline-none"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  color: 'white',
                  border: '2px solid #5D99F8'
                }}
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Qual é o seu e-mail?</h2>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="seu@email.com"
              className="w-full px-4 py-6 text-lg rounded-lg focus:ring-2 focus:ring-[#5D99F8] focus:outline-none"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                color: 'white',
                border: '2px solid #5D99F8'
              }}
            />
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Qual é o seu Instagram?</h2>
            <div className="flex items-center gap-2">
              <span className="text-white text-lg font-semibold px-3 py-6 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
                @
              </span>
              <Input
                value={formData.instagram}
                onChange={(e) => updateFormData('instagram', e.target.value.replace('@', ''))}
                onKeyPress={handleKeyPress}
                placeholder="seuinstagram"
                className="flex-1 px-4 py-6 text-lg rounded-lg focus:ring-2 focus:ring-[#5D99F8] focus:outline-none"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  color: 'white',
                  border: '2px solid #5D99F8'
                }}
              />
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Qual é o seu nicho de atuação?</h2>
            <Input
              value={formData.nicho}
              onChange={(e) => updateFormData('nicho', e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ex: Estética, Saúde, Educação..."
              className="w-full px-4 py-6 text-lg rounded-lg focus:ring-2 focus:ring-[#5D99F8] focus:outline-none"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                color: 'white',
                border: '2px solid #5D99F8'
              }}
            />
          </div>
        );

      case 6:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Qual é o seu cargo na empresa?</h2>
            <RadioGroup value={formData.cargo} onValueChange={(value) => updateFormData('cargo', value)}>
              <div className="space-y-3">
                {cargoOptions.map((option) => (
                  <Label
                    key={option}
                    htmlFor={`cargo-${option}`}
                    className="flex items-center p-4 rounded-lg cursor-pointer transition"
                    style={{
                      backgroundColor: formData.cargo === option ? 'rgba(93, 153, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${formData.cargo === option ? '#5D99F8' : 'rgba(255, 255, 255, 0.1)'}`
                    }}
                  >
                    <RadioGroupItem value={option} id={`cargo-${option}`} className="mr-3" />
                    <span className="text-white text-lg">{option}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case 7:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Qual é o seu faturamento mensal?</h2>
            <RadioGroup value={formData.faturamento} onValueChange={(value) => updateFormData('faturamento', value)}>
              <div className="space-y-3">
                {faturamentoOptions.map((option) => (
                  <Label
                    key={option}
                    htmlFor={`faturamento-${option}`}
                    className="flex items-center p-4 rounded-lg cursor-pointer transition"
                    style={{
                      backgroundColor: formData.faturamento === option ? 'rgba(93, 153, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${formData.faturamento === option ? '#5D99F8' : 'rgba(255, 255, 255, 0.1)'}`
                    }}
                  >
                    <RadioGroupItem value={option} id={`faturamento-${option}`} className="mr-3" />
                    <span className="text-white text-lg">{option}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case 8:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Qual é a sua principal dificuldade hoje?</h2>
            <RadioGroup value={formData.dificuldade} onValueChange={(value) => updateFormData('dificuldade', value)}>
              <div className="space-y-3">
                {dificuldadeOptions.map((option) => (
                  <Label
                    key={option}
                    htmlFor={`dificuldade-${option}`}
                    className="flex items-center p-4 rounded-lg cursor-pointer transition"
                    style={{
                      backgroundColor: formData.dificuldade === option ? 'rgba(93, 153, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${formData.dificuldade === option ? '#5D99F8' : 'rgba(255, 255, 255, 0.1)'}`
                    }}
                  >
                    <RadioGroupItem value={option} id={`dificuldade-${option}`} className="mr-3" />
                    <span className="text-white text-lg">{option}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
            {formData.dificuldade === 'Outro' && (
              <Textarea
                value={formData.outraDificuldade}
                onChange={(e) => updateFormData('outraDificuldade', e.target.value)}
                placeholder="Descreva sua principal dificuldade..."
                className="w-full px-4 py-4 text-lg rounded-lg focus:ring-2 focus:outline-none border-0 min-h-[120px]"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  color: 'white'
                }}
              />
            )}
          </div>
        );

      case 9:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">
              O investimento para participar dos nossos programas é de R$ 9.997 a R$ 100k
            </h2>
            <p className="text-gray-300">Gostaria de seguir com o processo seletivo?</p>
            <RadioGroup value={formData.investimento} onValueChange={(value) => updateFormData('investimento', value)}>
              <div className="space-y-3">
                {investimentoOptions.map((option) => (
                  <Label
                    key={option}
                    htmlFor={`investimento-${option}`}
                    className="flex items-center p-4 rounded-lg cursor-pointer transition"
                    style={{
                      backgroundColor: formData.investimento === option ? 'rgba(93, 153, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${formData.investimento === option ? '#5D99F8' : 'rgba(255, 255, 255, 0.1)'}`
                    }}
                  >
                    <RadioGroupItem value={option} id={`investimento-${option}`} className="mr-3" />
                    <span className="text-white text-lg">{option}</span>
                  </Label>
                ))}
              </div>
            </RadioGroup>
          </div>
        );

      case 10:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Escolha a data da sua call</h2>
            <p className="text-gray-300">Selecione o melhor dia para conversar com um especialista</p>
            <RadioGroup value={formData.dataAgendamento} onValueChange={(value) => updateFormData('dataAgendamento', value)}>
              <div className="space-y-3">
                {availableDates.map((date) => {
                  const dateStr = formatDateISO(date);
                  return (
                    <Label
                      key={dateStr}
                      htmlFor={`date-${dateStr}`}
                      className="flex items-center p-4 rounded-lg cursor-pointer transition"
                      style={{
                        backgroundColor: formData.dataAgendamento === dateStr ? 'rgba(93, 153, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                        border: `1px solid ${formData.dataAgendamento === dateStr ? '#5D99F8' : 'rgba(255, 255, 255, 0.1)'}`
                      }}
                    >
                      <RadioGroupItem value={dateStr} id={`date-${dateStr}`} className="mr-3" />
                      <span className="text-white text-lg capitalize">{formatDateLong(date)}</span>
                    </Label>
                  );
                })}
              </div>
            </RadioGroup>
          </div>
        );

      case 11:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-white">Escolha o horário</h2>
            <p className="text-gray-300">
              Horários disponíveis para {formData.dataAgendamento && formatDateLong(new Date(formData.dataAgendamento + 'T00:00:00'))}
            </p>
            {availableSlots.length === 0 ? (
              <p className="text-yellow-400 text-center py-8">Nenhum horário disponível para esta data.</p>
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {availableSlots.map((hour) => (
                  <Label
                    key={hour}
                    htmlFor={`hour-${hour}`}
                    className="flex items-center justify-center p-4 rounded-lg cursor-pointer transition text-center"
                    style={{
                      backgroundColor: formData.horarioAgendamento === hour ? '#5D99F8' : 'rgba(255, 255, 255, 0.05)',
                      border: `1px solid ${formData.horarioAgendamento === hour ? '#5D99F8' : 'rgba(255, 255, 255, 0.1)'}`,
                      color: 'white'
                    }}
                  >
                    <input
                      type="radio"
                      id={`hour-${hour}`}
                      name="horario"
                      value={hour}
                      checked={formData.horarioAgendamento === hour}
                      onChange={(e) => updateFormData('horarioAgendamento', e.target.value)}
                      className="sr-only"
                    />
                    <span className="text-lg font-semibold">{hour}</span>
                  </Label>
                ))}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#020716' }}>
      <FormHeader />
      
      <div className="max-w-xl mx-auto px-4 md:px-8 pb-12">
        <div className="mb-8">
          {renderStep()}
          
          {error && (
            <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'rgba(239, 68, 68, 0.2)', border: '1px solid rgb(239, 68, 68)' }}>
              <p className="text-red-400 text-sm text-center">{error}</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between gap-4">
          {currentStep > 1 && (
            <Button
              onClick={handleBack}
              variant="ghost"
              className="text-gray-400 hover:text-white hover:bg-transparent"
            >
              Voltar
            </Button>
          )}
          
          <Button
            onClick={handleContinue}
            className="ml-auto px-8 py-6 text-lg font-semibold rounded-lg"
            style={{ backgroundColor: '#5D99F8', color: 'white' }}
          >
            {currentStep === 11 ? 'Confirmar Agendamento' : 'Continuar'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MentorshipForm;
