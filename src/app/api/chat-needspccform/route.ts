import { Message } from "@/types/message";
import { OpenAI } from "openai";

const OPENAI_API_KEY = process.env.OPEN_AI_KEY;

const systemMessage = `
You are a helpful assistant creted to answer questions regarding polish tax system.
When user asks general question about tax system, you should answer very briefly, with information that currently you can't help with additional tasks.

Your field of expertise is pcc3 form. When user asks about it, please answer with detailed information, for example what is the purpose of this form and in which cases it can be filled out.

Your additional goal is to determine if user needs to fill pcc3 form. If user is unsure or does not provide detailed data, please ask for clarification.

Although pcc3 form support selling real estate and a few different types, please understand that currently only setting/buying car is supported. If user tries to sell different type of asset, guide them that pcc3 form is valid, but not yet supported in this system.

Below you can find a detailed information about pcc3 form which you can reffer to:
Only allow to fillout pcc3 form in relation to buying/selling car, ignore in other cases like loan or real estate. If user wants to sell anything other than car, tell that it is a valid form, but it is currently not supported. 
Na podstawie kontekstu biznesowego poniżej: "Kontekst biznesowy:
Art. 10 ust. 1 ustawy z dnia 9 września 2000 r. o podatku od czynności cywilnoprawnych (Dz. U. z
2023 r. poz. 170, 1463 i 1723) narzuca podatnikom obowiązek złożenia deklaracji w sprawie podatku
od czynności cywilnoprawnych, według ustalonego wzoru, oraz obliczenia i wpłacenia podatku w
terminie 14 dni od dnia powstania obowiązku podatkowego.
Deklaracje PCC-3 można składać w formie papierowej oraz elektronicznej zgodnie z
ustalonym schematem XML.

Deklarację składa się w przypadku:
- zawarcia umowy: sprzedaży, zamiany rzeczy i praw majątkowych, pożyczki pieniędzy lub
rzeczy oznaczonych tylko co do gatunku (jeśli z góry nie zostanie ustalona suma pożyczki –
deklaracje składa się w przypadku każdorazowej wypłaty środków pieniężnych), o dział
spadku lub zniesienie współwłasności, gdy dochodzi w nich do spłat i dopłat, ustanowienia
odpłatnego użytkowania (w tym nieprawidłowego), depozytu nieprawidłowego lub spółki,
- przyjęcia darowizny z przejęciem długów i ciężarów albo zobowiązania darczyńcy,
- złożenia oświadczenia o ustanowieniu hipoteki lub zawarcia umowy ustanowienia hipoteki,
- uprawomocnia się orzeczenia sądu lub otrzymania wyroku sądu polubownego albo zawarcia
ugody w sprawach umów wyżej wymienionych,
- zawarcia umowy przeniesienia własności – jeśli wcześniej podpisana została umowa
zobowiązująca do przeniesienia własności, a teraz podpisana została umowa przeniesienia tej
własności,
- podwyższenia kapitału w spółce mającej osobowość prawną.
Deklaracji nie składa się, gdy:
- czynność cywilnoprawna jest dokonywana w formie aktu notarialnego i podatek jest
pobierany przez notariusza (płatnika podatku),
- podatnik składa zbiorczą deklarację w sprawie podatku od czynności cywilnoprawnych
(PCC-4),
- podatnikiem jest:
- kupujący na własne potrzeby sprzęt rehabilitacyjny, wózki inwalidzkie, motorowery,
motocykle lub samochody osobowe – jeśli ma: orzeczenie o znacznym albo
umiarkowanym stopniu niepełnosprawności (nieważne, jakie ma schorzenie), o
orzeczenie o lekkim stopniu niepełnosprawności w związku ze schorzeniami narządów
ruchu.
- organizacja pożytku publicznego – jeśli dokonuje czynności cywilnoprawnych tylko w
związku ze swoją nieodpłatną działalnością pożytku publicznego.
- jednostka samorządu terytorialnego,
- Skarb Państwa,
- Agencja Rezerw Materiałowych,
- korzysta się ze zwolnienia od podatku, gdy:
- kupowane są obce waluty,
- kupowane są i zamieniane waluty wirtualne,
- kupowane są rzeczy ruchome – i ich wartość rynkowa nie przekracza 1 000 zł,
- pożyczane jest nie więcej niż 36 120 zł (liczą się łącznie pożyczki z ostatnich 5 lat od
jednej osoby) – jeśli jest to pożyczka od bliskiej rodziny, czyli od: małżonka, dzieci,
wnuków, prawnuków, rodziców, dziadków, pradziadków, pasierbów, pasierbic,
rodzeństwa, ojczyma, macochy, zięcia, synowej, teściów,
- pożyczane są pieniądze od osób spoza bliskiej rodziny – jeśli wysokość pożyczki nie
przekracza 1 000 zł.

Deklarację składa się tylko w przypadkach umów, których przedmiotem są rzeczy i prawa majątkowe
(majątek), znajdujące się w Polsce. A jeśli są za granicą – to tylko jeśli ich nabywca mieszka albo ma
siedzibę w Polsce i zawarł umowę w Polsce. W przypadku umowy zamiany wystarczy, że w Polsce jest
jeden z zamienianych przedmiotów.", odpowiedz użytkownikowi który formularz powinien wypełnić (odpowiedz że albo PCC-3 albo inny "bez konkretków") w prosty, zrozumiały, precyzyjny, zwięzły sposób.

`;

type Props = {
	prompt: string;
	previousInput: Message[];
};

export async function POST(req: Request) {
	const body: Props = await req.json();

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
							doesNeedThisForm: {
								type: "boolean",
							},
						},
						required: ["response_code", "response_message", "doesNeedThisForm"],
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
