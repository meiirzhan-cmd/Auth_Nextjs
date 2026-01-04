import Link from "next/link";

interface AuthFooterProps {
  text: string;
  linkText: string;
  linkHref: string;
}

const AuthFooter = ({ text, linkText, linkHref }: AuthFooterProps) => {
  return (
    <div className="mt-6 text-center">
      <p className="text-gray-400">
        {text}{" "}
        <Link
          href={linkHref}
          className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
        >
          {linkText}
        </Link>
      </p>
    </div>
  );
};

export default AuthFooter;
