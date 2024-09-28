import { AxiosError, AxiosResponse } from "axios";

export const makeApiCall = async <T>(
	axiosRequest: () => Promise<AxiosResponse<T>>
): Promise<T> => {
	try {
		const response: AxiosResponse<T> = await axiosRequest();

		// Check if the response status is successful (2xx)
		if (response.status >= 200 && response.status < 300) {
            const data = JSON.parse(response.data as string) as T;
			return data;
		} else {
			throw new Error(response.statusText);
		}
	} catch (error: any) {
		// Check if the error is an AxiosError (network-related)
        const axiosError = error as AxiosError<T>;
		throw new Error(axiosError.message);
	}
};