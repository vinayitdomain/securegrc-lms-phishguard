import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Json } from "@/integrations/supabase/types";

interface QuizStepperProps {
  questions: {
    id: string;
    question: string;
    options: Json;
    question_type: string;
  }[];
  onSubmit: (answers: Record<string, string>) => void;
}

export function QuizStepper({ questions, onSubmit }: QuizStepperProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleNext = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(answers);
  };

  // Add check for empty questions array
  if (!questions || questions.length === 0) {
    return (
      <Card>
        <CardContent className="p-6">
          <p>No questions available.</p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;

  // Parse options from Json type to string array and ensure they are strings
  const questionOptions = Array.isArray(currentQuestion.options) 
    ? currentQuestion.options.map(option => String(option))
    : [];

  return (
    <div className="max-w-2xl mx-auto">
      <Progress value={progress} className="mb-6" />
      
      <Card>
        <CardHeader>
          <CardTitle>Question {currentStep + 1} of {questions.length}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <p className="text-lg">{currentQuestion.question}</p>
            
            <div className="space-y-3">
              {questionOptions.map((option) => (
                <Button
                  key={String(option)}
                  variant={answers[currentQuestion.id] === option ? "default" : "outline"}
                  className="w-full justify-start text-left"
                  onClick={() => handleAnswer(currentQuestion.id, option)}
                >
                  {String(option)}
                </Button>
              ))}
            </div>

            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 0}
              >
                Previous
              </Button>
              
              {currentStep === questions.length - 1 ? (
                <Button onClick={handleSubmit}>Submit Quiz</Button>
              ) : (
                <Button onClick={handleNext}>Next Question</Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}