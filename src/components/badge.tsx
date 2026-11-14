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
  | 'brand'
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
      case 'cleared':
      case 'won':
        return 'bg-[#3A7A65]/20 text-[#5eead4] border-[#3A7A65]/50';
      case 'told':
        return 'bg-[#D9A441]/20 text-[#fde047] border-[#D9A441]/50';
      case 'claim':
        return 'bg-[#EC7D42]/20 text-[#fdba74] border-[#EC7D42]/50';
      case 'unknown':
        return 'bg-[#2E2E2E] text-[#999999] border-[#3D3D3D]';
      case 'ally':
        return 'bg-[#3A7A65]/25 text-[#4ade80] border-[#3A7A65]/60';
      case 'warm':
        return 'bg-[#3E6F9E]/25 text-[#7dd3fc] border-[#3E6F9E]/60';
      case 'neutral':
        return 'bg-[#2E2E2E] text-[#a3a3a3] border-[#3D3D3D]';
      case 'critical':
      case 'danger':
      case 'open':
      case 'immediate':
        return 'bg-[#F43F5E]/20 text-[#fda4af] border-[#F43F5E]/50 font-semibold';
      case 'high':
      case 'this_week':
        return 'bg-[#D95B28]/25 text-[#ffedd5] border-[#D95B28]/60 font-semibold';
      case 'medium':
      case 'this_month':
        return 'bg-[#D9A441]/20 text-[#fef08a] border-[#D9A441]/50';
      case 'brand':
        return 'bg-[#D95B28] text-white border-[#D95B28] font-semibold';
      default:
        return 'bg-[#2E2E2E] text-[#D6D6D6] border-[#3D3D3D]';
    }
  };

  const sizeStyles = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full border font-medium transition-colors tracking-wide',
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
