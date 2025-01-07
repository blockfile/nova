/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}"],
    theme: {
        extend: {
            fontFamily: {
                jura: ["Jura", "serif"],
                Graduate: ["Graduate", "serif"],
                Zen: ["Zen Dots", "serif"],
                Bruno: ["Bruno Ace SC", "serif"],
                Nuku: ["Nuku1", "sans-serif"],
            },
        },
    },
    plugins: [],
};
