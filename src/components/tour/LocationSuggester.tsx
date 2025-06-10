'use client';

import type { ChangeEvent } from 'react';
import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button'; // For potential clear button
import { suggestDestinations } from '@/ai/flows/suggest-destinations';
import { Loader2, XCircle } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface LocationSuggesterProps {
  onLocationSelect: (location: string) => void;
  initialValue?: string;
}

export function LocationSuggester({ onLocationSelect, initialValue = '' }: LocationSuggesterProps) {
  const [inputValue, setInputValue] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedInputValue = useDebounce(inputValue, 300);

  const fetchSuggestions = useCallback(async (query: string) => {
    if (!query.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    setIsLoading(true);
    try {
      const result = await suggestDestinations({ partialLocation: query });
      setSuggestions(result.suggestions || []);
      if (result.suggestions && result.suggestions.length > 0) {
        setShowSuggestions(true);
      } else {
        setShowSuggestions(false);
      }
    } catch (error) {
      console.error('Error fetching location suggestions:', error);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (debouncedInputValue && document.activeElement === inputRef.current) {
      fetchSuggestions(debouncedInputValue);
    } else if (!debouncedInputValue) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedInputValue, fetchSuggestions]);
  
  // Sync initialValue if it changes externally
  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    if (!e.target.value.trim()) { // Clear selection if input is cleared
      onLocationSelect('');
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputValue(suggestion);
    onLocationSelect(suggestion);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };
  
  const clearInput = () => {
    setInputValue('');
    onLocationSelect('');
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center">
        <Input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => {
            if (inputValue && suggestions.length > 0) {
              setShowSuggestions(true);
            } else if (inputValue) {
              fetchSuggestions(inputValue); // Fetch if focused and has value but no suggestions visible
            }
          }}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} // Delay to allow click on suggestions
          placeholder="City, Country, or Venue"
          aria-label="Location filter with AI suggestions"
          className="pr-10" // Make space for loader/clear button
        />
        {isLoading ? (
          <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-muted-foreground" />
        ) : (
          inputValue && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
              onClick={clearInput}
              aria-label="Clear location input"
            >
              <XCircle className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </Button>
          )
        )}
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute z-50 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-y-auto" role="listbox">
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              className="px-3 py-2 hover:bg-accent hover:text-accent-foreground cursor-pointer text-sm"
              onMouseDown={(e) => { // Use onMouseDown to ensure it fires before onBlur
                e.preventDefault(); // Prevent input from losing focus immediately
                handleSuggestionClick(suggestion);
              }}
              role="option"
              aria-selected={inputValue === suggestion} // Optional: indicate if a suggestion matches current input
            >
              {suggestion}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
