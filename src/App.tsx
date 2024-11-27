import { useState, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Instructions } from './components/Instructions';
import { AISettings } from './components/AISettings';
import { UserInput } from './components/UserInput';
import { getCocktailListBasedOnIngredients, getRecommendedCocktail } from './Api';
import { Configuration } from './types';


function App() {
  const DEFAULT_API_KEY = "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";
  const DEFAULT_TEMPERATURE = 0.5;
  const DEFAULT_MAX_TOKENS = 256;
  const DEFAULT_MODEL = "gpt-4o-mini";

  const [configuration, setConfiguration] = useState<Configuration>({
    apiKey: DEFAULT_API_KEY,
    apiKeyInput: "",
    temperature: DEFAULT_TEMPERATURE,
    maxTokens: DEFAULT_MAX_TOKENS,
    model: DEFAULT_MODEL,
  });

  const [mood, setMood] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);
  const [generatedCocktail, setGeneratedCocktail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);

  const generateCocktail = useCallback(async () => {
    // simple validation inputs
    if (!mood || selectedIngredients.length === 0 || !configuration.apiKey) {
      console.error("Please fill in all the required fields");
      return;
    }
    setLoading(true);
    try {

      // TODO: Call CocktailDB to get the list of cocktails based on the ingredients
      const cocktails = await getCocktailListBasedOnIngredients(selectedIngredients);
      console.log("Cocktails based on ingredients: ", cocktails);

      // TODO: Call OpenAI to generate the cocktail recipe based on the mood and ingredients

      const recommendedCocktail = await getRecommendedCocktail(mood, cocktails, configuration);


      console.log("Recommended cocktail: ", recommendedCocktail);

      // TODO: Set the generated cocktail recipe to the state
      setGeneratedCocktail(() => {
        return `🍸 Howdy! \n
        ${recommendedCocktail.reason} \n
        Here is the recipe for your perfect cocktail: \n
        ${recommendedCocktail.recipe}`;
      });


      // // Simulate API call for demo
      // await new Promise(resolve => setTimeout(resolve, 2000));
      //
      // // Mock response - 
      // const MockResponse = `🍸 Mood Lifter Margarita 
      //   Perfect for your current mood, here's a refreshing twist on the classic Margarita.
      //
      //   Ingredients:
      //   - 2 oz Tequila
      //   - 1 oz Cointreau
      //   - 1 oz Fresh lime juice
      //   - Salt for rimming
      //   - Ice
      //   - Lime wheel for garnish
      //
      //   Instructions:
      //   1. Rim a chilled glass with salt
      //   2. Fill shaker with ice
      //   3. Add tequila, Cointreau, and fresh lime juice
      //   4. Shake well until thoroughly chilled
      //   5. Strain into the prepared glass
      //   6. Garnish with a lime wheel
      //
      //   Enjoy your perfectly crafted cocktail! 🍹`
      //
      // setGeneratedCocktail(MockResponse);
      // console.log("Your perfect cocktail has been crafted!");

    } catch (error) {
      console.error("Failed to generate cocktail recommendation", error);
    } finally {
      setLoading(false);
    }
  }, [configuration, mood, selectedIngredients]);

  const resetForm = useCallback(() => {
    setMood("");
    setSelectedIngredients([]);
    setGeneratedCocktail("");
    console.log("All inputs have been reset");
  }, []);

  const toggleSettings = () => {
    // Check if the browser supports view transitions
    if (document.startViewTransition) {
      document.startViewTransition(() => {
        setShowAISettings(!showAISettings);
      });
    } else {
      // Fallback for browsers that don't support view transitions
      setShowAISettings(!showAISettings);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <Instructions />

        <div className="grid gap-8 md:grid-cols-2">
          <Button onClick={toggleSettings} variant="outline">
            {showAISettings ? "Hide AI Settings" : "Show AI Settings"}
          </Button>
          <div style={{ viewTransitionName: "settings-panel" }}>
            {showAISettings && (
              <AISettings
                configuration={configuration}
                setConfiguration={setConfiguration}
              />
            )}
          </div>
        </div>
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <UserInput
              mood={mood}
              setMood={setMood}
              selectedIngredients={selectedIngredients}
              setSelectedIngredients={setSelectedIngredients}
            />

            <div className="flex gap-4">
              <Button
                size="lg"
                onClick={generateCocktail}
                disabled={loading}
                className="w-full"
              >
                {loading ? (
                  <>Crafting...</>
                ) : (
                  <>Craft Cocktail</>
                )}
              </Button>

              <Button
                size="lg"
                variant="outline"
                onClick={resetForm}
                className="w-full"
              >
                Reset
              </Button>
            </div>
          </div>

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
          </div>
        </div>
      </div>
    </div >
  );
}

export default App;
