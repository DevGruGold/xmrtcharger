import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				charging: '#22c55e',
				discharging: '#f59e0b',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '1' },
					'50%': { opacity: '0.5' }
				},
				'liquid-fill': {
					'0%': { transform: 'translateY(100%)', opacity: '0.8' },
					'100%': { transform: 'translateY(0)', opacity: '1' }
				},
				'particle-float': {
					'0%': { transform: 'translateY(0) scale(1)', opacity: '0' },
					'50%': { opacity: '1' },
					'100%': { transform: 'translateY(-100px) scale(0.5)', opacity: '0' }
				},
				'lightning-strike': {
					'0%, 100%': { opacity: '0' },
					'10%, 30%, 50%': { opacity: '1' },
					'20%, 40%, 60%': { opacity: '0' }
				},
				'glow-pulse': {
					'0%, 100%': { filter: 'drop-shadow(0 0 5px currentColor)' },
					'50%': { filter: 'drop-shadow(0 0 20px currentColor)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'scan-line': {
					'0%': { transform: 'translateY(-100%)' },
					'100%': { transform: 'translateY(100%)' }
				},
				'energy-flow': {
					'0%': { transform: 'translateX(-100%) scale(0.5)', opacity: '0' },
					'50%': { opacity: '1', transform: 'translateX(0) scale(1)' },
					'100%': { transform: 'translateX(100%) scale(0.5)', opacity: '0' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-slow': 'pulse-slow 2s ease-in-out infinite',
				'liquid-fill': 'liquid-fill 2s ease-out',
				'particle-float': 'particle-float 3s ease-out infinite',
				'lightning-strike': 'lightning-strike 1s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'shimmer': 'shimmer 2s linear infinite',
				'scan-line': 'scan-line 2s ease-in-out infinite',
				'energy-flow': 'energy-flow 2s ease-in-out infinite'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;