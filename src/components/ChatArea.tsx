import { Message } from "@/types/message";
import { Image, Space, Typography } from "antd";
import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

const { Title } = Typography;

type Props = {
	messages: Message[];
	loading: boolean;
	explain: (content: string) => void;
};

export default function ChatArea(props: Props) {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		// Scroll to bottom when messages change
		if (containerRef.current) {
			containerRef.current.scrollTop = containerRef.current.scrollHeight;
		}
	}, [props.messages]);

	return (
		<div
			ref={containerRef}
			style={{
				height: "calc(100vh - 96px - 96px - 48px - 16px - 40px)",
				overflowY: "scroll",
				overflowX: "hidden",
			}}
		>
			<Space direction="vertical" style={{ width: "100%" }} size={40}>
				{props.messages.length > 0 ? (
					<>
						{props.messages.map((message, index) => {
							return (
								<ChatMessage
									key={index}
									role={message.role}
									content={message.content}
									explain={props.explain}
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
						<Image src={"/images/placeholder_image.png"} preview={false} />
					</>
				)}
				{props.loading && (
					<ChatMessage
						role={"assistant"}
						content="..."
						explain={props.explain}
					/>
				)}
			</Space>
		</div>
	);
}
