interface FormHeaderProps {
  logoUrl?: string;
  mentorName: string;
}

export const FormHeader = ({ logoUrl, mentorName }: FormHeaderProps) => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        {logoUrl ? (
          <img src={logoUrl} alt="Logo" className="h-10" />
        ) : (
          <div className="text-foreground font-bold text-xl">Bethel Educação</div>
        )}
      </div>
      <div className="text-foreground font-medium">{mentorName}</div>
    </header>
  );
};
