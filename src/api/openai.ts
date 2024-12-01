import { Configuration, Drink } from "@/types";
import { getCocktailRecipe } from "./cocktaildb";

const OPENAI_API_URL = "https://api.openai.com/v1/chat/completions";

const SYSTEM_PROMPT =
  'You are a expert bartender creating a cocktail recipe for a customer based on how they feel. your main goal is to recommend a cocktail based on a list of cocktails the user gives you. The customer is only interested in the cocktails provided in the list. You must return a valid json with the following structure: {"idDrink": "idDrink", "reason": "reason"}';

const createCocktailListWithIdAndName = (cocktails: Drink[]) => {
  const list = cocktails
    .map(
      (cocktail) =>
        `idDrink: ${cocktail.idDrink} - nameDrink: ${cocktail.strDrink}`,
    )
    .join(", ");
  return list;
};

function getMessages(mood: string, cocktails: Drink[]) {
  const MOOD_COCKTAIL_PROMPT = `From the following list recommend a cocktail for someone who is feeling ${mood}: ${createCocktailListWithIdAndName(cocktails)}`;
  return [
    {
      role: "system",
      content: SYSTEM_PROMPT,
    },
    {
      role: "user",
      content: MOOD_COCKTAIL_PROMPT,
    },
  ];
}

// get recommended with basic usage of openai api
export async function getRecommendedCocktailV0(
  mood: string,
  cocktails: Drink[],
  configuration: Configuration,
): Promise<{
  idDrink: string;
  reason: string;
  recipe: string;
}> {
  // basic call openai api to get a recommended cocktail
  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${configuration.apiKey}`,
    },
    body: JSON.stringify({
      temperature: configuration.temperature,
      model: configuration.model,
      max_tokens: configuration.maxTokens,
      messages: [...getMessages(mood, cocktails)],
    }),
  });

  // handle response
  const data = await response.json();
  const recomendation = JSON.parse(data.choices[0].message.content);

  // Then with the recommendation, fetch the recipe from the cocktail DB
  const recipeDetails = await getCocktailRecipe(recomendation.idDrink);

  // return the recommendation id, reason and recipe
  return {
    idDrink: recomendation.idDrink,
    reason: recomendation.reason,
    recipe: recipeDetails,
  };
}

// get recommended with advanced usage of openai api, using structured outputs
export async function getRecommendedCocktailV1(
  mood: string,
  cocktails: Drink[],
  configuration: Configuration,
): Promise<{ idDrink: string; reason: string; recipe: string }> {
  try {
    // Call OpenAI API to generate the cocktail recipe
    const response = await fetch(OPENAI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${configuration.apiKey}`,
      },
      body: JSON.stringify({
        max_tokens: configuration.maxTokens, // deprecated
        temperature: configuration.temperature,
        model: configuration.model,
        messages: [...getMessages(mood, cocktails)],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: "cocktail_recommendation",
            strict: true,
            schema: {
              type: "object",
              properties: {
                idDrink: {
                  type: "string",
                  description: "The id of the drink to recommend",
                },
                reason: {
                  type: "string",
                  description: "The reason for the recommendation",
                },
              },
              required: ["idDrink", "reason"],
              additionalProperties: false,
            },
          },
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    const recomendation = JSON.parse(data.choices[0].message.content);

    // Then fetch the recipe from the cocktail DB
    const recipeDetails = await getCocktailRecipe(recomendation.idDrink);

    return {
      idDrink: recomendation.idDrink,
      reason: recomendation.reason,
      recipe: recipeDetails,
    };
  } catch (error) {
    console.error("Error generating cocktail recipe:", error);
    return { idDrink: "", reason: "", recipe: "" };
  }
}
