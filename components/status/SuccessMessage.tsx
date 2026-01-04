import { CircleCheck } from "lucide-react";

interface SuccessMessageProps {
  message: string;
}

const SuccessMessage = ({ message }: SuccessMessageProps) => {
  return (
    <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
      <p className="text-green-400 text-sm flex items-center gap-2">
        <CircleCheck className="w-5 h-5 text-green-400" />
        {message}
      </p>
    </div>
  );
};

export default SuccessMessage;
