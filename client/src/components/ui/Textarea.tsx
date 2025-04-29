import { TextareaHTMLAttributes } from "react";

export const Textarea = (props: TextareaHTMLAttributes<HTMLTextAreaElement>) => {
	return (
		<textarea
			className="w-full p-2 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
			rows={4}
			{...props}
		/>
	);
};
