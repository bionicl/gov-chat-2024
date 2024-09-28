"use client"; // This is a client component 👈🏽

import {
	getParsedNeedPCCForm,
	getParsedUserFormData,
} from "@/axios/AdditionalData";
import ChatArea from "@/components/ChatArea";
import InputArea from "@/components/InputArea";
import TopBar from "@/components/TopBar";
import { FormUserData } from "@/types/formData";
import { Message } from "@/types/message";
import { Card, Flex, Typography } from "antd";
import { useState } from "react";

export default function Home() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<Partial<FormUserData>>({});
	const [mode, setMode] = useState<"start" | "gatherData" | "finished">(
		"start"
	);

	function addNewMessage(role: "assistant" | "user", content: string) {
		setMessages((prevMessages) => {
			return [...prevMessages, { role, content }];
		});
	}

	function updateFormData(valuesFromGpt: FormUserData) {
		let modifiedFormData = structuredClone(formData);

		if (valuesFromGpt.p20 != "") {
			modifiedFormData.p20 == valuesFromGpt.p20;
		}

		setFormData(modifiedFormData);
	}

	async function callApi(message: string) {
		setLoading(true);
		try {
			if (mode === "start") {
				const result = await getParsedNeedPCCForm(message);
				addNewMessage("assistant", result?.response_message);
				if (result.doesNeedThisForm) {
					setMode("gatherData");
				}
			}
			const result = await getParsedUserFormData(message);
			// addNewMessage("assistant", result?.userFormData);
			updateFormData(result?.userFormData);
			setLoading(false);
		} catch (error: any) {
			console.error(error);
			setLoading(false);
		}
	}

	function userActionAskQuestion() {
		if (loading) {
			return;
		}

		// Add user message
		addNewMessage("user", inputMessage);
		setInputMessage("");

		// Send API request
		setLoading(true);
		callApi(inputMessage);
	}

	return (
		<>
			<TopBar />
			<Typography.Text type="danger">{mode}</Typography.Text>
			<Flex
				align="center"
				justify="center"
				style={{ height: "calc(100vh - 96px)", width: "100vw" }}
			>
				<Card
					style={{
						width: 600,
						height: "calc(100% - 96px)",
						position: "relative",
					}}
					bordered={false}
				>
					<ChatArea messages={messages} loading={loading} />
					<InputArea
						inputMessage={inputMessage}
						setInputMessage={setInputMessage}
						loading={loading}
						userActionAskQuestion={userActionAskQuestion}
					/>
				</Card>
			</Flex>
		</>
	);
}
