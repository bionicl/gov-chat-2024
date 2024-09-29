import { DownloadOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Tooltip } from "antd";

type Props = {
	loading: boolean;
	userActionAskQuestion: () => void;
	setInputMessage: React.Dispatch<React.SetStateAction<string>>;
	inputMessage: string;
	downloadChatHistory(): void;
	messagesLength: number;
};

export default function InputArea(props: Props) {
	return (
		<Form
			onFinish={() => {
				props.userActionAskQuestion();
			}}
		>
			<Flex gap={10} style={{ marginTop: 16, width: "100%" }}>
				<Input
					variant="filled"
					size="large"
					placeholder="Zapytaj asystenta..."
					value={props.inputMessage}
					onChange={(e) => props.setInputMessage(e.target.value)}
					disabled={props.loading}
				/>
				<Button
					style={{ height: 40, paddingInline: 24 }}
					type="primary"
					disabled={props.loading || props.inputMessage.length === 0}
					loading={props.loading}
					onClick={props.userActionAskQuestion}
				>
					Wyślij
				</Button>
				<Tooltip title="Pobierz historię chatu">
					<Button
						disabled={props.messagesLength === 0}
						style={{ height: 40, paddingInline: 24 }}
						icon={<DownloadOutlined />}
						onClick={props.downloadChatHistory}
					/>
				</Tooltip>
			</Flex>
		</Form>
	);
}
