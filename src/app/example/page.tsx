"use client"; // This is a client component 👈🏽

import { getParsedAddress } from "@/axios/additionalData";
import { AdditionalData } from "@/types/additionalDataResponse";
import { Button, Descriptions, DescriptionsProps, Input, Space } from "antd";
import { useState } from "react";

export default function Page() {
	const [messyValue, setMessyValue] = useState("");

	const [loading, setLoading] = useState(false);
	const [output, setOutput] = useState<AdditionalData | null>(null);

	const items: DescriptionsProps["items"] = [
		{
			key: "1",
			label: "Kraj",
			children: output?.address.kraj,
		},
		{
			key: "2",
			label: "Województwo",
			children: output?.address.wojewodztwo,
		},
		{
			key: "3",
			label: "Powiat",
			children: output?.address.powiat,
		},
		{
			key: "4",
			label: "Gmina",
			children: output?.address.gmina,
		},
		{
			key: "5",
			label: "Miejscowośc",
			children: output?.address.miejscowosc,
		},
		{
			key: "6",
			label: "Ulica",
			children: output?.address.ulica,
		},
		{
			key: "7",
			label: "Numer domu",
			children: output?.address.numer_domu,
		},
		{
			key: "8",
			label: "Numer mieszkania",
			children: output?.address.numer_mieszkania,
		},
		{
			key: "9",
			label: "Kod pocztowy",
			children: output?.address.kod_pocztowy,
		},
	];

	async function callApi() {
		setLoading(true);
		try {
			const result = await getParsedAddress(messyValue);
			console.log(typeof result, result);
			setOutput(result);
			setLoading(false);
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
