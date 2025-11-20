const FormHeader = () => {
  return (
    <div className="w-full pt-8 px-5 md:px-8 mb-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <img 
            src="/Logo_Bethel_branco.png" 
            alt="Bethel Educação" 
            className="h-10 md:h-14 object-contain"
          />
          <span className="text-white font-poppins font-semibold text-sm md:text-lg">Cleiton Querobin</span>
        </div>
        <div 
          className="w-full h-px"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(93, 153, 248, 0.5) 20%, rgba(93, 153, 248, 0.8) 50%, rgba(93, 153, 248, 0.5) 80%, transparent 100%)'
          }}
        />
      </div>
    </div>
  );
};

export default FormHeader;
