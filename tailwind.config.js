/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
        "./components/**/*.{js,ts,jsx,tsx}",
        "./*.{js,ts,jsx,tsx}" // Include root files like App.tsx if they are there
    ],
    theme: {
        extend: {
            fontFamily: {
                serif: ['"Playfair Display"', '"Noto Serif Myanmar"', 'serif'],
                sans: ['"Lato"', '"Padauk"', 'sans-serif'],
            },
            colors: {
                'brand-black': '#121212',
                'brand-gray': '#f7f7f7',
                'brand-border': '#e2e2e2',
            }
        },
    },
    plugins: [],
}
