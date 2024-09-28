import { Card, Typography } from "antd";

const { Title } = Typography;

export default function FormDetailsArea() {
	return (
		<Card
			style={{
				width: 600,
				minHeight: "calc(100% - 96px)",
				position: "relative",
			}}
			bordered={false}
		>
			<Title level={3}>Postęp wypełnienia formularza PCC-3</Title>
			<Title level={5}>Dane personalne</Title>
			<Title level={5}>Adres</Title>
			<Title level={5}>Informacje o sprzedaży</Title>
			<Title level={5}>Inne</Title>
		</Card>
	);
}
