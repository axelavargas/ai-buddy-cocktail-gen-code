import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const MODELS = ["gpt-4o-mini"] as const;
const MIN_TEMPERATURE = 0;
const MAX_TEMPERATURE = 2;
const MIN_TOKENS = 1;
const MAX_TOKENS = 2048;

interface Configuration {
  apiKey: string;
  apiKeyInput: string;
  temperature: number;
  maxTokens: number;
  model: string;
}

interface AISettingsProps {
  configuration: Configuration;
  setConfiguration: React.Dispatch<React.SetStateAction<Configuration>>;
}

export function AISettings({
  configuration,
  setConfiguration,
}: AISettingsProps) {
  const handleApiKeyChange = (value: string) => {
    setConfiguration((prev) => ({
      ...prev,
      apiKeyInput: value,
    }));
  };

  const handleAuthorize = () => {
    setConfiguration((prev) => ({
      ...prev,
      apiKey: prev.apiKeyInput,
    }));
  };

  const handleTemperatureChange = (value: string) => {
    const temperature = parseFloat(value);
    if (temperature >= MIN_TEMPERATURE && temperature <= MAX_TEMPERATURE) {
      setConfiguration((prev) => ({
        ...prev,
        temperature,
      }));
    }
  };

  const handleMaxTokensChange = (value: string) => {
    const tokens = parseInt(value);
    if (tokens >= MIN_TOKENS && tokens <= MAX_TOKENS) {
      setConfiguration((prev) => ({
        ...prev,
        maxTokens: tokens,
      }));
    }
  };

  const handleModelChange = (value: string) => {
    setConfiguration((prev) => ({
      ...prev,
      model: value,
    }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Configuration</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Key Section */}
        <div className="space-y-2">
          <Label htmlFor="apiKey">API Key</Label>
          <div className="flex space-x-2">
            <Input
              id="apiKey"
              type="password"
              placeholder="sk-..."
              value={configuration.apiKeyInput}
              onChange={(e) => handleApiKeyChange(e.target.value)}
              required
            />
            <Button
              variant="outline"
              onClick={handleAuthorize}
              className="whitespace-nowrap"
            >
              Authorize
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {/* Temperature Section */}
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperature</Label>
            <Input
              id="temperature"
              type="number"
              min={MIN_TEMPERATURE}
              max={MAX_TEMPERATURE}
              step={0.1}
              value={configuration.temperature}
              onChange={(e) => handleTemperatureChange(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Value: {MIN_TEMPERATURE} - {MAX_TEMPERATURE}
            </p>
          </div>

          {/* Max Tokens Section */}
          <div className="space-y-2">
            <Label htmlFor="tokens">Max Tokens</Label>
            <Input
              id="tokens"
              type="number"
              min={MIN_TOKENS}
              max={MAX_TOKENS}
              step={1}
              value={configuration.maxTokens}
              onChange={(e) => handleMaxTokensChange(e.target.value)}
            />
            <p className="text-sm text-muted-foreground">
              Value: {MIN_TOKENS} - {MAX_TOKENS}
            </p>
          </div>
        </div>

        {/* Model Selection */}
        <div className="space-y-2">
          <Label htmlFor="model">Model</Label>
          <Select value={configuration.model} onValueChange={handleModelChange}>
            <SelectTrigger id="model">
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              {MODELS.map((model) => (
                <SelectItem key={model} value={model}>
                  {model}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}
