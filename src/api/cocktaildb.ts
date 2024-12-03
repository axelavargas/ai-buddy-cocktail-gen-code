import { Drink } from "@/types";

const API_BASE_URL = "https://www.thecocktaildb.com/api/json/v1/1";

export interface APIResponse {
  drinks: Drink[] | null;
}

export async function getCocktailListBasedOnIngredients(
  ingredients: string[],
): Promise<Drink[]> {
  if (!ingredients.length) {
    return [];
  }
  try {
    const drinks =
      ingredients.length === 1
        ? await searchByIngredient(ingredients[0])
        : await searchByMultipleIngredients(ingredients);

  // Remove duplicates based on idDrink
  const uniqueDrinks = Array.from(
    new Map(drinks.map((drink) => [drink.idDrink, drink])).values(),
  );

    return uniqueDrinks;
  } catch (error) {
    console.error("Error fetching cocktails:", error);
    return [];
  }
  return [];
}

async function searchByIngredient(ingredient: string): Promise<Drink[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`,
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

async function searchByMultipleIngredients(
  ingredients: string[],
): Promise<Drink[]> {
  try {
    const responses = await Promise.all(
      ingredients.map((ingredient) => searchByIngredient(ingredient)),
    );
    return responses.flat();
  } catch (error) {
    console.error("Error fetching multiple ingredients:", error);
    return [];
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
            : formattedIngredient,
        );
      }
    }

    // Format the recipe
    const recipe = [
      "Ingredients:",
      ...ingredients.map((ing) => `- ${ing}`),
      "",
      "Instructions:",
      drink.strInstructions,
    ].join("\n");

    return recipe;
  } catch (error) {
    console.error(`Error fetching cocktail recipe for ${idDrink}:`, error);
    return "";
  }
  // return "";
}
