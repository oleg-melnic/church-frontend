import React from "react";

interface ButtonProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
  size?: "default" | "large";
  className?: string;
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "primary",
  size = "default",
  className = "",
  onClick,
}) => {
  const sizeClasses = {
    default: "px-4 py-2.5 text-base",
    large: "px-6 py-3.5 text-lg",
  };

  const baseClasses =
    "text-white bg-amber-600 rounded-lg cursor-pointer border-[none]";
  const displayClasses = className.includes("mx-auto") ? className : "";

  const variantClasses = {
    primary: "text-white bg-amber-600",
    secondary: "text-amber-700 bg-white",
  };

  return (
    <button
      className={`${sizeClasses[size]} ${baseClasses} ${displayClasses}  ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;
