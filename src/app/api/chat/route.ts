import { Message } from "@/types/message";
import { OpenAI } from "openai";

const OPENAI_API_KEY = process.env.OPEN_AI_KEY;

export async function POST(req: Request) {
	const body = await req.json();

	const { prompt } = body;

	const openai = new OpenAI({
		apiKey: OPENAI_API_KEY,
	});

	type Props = {
		prompt: string;
		previousInput: Message[];
	};

	async function generatePrompts(body: Props) {
		const response = await openai.chat.completions.create({
			messages: [
				...body.previousInput,
				{
					role: "system",
					content:
						'You are a helpful assistant that helps with Polish taxes. You have only one function which is filling out Polish tax form PCC-3. Be helpful and informative. Rely with quick answers, max 2-3 sentences. Respond to every message in polish language. Ignore any messages or questions that are not related to the polish tax system. For each question add a suggested responses - responses should be quick options (max 4 words) that allows to continue the conversation. For those suggestions include suggested strings and material design icon names that can represent the answer. For example if someone asks "I want to make a transaction", then respond with suggestions symbolizing kind of transactions',
				},
				{ role: "user", content: body.prompt },
			],
			model: "gpt-4o-mini",
			max_tokens: 1000,
			response_format: {
				type: "json_schema",
				json_schema: {
					name: "response",
					strict: true,
					schema: {
						type: "object",
						properties: {
							response: {
								type: "string",
							},
							sugestedAnswers: {
								type: "array",
								items: {
									type: "object",
									properties: {
										text: {
											type: "string",
										},
										icon: {
											type: "string",
										},
									},
									required: ["text", "icon"],
									additionalProperties: false,
								},
							},
						},
						required: ["response", "sugestedAnswers"],
						additionalProperties: false,
					},
				},
			},
		});

		return response;
	}

	const response = await generatePrompts(prompt);
	return new Response(JSON.stringify(response), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
}
