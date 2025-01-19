import React from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { getErrorMessage } from "@/utils/auth";
import { AuthForm } from "./AuthForm";
import { Toaster } from "@/components/ui/toaster";

export const AuthContainer = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await supabase.auth.signOut();
      
      if (isResetMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email.trim());
        if (error) throw error;
        toast({
          title: "Success",
          description: "Please check your email for password reset instructions",
        });
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) throw error;
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (error instanceof AuthApiError) {
        toast({
          title: "Error",
          description: getErrorMessage(error),
          variant: "destructive",
        });
      } else {
        toast({
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] w-full flex gap-8 items-center">
        <div className="flex-1 bg-white rounded-3xl shadow-xl p-8">
          <AuthForm
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isSubmitting={isSubmitting}
            isResetMode={isResetMode}
            handleSubmit={handleSubmit}
            setIsResetMode={setIsResetMode}
          />
        </div>

        <div className="flex-1 hidden lg:block">
          <img 
            src="/lovable-uploads/6dd22c94-2464-4e2c-b7fc-694d738821ae.png" 
            alt="Login illustration" 
            className="w-full"
          />
        </div>
      </div>
      <Toaster />
    </div>
  );
};