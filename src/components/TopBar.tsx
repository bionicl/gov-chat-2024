import { Flex, Image } from "antd";

export default function TopBar() {
	return (
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
				<span style={{ fontFamily: "Amethysta", fontSize: 38, color: "white" }}>
					podatki.gov.pl
				</span>
			</Flex>
		</div>
	);
}
