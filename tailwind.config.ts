import type { Config } from "tailwindcss";

// Palet & warna status sesuai CLAUDE.md §3 — sumber kebenaran tunggal untuk warna.
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Brand Sinar Mas
        brand: {
          red: "#E30613",
          black: "#1A1A1A",
          grey: "#B3B3B3",
          yellow: "#F5C518",
          orange: "#E89A1F",
          teal: "#1A8A8A",
          green: "#8BC972",
        },
        // Warna status temuan (konsisten di seluruh app)
        status: {
          done: "#2E7D32",      // hijau — Done
          progress: "#E89A1F",  // amber/oranye — Progress
          noprogress: "#E30613",// merah — No Progress
        },
      },
      fontFamily: {
        sans: ["system-ui", "-apple-system", "Segoe UI", "Roboto", "sans-serif"],
      },
      maxWidth: {
        app: "480px", // mobile-first shell
      },
    },
  },
  plugins: [],
};

export default config;
