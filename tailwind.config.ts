import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        darkSlate: "#1B2D2A",
        neutralGray: "#C0C7C7",
        // Besys Theme Tokens (Standard Light Theme Default)
        besys: {
          sidebar: "#0A1C18",      // Kept dark for the signature sidebar
          lightBg: "#F4F7F6",      // Main background 
          darkBg: "#F4F7F6",       // Default to light background
          lightCard: "#FFFFFF",    // Card surface
          darkCard: "#FFFFFF",     // Default cards to white/light
          accent: "#2FD9C4",       // Vibrant mint brand accent
          lightBorder: "#E2E8F0",  // Soft border
          darkBorder: "#E2E8F0",   // Default borders to light mode standard
        },
      },
    },
  },
  plugins: [],
};

export default config;