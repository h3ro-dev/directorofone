export * from './tokens';

// Utility function to get CSS variable value
export const getCSSVariable = (variable: string): string => {
  if (typeof window !== 'undefined') {
    return getComputedStyle(document.documentElement).getPropertyValue(variable);
  }
  return '';
};

// Utility function to set CSS variable value
export const setCSSVariable = (variable: string, value: string): void => {
  if (typeof window !== 'undefined') {
    document.documentElement.style.setProperty(variable, value);
  }
};

// Theme utilities
export const toggleTheme = (): void => {
  if (typeof window !== 'undefined') {
    const root = document.documentElement;
    root.classList.toggle('dark');
    const isDark = root.classList.contains('dark');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  }
};

export const setTheme = (theme: 'light' | 'dark'): void => {
  if (typeof window !== 'undefined') {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }
};

export const getTheme = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined') {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }
  return 'light';
};

// Initialize theme on load
export const initTheme = (): void => {
  if (typeof window !== 'undefined') {
    const theme = getTheme();
    setTheme(theme);
  }
};