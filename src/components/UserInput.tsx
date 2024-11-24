import { useState, useEffect, useCallback } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

const DEFAULT_INGREDIENTS = [
  "Vodka", "Gin", "Rum", "Tequila", "Whiskey", "Brandy", "Vermouth",
  "Cointreau", "Kahlua", "Baileys", "Amaretto", "Champagne", "Wine",
  "Beer", "Soda", "Juice", "Milk", "Cream", "Sugar", "Salt", "Pepper",
  "Tabasco", "Worcestershire", "Bitters", "Egg", "Honey", "Syrup",
  "Grenadine", "Mint", "Cinnamon", "Nutmeg", "Vanilla", "Coffee",
  "Tea", "Ice", "Water",
];

interface UserInputProps {
  mood: string;
  setMood: (mood: string) => void;
  selectedIngredients: string[];
  setSelectedIngredients: (ingredients: string[]) => void;
}

export function UserInput({
  mood,
  setMood,
  selectedIngredients,
  setSelectedIngredients
}: UserInputProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [allIngredients, setAllIngredients] = useState(DEFAULT_INGREDIENTS);
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setHighlightedIndex(0); // Reset highlight to first item when search changes
  };

  const addIngredient = useCallback((ingredient: string) => {
    const trimmedIngredient = ingredient.trim();
    if (!trimmedIngredient) return;

    // If it's not in the all ingredients list, add it
    if (!allIngredients.includes(trimmedIngredient)) {
      setAllIngredients(prev => [...prev, trimmedIngredient]);
    }

    // Add to selected ingredients if not already selected
    if (!selectedIngredients.includes(trimmedIngredient)) {
      setSelectedIngredients([...selectedIngredients, trimmedIngredient]);
    }
    setSearchTerm("");
    setHighlightedIndex(-1);
  }, [allIngredients, selectedIngredients, setSelectedIngredients]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const filteredCount = filteredIngredients.length;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev < filteredCount - 1 ? prev + 1 : 0
        );
        break;

      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev =>
          prev > 0 ? prev - 1 : filteredCount - 1
        );
        break;

      case 'Enter':
        e.preventDefault();
        if (searchTerm.trim()) {
          // If there's a highlighted item, select it
          if (highlightedIndex >= 0 && filteredIngredients[highlightedIndex]) {
            addIngredient(filteredIngredients[highlightedIndex]);
          } else {
            // If there's an exact match, select it
            const exactMatch = filteredIngredients.find(
              ing => ing.toLowerCase() === searchTerm.toLowerCase()
            );

            if (exactMatch) {
              addIngredient(exactMatch);
            } else {
              // Add as new custom ingredient
              addIngredient(searchTerm);
            }
          }
        }
        break;

      case 'Tab':
        if (filteredIngredients.length === 1) {
          e.preventDefault();
          addIngredient(filteredIngredients[0]);
        }
        break;

      case 'Escape':
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
    }
  };

  const removeIngredient = (ingredientToRemove: string) => {
    setSelectedIngredients(
      selectedIngredients.filter(ingredient => ingredient !== ingredientToRemove)
    );
  };

  // Filter ingredients based on search term
  const filteredIngredients = allIngredients.filter(ingredient =>
    ingredient.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !selectedIngredients.includes(ingredient)
  );

  // Auto-select when there's only one exact match
  useEffect(() => {
    if (searchTerm && filteredIngredients.length === 1 &&
      filteredIngredients[0].toLowerCase() === searchTerm.toLowerCase()) {
      addIngredient(filteredIngredients[0]);
    }
  }, [searchTerm, filteredIngredients, addIngredient]);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Tell us about your mood</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Input */}
        <div className="space-y-2">
          <Label htmlFor="mood">How are you feeling?</Label>
          <Input
            id="mood"
            placeholder="Happy, Sad, Excited, Relaxed..."
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          />
        </div>

        {/* Unified Ingredient Input */}
        <div className="space-y-2">
          <Label>Ingredients</Label>
          <div className="relative">
            <Input
              placeholder="Search or add custom ingredients..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {searchTerm && filteredIngredients.length > 0 && (
              <div className="absolute w-full mt-1 max-h-[200px] overflow-auto z-10 border rounded-md bg-card shadow-lg">
                {filteredIngredients.map((ingredient, index) => (
                  <div
                    key={ingredient}
                    className={`px-3 py-2 cursor-pointer ${index === highlightedIndex ? 'bg-primary text-primary-foreground' : 'hover:bg-muted'
                      }`}
                    onClick={() => addIngredient(ingredient)}
                  >
                    {ingredient}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Selected Ingredients */}
          <div className="flex flex-wrap gap-2 pt-4">
            {selectedIngredients.map((ingredient) => (
              <Badge
                key={ingredient}
                variant="secondary"
                className="flex items-center gap-1 px-3 py-1"
              >
                {ingredient}
                <button
                  className="ml-1 ring-offset-background rounded-full outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={() => removeIngredient(ingredient)}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
