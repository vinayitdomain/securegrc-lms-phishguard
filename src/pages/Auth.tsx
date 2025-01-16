import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AuthForm } from "@/components/auth/AuthForm";
import { AuthHeader } from "@/components/auth/AuthHeader";
import { useToast } from "@/hooks/use-toast";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { getErrorMessage } from "@/utils/auth";
import { Toaster } from "@/components/ui/toaster";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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
        toast({
          title: "Error",
          description: "An error occurred while checking your session",
          variant: "destructive",
        });
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
  }, [navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please enter both email and password",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // First sign out to clear any existing session
      await supabase.auth.signOut();
      
      if (isResetMode) {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        toast({
          title: "Success",
          description: "Password reset instructions have been sent to your email",
        });
        setIsResetMode(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: password.trim(),
        });
        
        if (error instanceof AuthApiError) {
          if (error.message.includes("Invalid login credentials")) {
            toast({
              title: "Error",
              description: "Either username or password is incorrect. Please try again.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Error",
              description: getErrorMessage(error),
              variant: "destructive",
            });
          }
          return;
        }
        
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
      <Toaster />
    </div>
  );
};

export default Auth;