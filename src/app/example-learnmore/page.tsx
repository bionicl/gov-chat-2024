"use client"; // This is a client component 👈🏽

import { getParsedLearnMore } from "@/axios/AdditionalData";
import { AdditionalDataLearnMore } from "@/types/AdditionalDataResponse";
import { Button, Descriptions, DescriptionsProps, Input, Space } from "antd";
import { useState } from "react";

export default function Page() {
	const [messyValue, setMessyValue] = useState("");

	const [loading, setLoading] = useState(false);
	const [output, setOutput] = useState<AdditionalDataLearnMore | null>(null);

	console.log(output?.href)

	const items: DescriptionsProps["items"] = [
		{
			key: "1",
			label: "link",
			children: output?.href,
		},
		{
			key: "2",
			label: "Respone",
			children: output?.response_message,
		},
	];

	async function callApi() {
		setLoading(true);
		try {
			const result = await getParsedLearnMore(messyValue);
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
