import { Info, X } from "lucide-react";

interface FormInputProps {
  id: string;
  name: string;
  label: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  icon: React.ReactNode;
  error?: string;
  passwordErrors?: string[];
}

const FormInput = ({
  id,
  name,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  icon,
  error,
  passwordErrors,
}: FormInputProps) => {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-300">
        {label}
      </label>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {icon}
        </div>
        <input
          id={id}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all"
        />
      </div>
      {error && (
        <p className="text-red-400 text-sm flex items-center gap-1">
          <Info className="w-4 h-4 text-red-400" />
          {error}
        </p>
      )}
      {passwordErrors && passwordErrors.length > 0 && (
        <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <p className="font-medium mb-1">Password must:</p>
          <ul className="space-y-1">
            {passwordErrors.map((err: string) => (
              <li
                key={`password-error-${err}`}
                className="flex items-center gap-2"
              >
                <X className="w-3 h-3" />
                {err}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FormInput;
