import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme?: () => void;
  switchable: boolean;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
  defaultTheme?: Theme;
  switchable?: boolean;
}

function getInitialTheme(defaultTheme: Theme, switchable: boolean): Theme {
  if (!switchable) return defaultTheme;
  
  // 1. Check localStorage first
  const stored = localStorage.getItem("maham-theme");
  if (stored === "light" || stored === "dark") return stored;
  
  // 2. Respect system preference
  if (typeof window !== "undefined" && window.matchMedia) {
    if (window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  }
  
  // 3. Fallback to default
  return defaultTheme;
}

export function ThemeProvider({
  children,
  defaultTheme = "light",
  switchable = false,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => getInitialTheme(defaultTheme, switchable));

  useEffect(() => {
    const root = document.documentElement;
    
    // Smooth transition between themes
    root.style.setProperty("transition", "background-color 0.4s ease, color 0.3s ease");
    
    if (theme === "dark") {
      root.classList.add("dark");
      root.classList.remove("light");
    } else {
      root.classList.remove("dark");
      root.classList.add("light");
    }

    if (switchable) {
      localStorage.setItem("maham-theme", theme);
    }
    
    // Update meta theme-color for mobile browsers
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute("content", theme === "dark" ? "#1a1610" : "#fffdf9");
    }
  }, [theme, switchable]);

  // Listen for system preference changes
  useEffect(() => {
    if (!switchable) return;
    
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e: MediaQueryListEvent) => {
      // Only auto-switch if user hasn't manually set preference
      const stored = localStorage.getItem("maham-theme");
      if (!stored) {
        setTheme(e.matches ? "dark" : "light");
      }
    };
    
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [switchable]);

  const toggleTheme = useCallback(() => {
    if (!switchable) return;
    setTheme(prev => (prev === "light" ? "dark" : "light"));
  }, [switchable]);

  return (
    <ThemeContext.Provider value={{ 
      theme, 
      toggleTheme: switchable ? toggleTheme : undefined, 
      switchable,
      isDark: theme === "dark"
    }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
