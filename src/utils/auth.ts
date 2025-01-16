import { AuthError, AuthApiError } from "@supabase/supabase-js";

export const getErrorMessage = (error: AuthError | Error) => {
  console.error("Authentication error:", error);
  
  if (error instanceof AuthApiError) {
    if (error.message.includes("Invalid login credentials")) {
      return "Invalid email or password. Please check your credentials and try again.";
    }
    
    if (error.message.includes("refresh_token_not_found")) {
      return "Your session has expired. Please sign in again.";
    }
    
    switch (error.status) {
      case 400:
        if (error.message.includes("refresh_token")) {
          return "Your session has expired. Please sign in again.";
        }
        return "Invalid email or password. Please check your credentials and try again.";
      case 422:
        return "Invalid email format. Please enter a valid email address.";
      case 429:
        return "Too many attempts. Please try again later.";
      default:
        return error.message;
    }
  }
  return "An unexpected error occurred. Please try again.";
};