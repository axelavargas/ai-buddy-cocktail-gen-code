import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Instructions } from "./components/Instructions";
import { AISettings } from "./components/AISettings";
import { DEFAULT_INGREDIENTS, UserInput } from "./components/UserInput";
import { Configuration, Drink } from "./types";
import { getCocktailListBasedOnIngredients } from "./api/cocktaildb";
import {
  getRecommendedCocktailV0,
  getRecommendedCocktailV1,
  getRecommendedCocktailV1WithUserFeedback,
} from "./api/openai";
import { Results } from "./components/Results";

function App() {
  // CONSTANTS - Default values for the configuration
  const DEFAULT_API_KEY = import.meta.env.VITE_OPEN_API_KEY || "";
  const DEFAULT_TEMPERATURE = 0.5;
  const DEFAULT_MAX_TOKENS = 256;
  const DEFAULT_MODEL = "gpt-4o-mini";

  // OPENAI CONFIGURATION - State to store the configuration values
  const [configuration, setConfiguration] = useState<Configuration>({
    apiKey: DEFAULT_API_KEY,
    apiKeyInput: "",
    temperature: DEFAULT_TEMPERATURE,
    maxTokens: DEFAULT_MAX_TOKENS,
    model: DEFAULT_MODEL,
  });

  // STATE - User inputs and generated cocktail
  const [mood, setMood] = useState("");
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>(DEFAULT_INGREDIENTS);
  const [generatedCocktail, setGeneratedCocktail] = useState("");
  const [loading, setLoading] = useState(false);
  const [showAISettings, setShowAISettings] = useState(false);
  const [improveSection, setImproveSection] = useState(false);
  const [previousUserFeedback, setPreviousUserFeedback] = useState([]);
  const [userFeedback, setUserFeedback] = useState("");
  const [cocktails, setCocktails] = useState([] as Drink[]);
  const [cocktailRecommendation, setCocktailRecommendation] = useState({
    idDrink: "",
    reason: "",
    recipe: "",
  });

  // FUNCTION - Generate cocktail based on the mood and selected ingredients
  const generateCocktail = useCallback(async () => {
    // simple validation inputs
    if (!mood || selectedIngredients.length === 0) {
      console.error("Please fill in all the required fields");
      return;
    }
    setLoading(true);
    try {
      // Simulate API call for demo
      // await new Promise((resolve) => setTimeout(resolve, 2000));
      // Mock response -
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
      //   Enjoy your perfectly crafted cocktail! 🍹`;
      //
      // setGeneratedCocktail(MockResponse);
      // console.log("Your perfect cocktail has been crafted!");
      // Step 1: Get list of cocktails based on the selected ingredients
      const cocktails =
        await getCocktailListBasedOnIngredients(selectedIngredients);
      console.log("Cocktails based on ingredients: ", cocktails);
      setCocktails(cocktails);

      // Step 2.0: Add your api key to the .env.local file and validate it is working
      if (!configuration.apiKey) {
        console.error("You need an apiKey to generate a cocktail recommendation");
        return;
      }
      //Step 2: Call OpenAI to generate the cocktail recipe based on the mood and ingredients
      const recommendedCocktail = await getRecommendedCocktailV0(
        // const recommendedCocktail = await getRecommendedCocktailV0(
        mood,
        cocktails,
        configuration,
      );
      // Step 3: Lets store the recommended cocktail in the state
      console.log("Recommended cocktail: ", recommendedCocktail);
      setCocktailRecommendation(recommendedCocktail);
      // Step 4: Show the recommended cocktail to the user in the UI
      setGeneratedCocktail(() => {
        return `🍸 Howdy! \n
        ${recommendedCocktail.reason} \n
        Here is the recipe for your perfect cocktail: \n
        ${recommendedCocktail.recipe}`;
      });
      // Step 5: enable the improve section, so the user can provide feedback
      setImproveSection(true);
    } catch (error) {
      console.error("Failed to generate cocktail recommendation", error);
    } finally {
      setLoading(false);
    }
  }, [configuration, mood, selectedIngredients]);

  // FUNCTION - Reset all the user inputs
  const resetForm = useCallback(() => {
    setMood("");
    setSelectedIngredients([]);
    setGeneratedCocktail("");
    setImproveSection(false);
    setUserFeedback("");
    console.log("All inputs have been reset");
  }, []);

  // FUNCTION - Toggle the AI settings panel
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

  // FUNCTION - Generate cocktail based on the user feedback
  const generateCocktailWithUserFeedback = useCallback(async () => {
    setLoading(true);
    try {
      const feedbacks = [...previousUserFeedback, userFeedback.trim()]; // remove any leading/trailing spaces
      const feedback = feedbacks.join('. ');
      setPreviousUserFeedback(feedbacks);
      if (!feedback) {
        console.error("Please provide feedback to improve the results");
        return;
      }

      // Call OpenAI to generate the cocktail recipe based on the previous mood and ingredients and the user feedback

      // call openai.ts function with the user feedback
      const updatedCocktailRecommendation =
        await getRecommendedCocktailV1WithUserFeedback(
          mood,
          cocktails,
          feedback,
          configuration,
          generatedCocktail,
        );
      // update the generated cocktail recipe with the updated recommendation
      setCocktailRecommendation(updatedCocktailRecommendation);

      // Set the generated cocktail recipe to the state
      setGeneratedCocktail(() => {
        return `🍸 Howdy! \n
        ${updatedCocktailRecommendation.reason} \n
        Here is the recipe for your perfect cocktail: \n
        ${updatedCocktailRecommendation.recipe}`;
      });
      console.log(
        "Updated cocktail recommendation: ",
        updatedCocktailRecommendation,
      );
    } catch (error) {
      console.error("Failed to generate cocktail recommendation", error);
    } finally {
      setLoading(false);
    }
  }, [userFeedback, generatedCocktail, configuration, mood, cocktails]);

  // UI - Main App component
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
                {loading ? <>Crafting...</> : <>Craft Cocktail</>}
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

          <Results
            generatedCocktail={generatedCocktail}
            improveSection={improveSection}
            userFeedback={userFeedback}
            setUserFeedback={setUserFeedback}
            onSubmitFeedback={generateCocktailWithUserFeedback}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
