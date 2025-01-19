import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

interface IncidentUpdateFormProps {
  onSubmit: (message: string) => void;
  isSubmitting: boolean;
}

export function IncidentUpdateForm({ onSubmit, isSubmitting }: IncidentUpdateFormProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSubmit(message);
    setMessage("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Add an update..."
        className="min-h-[100px]"
      />
      <Button type="submit" disabled={isSubmitting || !message.trim()}>
        Add Update
      </Button>
    </form>
  );
}