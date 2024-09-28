import { Message } from "@/types/message";
import { Image, Space, Typography } from "antd";
import ChatMessage from "./ChatMessage";

const { Title } = Typography;

type Props = {
	messages: Message[];
	loading: boolean;
};

export default function ChatArea(props: Props) {
	return (
		<div
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
				{props.loading && <ChatMessage role={"assistant"} content="..." />}
			</Space>
		</div>
	);
}
