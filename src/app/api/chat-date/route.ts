import { OpenAI } from "openai";

const OPENAI_API_KEY = process.env.OPEN_AI_KEY;

export async function POST(req: Request) {
	const body = await req.json();

	const { prompt } = body;

	const openai = new OpenAI({
		apiKey: OPENAI_API_KEY,
	});

	async function generatePrompts(prompt: string) {
		const response = await openai.chat.completions.create({
			messages: [
				{
					role: "system",
					content:
						"Your only goal is to collect full user birth date. Then output it in the sttructured JSON format. User needs to input rok, miesiac and dzien. If any of those fields are not provided, then output additional message in polish that indicates which data is missing. Try to help with filling out some data. If you're unsure but all values are filled, please set success_but_unsure status. Provide response_message only if response was failed. If provided data if wrong (for example prodived month doesn't exist or day at provided year and month doesn't exist), try to fix it or return failed status and notify in the message.",
				},
				{ role: "user", content: prompt },
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
							response_code: {
								type: "string",
								enum: [
									"success",
									"need_more_data",
									"success_but_unsure",
									"failed",
								],
							},
							response_message: {
								type: "string",
							},
							calendarDate: {
								type: "object",
								properties: {
									rok: {
										type: "string",
									},
									miesiac: {
										type: "string",
									},
									dzien: {
										type: "string",
									},
								},
								required: [
									"rok",
									"miesiac",
									"dzien",
								],
								additionalProperties: false,
							},
						},
						required: ["response_code", "response_message", "calendarDate"],
						additionalProperties: false,
					},
				},
			},
		});

		return response;
	}

	const response = await generatePrompts(prompt);
	const essence = response.choices[0].message.content;
	return new Response(JSON.stringify(essence), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
	// res.status(200).json({ response })
}
