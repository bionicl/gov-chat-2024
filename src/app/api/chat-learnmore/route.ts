import { Message } from "@/types/message";
import { OpenAI } from "openai";

const OPENAI_API_KEY = process.env.OPEN_AI_KEY;

const systemMessage = `Your goal is to help user understand part of the conversation, specifically the last message.
Based on provided data, write a brief explanation of the topic and then provide an URL with more details.

Na podstawie wypowiedzi użytownika wybierz odpowiednik 
link gdzie może znaleźć więcej informacji na temat podatków i 
podaj użytkownikowi ten specfificzny link. Odpowiadaj tylko na tematy związane z podatkami. Dodawaj link TYLKO jeśli ma on sens, nie podawaj linków jeśli poruszane są proste tematy takie jak imię, nazwisko, pesel

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

Here is a big description you can use as a reference to write a short description of the topic:
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
jeden z zamienianych przedmiotów.
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
			// max_tokens: 1000,
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
