import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary';
}

export const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    className = '',
    disabled,
    children,
    ...props
}) => {
    const baseStyles = 'px-4 py-2 text-sm font-medium rounded-md transition-colors';

    const variantStyles = {
        primary: `text-white ${disabled
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-blue-600 hover:bg-blue-700'
            }`,
        secondary: 'text-gray-700 bg-gray-100 hover:bg-gray-200',
    };

    return (
        <button
            className={`${baseStyles} ${variantStyles[variant]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}; 