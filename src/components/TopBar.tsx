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
			<Flex align="center" style={{ height: 96 }}>
				<Image
					preview={false}
					src={"/images/logo.svg"}
					alt="Przejdź do strony głównej serwisu"
					style={{
						width: 80,
						height: 80,
					}}
				/>
				<span
					style={{
						fontFamily: "Amethysta",
						fontSize: 38,
						color: "white",
						// fontWeight: 500,
					}}
				>
					ePartner Podatkowy
				</span>
			</Flex>
		</div>
	);
}
