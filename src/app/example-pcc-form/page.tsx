"use client"; // This is a client component 👈🏽

import { getParsedNeedPCCForm } from "@/axios/AdditionalData";
import { AdditionalDataNeedsPCCForm } from "@/types/AdditionalDataResponse";
import { Button, Descriptions, DescriptionsProps, Input, Space } from "antd";
import { useState } from "react";

export default function Page() {
	const [messyValue, setMessyValue] = useState("");

	const [loading, setLoading] = useState(false);
	const [output, setOutput] = useState<AdditionalDataNeedsPCCForm | null>(null);

	const items: DescriptionsProps["items"] = [
		{
			key: "1",
			label: "potrzebuje pcc",
			children: output?.doesNeedThisForm ? "Tak" : "Nie",
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
			const result = await getParsedNeedPCCForm(messyValue);
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
