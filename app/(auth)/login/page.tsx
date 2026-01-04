"use client";

import { useActionState, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import signin from "./action";
import { LogIn } from "lucide-react";
import AtSignSvg from "@/components/svg/AtSignSvg";
import LockSvg from "@/components/svg/LockSvg";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import FormInput from "@/components/ui/FormInput";
import FormErrors from "@/components/status/FormErrors";
import SuccessMessage from "@/components/status/SuccessMessage";
import SubmitButton from "@/components/ui/SubmitButton";
import AuthFooter from "@/components/auth/AuthFooter";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [countdown, setCountdown] = useState(5);
  const [state, action, pending] = useActionState(signin, undefined);
  const router = useRouter();

  const isSuccess = state && "success" in state && state.success;

  useEffect(() => {
    if (!isSuccess) return;

    if (countdown <= 0) {
      router.push("/home");
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isSuccess, countdown, router]);

  return (
    <AuthLayout>
      <AuthHeader
        icon={<LogIn className="w-8 h-8 text-white" />}
        title="Welcome Back"
        subtitle="Sign in to continue to your account"
      />

      <form action={action} className="space-y-5">
        <FormInput
          id="email"
          name="email"
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="yourEmail@example.com"
          icon={<AtSignSvg />}
          error={state?.errors?.email?.[0]}
        />

        <FormInput
          id="password"
          name="password"
          label="Password"
          type="password"
          placeholder="••••••••"
          icon={<LockSvg />}
          passwordErrors={state?.errors?.password}
        />

        {state && "formErrors" in state && state.formErrors && (
          <FormErrors errors={state.formErrors} />
        )}

        {isSuccess && (
          <SuccessMessage
            message={`Successfully logged in! Welcome back, ${state.user?.name}! Redirecting in ${countdown}s...`}
          />
        )}

        <SubmitButton
          pending={pending}
          loadingText="Signing in..."
          text="Sign In"
        />
      </form>

      <AuthFooter
        text="Don't have an account?"
        linkText="Create one"
        linkHref="/signup"
      />
    </AuthLayout>
  );
};

export default SignIn;
