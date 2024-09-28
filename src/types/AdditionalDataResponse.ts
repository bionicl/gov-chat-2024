import { Address } from "./Address";
import { CalendarDate } from "./CalendarDate";

export type AdditionalDataAddress = {
	response_code: "success" | "need_more_data" | "success_but_unsure" | "failed";
	response_message: string;
	address: Address;
};

export type AdditionalDataDate = {
	response_code: "success" | "need_more_data" | "success_but_unsure" | "failed";
	response_message: string;
	calendarDate: CalendarDate;
};

export type AdditionalDataNeedsPCCForm = {
	response_code: "success" | "need_more_data" | "success_but_unsure" | "failed";
	response_message: string;
	doesNeedThisForm: boolean;
};