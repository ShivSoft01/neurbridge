export const theme = {
  primary: '#FFFFFF', // White - Main content background
  secondary: '#1e3a8a', // Deep blue - Sidebar background
  accent: '#3b82f6', // Light blue - Hover effect
  text: '#000000', // Black - Main content text
  sidebarText: '#FFFFFF', // White - Sidebar text
  white: '#FFFFFF',
  // Add more theme variables as needed
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    sidebar: '-2px 0 5px rgba(0, 0, 0, 0.1)', // Soft left shadow for main content
  },
  radius: {
    sm: '0.375rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  transition: {
    fast: 'all 0.2s ease',
    normal: 'all 0.3s ease',
    slow: 'all 0.4s ease',
  },
};

export type Theme = typeof theme;

export default theme; 