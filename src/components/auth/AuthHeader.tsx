import React from "react";

interface AuthHeaderProps {
  isResetMode: boolean;
}

export const AuthHeader: React.FC<AuthHeaderProps> = ({ isResetMode }) => {
  return (
    <div className="sm:mx-auto sm:w-full sm:max-w-md">
      <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
        SecureGRC
      </h2>
      <p className="mt-2 text-center text-sm text-gray-600">
        {isResetMode ? "Reset your password" : "Sign in with your organization credentials"}
      </p>
      <div className="mt-1 text-center text-xs space-y-1 text-gray-500">
        <p>Test accounts format: orgname.xxxx.role@example.com</p>
        <p>Password: Password123!</p>
      </div>
    </div>
  );
};