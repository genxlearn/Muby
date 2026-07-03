import React, { createContext, useContext, useMemo } from 'react';
import { makeTheme, Theme, ThemeMode } from './tokens';

const ThemeContext = createContext<Theme>(makeTheme('light'));

/** Controlled provider — `mode` is owned by the app root so the same value can
 *  drive both the theme and the navigation context (ctx.theme). */
export function ThemeProvider({ mode, children }: { mode: ThemeMode; children: React.ReactNode }) {
  const theme = useMemo(() => makeTheme(mode), [mode]);
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>;
}

export function useTheme(): Theme {
  return useContext(ThemeContext);
}
