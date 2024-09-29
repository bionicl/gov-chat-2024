"use client"; // This is a client component 👈🏽

import {
	getParsedValidateAddress
} from "@/axios/AdditionalData";
import { AdditionalDataDate } from "@/types/AdditionalDataResponse";
import { CalendarDate } from "@/types/CalendarDate";
import { Button, Descriptions, DescriptionsProps, Input, Space } from "antd";
import { useState } from "react";

function GetStringFromCalendarDate(calendarDate : CalendarDate | undefined) : string | undefined {
	if (calendarDate == undefined){
		return "";
	}
	return (calendarDate.rok + "-" + calendarDate.miesiac + "-" + calendarDate.dzien);
}

export default function Page() {
	const [messyValue, setMessyValue] = useState("");

	const [loading, setLoading] = useState(false);
	const [output, setOutput] = useState<AdditionalDataDate | null>(null);

	const items: DescriptionsProps["items"] = [
		{
			key: "1",
			label: "Data",
			children: GetStringFromCalendarDate(output?.calendarDate),
		},
	];

	async function callApi() {
		setLoading(true);
		try {
			const addressValidationResult = await getParsedValidateAddress(
				{ kraj: "Polska",
					wojewodztwo: "Mazowieckie",
					powiat: "Warszawa",
					gmina: "Mokotów",
					miejscowosc: "Warszawa",
					ulica: "Ul. Słoneczna",
					numer_domu: "12",
					numer_mieszkania: "3A",
					kod_pocztowy: "02-100" },
				[]
			);
				console.log(addressValidationResult.response_code);
		} catch (error: any) {
			console.error(error);
			setLoading(false);
		}
	}

	return (
		<Space direction="vertical">
			<Input
				onChange={(e) => setMessyValue(e.target.value)}
				value={messyValue}
			/>
			<Button onClick={callApi} loading={loading} disabled={loading}>
				Submit
			</Button>
			{output !== null && <Descriptions title="User Info" items={items} />}
		</Space>
	);
}
