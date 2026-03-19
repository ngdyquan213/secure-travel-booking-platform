import React from 'react';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading = false, className, ...props }, ref) => {
    const baseStyles = 'font-medium transition-all duration-200 rounded-lg flex items-center justify-center gap-2';
    
    const variants = {
      primary: 'bg-primary text-white hover:bg-primary-dark disabled:bg-gray-400',
      secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 disabled:bg-gray-300',
      outline: 'border-2 border-primary text-primary hover:bg-primary hover:text-white disabled:border-gray-400 disabled:text-gray-400',
      ghost: 'text-primary hover:bg-gray-100 disabled:text-gray-400',
    };

    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2.5 text-base',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={clsx(baseStyles, variants[variant], sizes[size], className)}
        disabled={loading || props.disabled}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
        )}
        {props.children}
      </button>
    );
  }
);

Button.displayName = 'Button';
