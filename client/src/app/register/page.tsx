"use client";

import api from "@/global/apiRoutes";
import config from "@/global/config";
import { fetchData } from "@/global/FetchData";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
	const router = useRouter();
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const [errors, setErrors] = useState<{ username?: string; password?: string }>({});

	const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;

	const validate = () => {
		const newErrors: typeof errors = {};

		if (username.trim().length < 3) {
			newErrors.username = "Username must be at least 3 characters.";
		}

		if (!passwordRegex.test(password)) {
			newErrors.password =
				"Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!validate()) return;

		try {
			const res = await fetchData(config.API_URL + api.REGISTER, "POST", { username, password });

			if (res instanceof Response && res.ok) {
				router.push("/login");
			} else if (res instanceof Response) {
				const data = await res.json();
				alert(data.message || "Registration failed.");
			} else {
				alert("An unexpected error occurred.");
			}
		} catch (error) {
			console.error(error);
		}
	};

	return (
		<div className="flex flex-col items-center justify-center min-h-screen p-8">
			<h1 className="text-2xl font-bold mb-6">Register</h1>
			<form className="flex flex-col gap-4 w-80" onSubmit={handleSubmit}>
				<input
					className="border p-2 rounded"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				{errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}

				<input
					type="password"
					className="border p-2 rounded"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				{errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}

				<button className="bg-blue-600 text-white p-2 rounded" type="submit">
					Register
				</button>
			</form>
		</div>
	);
}
