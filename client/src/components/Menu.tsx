"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import config from "@/global/config";
import api from "@/global/apiRoutes";
import { fetchData } from "@/global/FetchData";

export default function Navbar() {
	const [user, setUser] = useState<null | { username: string; role: string }>(null);
	const [loading, setLoading] = useState(true);
	const router = useRouter();

	useEffect(() => {
		const fetchUserData = async () => {
			const storedUser = localStorage.getItem("user");
			if (storedUser) {
				setUser(JSON.parse(storedUser));
				setLoading(false);
				return;
			}

			const token = localStorage.getItem("token");
			if (!token) {
				setLoading(false);
				return;
			}

			try {
				const res = await fetchData(config.API_URL + api.ME, "POST");

				if (res instanceof Response && res.ok) {
					const data = await res.json();
					setUser(data.user);
					localStorage.setItem("user", JSON.stringify(data.user));
				} else {
					localStorage.removeItem("token");
					localStorage.removeItem("user");
				}
			} catch (error) {
				console.error("Failed to fetch user data:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchUserData();
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		setUser(null);
		router.push("/");
		router.refresh();
	};

	const handleProfile = () => {
		router.push("/profile"); // 👈 Navigate to /profile
	};

	const handleAdmin = () => {
		router.push("/admin"); // 👈 Navigate to /admin
	};

	return (
		<nav className="sticky top-0 w-full bg-white shadow-md p-4 flex justify-between items-center">
			<div className="text-xl font-bold text-blue-600 cursor-pointer" onClick={() => router.push("/")}>
				Dubizzle
			</div>

			<div className="flex gap-4 items-center">
				{loading ? (
					<div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
				) : user ? (
					<>
						<span className="text-gray-700">
							Welcome, <span className="font-semibold">{user.username}</span>!
						</span>

						{/* Admin Button */}
						{user.role === "admin" && (
							<button
								onClick={handleAdmin}
								className="px-4 py-2 cursor-pointer bg-blue-500 hover:bg-blue-600 text-white rounded transition"
							>
								Dashboard
							</button>
						)}

						{/* Profile Button */}
						<button
							onClick={handleProfile}
							className="px-4 py-2 cursor-pointer bg-yellow-500 hover:bg-yellow-600 text-white rounded transition"
						>
							Profile
						</button>

						<button
							onClick={handleLogout}
							className="px-4 py-2 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded transition"
						>
							Logout
						</button>
					</>
				) : (
					<>
						<a
							href="/register"
							className="px-4 cursor-pointer py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition"
						>
							Register
						</a>
						<a
							href="/login"
							className="px-4 py-2 cursor-pointer bg-green-500 hover:bg-green-600 text-white rounded transition"
						>
							Login
						</a>
					</>
				)}
			</div>
		</nav>
	);
}
