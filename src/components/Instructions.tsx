import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export function Instructions() {
  return (
    <div className="max-w-3xl mx-auto space-y-6 p-4">
      {/* Header Section */}
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gradient bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
          Mood Based Cocktail Buddy
        </h1>
        <p className="text-lg text-muted-foreground">Gen AI Playground</p>
      </div>

      {/* Main Content Card */}
      <Card>
        <CardHeader>
          <CardTitle>Your Mission</CardTitle>
          <CardDescription>
            Discover the perfect cocktail based on your mood
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg leading-relaxed">
            There is a big alcohol cabinet on your house, friend's house or
            hotel minibar. Considering your mood as an input and the ingredients
            you find in that cabinet, we'll help you create the perfect cocktail
            using OpenAI API and CocktailDB API.
          </p>

          {/* Safety Alert */}
          <Alert variant="default" className="border-amber-500">
            <AlertTriangle className="h-4 w-4 text-amber-500" />
            <AlertDescription className="ml-2">
              <span className="font-semibold">Important Rule:</span> Cocktails
              must exist in the cocktail DB - we don't want any dangerous
              experimental mixing!
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}
