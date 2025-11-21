/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                scout: {
                    purple: '#4B0082',
                    gold: '#FFD700',
                    green: '#228B22',
                    blue: '#1E3A8A',
                },
            },
        },
    },
    plugins: [],
}
