import { Message } from "@/types/message";
import { OpenAI } from "openai";

const OPENAI_API_KEY = process.env.OPEN_AI_KEY;

const systemMessage = `Your only goal is to determine which link will allow user to learn more about topic in his response he needs help with. Then output it in the sttructured JSON format (set href as specific link from set of your choice).
Poniżej są podane zestawiania linków i ich opisów. 
Na podstawie wypowiedzi użytownika wybierz odpowiednik 
link gdzie może znaleźć więcej informacji na temat podatków i 
podaj użytkownikowi ten specfificzny link. Odpowiadaj tylko na tematy związane z podatkami.

{
link: "https://www.podatki.gov.pl/pcc-sd/rozliczenie-podatku-pcc-od-kupna-samochodu/" 
opis: "Rozliczenie podatku PCC od kupna samochodu. Kupiłeś samochód i musisz rozliczyć podatek?"
}

{
link: "https://www.podatki.gov.pl/pcc-sd/rozliczenie-podatku-pcc-od-pozyczki/" 
opis: "Rozliczenie podatku PCC od pożyczki. Otrzymałeś pożyczkę i musisz rozliczyć podatek?"
}

{
link: "https://www.podatki.gov.pl/pcc-sd/rozliczenie-podatku-pcc-od-innych-czynnosci/" 
opis: "Rozliczenie podatku PCC od innych czynności. Dokonałeś innych czynności opodatkowanych PCC i musisz rozliczyć podatek?"
}

{
link: "https://www.podatki.gov.pl/pcc-sd/rozliczenie-podatku-sd-od-spadkow-i-zapisow/" 
opis: "Rozliczenie podatku SD od spadków i zapisów. Otrzymałeś spadek lub zapisy dokonane przez spadkodawcę?"
}

{
link: "https://www.podatki.gov.pl/pcc-sd/rozliczenie-podatku-sd-od-darowizny/" 
opis: "Rozliczenie podatku SD od darowizny. Otrzymałeś darowiznę od najbliższej rodziny lub dalszych krewnych?"
}

{
link: "https://www.podatki.gov.pl/pcc-sd/rozliczenie-podatku-sd-od-innego-sposobu-nabycia-majatku/" 
opis: "Rozliczenie podatku SD od innego sposobu nabycia majatku. Nabyłeś własność rzeczy lub praw majątkowych?"
}

{
link: "https://www.podatki.gov.pl/" 
opis: "Inne, ogólne przypadki jeśli nie pasuje żadna inna strona"
}
`;

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
					content: systemMessage,
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
							href: {
								type: "string",
							},
						},
						required: ["response_code", "response_message", "href"],
						additionalProperties: false,
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
