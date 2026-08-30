"use client";

import * as React from "react";

// Mock session context for frontend-only development
const MockSessionContext = React.createContext(null);

function MockSessionProvider({ children }: { children: React.ReactNode }) {
  return (
    <MockSessionContext.Provider value={null}>
      {children}
    </MockSessionContext.Provider>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MockSessionProvider>
      {children}
    </MockSessionProvider>
  );
}
