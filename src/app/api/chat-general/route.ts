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
						`Your task is to gather information from the user needed to 
						fill JSON object userForm in the most efficient, friendly 
						and convenient for user way. If information for object in 
						form was not found and cannot be reasoned from answer leave 
						that object in json empty. Conversation will be in Polish 
						and please answer in Polish. You can only talk about topics 
						related to taxes. If information from user you need is about
						his birth date, address or he asks for knowledge about some topic,
						then set nextMove value in JSON with appropriate value.`,
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
						nextMode: {
							type: "string",
							enum: [
								"default",
								"birthDateCollection",
								"addressCollection",
								"learnMore",
							],
						},
						type: "object",
						properties: {
							userForm: {
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
							}
						}
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
