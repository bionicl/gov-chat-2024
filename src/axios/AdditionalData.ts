import { AdditionalData } from "@/types/AdditionalDataResponse";
import { makeApiCall } from "./apiConfig";
import axios from "axios";

export async function getParsedAddress(messyAddress: string): Promise<AdditionalData> {
	return await makeApiCall<AdditionalData>(() => axios.post("api/chat-city", {prompt: messyAddress}));
}