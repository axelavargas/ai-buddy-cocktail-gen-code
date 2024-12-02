import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "./ui/button";

interface ResultsProps {
  generatedCocktail: string;
  improveSection: boolean;
  userFeedback: string;
  setUserFeedback: React.Dispatch<React.SetStateAction<string>>;
  onSubmitFeedback: () => void;
}

export function Results({
  generatedCocktail,
  improveSection,
  userFeedback,
  setUserFeedback,
  onSubmitFeedback,
}: ResultsProps) {
  return (
    <div className="space-y-6">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Generated Cocktail</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="cocktail">Recipe</Label>
            <ScrollArea className="h-[300px] w-full rounded-md border">
              <Textarea
                id="cocktail"
                value={generatedCocktail}
                className="min-h-[300px] resize-none border-0 focus-visible:ring-0"
                readOnly
              />
            </ScrollArea>
          </div>
        </CardContent>
      </Card>
      {/* Improvement Feedback Section */}
      {improveSection && (
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              Not happy with the Cocktail? You can improve the results{" "}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="improve" className="flex items-center gap-2">
                Improve
              </Label>
              <Textarea
                id="improve"
                value={userFeedback}
                onChange={(e) => setUserFeedback(e.target.value)}
                placeholder="Enter your feedback to improve the results..."
                className="min-h-[100px]"
              />

              <Button
                size="lg"
                variant="outline"
                className="w-full"
                onClick={onSubmitFeedback}
              >
                Submit Feedback
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
