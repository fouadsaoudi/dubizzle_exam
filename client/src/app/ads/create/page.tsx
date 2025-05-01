"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import config from "@/global/config";
import api from "@/global/apiRoutes";
import { fetchData } from "@/global/FetchData";
import Menu from "@/components/Menu";

export default function CreateAdPage() {
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [location, setLocation] = useState("");
	const [price, setPrice] = useState(1);
	const [subCategories, setSubCategories] = useState<{ id: number; name: string }[]>([]);
	const [subCategoryId, setSubCategoryId] = useState<number | null>(null);
	const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
	const [isLoading, setIsLoading] = useState(true); // 🔐 Add loading state

	const router = useRouter();

	useEffect(() => {
		const init = async () => {
			const user = JSON.parse(localStorage.getItem("user") || "{}");

			if (!user || user.role !== "admin") {
				return router.push("/");
			}

			await fetchSubCategories();
			setIsLoading(false); // ✅ Done checking
		};

		const fetchSubCategories = async () => {
			const res = await fetchData(config.API_URL + api.SUB_CATEGORIES, "GET");
			if (res instanceof Response) {
				const data = await res.json();
				setSubCategories(data.subCategories);
			} else {
				console.error("Error fetching subcategories:", res);
			}
		};

		init();
	}, []);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		try {
			const res = await fetchData(config.API_URL + api.ADS, "POST", {
				title,
				description,
				location,
				price,
				sub_category_id: subCategoryId,
			});

			if (res instanceof Response && res.ok) {
				alert("Ad created successfully!");
				router.push("/");
			} else {
				const data = res instanceof Response ? await res.json() : null;

				// If validation errors exist
				if (data.errors && Array.isArray(data.errors)) {
					const errorsObj: { [key: string]: string } = {};
					data.errors.forEach((error: unknown) => {
						if (typeof error === "object" && error !== null && "path" in error && "msg" in error) {
							errorsObj[error.path as string] = error.msg as string;
						}
					});
					setFormErrors(errorsObj);
				} else {
					alert("Failed to create ad.");
				}
			}
		} catch (error) {
			console.error("Error creating ad:", error);
		}
	};

	// 👁️ Block rendering until check is complete
	if (isLoading) return <p className="text-center p-8">loading...</p>;

	return (
		<div>
			<Menu />

			<div className="max-w-2xl mx-auto p-8">
				<h1 className="text-2xl font-bold mb-6">Create New Ad</h1>
				<form className="flex flex-col gap-4" onSubmit={handleSubmit}>
					<div className="flex flex-col">
						<label htmlFor="title" className="mb-1 font-semibold">
							Title
						</label>
						<input
							id="title"
							type="text"
							className="border p-2 rounded"
							placeholder="Enter ad title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							required
						/>
					</div>

					<div className="flex flex-col">
						<label htmlFor="description" className="mb-1 font-semibold">
							Description
						</label>
						<textarea
							id="description"
							className="border p-2 rounded"
							placeholder="Enter ad description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							required
						/>
					</div>

					<div className="flex flex-col">
						<label htmlFor="location" className="mb-1 font-semibold">
							Location
						</label>
						<input
							id="location"
							type="text"
							className="border p-2 rounded"
							placeholder="Enter location"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
						/>
					</div>

					<div className="flex flex-col">
						<label htmlFor="price" className="mb-1 font-semibold">
							Price
						</label>
						<input
							min={1}
							id="price"
							type="number"
							className="border p-2 rounded"
							placeholder="Enter price"
							value={price}
							onChange={(e) => setPrice(Number(e.target.value))}
							required
						/>
					</div>

					<div className="flex flex-col">
						<label htmlFor="subCategory" className="mb-1 font-semibold">
							Sub-Category
						</label>
						<select
							id="subCategory"
							className="border p-2 rounded"
							value={subCategoryId ?? ""}
							onChange={(e) => setSubCategoryId(Number(e.target.value))}
							required
						>
							<option value="">Select Sub-Category</option>
							{subCategories &&
								subCategories.length > 0 &&
								subCategories.map((sub) => (
									<option key={sub.id} value={sub.id}>
										{sub.name}
									</option>
								))}
						</select>
					</div>

					{formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}

					<button type="submit" className="bg-blue-600 text-white p-2 rounded mt-4">
						Create Ad
					</button>
				</form>
			</div>
		</div>
	);
}
