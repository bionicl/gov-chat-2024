import { AdditionalDataAddress, AdditionalDataDate, AdditionalDataLearnMore, AdditionalDataNeedsPCCForm, AdditionalDataUserFormData } from "@/types/AdditionalDataResponse";
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

export async function getParsedLearnMore(
	messyAddress: string
): Promise<AdditionalDataLearnMore> {
	return await makeApiCall<AdditionalDataLearnMore>(() =>
		axios.post("api/chat-learnmore", { prompt: messyAddress })
	);
}

export async function getParsedUserFormData(
	messyAddress: string
): Promise<AdditionalDataUserFormData> {
	return await makeApiCall<AdditionalDataUserFormData>(() =>
		axios.post("api/chat-learnmore", { prompt: messyAddress })
	);
}