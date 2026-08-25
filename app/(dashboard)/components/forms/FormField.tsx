import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils/cn';
import type { CSSProperties, ReactNode } from 'react';

interface FormFieldProps {
  /** Field name used to build a unique id and wire label ↔ control. */
  name: string;
  label: ReactNode;
  /** Renders the red required marker next to the label. */
  required?: boolean;
  /** Field-level error message, rendered under the control. */
  error?: string;
  className?: string;
  style?: CSSProperties;
  children: ReactNode;
}

/**
 * Labeled field wrapper for dialog forms: renders label (with optional
 * required marker) above and error message below the control. The control
 * itself is passed as children and is expected to use the generated id —
 * `FormField` exports `fieldId(name)` for that, so the label's htmlFor
 * matches without prop-drilling.
 */
export const fieldId = (name: string) => `field-${name}`;

export const FormField = ({
  name,
  label,
  required = false,
  error,
  className,
  style,
  children,
}: FormFieldProps) => (
  <div className={cn('grid gap-2', className)} style={style}>
    <Label htmlFor={fieldId(name)} className='gap-0'>
      {label}
      {required && <span className='text-red-500'>*</span>}
    </Label>
    {children}
    {error && <p className='text-sm text-red-500'>{error}</p>}
  </div>
);
