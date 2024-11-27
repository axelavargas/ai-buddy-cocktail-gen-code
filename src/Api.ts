import { Configuration } from "./types";

const API_BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface Drink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strInstructions: string;
  [key: string]: string | null;
}

export interface APIResponse {
  drinks: Drink[] | null;
}

export async function getCocktailListBasedOnIngredients(ingredients: string[]): Promise<Drink[]> {
  if (!ingredients.length) {
    return [];
  }
  try {
    const drinks = ingredients.length === 1
      ? await getSingleIngredientCocktails(ingredients[0])
      : await getMultipleIngredientsCocktails(ingredients);

    // Remove duplicates based on idDrink
    const uniqueDrinks = Array.from(
      new Map(drinks.map(drink => [drink.idDrink, drink])).values()
    );

    return uniqueDrinks;
  } catch (error) {
    console.error("Error fetching cocktails:", error);
    return [];
  }
  // return [];
}

async function getSingleIngredientCocktails(ingredient: string): Promise<Drink[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: APIResponse = await response.json();
    return data.drinks || [];
  } catch (error) {
    console.error(`Error fetching drinks for ${ingredient}:`, error);
    return [];
  }
}

async function getMultipleIngredientsCocktails(ingredients: string[]): Promise<Drink[]> {
  try {
    const responses = await Promise.all(
      ingredients.map(ingredient => getSingleIngredientCocktails(ingredient))
    );

    return responses.flat();
  } catch (error) {
    console.error('Error fetching multiple ingredients:', error);
    return [];
  }
}

// OPENAI API


function getMessages(mood: string, cocktails: Drink[]) {
  const DEFAULT_PROMPT = "You are a expert bartender creating a cocktail recipe for a customer based on how they feel. your main goal is to recommend a cocktail based on a list of cocktails the user gives you. The customer is only interested in the cocktails provided in the list. You must return a valid json with the following structure: {\"idDrink\": \"idDrink\", \"reason\": \"reason\"}";
  const list = cocktails.map(cocktail => `idDrink: ${cocktail.idDrink} - nameDrink: ${cocktail.strDrink}`).join(", ");
  const MOOD_COCKTAIL_PROMPT = `From the following list recommend a cocktail for someone who is feeling ${mood}: ${list}`;
  return [
    {
      role: 'system',
      content: DEFAULT_PROMPT,
    },
    {
      role: 'user',
      content: MOOD_COCKTAIL_PROMPT,
    }
  ]
}

export async function getRecommendedCocktail(mood: string, cocktails: Drink[], configuration: Configuration): Promise<{ idDrink: string, reason: string, recipe: string }> {

  try {
    // Call OpenAI API to generate the cocktail recipe
    // TODO: Is it possible to call the cocktail DB API to get the recipe?
    const response = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${configuration.apiKey}`,
      },
      body: JSON.stringify({
        max_tokens: configuration.maxTokens,// deprecated
        temperature: configuration.temperature,
        model: configuration.model,
        messages: [...getMessages(mood, cocktails)],
        response_format: {
          type: 'json_schema',
          json_schema: {
            name: "cocktail_recommendation",
            strict: true,
            schema: {
              type: 'object',
              properties: {
                idDrink: {
                  type: 'string',
                  description: 'The id of the drink to recommend',
                },
                reason: {
                  type: 'string',
                  description: 'The reason for the recommendation'
                },
              },
              required: ['idDrink', 'reason'],
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


export async function getCocktailRecipe(idDrink: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/lookup.php?i=${idDrink}`);
    const data: APIResponse = await response.json();
    const drink = data.drinks?.[0];

    if (!drink) {
      return "";
    }

    // Get all ingredients and their measurements
    const ingredients: string[] = [];
    // from the API ingredients are stored in strIngredient1, strIngredient2, ..., strIngredient15
    for (let i = 1; i <= 15; i++) {
      const ingredient = drink[`strIngredient${i}`];
      const measure = drink[`strMeasure${i}`];

      if (ingredient) {
        const formattedMeasure = measure ? measure.trim() : "";
        const formattedIngredient = ingredient.trim();
        ingredients.push(
          formattedMeasure
            ? `${formattedMeasure} ${formattedIngredient}`
            : formattedIngredient
        );
      }
    }

    // Format the recipe
    const recipe = [
      "Ingredients:",
      ...ingredients.map(ing => `- ${ing}`),
      "",
      "Instructions:",
      drink.strInstructions
    ].join("\n");

    return recipe;

  } catch (error) {
    console.error(`Error fetching cocktail recipe for ${idDrink}:`, error);
    return "";
  }
}

