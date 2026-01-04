import FormErrorSvg from "@/components/svg/FormErrorSvg";

interface FormErrorsProps {
  errors: string[];
}

const FormErrors = ({ errors }: FormErrorsProps) => {
  if (!errors || errors.length === 0) return null;

  return (
    <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
      {errors.map((error: string) => (
        <p
          key={`form-error-${error}`}
          className="text-red-400 text-sm flex items-center gap-2"
        >
          <FormErrorSvg />
          {error}
        </p>
      ))}
    </div>
  );
};

export default FormErrors;
