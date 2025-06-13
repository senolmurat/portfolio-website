const tailwindPalettes = {
    red:     { 50: '#fef2f2', 100: '#fee2e2', 200: '#fecaca', 500: '#ef4444', 800: '#991b1b' },
    yellow:  { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 500: '#eab308', 800: '#854d0e' },
    green:   { 50: '#f0fdf4', 100: '#dcfce7', 200: '#bbf7d0', 500: '#22c55e', 800: '#166534' },
    blue:    { 50: '#eff6ff', 100: '#dbeafe', 200: '#bfdbfe', 500: '#3b82f6', 800: '#1e40af' },
    indigo:  { 50: '#eef2ff', 100: '#e0e7ff', 200: '#c7d2fe', 500: '#6366f1', 800: '#3730a3' },
    purple:  { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 500: '#a21caf', 800: '#6d28d9' },
    pink:    { 50: '#fdf2f8', 100: '#fce7f3', 200: '#fbcfe8', 500: '#ec4899', 800: '#9d174d' },
    orange:  { 50: '#fff7ed', 100: '#ffedd5', 200: '#fed7aa', 500: '#f97316', 800: '#9a3412' },
    amber:   { 50: '#fffbeb', 100: '#fef3c7', 200: '#fde68a', 500: '#f59e42', 800: '#78350f' },
    lime:    { 50: '#f7fee7', 100: '#ecfccb', 200: '#d9f99d', 500: '#84cc16', 800: '#365314' },
    emerald: { 50: '#ecfdf5', 100: '#d1fae5', 200: '#a7f3d0', 500: '#10b981', 800: '#065f46' },
    teal:    { 50: '#f0fdfa', 100: '#ccfbf1', 200: '#99f6e4', 500: '#14b8a6', 800: '#115e59' },
    cyan:    { 50: '#ecfeff', 100: '#cffafe', 200: '#a5f3fc', 500: '#06b6d4', 800: '#155e75' },
    sky:     { 50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 500: '#0ea5e9', 800: '#075985' },
    violet:  { 50: '#f5f3ff', 100: '#ede9fe', 200: '#ddd6fe', 500: '#8b5cf6', 800: '#5b21b6' },
    fuchsia: { 50: '#fdf4ff', 100: '#fae8ff', 200: '#f5d0fe', 500: '#d946ef', 800: '#86198f' },
    rose:    { 50: '#fff1f2', 100: '#ffe4e6', 200: '#fecdd3', 500: '#f43f5e', 800: '#9f1239' }
};
const defaultColorPalette = tailwindPalettes.blue
var selectedColorPalette = defaultColorPalette
const defaultPrimaryColor = selectedColorPalette[500]; //defaultColorPalette[500];
const defaultSecondaryColor = selectedColorPalette[800];

tailwind.config = {
    theme: {
        extend: {
            colors: {
                primary: '#ffffff',
                secondary: '#ffffff',
                dark: '#1f2937',
                light: '#f9fafb'
            }
        }
    }
}