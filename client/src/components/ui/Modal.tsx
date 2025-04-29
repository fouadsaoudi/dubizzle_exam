import { ReactNode } from "react";

interface ModalProps {
	open: boolean;
	onClose: () => void;
	children: ReactNode;
}

export const Modal = ({ open, onClose, children }: ModalProps) => {
	if (!open) return null;

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
			<div className="bg-white rounded-xl shadow-lg w-full max-w-md p-4 relative">
				<button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-black">
					&times;
				</button>
				{children}
			</div>
		</div>
	);
};
