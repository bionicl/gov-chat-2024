import { Address } from "./address";
import { CalendarDate } from "./CalendarDate";
import { FormUserData } from "./formData";

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

export type AdditionalDataLearnMore = {
	response_code: "success" | "need_more_data" | "success_but_unsure" | "failed";
	response_message: string;
	href: string;
};

export type AdditionalDataUserFormData = {
	response_code: "success" | "need_more_data" | "success_but_unsure" | "failed";
	response_message: string;
	nextMode: "default" | "addressCollection" | "learnMore" | "finished";
	userForm: FormUserData;
};

export type AdditionalAddressValidationData = {
	response_code: string;
};