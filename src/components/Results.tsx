import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ResultsProps {
  generatedName: string;
  improveSection: boolean;
  userFeedback: string;
  setUserFeedback: React.Dispatch<React.SetStateAction<string>>;
}

export function Results({
  generatedName,
  improveSection,
  userFeedback,
  setUserFeedback
}: ResultsProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Result & Feedback</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Generated Response Section */}
        <div className="space-y-2">
          <Label htmlFor="response">Generated name</Label>
          <ScrollArea className="h-[200px] w-full rounded-md border">
            <Textarea
              id="response"
              value={generatedName}
              className="min-h-[200px] resize-none border-0"
              readOnly
            />
          </ScrollArea>
        </div>

        {/* Improvement Feedback Section */}
        {improveSection && (
          <div className="space-y-2">
            <Label
              htmlFor="improve"
              className="flex items-center gap-2"
            >
              Improve
            </Label>
            <Textarea
              id="improve"
              value={userFeedback}
              onChange={(e) => setUserFeedback(e.target.value)}
              placeholder="Enter your feedback to improve the results..."
              className="min-h-[100px]"
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
