import { Configuration } from "./types";

const API_BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

export interface Drink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strInstructions: string;
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
  const DEFAULT_PROMPT = "You are a bartender creating a cocktail recipe for a customer. your main goal is to recommend a cocktail based on a list of cocktails te customer give you, do not create the recipe, just give the cocktail idDrink and the reason why is suiting. Return a json with the idDrink and the reason.";
  const MOOD_COCKTAIL_PROMPT = `craft a cocktail recipe for a customer who is feeling ${mood}. They have the ingredients to make the following cocktails: ${cocktails.map(cocktail => cocktail.strDrink).join(", ")}.`;
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

export async function getRecommendedCocktail(mood: string, cocktails: Drink[], configuration: Configuration): Promise<{ idDrink: string, reason: string }> {


  // Call OpenAI API to generate the cocktail recipe

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
    }),
  });

  if (response.ok) {
    const data = await response.json();
    return data.choices[0].message.content;
  }

  console.error('Error fetching recommended cocktail:', response.statusText);

  return { idDrink: "", reason: "" };

}


export async function getCocktailRecipe(idDrink: string): Promise<string> {
  try {
    const response = await fetch(`${API_BASE_URL}/filter.php?i=${idDrink}`);
    const data: APIResponse = await response.json();
    const drink = data.drinks?.[0];
    return drink?.strInstructions || "";
  } catch (error) {
    console.error(`Error fetching cocktail recipe for ${idDrink}:`, error);
    return "";
  }
}

