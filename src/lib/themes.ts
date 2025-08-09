export interface Theme {
  name: string;
  gradient: string;
  glass: string;
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  input: {
    bg: string;
    text: string;
    placeholder: string;
    border: string;
  };
  button: {
    primary: string;
    primaryHover: string;
    filter: string;
    filterActive: string;
  };
  card: {
    bg: string;
    hover: string;
    border: string;
  };
  wordTypes: {
    noun: string;
    verb: string;
    adjective: string;
    adverb: string;
    other: string;
  };
}

export const themes: Record<string, Theme> = {
  ocean: {
    name: "Ocean Blue",
    gradient: "bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800",
    glass: "bg-white/15 backdrop-blur-md border border-white/20",
    text: {
      primary: "text-white",
      secondary: "text-blue-100",
      accent: "text-blue-200",
    },
    input: {
      bg: "bg-white/90",
      text: "text-gray-800",
      placeholder: "placeholder-gray-600",
      border: "focus:ring-blue-300",
    },
    button: {
      primary: "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700",
      primaryHover: "hover:shadow-blue-500/25",
      filter: "bg-white/20 hover:bg-white/30 text-white",
      filterActive: "bg-white text-blue-800 shadow-lg",
    },
    card: {
      bg: "bg-white/10",
      hover: "hover:bg-white/20",
      border: "border-white/10",
    },
    wordTypes: {
      noun: "bg-blue-100 text-blue-800 border-blue-200",
      verb: "bg-green-100 text-green-800 border-green-200",
      adjective: "bg-purple-100 text-purple-800 border-purple-200",
      adverb: "bg-orange-100 text-orange-800 border-orange-200",
      other: "bg-gray-100 text-gray-800 border-gray-200",
    },
  },
  forest: {
    name: "Forest Green",
    gradient: "bg-gradient-to-br from-green-600 via-emerald-700 to-teal-800",
    glass: "bg-white/15 backdrop-blur-md border border-white/20",
    text: {
      primary: "text-white",
      secondary: "text-green-100",
      accent: "text-emerald-200",
    },
    input: {
      bg: "bg-white/90",
      text: "text-gray-800",
      placeholder: "placeholder-gray-600",
      border: "focus:ring-emerald-300",
    },
    button: {
      primary: "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700",
      primaryHover: "hover:shadow-green-500/25",
      filter: "bg-white/20 hover:bg-white/30 text-white",
      filterActive: "bg-white text-green-800 shadow-lg",
    },
    card: {
      bg: "bg-white/10",
      hover: "hover:bg-white/20",
      border: "border-white/10",
    },
    wordTypes: {
      noun: "bg-emerald-100 text-emerald-800 border-emerald-200",
      verb: "bg-teal-100 text-teal-800 border-teal-200",
      adjective: "bg-cyan-100 text-cyan-800 border-cyan-200",
      adverb: "bg-lime-100 text-lime-800 border-lime-200",
      other: "bg-gray-100 text-gray-800 border-gray-200",
    },
  },
  sunset: {
    name: "Sunset Orange",
    gradient: "bg-gradient-to-br from-orange-500 via-red-600 to-pink-700",
    glass: "bg-white/15 backdrop-blur-md border border-white/20",
    text: {
      primary: "text-white",
      secondary: "text-orange-100",
      accent: "text-red-200",
    },
    input: {
      bg: "bg-white/90",
      text: "text-gray-800",
      placeholder: "placeholder-gray-600",
      border: "focus:ring-orange-300",
    },
    button: {
      primary: "bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700",
      primaryHover: "hover:shadow-orange-500/25",
      filter: "bg-white/20 hover:bg-white/30 text-white",
      filterActive: "bg-white text-orange-800 shadow-lg",
    },
    card: {
      bg: "bg-white/10",
      hover: "hover:bg-white/20",
      border: "border-white/10",
    },
    wordTypes: {
      noun: "bg-orange-100 text-orange-800 border-orange-200",
      verb: "bg-red-100 text-red-800 border-red-200",
      adjective: "bg-pink-100 text-pink-800 border-pink-200",
      adverb: "bg-yellow-100 text-yellow-800 border-yellow-200",
      other: "bg-gray-100 text-gray-800 border-gray-200",
    },
  },
  dark: {
    name: "Dark Mode",
    gradient: "bg-gradient-to-br from-gray-800 via-gray-900 to-black",
    glass: "bg-gray-800/40 backdrop-blur-md border border-gray-600/30",
    text: {
      primary: "text-gray-100",
      secondary: "text-gray-300",
      accent: "text-gray-200",
    },
    input: {
      bg: "bg-gray-700/90",
      text: "text-gray-100",
      placeholder: "placeholder-gray-400",
      border: "focus:ring-gray-500",
    },
    button: {
      primary: "bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800",
      primaryHover: "hover:shadow-gray-500/25",
      filter: "bg-gray-700/50 hover:bg-gray-600/50 text-gray-200",
      filterActive: "bg-gray-600 text-white shadow-lg",
    },
    card: {
      bg: "bg-gray-700/30",
      hover: "hover:bg-gray-600/40",
      border: "border-gray-600/20",
    },
    wordTypes: {
      noun: "bg-blue-900/50 text-blue-200 border-blue-700/50",
      verb: "bg-green-900/50 text-green-200 border-green-700/50",
      adjective: "bg-purple-900/50 text-purple-200 border-purple-700/50",
      adverb: "bg-orange-900/50 text-orange-200 border-orange-700/50",
      other: "bg-gray-700/50 text-gray-300 border-gray-600/50",
    },
  },
  light: {
    name: "Light Mode",
    gradient: "bg-gradient-to-br from-gray-100 to-gray-200",
    glass: "bg-white/80 backdrop-blur-sm border border-gray-200/50",
    text: {
      primary: "text-gray-800",
      secondary: "text-gray-600",
      accent: "text-gray-700",
    },
    input: {
      bg: "bg-white",
      text: "text-gray-800",
      placeholder: "placeholder-gray-500",
      border: "focus:ring-blue-500 border-gray-300",
    },
    button: {
      primary: "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white",
      primaryHover: "hover:shadow-blue-500/25",
      filter: "bg-gray-200 hover:bg-gray-300 text-gray-700",
      filterActive: "bg-blue-600 text-white shadow-lg",
    },
    card: {
      bg: "bg-white/60",
      hover: "hover:bg-white/80",
      border: "border-gray-200/50",
    },
    wordTypes: {
      noun: "bg-blue-100 text-blue-800 border-blue-200",
      verb: "bg-green-100 text-green-800 border-green-200",
      adjective: "bg-purple-100 text-purple-800 border-purple-200",
      adverb: "bg-orange-100 text-orange-800 border-orange-200",
      other: "bg-gray-100 text-gray-800 border-gray-200",
    },
  },
};
