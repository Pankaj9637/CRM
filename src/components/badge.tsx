import React from 'react';
import { cn } from '@/lib/utils';

export type BadgeVariant =
  | 'verified'
  | 'told'
  | 'claim'
  | 'unknown'
  | 'ally'
  | 'warm'
  | 'neutral'
  | 'critical'
  | 'high'
  | 'medium'
  | 'open'
  | 'cleared'
  | 'won'
  | 'default';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant | string;
  size?: 'sm' | 'md';
}

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className,
  ...props
}: BadgeProps) {
  const getVariantStyles = (v: string) => {
    switch (v.toLowerCase()) {
      case 'verified':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'told':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'claim':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'unknown':
        return 'bg-slate-100 text-slate-600 border-slate-200';
      case 'ally':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'warm':
        return 'bg-sky-100 text-sky-800 border-sky-300';
      case 'neutral':
        return 'bg-slate-100 text-slate-700 border-slate-300';
      case 'critical':
      case 'immediate':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-semibold';
      case 'high':
      case 'this_week':
        return 'bg-amber-100 text-amber-800 border-amber-300 font-medium';
      case 'medium':
      case 'this_month':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'open':
        return 'bg-rose-50 text-rose-700 border-rose-200 font-medium';
      case 'cleared':
      case 'won':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200 font-medium';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium transition-colors',
        getVariantStyles(variant),
        sizeStyles,
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
