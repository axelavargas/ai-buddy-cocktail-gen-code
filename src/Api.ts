// const API_BASE_URL = 'https://www.thecocktaildb.com/api/json/v1/1';

export interface Drink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
}

export interface APIResponse {
  drinks: Drink[] | null;
}

export async function getCocktailListBasedOnIngredients(ingredients: string[]): Promise<Drink[]> {
  if (!ingredients.length) {
    return [];
  }

  // try {
  //   const drinks = ingredients.length === 1
  //     ? await getSingleIngredientCocktails(ingredients[0])
  //     : await getMultipleIngredientsCocktails(ingredients);
  //
  //   // Remove duplicates based on idDrink
  //   const uniqueDrinks = Array.from(
  //     new Map(drinks.map(drink => [drink.idDrink, drink])).values()
  //   );
  //
  //   return uniqueDrinks;
  // } catch (error) {
  //   console.error("Error fetching cocktails:", error);
  //   return [];
  // }
  return [];
}

// async function getSingleIngredientCocktails(ingredient: string): Promise<Drink[]> {
//   try {
//     const response = await fetch(
//       `${API_BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
//     );
//
//     if (!response.ok) {
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//
//     const data: APIResponse = await response.json();
//     return data.drinks || [];
//   } catch (error) {
//     console.error(`Error fetching drinks for ${ingredient}:`, error);
//     return [];
//   }
// }
//
// async function getMultipleIngredientsCocktails(ingredients: string[]): Promise<Drink[]> {
//   try {
//     const responses = await Promise.all(
//       ingredients.map(ingredient => getSingleIngredientCocktails(ingredient))
//     );
//
//     return responses.flat();
//   } catch (error) {
//     console.error('Error fetching multiple ingredients:', error);
//     return [];
//   }
// }
//

