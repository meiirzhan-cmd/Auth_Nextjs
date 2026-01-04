"use client";

import { useActionState, useState } from "react";
import signup from "./action";
import { User } from "lucide-react";
import AddSvg from "@/components/svg/AddSvg";
import AtSignSvg from "@/components/svg/AtSignSvg";
import LockSvg from "@/components/svg/LockSvg";
import FormInput from "@/components/ui/FormInput";
import AuthLayout from "@/components/auth/AuthLayout";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthFooter from "@/components/auth/AuthFooter";
import FormErrors from "@/components/status/FormErrors";
import SuccessMessage from "@/components/status/SuccessMessage";
import SubmitButton from "@/components/ui/SubmitButton";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <AuthLayout>
      <AuthHeader
        icon={<AddSvg />}
        title="Create Account"
        subtitle="Join us and start your journey"
      />

      <form action={action} className="space-y-5">
        <FormInput
          id="name"
          name="name"
          label="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Meiirzhan Baitangatov"
          icon={<User className="w-5 h-5 text-gray-500" />}
          error={state?.errors?.name?.[0]}
        />

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

        {state && "success" in state && state.success && (
          <SuccessMessage
            message={`Successfully signed up! Welcome ${state.user?.name}!`}
          />
        )}

        <SubmitButton
          pending={pending}
          loadingText="Creating account..."
          text="Create Account"
        />
      </form>

      <AuthFooter
        text="Already have an account?"
        linkText="Sign in"
        linkHref="/login"
      />
    </AuthLayout>
  );
};

export default SignUp;
