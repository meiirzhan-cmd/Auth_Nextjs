import LoadingSvg from "@/components/svg/LoadingSvg";

interface SubmitButtonProps {
  pending: boolean;
  loadingText: string;
  text: string;
}

const SubmitButton = ({ pending, loadingText, text }: SubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full py-3 px-4 bg-linear-to-r from-cyan-500 to-purple-500 text-white font-semibold rounded-xl hover:from-cyan-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98]"
    >
      {pending ? (
        <span className="flex items-center justify-center gap-2">
          <LoadingSvg />
          {loadingText}
        </span>
      ) : (
        text
      )}
    </button>
  );
};

export default SubmitButton;
