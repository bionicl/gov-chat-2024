"use client"; // This is a client component 👈🏽

import { getParsedAddress } from "@/axios/AdditionalData";
import ChatArea from "@/components/ChatArea";
import InputArea from "@/components/InputArea";
import TopBar from "@/components/TopBar";
import { Message } from "@/types/message";
import { Card, Flex } from "antd";
import { useState } from "react";

export default function Home() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<Partial<FormData>>({});
	const [mode, setMode] = useState<"start" | "gatherData" | "finished">();

	function addNewMessage(role: "assistant" | "user", content: string) {
		setMessages((prevMessages) => {
			return [...prevMessages, { role, content }];
		});
	}

	async function callApi(message: string) {
		setLoading(true);
		try {
			const result = await getParsedAddress(message);
			addNewMessage("assistant", result.address.kraj ?? "Nie wiem");
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
