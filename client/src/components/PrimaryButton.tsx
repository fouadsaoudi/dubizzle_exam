// PrimaryButton.js (Client Component)
"use client"; // Marks this file as a client-side component

import React from "react";

export default function PrimaryButton({
	label,
	onClick,
	className,
}: {
	label: string;
	onClick?: () => void; // Optional onClick since it can be undefined
	className?: string;
}) {
	// Default onClick if no handler is provided
	const handleClick = onClick || (() => alert("Button clicked!"));

	return (
		<button
			className={`rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto ${className}`}
			onClick={handleClick}
		>
			{label}
		</button>
	);
}
