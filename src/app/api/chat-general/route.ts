import { Message } from "@/types/message";
import { OpenAI } from "openai";

const OPENAI_API_KEY = process.env.OPEN_AI_KEY;

type Props = {
	prompt: string;
	previousInput: Message[];
};

export async function POST(req: Request) {
	const body: Props = await req.json();

	const { prompt } = body;

	const openai = new OpenAI({
		apiKey: OPENAI_API_KEY,
	});

	async function generatePrompts(body: Props) {
		const response = await openai.chat.completions.create({
			messages: [
				...body.previousInput,
				{
					role: "system",
					content: `Your task is to gather information from the user needed to 
						fill JSON object userForm in alignement with field descriptions 
						and in the most efficient, friendly 
						and convenient for user way. If information for object in 
						form was not found and cannot be reasoned from answer leave 
						that object in json empty. Conversation will be in Polish 
						and please answer in Polish. You can only talk about topics 
						related to taxes. If information from user you need is about
						his birth date, address or he asks for knowledge about some topic,
						then set nextMove value in JSON with appropriate value.
						After finished form, make sure to always output finalised JSON.
						Limit each question about form data to minimum information to not overwhelm 
						user at once and ensure that your responses are full and complete.
						`,
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
							response_message: {
								type: "string",
							},
							nextMode: {
								type: "string",
								enum: ["default", "addressCollection", "learnMore", "finished"],
							},
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
									osoba_PESEL: {
										type: "string",
										description:
											"PESEL number (personal identification number)",
									},
									osoba_NIP: {
										type: "string",
										description: "NIP number (tax identification number)",
									},
									osoba_imie: {
										type: "string",
										description: "First name",
									},
									osoba_nazwisko: {
										type: "string",
										description: "Last name",
									},
									osoba_dataUrodzenia: {
										type: "string",
										description: "Date of birth (format: YYYY-MM-DD)",
									},

									adres_kodKraju: {
										type: "string",
										description: "Country code",
									},
									adres_wojewodztwo: {
										type: "string",
										description: "Province",
									},
									adres_powiat: {
										type: "string",
										description: "District",
									},
									adres_gmina: {
										type: "string",
										description: "Municipality",
									},
									adres_miejscowosc: {
										type: "string",
										description: "Locality",
									},
									adres_ulica: {
										type: "string",
										description: "Street",
									},
									adres_nrDomu: {
										type: "string",
										description: "House number",
									},
									adres_nrLokalu: {
										type: "string",
										description: "Apartment number",
									},
									adres_kodPocztowy: {
										type: "string",
										description: "Postal code",
									},

									p4: {
										type: "string",
										description: "DATA DOKONANIA CZYNNOŚCI",
									},
									p6: {
										type: "string",
										description: "CEL ZŁOŻENIA DEKLARACJI",
									},
									p7: {
										type: "string",
										description: "PODMIOT SKŁADAJĄCY DEKLARACJĘ",
									},
									p20: {
										type: "string",
										description: "PRZEDMIOT OPODATKOWANIA",
									},
									p21: {
										type: "string",
										description:
											"Miejsce położenia rzeczy lub miejsce wykonywania prawa majątkowego. Musi przyjmować wartość: 0 (jest niewypełnione), 1 (terytorium RP) lub 2 (poza terytorium RP),",
									},
									p22: {
										type: "string",
										description:
											"MIEJSCE DOKONANIA CZYNNOŚCI CYWILNOPRAWNEJ. Musi przyjmować wartość: 0 (jest niewypełnione), 1 (terytorium RP) lub 2 (poza terytorium RP).",
									},
									p23: {
										type: "string",
										description:
											"ZWIĘZŁE OKREŚLENIE TREŚCI I PRZEDMIOTU CZYNNOŚCI CYWILNOPRAWNEJ. Tekstowe (należy podać markę, model samochodu, rok produkcji i inne istotne informacje o stanie technicznym)",
									},
									p26: {
										type: "string",
										description:
											"PODSTAWA OPODATKOWANIA DLA UMOWY SPRZEDAŻY. Musi być większa lub równa 1000 PLN (jeśli nie jest to cały formularz nie jest potrzebny) oraz podana po zaokrągleniu do pełnych złotych.",
									},
									p62: {
										type: "string",
										description: "LICZBA DOŁĄCZONYCH ZAŁĄCZNIKÓW PCC-3/A",
									},
									pouczenia: {
										type: "string",
										description:
											"(Potwierdzam i akceptuję pouczenia). Musi przyjmować wartość 1 aby wniosek był poprawny. Zapytaj czy użytkownik akceptuje pouczenia",
									},
								},
								required: [
									"celZlozenia",
									"dataZlozenia",
									"kodUrzedu",
									"p4",
									"p6",
									"p7",
									"p20",
									"p21",
									"p22",
									"p23",
									"p26",
									"p62",
									"osoba_PESEL",
									"osoba_NIP",
									"osoba_imie",
									"osoba_nazwisko",
									"osoba_dataUrodzenia",
									"adres_kodKraju",
									"adres_wojewodztwo",
									"adres_powiat",
									"adres_gmina",
									"adres_miejscowosc",
									"adres_ulica",
									"adres_nrDomu",
									"adres_nrLokalu",
									"adres_kodPocztowy",
									"pouczenia",
								],
								description: "Form data for a specific submission process",
								additionalProperties: false,
							},
						},
						additionalProperties: false,
						required: ["response_message", "nextMode", "userForm"],
					},
				},
			},
		});

		return response;
	}

	const response = await generatePrompts(body);
	const essence = response.choices[0].message.content;
	return new Response(JSON.stringify(essence), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
	// res.status(200).json({ response })
}
