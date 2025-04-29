export const Table = ({ children }: { children: React.ReactNode }) => {
	return (
		<div className="p-5 overflow-x-auto rounded-2xl border border-gray-200 shadow">
			<table className="table-auto min-w-full divide-y divide-gray-200 text-sm text-left bg-white">
				{children}
			</table>
		</div>
	);
};
