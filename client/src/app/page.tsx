"use client";

import Menu from "@/components/Menu"; // ✅ import the menu

import Ads from "@/components/Ads"; // ✅ import Ads component

export default function Page() {
	return (
		<div className="flex flex-col min-h-screen">
			<Menu />

			<main className="flex flex-col items-center justify-center flex-grow p-8">
				<h1 className="text-3xl font-bold mb-6">List of Ads</h1>
				<Ads /> {/* 👈 dynamic ads list */}
			</main>
		</div>
	);
}
