import { X } from "lucide-react";

interface PasswordErrorsProps {
  errors: string[];
}

const PasswordErrors = ({ errors }: PasswordErrorsProps) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg p-3">
      <p className="font-medium mb-1">Password must:</p>
      <ul className="space-y-1">
        {errors.map((error: string) => (
          <li
            key={`password-error-${error}`}
            className="flex items-center gap-2"
          >
            <X className="w-3 h-3" />
            {error}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordErrors;
