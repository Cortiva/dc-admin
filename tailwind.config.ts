import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

export default {
    darkMode: "class",

    content: [
        "./index.html",
        "./src/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./pages/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
    ],

    theme: {
        container: {
            center: true,
            padding: "2rem",
            screens: {
                "2xl": "1400px",
            },
        },

        extend: {
            fontFamily: {
                sans: ["Inter", "sans-serif"],
                heading: ["Plus Jakarta Sans", "sans-serif"],
            },

            colors: {
                // ✅ core tokens
                background: "var(--background)",
                foreground: "var(--foreground)",

                border: "var(--border)",
                input: "var(--input)",
                ring: "var(--ring)",

                // ✅ semantic tokens
                primary: {
                    DEFAULT: "var(--primary)",
                    foreground: "var(--primary-foreground)",
                },

                secondary: {
                    DEFAULT: "var(--secondary)",
                    foreground: "var(--secondary-foreground)",
                },

                destructive: {
                    DEFAULT: "var(--destructive)",
                    foreground: "var(--destructive-foreground)",
                },

                muted: {
                    DEFAULT: "var(--muted)",
                    foreground: "var(--muted-foreground)",
                },

                accent: {
                    DEFAULT: "var(--accent)",
                    foreground: "var(--accent-foreground)",
                },

                success: {
                    DEFAULT: "var(--success)",
                    foreground: "var(--success-foreground)",
                },

                popover: {
                    DEFAULT: "var(--popover)",
                    foreground: "var(--popover-foreground)",
                },

                card: {
                    DEFAULT: "var(--card)",
                    foreground: "var(--card-foreground)",
                },

                // ✅ sidebar tokens (kept consistent)
                sidebar: {
                    DEFAULT: "var(--sidebar-background)",
                    foreground: "var(--sidebar-foreground)",

                    primary: "var(--sidebar-primary)",
                    "primary-foreground": "var(--sidebar-primary-foreground)",

                    accent: "var(--sidebar-accent)",
                    "accent-foreground": "var(--sidebar-accent-foreground)",

                    border: "var(--sidebar-border)",
                    ring: "var(--sidebar-ring)",
                },
            },

            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },

            keyframes: {
                "accordion-down": {
                    from: { height: "0" },
                    to: { height: "var(--radix-accordion-content-height)" },
                },
                "accordion-up": {
                    from: { height: "var(--radix-accordion-content-height)" },
                    to: { height: "0" },
                },
                "fade-in": {
                    "0%": { opacity: "0", transform: "translateY(10px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "fade-in-up": {
                    "0%": { opacity: "0", transform: "translateY(30px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                "scale-in": {
                    "0%": { transform: "scale(0.95)", opacity: "0" },
                    "100%": { transform: "scale(1)", opacity: "1" },
                },
                float: {
                    "0%, 100%": { transform: "translateY(0)" },
                    "50%": { transform: "translateY(-10px)" },
                },
                "pulse-glow": {
                    "0%, 100%": {
                        boxShadow: "0 0 20px 187 72% 50% / 0.2)",
                    },
                    "50%": {
                        boxShadow: "0 0 40px 187 72% 50% / 0.4)",
                    },
                },
                "count-up": {
                    "0%": { opacity: "0", transform: "translateY(20px)" },
                    "100%": { opacity: "1", transform: "translateY(0)" },
                },
                slideInRight: {
                    from: { transform: "translateX(100%)" },
                    to: { transform: "translateX(0)" },
                },
                slideOutRight: {
                    from: { transform: "translateX(0)" },
                    to: { transform: "translateX(100%)" },
                },
                fadeIn: {
                    from: { opacity: 0 },
                    to: { opacity: 1 },
                },
                fadeOut: {
                    from: { opacity: 1 },
                    to: { opacity: 0 },
                },
            },

            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                "fade-in": "fade-in 0.5s ease-out forwards",
                "fade-in-up": "fade-in-up 0.6s ease-out forwards",
                "scale-in": "scale-in 0.3s ease-out forwards",
                float: "float 3s ease-in-out infinite",
                "pulse-glow": "pulse-glow 2s ease-in-out infinite",
                "count-up": "count-up 0.6s ease-out forwards",
                slideInRight: "slideInRight 0.3s ease-out",
                slideOutRight: "slideOutRight 0.25s ease-in",
                fadeIn: "fadeIn 0.3s ease-out",
                fadeOut: "fadeOut 0.2s ease-in",
            },
        },
    },

    plugins: [animate],
} satisfies Config;
