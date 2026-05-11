import { getPasswordStrength } from "../_lib/validators";

interface Props {
  password: string;
}

export default function PasswordStrength({ password }: Props) {
  if (!password) return null;

  const strength = getPasswordStrength(password);

  const text_color =
    strength?.label === "Débil"  ? "text-red-500"    :
    strength?.label === "Media"  ? "text-yellow-500" :
                                   "text-green-500";

  return (
    <div className="mt-2">
      <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${strength?.color} ${strength?.width}`}
        />
      </div>
      <p className={`text-xs mt-1 ${text_color}`}>{strength?.label}</p>
    </div>
  );
}