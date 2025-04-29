"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { fetchData } from "@/global/FetchData";
import config from "@/global/config";
import api from "@/global/apiRoutes";

export default function Login() {
	const [username, setUsername] = useState("");
	const [password, setPassword] = useState("");
	const router = useRouter();

	const handleLogin = async (e: { preventDefault: () => void }) => {
		e.preventDefault();
		try {
			const res = await fetchData(config.API_URL + api.LOGIN, "POST", { username, password });

			if (res instanceof Response && res.ok) {
				const data = await res.json();
				localStorage.setItem("token", data.token); // Save token
				localStorage.setItem("user", JSON.stringify(data.user)); // Save user details
				router.push("/");
			} else if (res instanceof Response) {
				const data = await res.json();
				alert(data.message || "Login failed.");
			} else {
				alert("An unexpected error occurred.");
			}
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="bg-blue-500 flex flex-col items-center justify-center min-h-screen p-8">
			<h1 className="text-2xl font-bold mb-6 color-gray-950 ">Login</h1>
			<form className="flex flex-col gap-4 w-80" onSubmit={handleLogin}>
				<input
					className="p-2 rounded bg-white"
					placeholder="Username"
					value={username}
					onChange={(e) => setUsername(e.target.value)}
				/>
				<input
					type="password"
					className="p-2 rounded bg-white"
					placeholder="Password"
					value={password}
					onChange={(e) => setPassword(e.target.value)}
				/>
				<button className="bg-green-600 border cursor-pointer text-white p-2 rounded" type="submit">
					Login
				</button>
			</form>
		</div>
	);
}
