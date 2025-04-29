// Define the return type for the function (response from the fetch API)
type FetchResponse = Response;

export const fetchData = async (
	url: string,
	method: "GET" | "POST" | "PUT" | "DELETE",
	body: unknown = null
): Promise<FetchResponse | Error> => {
	try {
		console.debug("fetchData debug", url, method);

		const headers: HeadersInit = {
			Accept: "application/json",
		};

		const token = localStorage.getItem("token");

		if (token) {
			headers.Authorization = `Bearer ${token}`;
		}

		const options: RequestInit = {
			method: method,
			headers: headers,
		};

		if (method !== "GET") {
			if (body instanceof FormData) {
				// If body is FormData, do not set Content-Type header
				delete headers["Content-Type"];
				options.body = body;
			} else {
				headers["Content-Type"] = "application/json";
				options.body = JSON.stringify(body);
			}
		}

		const response = await fetch(url, options);

		// 🔥 Handle Unauthorized globally
		if (response.status === 401) {
			console.warn("Token expired or invalid. Redirecting to login...");

			// Optional: Clear token from localStorage
			localStorage.removeItem("token");

			// Redirect to login page
			window.location.href = "/login";

			// Important: Return an error to prevent further processing
			return new Error("Unauthorized. Redirecting to login.");
		}

		return response;
	} catch (error) {
		console.error("Error: fetchData", error);
		return error as Error;
	}

	// Default return
	return new Error("Unexpected error occurred in fetchData.");
};
