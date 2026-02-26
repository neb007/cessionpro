export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const calculatePasswordStrength = (password) => {
  let strength = 0;
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;
  if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;
  return Math.min(strength, 5);
};

export const getPasswordStrengthColor = (strength) => {
  if (strength === 0) return 'bg-muted';
  if (strength <= 2) return 'bg-destructive';
  if (strength <= 3) return 'bg-warning';
  return 'bg-success';
};

export const getPasswordStrengthTextColor = (strength) => {
  if (strength <= 2) return 'text-destructive';
  if (strength <= 3) return 'text-warning';
  return 'text-success';
};

export const getPasswordStrengthText = (strength, language) => {
  if (strength === 0) return '';
  const texts = {
    fr: ['Très faible', 'Faible', 'Moyen', 'Fort', 'Très fort'],
    en: ['Very weak', 'Weak', 'Fair', 'Strong', 'Very strong']
  };
  return (texts[language] || texts.en)[strength - 1];
};

export const AUTH_INPUT_CLASS = 'rounded-xl border-2 border-border bg-muted px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:bg-white focus:outline-none transition';
