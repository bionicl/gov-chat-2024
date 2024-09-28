"use client"; // This is a client component 👈🏽

import ChatMessage from "@/components/ChatMessage";
import { Button, Card, Flex, Image, Input, Space } from "antd";

export default function Home() {
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
					style={{ width: 500, height: 600, position: "relative" }}
					bordered={false}
				>
					<div style={{ height: 500, overflowY: "scroll" }}>
						<Space direction="vertical" style={{ width: "100%" }} size={40}>
							<ChatMessage role={"user"} />
							<ChatMessage role={"assistant"} />
							<ChatMessage role={"user"} />
							<ChatMessage role={"assistant"} />
							<ChatMessage role={"user"} />
							<ChatMessage role={"assistant"} />
							<ChatMessage role={"user"} />
							<ChatMessage role={"assistant"} />
							{/* <Card title="Test 1" style={{ width: "100%" }} />
							<Card title="Test 2" style={{ width: "100%" }} />
							<Card title="Test 3" style={{ width: "100%" }} />
							<Card title="Test 4" style={{ width: "100%" }} />
							<Card title="Test 5" style={{ width: "100%" }} />
							<Card title="Test 6" style={{ width: "100%" }} /> */}
						</Space>
					</div>
					<Input
						variant="filled"
						size="large"
						placeholder="Zapytaj asystenta..."
						style={{
							width: 452,
							marginTop: 16,
						}}
					/>
					<Button type="primary">Test</Button>
				</Card>
			</Flex>
		</>
	);
}
