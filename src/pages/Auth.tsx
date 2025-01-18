import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { AuthError, AuthApiError } from "@supabase/supabase-js";
import { getErrorMessage } from "@/utils/auth";
import { Toaster } from "@/components/ui/toaster";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, Lock } from "lucide-react";

const Auth = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
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
    setIsSubmitting(true);

    try {
      await supabase.auth.signOut();
      
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password: password.trim(),
        });
        if (error) throw error;
        toast({
          title: "Success",
          description: "Please check your email to verify your account",
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-[1200px] w-full flex gap-8 items-center">
        <div className="flex-1 bg-white rounded-3xl shadow-xl p-8">
          <div className="mb-8">
            <img 
              src="/lovable-uploads/6dd22c94-2464-4e2c-b7fc-694d738821ae.png" 
              alt="Logo" 
              className="h-12 mx-auto mb-6"
            />
            <h2 className="text-2xl font-semibold text-center text-gray-900">
              {isSignUp ? "Create your account" : "Login into your account"}
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 max-w-sm mx-auto">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email address
              </label>
              <div className="relative">
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 bg-gray-50"
                  placeholder="Enter your email"
                  disabled={isSubmitting}
                />
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 bg-gray-50"
                  placeholder="Enter your password"
                  disabled={isSubmitting}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              </div>
            </div>

            {!isSignUp && (
              <div className="text-right">
                <Button
                  type="button"
                  variant="link"
                  className="text-sm text-[#ff6b00]"
                  onClick={() => setIsSignUp(true)}
                >
                  Forgot password?
                </Button>
              </div>
            )}

            <Button
              type="submit"
              className="w-full bg-[#ff6b00] hover:bg-[#ff6b00]/90 text-white"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                </div>
              ) : (
                isSignUp ? "Sign up now" : "Login now"
              )}
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">OR</span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full border-[#ff6b00] text-[#ff6b00] hover:bg-[#ff6b00] hover:text-white"
              onClick={() => setIsSignUp(!isSignUp)}
            >
              {isSignUp ? "Login now" : "Sign up now"}
            </Button>
          </form>
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

export default Auth;