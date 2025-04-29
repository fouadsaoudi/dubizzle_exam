import { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
	variant?: "primary" | "secondary";
}

export const Button = ({ variant = "primary", className = "", ...props }: ButtonProps) => {
	const base =
		"px-4 py-2 rounded-2xl font-semibold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed";
	const variants = {
		primary: "bg-blue-600 text-white hover:bg-blue-700",
		secondary: "bg-gray-200 text-black hover:bg-gray-300",
	};

	return (
		<button className={`${base} ${variants[variant]} ${className}`} {...props}>
			{props.children}
		</button>
	);
};
