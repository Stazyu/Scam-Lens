"use client";

import React from "react";

interface HighlightTextProps {
  text: string;
  keywords: string[];
}

export function HighlightText({ text, keywords }: HighlightTextProps) {
  if (!text) return null;
  if (!keywords || keywords.length === 0) {
    return <span>{text}</span>;
  }

  // Safely escape regex characters to avoid errors
  const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  
  // Filter out empty keywords
  const validKeywords = keywords.filter((k) => k.trim().length > 0);
  
  if (validKeywords.length === 0) {
    return <span>{text}</span>;
  }

  // Create a regex pattern to match any of the keywords, case-insensitive
  const regexPattern = new RegExp(`(${validKeywords.map(escapeRegExp).join("|")})`, "gi");
  
  // Split the text by the regex pattern. The captured groups (the matched keywords) 
  // will be included in the resulting array.
  const parts = text.split(regexPattern);

  return (
    <span>
      {parts.map((part, i) => {
        const isMatch = validKeywords.some(
          (keyword) => keyword.toLowerCase() === part.toLowerCase()
        );
        
        if (isMatch) {
          return (
            <span key={i} className="bg-danger/20 text-danger-700 px-1 rounded font-medium">
              {part}
            </span>
          );
        }
        // Return unmatched text as is
        return <span key={i}>{part}</span>;
      })}
    </span>
  );
}
