import { Button, Flex, Form, Input } from "antd";

type Props = {
	loading: boolean;
	userActionAskQuestion: () => void;
	setInputMessage: React.Dispatch<React.SetStateAction<string>>;
	inputMessage: string;
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
			</Flex>
		</Form>
	);
}
