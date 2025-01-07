import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export function Navbar() {
  const navigate = useNavigate();

  return (
    <nav className="border-b bg-white">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <span className="text-2xl font-bold text-primary">SecureGRC</span>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/campaigns")}
          >
            Phishing Campaigns
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/learning")}
          >
            Learning
          </Button>
          <Button
            variant="ghost"
            onClick={() => navigate("/compliance")}
          >
            Compliance
          </Button>
        </div>
      </div>
    </nav>
  );
}