import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
}
//general layout for both login and sign up
const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <div>{children}</div>;
};

export default AuthLayout;
