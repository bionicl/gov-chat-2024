import {
	AdditionalDataDate,
	AdditionalDataLearnMore,
	AdditionalDataNeedsPCCForm,
	AdditionalDataUserFormData,
} from "@/types/AdditionalDataResponse";
import { Message } from "@/types/message";
import axios from "axios";
import { makeApiCall } from "./apiConfig";

export async function getParsedDate(
	messyDate: string,
	previousInput: Message[]
): Promise<AdditionalDataDate> {
	return await makeApiCall<AdditionalDataDate>(() =>
		axios.post("api/chat-date", { prompt: messyDate, previousInput })
	);
}

export async function getParsedNeedPCCForm(
	input: string,
	previousInput: Message[]
): Promise<AdditionalDataNeedsPCCForm> {
	return await makeApiCall<AdditionalDataNeedsPCCForm>(() =>
		axios.post("api/chat-needspccform", { prompt: input, previousInput })
	);
}

export async function getParsedLearnMore(
	info: string,
	previousInput: Message[]
): Promise<AdditionalDataLearnMore> {
	return await makeApiCall<AdditionalDataLearnMore>(() =>
		axios.post("api/chat-learnmore", { prompt: info, previousInput })
	);
}

export async function getParsedUserFormData(
	input: string,
	previousInput: Message[]
): Promise<AdditionalDataUserFormData> {
	return await makeApiCall<AdditionalDataUserFormData>(() =>
		axios.post("api/chat-general", { prompt: input, previousInput })
	);
}
