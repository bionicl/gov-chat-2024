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
							celZlozenia: {
								type: "string",
								description: "Purpose of the submission",
							},
							dataZlozenia: {
								type: "string",
								description: "Date of submission (format: YYYY-MM-DD)",
							},
							kodUrzedu: {
								type: "string",
								description: "Office code",
							},
							osobaFizyczna: {
								type: "object",
								properties: {
									PESEL: {
										type: "string",
										description:
											"PESEL number (personal identification number)",
									},
									NIP: {
										type: "string",
										description: "NIP number (tax identification number)",
									},
									imie: {
										type: "string",
										description: "First name",
									},
									nazwisko: {
										type: "string",
										description: "Last name",
									},
									dataUrodzenia: {
										type: "string",
										description: "Date of birth (format: YYYY-MM-DD)",
									},
								},
								required: ["PESEL", "NIP", "imie", "nazwisko", "dataUrodzenia"],
								description: "Details of a physical person",
							},
							adresZamieszkaniaSiedziby: {
								type: "object",
								properties: {
									kodKraju: {
										type: "string",
										description: "Country code",
									},
									wojewodztwo: {
										type: "string",
										description: "Province",
									},
									powiat: {
										type: "string",
										description: "District",
									},
									gmina: {
										type: "string",
										description: "Municipality",
									},
									miejscowosc: {
										type: "string",
										description: "Locality",
									},
									ulica: {
										type: "string",
										description: "Street",
									},
									nrDomu: {
										type: "string",
										description: "House number",
									},
									nrLokalu: {
										type: "string",
										description: "Apartment number",
									},
									kodPocztowy: {
										type: "string",
										description: "Postal code",
									},
								},
								required: [
									"kodKraju",
									"wojewodztwo",
									"powiat",
									"gmina",
									"miejscowosc",
									"ulica",
									"nrDomu",
									"nrLokalu",
									"kodPocztowy",
								],
								description: "Residential or registered office address",
							},
							p4: {
								type: "string",
								description: "Additional field 4",
							},
							p6: {
								type: "string",
								description: "Additional field 6",
							},
							p7: {
								type: "string",
								description: "Additional field 7",
							},
							p20: {
								type: "string",
								description: "Additional field 20",
							},
							p21: {
								type: "string",
								description: "Additional field 21",
							},
							p22: {
								type: "string",
								description: "Additional field 22",
							},
							p23: {
								type: "string",
								description: "Additional field 23",
							},
							p26: {
								type: "string",
								description: "Additional field 26",
							},
							p27: {
								type: "string",
								description: "Additional field 27",
							},
							p46: {
								type: "string",
								description: "Additional field 46",
							},
							p53: {
								type: "string",
								description: "Additional field 53",
							},
							p62: {
								type: "string",
								description: "Additional field 62",
							},
						},
						required: [
							"celZlozenia",
							"dataZlozenia",
							"kodUrzedu",
							"osobaFizyczna",
							"adresZamieszkaniaSiedziby",
							"p4",
							"p6",
							"p7",
							"p20",
							"p21",
							"p22",
							"p23",
							"p26",
							"p27",
							"p46",
							"p53",
							"p62",
						],
						description: "Form data for a specific submission process",
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
