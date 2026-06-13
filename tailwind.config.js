module.exports = {
  darkMode: "class",
  content: ["./*.html", "./js/*.js"],
  theme: {
    extend: {
      colors: {
        "outline-variant": "#d2c3c6", "surface-bright": "#faf9f6",
        "on-primary-fixed-variant": "#5a4048", "on-primary-fixed": "#2a151c",
        "on-primary": "#ffffff", "secondary-fixed-dim": "#c8c6c6",
        "primary-container": "#ffd9e3", "tertiary": "#556158",
        "primary-fixed-dim": "#e1bdc7", "secondary": "#5f5e5e",
        "surface-container": "#efeeeb", "on-tertiary-fixed-variant": "#3e4a41",
        "on-surface-variant": "#4e4447", "surface-container-highest": "#e3e2e0",
        "on-secondary-fixed-variant": "#474747", "error-container": "#ffdad6",
        "on-tertiary-fixed": "#131e17", "on-tertiary": "#ffffff",
        "on-secondary": "#ffffff", "on-error-container": "#93000a",
        "on-error": "#ffffff", "background": "#faf9f6",
        "inverse-surface": "#2f312f", "surface-container-lowest": "#ffffff",
        "surface-dim": "#dbdad7", "tertiary-fixed": "#d9e6da",
        "on-primary-container": "#7a5d65", "on-tertiary-container": "#5b675e",
        "on-secondary-fixed": "#1b1c1c", "outline": "#807477",
        "tertiary-fixed-dim": "#bdcabe", "secondary-container": "#e4e2e1",
        "inverse-primary": "#e1bdc7", "surface-container-high": "#e9e8e5",
        "surface": "#faf9f6", "error": "#ba1a1a", "on-background": "#1a1c1a",
        "tertiary-container": "#d9e6da", "on-surface": "#1a1c1a",
        "surface-container-low": "#f4f3f1", "inverse-on-surface": "#f2f1ee",
        "primary-fixed": "#ffd9e3", "surface-tint": "#73575f",
        "surface-variant": "#e3e2e0", "on-secondary-container": "#656464",
        "secondary-fixed": "#e4e2e1", "primary": "#73575f"
      },
      borderRadius: { DEFAULT: "0.25rem", lg: "0.5rem", xl: "0.75rem", full: "9999px" },
      spacing: { unit: "8px", gutter: "24px", "stack-sm": "12px", "margin-desktop": "40px", "stack-lg": "48px", "margin-mobile": "16px", "stack-md": "24px", "container-max": "1120px" },
      fontFamily: {
        "body-lg": ["Noto Sans", "system-ui", "sans-serif"],
        "japanese-character": ["Noto Sans JP", "Hiragino Sans", "Yu Gothic", "MS Gothic", "sans-serif"],
        "body-md": ["Noto Sans", "system-ui", "sans-serif"],
        "display-lg-mobile": ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        "display-lg": ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        "label-caps": ["Plus Jakarta Sans", "system-ui", "sans-serif"],
        "headline-md": ["Plus Jakarta Sans", "system-ui", "sans-serif"]
      },
      fontSize: {
        "body-lg": ["18px", { lineHeight: "28px", fontWeight: "400" }],
        "japanese-character": ["64px", { lineHeight: "1.2", fontWeight: "500" }],
        "body-md": ["16px", { lineHeight: "24px", fontWeight: "400" }],
        "display-lg-mobile": ["32px", { lineHeight: "40px", fontWeight: "700" }],
        "display-lg": ["40px", { lineHeight: "48px", letterSpacing: "-0.02em", fontWeight: "700" }],
        "label-caps": ["12px", { lineHeight: "16px", letterSpacing: "0.08em", fontWeight: "700" }],
        "headline-md": ["24px", { lineHeight: "32px", fontWeight: "600" }]
      }
    }
  },
  plugins: []
};
