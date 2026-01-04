interface AuthHeaderProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

const AuthHeader = ({ icon, title, subtitle }: AuthHeaderProps) => {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-cyan-500 to-purple-500 mb-4">
        {icon}
      </div>
      <h1 className="text-3xl font-bold text-white mb-2">{title}</h1>
      <p className="text-gray-400">{subtitle}</p>
    </div>
  );
};

export default AuthHeader;
