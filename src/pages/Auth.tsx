import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { toast } from "sonner";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { getErrorMessage } from "@/utils/auth";

const Auth = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error("Session check error:", error);
        toast.error("An error occurred while checking your session");
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth state change:", event);
      if (event === "SIGNED_IN" && session) {
        navigate("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    setIsSubmitting(true);

    try {
      // First sign out to clear any existing session
      await supabase.auth.signOut();
      
      if (isResetMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        toast.success("Password reset instructions have been sent to your email");
        setIsResetMode(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) {
          if (error instanceof AuthApiError && error.message.includes("Invalid login credentials")) {
            toast.error("Either username or password is incorrect. Please try again.");
          } else {
            throw error;
          }
        }
      }
    } catch (error) {
      console.error("Auth error:", error);
      if (error instanceof AuthApiError) {
        toast.error(getErrorMessage(error));
      } else {
        toast.error("An unexpected error occurred. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8 bg-gray-50">
      <AuthHeader isResetMode={isResetMode} />
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
  );
};

export default Auth;