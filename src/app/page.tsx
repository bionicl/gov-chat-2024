"use client"; // This is a client component 👈🏽

import { getParsedAddress } from "@/axios/AdditionalData";
import ChatMessage from "@/components/ChatMessage";
import { Message } from "@/types/message";
import {
	Button,
	Card,
	Flex,
	Form,
	Image,
	Input,
	Space,
	Typography,
} from "antd";
import { useState } from "react";

const { Title } = Typography;

export default function Home() {
	const [messages, setMessages] = useState<Message[]>([]);
	const [inputMessage, setInputMessage] = useState("");
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState<Partial<FormData>>({});

	async function callApi(message: string) {
		setLoading(true);
		try {
			const result = await getParsedAddress(message);
			newAssistantMessage(result.address.kraj ?? "Nie wiem");
		} catch (error: any) {
			console.error(error);
			setLoading(false);
		}
	}

	function submitMessage() {
		if (loading) {
			return;
		}

		setMessages([...messages, { role: "user", content: inputMessage }]);

		setLoading(true);
		callApi(inputMessage);
		setInputMessage("");
	}

	function newAssistantMessage(content: string) {
		setMessages((prevMessages) => {
			return [...prevMessages, { role: "assistant", content }];
		});
		setLoading(false);
	}

	return (
		<>
			<div
				style={{
					width: "100vw",
					minHeight: 96,
					backgroundColor: "rgb(220, 0, 50)",
				}}
			>
				<Flex align="center">
					<Image
						preview={false}
						width="96"
						src={"/images/logo.svg"}
						alt="Przejdź do strony głównej serwisu"
					/>
					<span
						style={{ fontFamily: "Amethysta", fontSize: 38, color: "white" }}
					>
						podatki.gov.pl
					</span>
				</Flex>
			</div>
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
					<div
						style={{
							height: "calc(100vh - 96px - 96px - 48px - 16px - 40px)",
							overflowY: "scroll",
							overflowX: "hidden",
						}}
					>
						<Space direction="vertical" style={{ width: "100%" }} size={40}>
							{messages.length > 0 ? (
								<>
									{messages.map((message, index) => {
										return (
											<ChatMessage
												key={index}
												role={message.role}
												content={message.content}
											/>
										);
									})}
								</>
							) : (
								<>
									<Title
										level={3}
										style={{
											marginTop: 32,
											fontFamily: "Montserrat, sans-serif",
											fontWeight: 700,
											textAlign: "center",
										}}
									>
										Skorzystaj z pomocy asystenta podatkowego
									</Title>
									<Image
										src={"/images/placeholder_image.png"}
										preview={false}
									/>
								</>
							)}
							{loading && <ChatMessage role={"assistant"} content="..." />}
						</Space>
					</div>
					<Form
						onFinish={() => {
							submitMessage();
						}}
					>
						<Flex gap={10} style={{ marginTop: 16, width: "100%" }}>
							<Input
								variant="filled"
								size="large"
								placeholder="Zapytaj asystenta..."
								value={inputMessage}
								onChange={(e) => setInputMessage(e.target.value)}
								disabled={loading}
							/>
							{/* <Form.Item> */}
							<Button
								style={{ height: 40, paddingInline: 24 }}
								type="primary"
								disabled={loading || inputMessage.length === 0}
								loading={loading}
								onClick={submitMessage}
							>
								Wyślij
							</Button>
							{/* </Form.Item> */}
						</Flex>
					</Form>
				</Card>
			</Flex>
		</>
	);
}
