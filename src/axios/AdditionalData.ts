import { AdditionalData } from "@/types/AdditionalDataResponse";
import axios from "axios";
import { makeApiCall } from "./apiConfig";

export async function getParsedAddress(
	messyAddress: string
): Promise<AdditionalData> {
	return await makeApiCall<AdditionalData>(() =>
		axios.post("api/chat-city", { prompt: messyAddress })
	);
}
