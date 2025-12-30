"use client";

import { useActionState, useState } from "react";
import { signup } from "./action";

const SignUp = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [state, action, pending] = useActionState(signup, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-gray-900 to-gray-800 overflow-hidden">
      <form
        action={action}
        className="flex flex-col gap-4 border-2 border-gray-700 p-10 rounded-xl shadow-2xl bg-gray-800"
      >
        <div className="mx-4">
          <h1 className="text-2xl font-bold text-center mb-5 text-gray-100">
            Sign Up
          </h1>
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="font-semibold text-gray-200">
            Name
          </label>
          <input
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border-2 p-2 border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:border-cyan-400 focus:outline-none placeholder-gray-400"
          />
          {state?.errors?.name && (
            <p className="text-red-400 text-sm">{state.errors.name[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="email" className="font-semibold text-gray-200">
            Email
          </label>
          <input
            id="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
            className="border-2 p-2 border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:border-cyan-400 focus:outline-none placeholder-gray-400"
          />
          {state?.errors?.email && (
            <p className="text-red-400 text-sm">{state.errors.email[0]}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="password" className="font-semibold text-gray-200">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            className="border-2 p-2 border-gray-600 bg-gray-700 text-gray-100 rounded-md focus:border-cyan-400 focus:outline-none placeholder-gray-400"
          />
          {state?.errors?.password && state.errors.password.length > 0 && (
            <div className="text-red-400 text-sm">
              <p className="font-semibold">Password must:</p>
              <ul className="list-disc list-inside">
                {state.errors.password.map((error: string) => (
                  <li key={`password-error-${error}`}>{error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {state &&
          "formErrors" in state &&
          state.formErrors &&
          state.formErrors.length > 0 && (
            <div className="text-red-400 text-sm">
              {state.formErrors.map((error: string) => (
                <p key={`form-error-${error}`}>{error}</p>
              ))}
            </div>
          )}

        {state && "success" in state && state.success && (
          <div className="text-green-400 text-sm">
            Successfully signed up! Welcome {state.user?.name}!
          </div>
        )}

        <button
          type="submit"
          disabled={pending}
          className="bg-cyan-600 text-white p-2 rounded-md hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {pending ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export default SignUp;
