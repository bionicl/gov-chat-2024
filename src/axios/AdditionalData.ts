import { AdditionalDataAddress, AdditionalDataDate, AdditionalDataNeedsPCCForm } from "@/types/AdditionalDataResponse";
import axios from "axios";
import { makeApiCall } from "./apiConfig";

export async function getParsedAddress(
	messyAddress: string
): Promise<AdditionalDataAddress> {
	return await makeApiCall<AdditionalDataAddress>(() =>
		axios.post("api/chat-city", { prompt: messyAddress })
	);
}

export async function getParsedDate(
	messyAddress: string
): Promise<AdditionalDataDate> {
	return await makeApiCall<AdditionalDataDate>(() =>
		axios.post("api/chat-date", { prompt: messyAddress })
	);
}

export async function getParsedNeedPCCForm(
	messyAddress: string
): Promise<AdditionalDataNeedsPCCForm> {
	return await makeApiCall<AdditionalDataNeedsPCCForm>(() =>
		axios.post("api/chat-needspccform", { prompt: messyAddress })
	);
}
