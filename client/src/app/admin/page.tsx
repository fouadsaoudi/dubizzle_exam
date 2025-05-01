"use client";
import { SetStateAction, useEffect, useState } from "react";
import config from "@/global/config";
import api from "@/global/apiRoutes";
import { fetchData } from "@/global/FetchData";
import { Table } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Textarea } from "@/components/ui/Textarea";
import { Ad } from "@/types/entities";
import Menu from "@/components/Menu";
import { useRouter } from "next/navigation";

interface AdminAd extends Ad {
	posted_by: string;
	sub_category: string;
	parent_ad_id: number | null;
	is_active: boolean;
}

export default function AdminAdsPage() {
	const [ads, setAds] = useState<AdminAd[]>([]);
	const [selectedAd, setSelectedAd] = useState<AdminAd | null>(null);
	const [loading, setLoading] = useState(true);
	const [showModal, setShowModal] = useState(false);
	const [rejectionReason, setRejectionReason] = useState("");
	const router = useRouter();

	useEffect(() => {
		const user = JSON.parse(localStorage.getItem("user") || "{}");

		if (!user || user.role !== "admin") {
			return router.push("/");
		}
		fetchAds();
	}, []);

	const fetchAds = async () => {
		try {
			const res = await fetchData(config.API_URL + api.ADMIN_GET_ALL_ADS, "GET");
			if (res instanceof Response && res.ok) {
				const data = await res.json();
				setAds(data.ads);
			} else {
				console.error("Failed to fetch ads", res);
			}
		} catch (error) {
			console.error("Error fetching ads:", error);
		} finally {
			setLoading(false);
		}
	};

	const updateStatus = async (adId: number, status: string) => {
		try {
			const body = status === "rejected" ? { status, rejection_reason: rejectionReason } : { status };
			const res = await fetchData(config.API_URL + api.UPDATE_AD_STATUS + "/" + adId, "PUT", body);
			if (res instanceof Response && res.ok) {
				fetchAds();
				closeModal();
			} else {
				console.error("Failed to update ad status", res);
				alert("Failed to update status.");
			}
		} catch (error) {
			console.error("Error updating ad status:", error);
			alert("Failed to update status.");
		}
	};

	const openModal = (ad: Ad) => {
		setSelectedAd(ad as AdminAd);
		setShowModal(true);
		setRejectionReason("");
	};

	const closeModal = () => {
		setSelectedAd(null);
		setShowModal(false);
	};

	return loading ? (
		<p> Loading...</p>
	) : (
		<div>
			<Menu />
			<div className="p-4">
				<h1 className="text-xl font-bold mb-4">Moderate Ads</h1>

				<Table>
					<thead className="bg-gray-50">
						<tr>
							<th>ID</th>
							<th>Title</th>
							<th>Description</th>
							<th>User</th>
							<th>Category</th>
							<th>Sub Category</th>
							<th>Price</th>
							<th>Location</th>
							<th>Status</th>
							<th>Rejection Reason</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{ads && ads.length > 0 ? (
							ads.map((ad) => (
								<tr key={ad.id} className="hover:bg-gray-50">
									<td className="px-4 py-2">{ad.id}</td>
									<td className="px-4 py-2">{ad.title}</td>
									<td className="px-4 py-2">{ad.description}</td>
									<td className="px-4 py-2">{ad.posted_by}</td>
									<td className="px-4 py-2">{ad.category}</td>
									<td className="px-4 py-2">{ad.sub_category}</td>
									<td className="px-4 py-2">{ad.price ? `$${ad.price}` : "N/A"}</td>
									<td className="px-4 py-2">{ad.location || "N/A"}</td>
									<td className="px-4 py-2">
										<span
											className={`
											inline-flex px-3 py-1 rounded-full text-xs font-semibold capitalize
											${ad.status === "approved" ? "bg-green-100 text-green-700" : ""}
											${ad.status === "pending" ? "bg-yellow-100 text-gray-700" : ""}
											${ad.status === "rejected" ? "bg-red-100 text-red-700" : ""}
										`}
										>
											{ad.status}
										</span>
									</td>
									<td className="px-4 py-2">{ad.rejection_reason || "—"}</td>
									<td className="px-4 py-2 space-x-2 flex">
										<Button
											onClick={() => updateStatus(ad.id, "approved")}
											disabled={ad.status === "approved"}
											className="text-xs px-3 py-1"
										>
											Approve
										</Button>
										<Button
											onClick={() => openModal(ad)}
											disabled={ad.status === "rejected"}
											variant="secondary"
											className="text-xs px-3 py-1 bg-red-300"
										>
											Reject
										</Button>
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={9} className="text-center py-4 text-gray-400">
									No ads found.
								</td>
							</tr>
						)}
					</tbody>
				</Table>

				<Modal open={showModal} onClose={closeModal}>
					<div className="p-4">
						<h2 className="text-lg font-semibold mb-2">Reject Ad</h2>
						<Textarea
							placeholder="Enter rejection reason"
							value={rejectionReason}
							onChange={(e: { target: { value: SetStateAction<string> } }) =>
								setRejectionReason(e.target.value)
							}
						/>
						<div className="mt-4 flex justify-end space-x-2">
							<Button onClick={closeModal} variant="secondary">
								Cancel
							</Button>
							<Button
								onClick={() => selectedAd && updateStatus(selectedAd.id, "rejected")}
								disabled={!rejectionReason.trim()}
							>
								Reject
							</Button>
						</div>
					</div>
				</Modal>
			</div>
		</div>
	);
}
