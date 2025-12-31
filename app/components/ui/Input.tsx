// Input Component - Text inputs, search, password with icons
import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', label, error, hint, icon, iconPosition = 'left', type, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    const baseStyles = `
      w-full px-4 py-3 
      bg-white border rounded-lg
      text-charcoal placeholder-charcoal-muted/50
      transition-all duration-200
      focus:outline-none focus:ring-2 focus:ring-kizuna-green/20 focus:border-kizuna-green
      disabled:opacity-50 disabled:cursor-not-allowed
    `;

    const errorStyles = error
      ? 'border-red-400 focus:ring-red-200 focus:border-red-400'
      : 'border-gray-200';

    const iconPadding = icon
      ? iconPosition === 'left'
        ? 'pl-11'
        : 'pr-11'
      : '';

    const passwordPadding = isPassword ? 'pr-11' : '';

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-charcoal mb-1.5">
            {label}
          </label>
        )}

        <div className="relative">
          {icon && iconPosition === 'left' && (
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted">
              {icon}
            </div>
          )}

          <input
            ref={ref}
            type={inputType}
            className={`${baseStyles} ${errorStyles} ${iconPadding} ${passwordPadding} ${className}`}
            {...props}
          />

          {icon && iconPosition === 'right' && !isPassword && (
            <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted">
              {icon}
            </div>
          )}

          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-charcoal-muted hover:text-charcoal transition-colors"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>

        {error && (
          <p className="mt-1.5 text-sm text-red-500">{error}</p>
        )}

        {hint && !error && (
          <p className="mt-1.5 text-sm text-charcoal-muted">{hint}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// OTP Input for verification codes
export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}

export function OtpInput({ length = 6, value, onChange, error }: OtpInputProps) {
  const handleChange = (index: number, digit: string) => {
    if (!/^\d*$/.test(digit)) return; // Only allow digits

    const newValue = value.split('');
    newValue[index] = digit;
    const result = newValue.join('').slice(0, length);
    onChange(result);

    // Auto-focus next input
    if (digit && index < length - 1) {
      const next = document.getElementById(`otp-${index + 1}`);
      next?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      const prev = document.getElementById(`otp-${index - 1}`);
      prev?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    onChange(pasted);
  };

  return (
    <div>
      <div className="flex gap-2 justify-center">
        {Array.from({ length }).map((_, i) => (
          <input
            key={i}
            id={`otp-${i}`}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[i] || ''}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={handlePaste}
            className={`
              w-12 h-14 text-center text-xl font-semibold
              bg-white border rounded-lg
              text-charcoal
              transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-kizuna-green/20 focus:border-kizuna-green
              ${error ? 'border-red-400' : 'border-gray-200'}
            `}
          />
        ))}
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-500 text-center">{error}</p>
      )}
    </div>
  );
}

