import type { ButtonHTMLAttributes } from "react";

type ButtonVariant = "solid" | "outline" | "quiet" | "icon" | "filter" | "bag" | "backdrop";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
};

export function Button({ variant = "solid", className = "", ...props }: ButtonProps) {
  return <button className={`store-button store-button--${variant} ${className}`} {...props} />;
}