import { Address } from "./address";

export type AdditionalData = {
	response_code: "success" | "need_more_data" | "success_but_unsure" | "failed";
	response_message: string;
	address: Address;
};
