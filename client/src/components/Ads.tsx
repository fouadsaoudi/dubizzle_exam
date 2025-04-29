"use client";

import { useEffect, useState } from "react";
import config from "@/global/config";
import api from "@/global/apiRoutes";
import { fetchData } from "@/global/FetchData";

type Ad = {
	id: number;
	title: string;
	description: string;
	location: string;
	price: string;
	status: "pending" | "approved" | "rejected";
	category_name: string;
	sub_category_name: string;
	created_at: string;
};

export default function Ads() {
	const [ads, setAds] = useState<Ad[]>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const fetchAds = async () => {
			try {
				const res = await fetchData(config.API_URL + api.ADS, "GET");
				if (res instanceof Response && res.ok) {
					const data = await res.json();
					setAds(data.ads); // Assuming backend sends { ads: [...] }
				} else {
					console.error("Failed to fetch ads", res);
				}
			} catch (error) {
				console.error("Error fetching ads:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchAds();
	}, []);

	if (loading) {
		return <div>Loading ads...</div>;
	}

	if (ads.length === 0) {
		return <div>No ads available.</div>;
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
			{ads &&
				ads.length > 0 &&
				ads.map((ad) => (
					<div key={ad.id} className="border p-4 rounded shadow hover:shadow-lg transition">
						<h2 className="text-xl font-semibold mb-2">{ad.title}</h2>
						<p className="text-gray-600 mb-2">{ad.description?.substring(0, 100) || "No description."}</p>
						<div className="flex direction-row gap-2">
							<div className="text-sm text-gray-500 mb-2 bg-red-500 text-white p-1 rounded w-auto w-fit">
								{ad.category_name || ""}
							</div>
							<div className="text-sm text-gray-500 mb-2 bg-blue-500 text-white p-1 rounded w-auto w-fit">
								{ad.sub_category_name || ""}
							</div>
						</div>
						<div className="text-sm text-gray-500 mb-2">{ad.location || "Unknown location"}</div>
						<div className="text-lg font-bold mb-2">${parseFloat(ad.price).toFixed(2)}</div>
					</div>
				))}
		</div>
	);
}
