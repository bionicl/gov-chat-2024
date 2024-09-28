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
						"Your only goal is to collect user address. It needs to be address in Poland. Then output it in the sttructured JSON format. User needs to input Powiat, Gmina, Miejscowośc, Street (optional), home number and optional room number and postal code. If any of those fields are not provided, then output additional message in polish that indicates which data is missing. Try to help with filling out some data. For example if user provides a big city, autofill powiat/gmina/wojewódźtwo but only if you are 100% sure. If you fill them out automatically, but you're unsure, please set success_but_unsure status. Provide response_message only if response was failed. If provided data if wrong (for example kod pocztowy is longer than 5 characters), try to fix it or return failed status and notify in the message. If Kod pocztowy is provided without the - character, fill it out with the correct format 00-000. Kraj, Województwo, Powiat and Gmina, output always in UPPERLETTERS.",
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
							address: {
								type: "object",
								properties: {
									kraj: {
										type: "string",
									},
									wojewodztwo: {
										type: "string",
									},
									powiat: {
										type: "string",
									},
									gmina: {
										type: "string",
									},
									miejscowosc: {
										type: "string",
									},
									ulica: {
										type: "string",
									},
									numer_domu: {
										type: "string",
									},
									numer_mieszkania: {
										type: "string",
									},
									kod_pocztowy: {
										type: "string",
									},
								},
								required: [
									"kraj",
									"wojewodztwo",
									"powiat",
									"gmina",
									"miejscowosc",
									"ulica",
									"numer_domu",
									"numer_mieszkania",
									"kod_pocztowy",
								],
								additionalProperties: false,
							},
						},
						required: ["response_code", "response_message", "address"],
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
