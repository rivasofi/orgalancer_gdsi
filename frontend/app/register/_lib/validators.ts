export function getPasswordStrength(password: string) {
  if (!password) return null;

  const checks = [
    /[a-z]/.test(password),
    /[A-Z]/.test(password),
    /\d/.test(password),
    password.length >= 8,
  ];
  const score = checks.filter(Boolean).length;

  if (score <= 2) return { label: "Débil",  color: "bg-red-400",    width: "w-1/3" };
  if (score === 3) return { label: "Media",  color: "bg-yellow-400", width: "w-2/3" };
  return             { label: "Fuerte", color: "bg-green-500",  width: "w-full" };
}

export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;