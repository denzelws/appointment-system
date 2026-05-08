export const tokens = {
  colors: {
    // Backgrounds
    bg: {
      base: "#0B0F1A", // fundo principal
      surface: "#131929", // cards, sidebar
      elevated: "#1C2333", // inputs, hover
      overlay: "#243044", // dropdown, modal
    },

    // Accent
    accent: {
      default: "#4F6EF7", // botões primários, seleção
      hover: "#3D5CE6", // hover de botões
      muted: "#4F6EF720", // fundo de badges accent
      text: "#8CA4FF", // links, labels accent
    },

    // Text
    text: {
      primary: "#F0F4FF", // títulos
      secondary: "#8892A4", // labels, subtítulos
      muted: "#4A5568", // placeholders, desabilitados
      inverse: "#0B0F1A", // texto sobre fundo claro
    },

    // Border
    border: {
      subtle: "#1E2D45", // bordas de cards
      default: "#2A3A55", // bordas de inputs
      focus: "#4F6EF7", // foco em inputs
    },

    // Status
    status: {
      confirmed: {
        bg: "#0D2E1A",
        text: "#4ADE80",
        dot: "#22C55E",
      },
      pending: {
        bg: "#2E2000",
        text: "#FBBF24",
        dot: "#F59E0B",
      },
      cancelled: {
        bg: "#2E0D0D",
        text: "#F87171",
        dot: "#EF4444",
      },
    },
  },

  typography: {
    fontFamily: "Inter, system-ui, sans-serif",
    sizes: {
      xs: "0.75rem", // 12px
      sm: "0.875rem", // 14px
      base: "1rem", // 16px
      lg: "1.125rem", // 18px
      xl: "1.25rem", // 20px
      "2xl": "1.5rem", // 24px
    },
    weights: {
      normal: "400",
      medium: "500",
      semibold: "600",
      bold: "700",
    },
  },

  spacing: {
    sidebar: "220px",
    header: "60px",
  },

  radius: {
    sm: "6px",
    md: "10px",
    lg: "14px",
    full: "9999px",
  },

  shadow: {
    card: "0 4px 24px rgba(0,0,0,0.4)",
    modal: "0 8px 48px rgba(0,0,0,0.6)",
  },
} as const;
