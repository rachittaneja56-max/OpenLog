import { forwardRef, type ComponentPropsWithoutRef, type ReactNode } from 'react';
import { LoaderCircle } from 'lucide-react';
import { cn } from '../../lib/cn';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';
type ButtonSize = 'small' | 'medium' | 'large';

const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-green text-foreground',
  secondary: 'bg-yellow text-foreground',
  danger: 'bg-danger text-foreground',
  ghost: 'bg-surface text-foreground',
};

const buttonSizes: Record<ButtonSize, string> = {
  small: 'px-3 py-2 text-xs',
  medium: 'px-4 py-3 text-sm',
  large: 'px-6 py-4 text-base',
};

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    className,
    variant = 'primary',
    size = 'medium',
    loading = false,
    children,
    disabled,
    ...props
  },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        'neo-button inline-flex items-center justify-center gap-2',
        buttonVariants[variant],
        buttonSizes[size],
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <LoaderCircle aria-hidden="true" className="animate-spin" size={18} /> : null}
      {children}
    </button>
  );
});

export type IconButtonProps = ComponentPropsWithoutRef<'button'> & {
  label: string;
  size?: ButtonSize;
};

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { className, label, size = 'medium', children, disabled, ...props },
  ref
) {
  return (
    <button
      ref={ref}
      className={cn(
        'neo-button inline-flex items-center justify-center bg-surface',
        buttonSizes[size],
        'disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      type="button"
      aria-label={label}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
});

type FieldProps = {
  id?: string;
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
};

export function FormField({
  id,
  label,
  helperText,
  error,
  required,
  children,
}: FieldProps): JSX.Element {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block font-bold uppercase tracking-wide">
        {label} {required ? <span aria-hidden="true">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="font-mono text-xs font-bold text-danger" role="alert">
          {error}
        </p>
      ) : helperText ? (
        <p className="font-mono text-xs font-bold text-foreground/70">{helperText}</p>
      ) : null}
    </div>
  );
}

type InputExtras = {
  label: string;
  helperText?: string;
  error?: string;
  required?: boolean;
};

type TextInputProps = ComponentPropsWithoutRef<'input'> & InputExtras;

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(function TextInput(
  { id, label, helperText, error, required, className, ...props },
  ref
) {
  return (
    <FormField id={id} label={label} helperText={helperText} error={error} required={required}>
      <input
        ref={ref}
        id={id}
        className={cn('neo-input', error && 'neo-input-error', className)}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    </FormField>
  );
});

type TextareaProps = ComponentPropsWithoutRef<'textarea'> & InputExtras;

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { id, label, helperText, error, required, className, ...props },
  ref
) {
  return (
    <FormField id={id} label={label} helperText={helperText} error={error} required={required}>
      <textarea
        ref={ref}
        id={id}
        className={cn('neo-input min-h-28 resize-y', error && 'neo-input-error', className)}
        aria-invalid={error ? true : undefined}
        {...props}
      />
    </FormField>
  );
});

export const NumberInput = forwardRef<HTMLInputElement, TextInputProps>(
  function NumberInput(props, ref) {
    return <TextInput ref={ref} type="number" inputMode="numeric" {...props} />;
  }
);

type SelectOption = { label: string; value: string };
type SelectProps = ComponentPropsWithoutRef<'select'> & InputExtras & { options: SelectOption[] };

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { id, label, helperText, error, required, className, options, ...props },
  ref
) {
  return (
    <FormField id={id} label={label} helperText={helperText} error={error} required={required}>
      <select
        ref={ref}
        id={id}
        className={cn('neo-input', error && 'neo-input-error', className)}
        aria-invalid={error ? true : undefined}
        {...props}
      >
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
});
