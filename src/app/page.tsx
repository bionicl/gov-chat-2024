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
	const [currentModeMessages, setCurrentModeMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<Partial<FormUserData>>({});
	const [mode, setMode] = useState<
		| "start"
		| "default"
		| "birthDateCollection"
		| "addressCollection"
		| "learnMore"
		| "finished"
	>("start");

	function addNewMessage(role: "assistant" | "user", content: string) {
		setMessages((prevMessages) => {
			return [...prevMessages, { role, content }];
		});
		setCurrentModeMessages((prevMessages) => {
			return [...prevMessages, { role, content }];
		});
	}

	function updateFormData(valuesFromGpt: FormUserData) {
		let modifiedFormData = structuredClone(formData);

		// Loop through all elements and override any with non empty strings
		for (const key in valuesFromGpt) {
			const castKey = key as keyof FormUserData;
			const value = valuesFromGpt[castKey];
			if (value != "") {
				modifiedFormData[castKey] = value;
			}
		}
		setFormData(modifiedFormData);
	}

	async function callApi(message: string) {
		setLoading(true);
		try {
			if (mode === "start") {
				const result = await getParsedNeedPCCForm(message, currentModeMessages);
				addNewMessage("assistant", result?.response_message);
				setLoading(false);
				if (result.doesNeedThisForm) {
					setMode("default");
					setLoading(true);
					const result = await getParsedUserFormData(
						"Chciałbym kupić samochód. Czy możesz pomóc mi wypełnić formularz pcc-3?",
						currentModeMessages
					);
					addNewMessage("assistant", result?.response_message);
					setLoading(false);
				}
			} else if (mode === "default") {
				const result = await getParsedUserFormData(
					message,
					currentModeMessages
				);
				addNewMessage("assistant", result?.response_message);
				updateFormData(result?.userFormData);
				setLoading(false);
			}
			// const result = await getParsedUserFormData(message);
			// updateFormData(result?.userFormData);
			// console.log(result?.userFormData);
			// addNewMessage("assistant", result?.response_message);
			// setLoading(false);
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
