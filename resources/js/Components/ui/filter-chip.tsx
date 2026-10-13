import * as React from 'react';
import { badgeVariants } from '@/Components/ui/badge';
import { cn } from '@/Lib/utils';
import type { VariantProps } from 'class-variance-authority';

type BadgeVariant = VariantProps<typeof badgeVariants>['variant'];

export interface FilterChipProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Whether this chip is the active selection. */
  active?: boolean;
  /** Resting variant when not active (defaults to `outline`). */
  variant?: BadgeVariant;
}

/**
 * A filter/toggle chip that is a real, keyboard-focusable button with
 * aria-pressed — the accessible replacement for `<Badge onClick={...}>`.
 * Keeps the badge look by reusing badgeVariants.
 */
export const FilterChip = React.forwardRef<HTMLButtonElement, FilterChipProps>(
  function FilterChip({ active = false, variant = 'outline', className, ...props }, ref) {
    return (
      <button
        ref={ref}
        type="button"
        aria-pressed={active}
        className={cn(
          badgeVariants({ variant: active ? 'default' : variant }),
          'cursor-pointer select-none transition-colors',
          className
        )}
        {...props}
      />
    );
  }
);
