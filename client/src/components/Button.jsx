import React from 'react';
import '../styles/variables.css';
import '../styles/Button.css';

export default function Button({
    children,
    onClick,
    type = 'button',
    disabled = false,
    className = '',
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`btn ${className}`}>
            {children}
        </button>
    );
}