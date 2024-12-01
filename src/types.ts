export interface Configuration {
  apiKey: string;
  apiKeyInput: string;
  temperature: number;
  maxTokens: number;
  model: string;
}

export interface Drink {
  idDrink: string;
  strDrink: string;
  strDrinkThumb: string;
  strInstructions: string;
  [key: string]: string | null;
}
