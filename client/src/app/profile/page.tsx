"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import config from "@/global/config";
import api from "@/global/apiRoutes";
import { fetchData } from "@/global/FetchData";
import { Ad } from "@/types/entities";
import Menu from "@/components/Menu";

export default function ProfilePage() {
	const [user, setUser] = useState<null | { username: string }>(null);
	const [ads, setAds] = useState<Ad[]>([]);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchProfileData = async () => {
			const storedUser = localStorage.getItem("user");
			if (!storedUser) {
				router.push("/login");
				return;
			}

			setUser(JSON.parse(storedUser));

			const token = localStorage.getItem("token");
			if (!token) {
				router.push("/login");
				return;
			}

			try {
				const res = await fetchData(config.API_URL + api.MY_ADS, "GET");

				if (res instanceof Response && res.ok) {
					const data = await res.json();
					setAds(data.ads || []);
				} else {
					console.error("Failed to fetch ads.", res);
				}
			} catch (err) {
				console.error("Failed to fetch ads:", err);
			} finally {
				setLoading(false);
			}
		};

		fetchProfileData();
	}, [router]);

	if (loading) {
		return (
			<div className="flex items-center justify-center min-h-screen">
				<div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
			</div>
		);
	}

	return (
		<div>
			<Menu />

			<div className="p-8 min-h-screen bg-gray-50">
				<h1 className="text-3xl font-bold mb-8">My Profile</h1>

				{user && (
					<div className="mb-8">
						<h2 className="text-2xl font-semibold mb-2">Username: {user.username}</h2>
					</div>
				)}

				<div className="mb-8">
					<button
						onClick={() => router.push("/ads/create")}
						className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
					>
						+ Create New Ad
					</button>
				</div>

				<hr className="mb-8" />

				<h2 className="text-2xl font-bold mb-4">My Ads</h2>

				{ads.length === 0 ? (
					<p>No ads posted yet.</p>
				) : (
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{ads.map((ad) => (
							<div
								key={ad.id}
								className="border p-4 rounded shadow hover:shadow-lg transition flex flex-col justify-between"
							>
								<div>
									<div className="flex row mb-2 gap-2">
										<h3 className="text-xl font-bold">{ad.title}</h3>
										<span
											className={`
											inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize
											${ad.status === "approved" ? "bg-green-200 text-green-700" : ""}
											${ad.status === "pending" ? "bg-yellow-100 text-gray-700" : ""}
											${ad.status === "rejected" ? "bg-red-100 text-red-700" : ""}
										`}
										>
											{ad.status}
										</span>
									</div>
									<p className="text-gray-600 mb-2">{ad.description}</p>
									<p className="text-green-600 font-bold">${ad.price}</p>
									{ad.rejection_reason && (
										<div>
											<div className="h-0.5 bg-black"></div>
											<h4>Rejection reason:</h4>
											<p className="text-red-300">{ad.rejection_reason}</p>
										</div>
									)}
								</div>

								{ad.status !== "rejected" && (
									<button
										onClick={() => router.push(`/ads/edit/${ad.id}`)}
										className="mt-4 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
									>
										Edit Ad
									</button>
								)}
							</div>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
