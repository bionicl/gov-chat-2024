"use client"; // This is a client component 👈🏽

import { theme } from "antd";
import React from "react";
const { useToken } = theme;

type Props = {
	role: "assistant" | "user";
};

const ArrowSvg = ({
	color,
	style,
}: {
	color: string;
	style?: React.CSSProperties;
}) => {
	return (
		<svg
			width="42.6891097px"
			height="42.6891097px"
			viewBox="0 0 42.6891097 42.6891097"
			version="1.1"
			xmlns="http://www.w3.org/2000/svg"
			style={{ ...style }}
		>
			<g
				id="Page-1"
				stroke="none"
				stroke-width="1"
				fill="none"
				fill-rule="evenodd"
			>
				<g
					id="Artboard"
					transform="translate(-302.3109, -383.0886)"
					fill={color}
				>
					<polygon
						id="Path"
						points="302.31089 383.088562 345 425.777672 345 383.088562"
					></polygon>
				</g>
			</g>
		</svg>
	);
};

export default function ChatMessage(props: Props) {
	const { token } = useToken();

	const isUser = props.role === "user";

	return (
		<div
			style={{
				backgroundColor: isUser ? token.colorPrimary : "#999",
				color: "white",
				padding: 24,
				fontSize: 16,
				position: "relative",
			}}
		>
			<ArrowSvg
				color={isUser ? token.colorPrimary : "#999"}
				style={{
					bottom: -30,
					right: isUser ? -12 : undefined,
					left: !isUser ? -12 : undefined,
					fill: "red",
					position: "absolute",
					transform: isUser ? "scale(0.5)" : "scale(0.5) scaleX(-1)",
				}}
			/>
			Message
		</div>
	);
}
