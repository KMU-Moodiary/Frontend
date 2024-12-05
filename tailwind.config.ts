import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      pen: ["Ownglyph_ParkDaHyun"],
    },
    extend: {
      colors: {
        'kakao-background': '#FEE500',
        'kakao-text': '#3C1E1E',
      },
    },
  },
  plugins: [],
};
export default config;
