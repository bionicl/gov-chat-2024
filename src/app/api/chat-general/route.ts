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
						his birth date, his/her address or he asks for knowledge about some topic,
						then set nextMove value in JSON with appropriate value.
						If you want to get any information about user's address values or user wants to give his address info
						(like kraj, wojewodztwo, ulica) then set nextMode to addressCollection in JSON.
						After finished form, make sure to always output finalised JSON.
						Limit each question about form data to minimum information to not overwhelm 
						user at once and ensure that your responses are full and complete.
						Today is date: ${new Date().toLocaleDateString("en-US")} (in US format)
						When asking for name or surname, and you don't already know, ask for 
						full name (name + surname).

						Fillout data in this order:
						1. Full name
						2. Pesel/NIP
						3. Birth date
						4. Address (DO NOT CONFIRM DATA WITH THE USER, GO ON WITH THE SCRIPT)
						It needs to be address in Poland. User needs to input Powiat, Gmina, Miejscowośc, Street (optional), home number and optional room number and postal code. If any of those fields are not provided, then output additional message in polish that indicates which data is missing. Try to help with filling out some data. For example if user provides a big city, autofill powiat/gmina/wojewódźtwo but only if you are 100% sure. If you fill them out automatically, If provided data if wrong (for example kod pocztowy is longer than 5 characters), try to fix it or return failed status and notify in the message. If Kod pocztowy is provided without the - character, fill it out with the correct format 00-000. Kraj, Województwo, Powiat and Gmina, output always in UPPERLETTERS. Odpowiadaj tylko na tematy związane z podatkami.
						Oto przykłady nazw powiatów: "M. RADOM", "MIŃSKI", "MAKOWSKI", "M. ST. WARSZAWA", "M. SIEDLCE", "GARWOLIŃSKI", "OTWOCKI",
						Oto przykłady nazw gmin: "CEGŁÓW", "DOBRE", "MIŃSK MAZOWIECKI-MIEJSKA", "MIŃSK MAZOWIECKI-WIEJSKA", "MROZY", "M. ST. WARSZAWA", "KRAKOWSKI", "M. KRAKÓW", 



						5. Details about purchase
						6. Other details like urzad skarbowy

						lookout for previous messages, maybe user has already filled out some of the info there! In such case no need to ask, try to fill them out automatically

						NEVER OUTPUT EMPTY MESSAGE

						MAKE SURE THAT ALL REQUIRED FIELDS ARE FILLED OUT.
						Take your time to check it out. No field should be left empty except optional NIP or PESEL, address street, sddress locum number

						Make sure that you always ask a question at the end of the message. Never mention field names (like p4 or p20), just their description.
						Never output any kind of combined data/summary info, jutr go on with the script and at the end mention, that "Proper file has been downloaded and now user can visit this page to upload it: https://klient-eformularz.mf.gov.pl/declaration/form/422f3471-b5cb-4f25-9f81-2f43c497ec51/ ".


						Kod US	Urząd Skarbowy
271	DOLNOŚLĄSKI URZĄD SKARBOWY WE WROCŁAWIU
1472	DRUGI MAZOWIECKI URZĄD SKARBOWY W WARSZAWIE
2472	DRUGI ŚLĄSKI URZĄD SKARBOWY W BIELSKU-BIAŁEJ
1228	DRUGI URZĄD SKARBOWY KRAKÓW
1009	DRUGI URZĄD SKARBOWY ŁÓDŹ-BAŁUTY
1011	DRUGI URZĄD SKARBOWY ŁÓDŹ-GÓRNA
2004	DRUGI URZĄD SKARBOWY W BIAŁYMSTOKU
2404	DRUGI URZĄD SKARBOWY W BIELSKU-BIAŁEJ
405	DRUGI URZĄD SKARBOWY W BYDGOSZCZY
2410	DRUGI URZĄD SKARBOWY W CZĘSTOCHOWIE
2206	DRUGI URZĄD SKARBOWY W GDAŃSKU
2209	DRUGI URZĄD SKARBOWY W GDYNI
2413	DRUGI URZĄD SKARBOWY W GLIWICACH
3008	DRUGI URZĄD SKARBOWY W KALISZU
2417	DRUGI URZĄD SKARBOWY W KATOWICACH
2605	DRUGI URZĄD SKARBOWY W KIELCACH
3211	DRUGI URZĄD SKARBOWY W KOSZALINIE
611	DRUGI URZĄD SKARBOWY W LUBLINIE
1610	DRUGI URZĄD SKARBOWY W OPOLU
1425	DRUGI URZĄD SKARBOWY W RADOMIU
1822	DRUGI URZĄD SKARBOWY W RZESZOWIE
3216	DRUGI URZĄD SKARBOWY W SZCZECINIE
1224	DRUGI URZĄD SKARBOWY W TARNOWIE
417	DRUGI URZĄD SKARBOWY W TORUNIU
809	DRUGI URZĄD SKARBOWY W ZIELONEJ GÓRZE
1436	DRUGI URZĄD SKARBOWY WARSZAWA-ŚRÓDMIEŚCIE
3072	DRUGI WIELKOPOLSKI URZĄD SKARBOWY W KALISZU
471	KUJAWSKO-POMORSKI URZĄD SKARBOWY W BYDGOSZCZY
671	LUBELSKI URZĄD SKARBOWY W LUBLINIE
871	LUBUSKI URZĄD SKARBOWY W ZIELONEJ GÓRZE
1071	ŁÓDZKI URZĄD SKARBOWY W ŁODZI
1271	MAŁOPOLSKI URZĄD SKARBOWY W KRAKOWIE
1671	OPOLSKI URZĄD SKARBOWY W OPOLU
1471	PIERWSZY MAZOWIECKI URZĄD SKARBOWY W WARSZAWIE
2471	PIERWSZY ŚLĄSKI URZĄD SKARBOWY W SOSNOWCU
1207	PIERWSZY URZĄD SKARBOWY KRAKÓW
1008	PIERWSZY URZĄD SKARBOWY ŁÓDŹ-BAŁUTY
1010	PIERWSZY URZĄD SKARBOWY ŁÓDŹ-GÓRNA
2003	PIERWSZY URZĄD SKARBOWY W BIAŁYMSTOKU
2403	PIERWSZY URZĄD SKARBOWY W BIELSKU-BIAŁEJ
404	PIERWSZY URZĄD SKARBOWY W BYDGOSZCZY
2409	PIERWSZY URZĄD SKARBOWY W CZĘSTOCHOWIE
2205	PIERWSZY URZĄD SKARBOWY W GDAŃSKU
2208	PIERWSZY URZĄD SKARBOWY W GDYNI
2412	PIERWSZY URZĄD SKARBOWY W GLIWICACH
3007	PIERWSZY URZĄD SKARBOWY W KALISZU
2416	PIERWSZY URZĄD SKARBOWY W KATOWICACH
2604	PIERWSZY URZĄD SKARBOWY W KIELCACH
3210	PIERWSZY URZĄD SKARBOWY W KOSZALINIE
610	PIERWSZY URZĄD SKARBOWY W LUBLINIE
1609	PIERWSZY URZĄD SKARBOWY W OPOLU
3023	PIERWSZY URZĄD SKARBOWY W POZNANIU
1424	PIERWSZY URZĄD SKARBOWY W RADOMIU
1816	PIERWSZY URZĄD SKARBOWY W RZESZOWIE
3215	PIERWSZY URZĄD SKARBOWY W SZCZECINIE
1223	PIERWSZY URZĄD SKARBOWY W TARNOWIE
416	PIERWSZY URZĄD SKARBOWY W TORUNIU
808	PIERWSZY URZĄD SKARBOWY W ZIELONEJ GÓRZE
1435	PIERWSZY URZĄD SKARBOWY WARSZAWA-ŚRÓDMIEŚCIE
229	PIERWSZY URZĄD SKARBOWY WE WROCŁAWIU
3071	PIERWSZY WIELKOPOLSKI URZĄD SKARBOWY W POZNANIU
1871	PODKARPACKI URZĄD SKARBOWY W RZESZOWIE
2071	PODLASKI URZĄD SKARBOWY W BIAŁYMSTOKU
2271	POMORSKI URZĄD SKARBOWY W GDAŃSKU
2671	ŚWIĘTOKRZYSKI URZĄD SKARBOWY W KIELCACH
1473	TRZECI MAZOWIECKI URZĄD SKARBOWY W RADOMIU
406	TRZECI URZĄD SKARBOWY W BYDGOSZCZY
2207	TRZECI URZĄD SKARBOWY W GDAŃSKU
612	TRZECI URZĄD SKARBOWY W LUBLINIE
3217	TRZECI URZĄD SKARBOWY W SZCZECINIE
1449	TRZECI URZĄD SKARBOWY WARSZAWA-ŚRÓDMIEŚCIE
1208	URZĄD SKARBOWY KRAKÓW-KROWODRZA
1209	URZĄD SKARBOWY KRAKÓW-NOWA HUTA
1210	URZĄD SKARBOWY KRAKÓW-PODGÓRZE
1211	URZĄD SKARBOWY KRAKÓW-PRĄDNIK
1212	URZĄD SKARBOWY KRAKÓW-STARE MIASTO
1213	URZĄD SKARBOWY KRAKÓW-ŚRÓDMIEŚCIE
1012	URZĄD SKARBOWY ŁÓDŹ-POLESIE
1013	URZĄD SKARBOWY ŁÓDŹ-ŚRÓDMIEŚCIE
1014	URZĄD SKARBOWY ŁÓDŹ-WIDZEW
3020	URZĄD SKARBOWY POZNAŃ-GRUNWALD
3021	URZĄD SKARBOWY POZNAŃ-JEŻYCE
3022	URZĄD SKARBOWY POZNAŃ-NOWE MIASTO
3026	URZĄD SKARBOWY POZNAŃ-WILDA
3025	URZĄD SKARBOWY POZNAŃ-WINOGRADY
402	URZĄD SKARBOWY W ALEKSANDROWIE KUJAWSKIM
2002	URZĄD SKARBOWY W AUGUSTOWIE
2802	URZĄD SKARBOWY W BARTOSZYCACH
1002	URZĄD SKARBOWY W BEŁCHATOWIE
2402	URZĄD SKARBOWY W BĘDZINIE
602	URZĄD SKARBOWY W BIAŁEJ PODLASKIEJ
1402	URZĄD SKARBOWY W BIAŁOBRZEGACH
3202	URZĄD SKARBOWY W BIAŁOGARDZIE
2005	URZĄD SKARBOWY W BIELSKU PODLASKIM
603	URZĄD SKARBOWY W BIŁGORAJU
1202	URZĄD SKARBOWY W BOCHNI
202	URZĄD SKARBOWY W BOLESŁAWCU
2803	URZĄD SKARBOWY W BRANIEWIE
403	URZĄD SKARBOWY W BRODNICY
1602	URZĄD SKARBOWY W BRZEGU
1203	URZĄD SKARBOWY W BRZESKU
1003	URZĄD SKARBOWY W BRZEZINACH
1802	URZĄD SKARBOWY W BRZOZOWIE
2602	URZĄD SKARBOWY W BUSKU-ZDROJU
203	URZĄD SKARBOWY W BYSTRZYCY KŁODZKIEJ
2405	URZĄD SKARBOWY W BYTOMIU
2202	URZĄD SKARBOWY W BYTOWIE
604	URZĄD SKARBOWY W CHEŁMIE
407	URZĄD SKARBOWY W CHEŁMNIE
3037	URZĄD SKARBOWY W CHODZIEŻY
2203	URZĄD SKARBOWY W CHOJNICACH
2406	URZĄD SKARBOWY W CHORZOWIE
3203	URZĄD SKARBOWY W CHOSZCZNIE
1204	URZĄD SKARBOWY W CHRZANOWIE
1403	URZĄD SKARBOWY W CIECHANOWIE
2407	URZĄD SKARBOWY W CIESZYNIE
3002	URZĄD SKARBOWY W CZARNKOWIE
2408	URZĄD SKARBOWY W CZECHOWICACH-DZIEDZICACH
2204	URZĄD SKARBOWY W CZŁUCHOWIE
2411	URZĄD SKARBOWY W DĄBROWIE GÓRNICZEJ
1205	URZĄD SKARBOWY W DĄBROWIE TARNOWSKIEJ
1803	URZĄD SKARBOWY W DĘBICY
3204	URZĄD SKARBOWY W DRAWSKU POMORSKIM
812	URZĄD SKARBOWY W DREZDENKU
2804	URZĄD SKARBOWY W DZIAŁDOWIE
204	URZĄD SKARBOWY W DZIERŻONIOWIE
2805	URZĄD SKARBOWY W ELBLĄGU
2806	URZĄD SKARBOWY W EŁKU
1404	URZĄD SKARBOWY W GARWOLINIE
2807	URZĄD SKARBOWY W GIŻYCKU
205	URZĄD SKARBOWY W GŁOGOWIE
1004	URZĄD SKARBOWY W GŁOWNIE
1603	URZĄD SKARBOWY W GŁUBCZYCACH
3003	URZĄD SKARBOWY W GNIEŹNIE
3205	URZĄD SKARBOWY W GOLENIOWIE
422	URZĄD SKARBOWY W GOLUBIU-DOBRZYNIU
1206	URZĄD SKARBOWY W GORLICACH
802	URZĄD SKARBOWY W GORZOWIE WIELKOPOLSKIM
1405	URZĄD SKARBOWY W GOSTYNINIE
3004	URZĄD SKARBOWY W GOSTYNIU
233	URZĄD SKARBOWY W GÓRZE
2006	URZĄD SKARBOWY W GRAJEWIE
1406	URZĄD SKARBOWY W GRODZISKU MAZOWIECKIM
3005	URZĄD SKARBOWY W GRODZISKU WIELKOPOLSKIM
1407	URZĄD SKARBOWY W GRÓJCU
408	URZĄD SKARBOWY W GRUDZIĄDZU
3206	URZĄD SKARBOWY W GRYFICACH
3207	URZĄD SKARBOWY W GRYFINIE
2015	URZĄD SKARBOWY W HAJNÓWCE
605	URZĄD SKARBOWY W HRUBIESZOWIE
2808	URZĄD SKARBOWY W IŁAWIE
409	URZĄD SKARBOWY W INOWROCŁAWIU
606	URZĄD SKARBOWY W JANOWIE LUBELSKIM
3006	URZĄD SKARBOWY W JAROCINIE
1804	URZĄD SKARBOWY W JAROSŁAWIU
2414	URZĄD SKARBOWY W JASTRZĘBIU-ZDROJU
1805	URZĄD SKARBOWY W JAŚLE
206	URZĄD SKARBOWY W JAWORZE
2415	URZĄD SKARBOWY W JAWORZNIE
207	URZĄD SKARBOWY W JELENIEJ GÓRZE
2603	URZĄD SKARBOWY W JĘDRZEJOWIE
3208	URZĄD SKARBOWY W KAMIENIU POMORSKIM
208	URZĄD SKARBOWY W KAMIENNEJ GÓRZE
2210	URZĄD SKARBOWY W KARTUZACH
2614	URZĄD SKARBOWY W KAZIMIERZY WIELKIEJ
1604	URZĄD SKARBOWY W KĘDZIERZYNIE-KOŹLU
3009	URZĄD SKARBOWY W KĘPNIE
2809	URZĄD SKARBOWY W KĘTRZYNIE
1605	URZĄD SKARBOWY W KLUCZBORKU
2418	URZĄD SKARBOWY W KŁOBUCKU
209	URZĄD SKARBOWY W KŁODZKU
1806	URZĄD SKARBOWY W KOLBUSZOWEJ
3010	URZĄD SKARBOWY W KOLE
2007	URZĄD SKARBOWY W KOLNIE
3209	URZĄD SKARBOWY W KOŁOBRZEGU
3011	URZĄD SKARBOWY W KONINIE
2606	URZĄD SKARBOWY W KOŃSKICH
3012	URZĄD SKARBOWY W KOŚCIANIE
2211	URZĄD SKARBOWY W KOŚCIERZYNIE
1408	URZĄD SKARBOWY W KOZIENICACH
1613	URZĄD SKARBOWY W KRAPKOWICACH
607	URZĄD SKARBOWY W KRASNYMSTAWIE
608	URZĄD SKARBOWY W KRAŚNIKU
1807	URZĄD SKARBOWY W KROŚNIE
803	URZĄD SKARBOWY W KROŚNIE ODRZAŃSKIM
3013	URZĄD SKARBOWY W KROTOSZYNIE
1005	URZĄD SKARBOWY W KUTNIE
2212	URZĄD SKARBOWY W KWIDZYNIE
1409	URZĄD SKARBOWY W LEGIONOWIE
210	URZĄD SKARBOWY W LEGNICY
1808	URZĄD SKARBOWY W LESKU
3014	URZĄD SKARBOWY W LESZNIE
1809	URZĄD SKARBOWY W LEŻAJSKU
2213	URZĄD SKARBOWY W LĘBORKU
1214	URZĄD SKARBOWY W LIMANOWEJ
410	URZĄD SKARBOWY W LIPNIE
1447	URZĄD SKARBOWY W LIPSKU
1810	URZĄD SKARBOWY W LUBACZOWIE
211	URZĄD SKARBOWY W LUBANIU
609	URZĄD SKARBOWY W LUBARTOWIE
212	URZĄD SKARBOWY W LUBINIE
2419	URZĄD SKARBOWY W LUBLIŃCU
213	URZĄD SKARBOWY W LWÓWKU ŚLĄSKIM
1811	URZĄD SKARBOWY W ŁAŃCUCIE
1006	URZĄD SKARBOWY W ŁASKU
621	URZĄD SKARBOWY W ŁĘCZNEJ
1028	URZĄD SKARBOWY W ŁĘCZYCY
2008	URZĄD SKARBOWY W ŁOMŻY
1410	URZĄD SKARBOWY W ŁOSICACH
1007	URZĄD SKARBOWY W ŁOWICZU
613	URZĄD SKARBOWY W ŁUKOWIE
1411	URZĄD SKARBOWY W MAKOWIE MAZOWIECKIM
2214	URZĄD SKARBOWY W MALBORKU
1215	URZĄD SKARBOWY W MIECHOWIE
1812	URZĄD SKARBOWY W MIELCU
3015	URZĄD SKARBOWY W MIĘDZYCHODZIE
804	URZĄD SKARBOWY W MIĘDZYRZECZU
2420	URZĄD SKARBOWY W MIKOŁOWIE
214	URZĄD SKARBOWY W MILICZU
1412	URZĄD SKARBOWY W MIŃSKU MAZOWIECKIM
1413	URZĄD SKARBOWY W MŁAWIE
411	URZĄD SKARBOWY W MOGILNIE
2009	URZĄD SKARBOWY W MOŃKACH
2421	URZĄD SKARBOWY W MYSŁOWICACH
2422	URZĄD SKARBOWY W MYSZKOWIE
1216	URZĄD SKARBOWY W MYŚLENICACH
3212	URZĄD SKARBOWY W MYŚLIBORZU
412	URZĄD SKARBOWY W NAKLE NAD NOTECIĄ
1606	URZĄD SKARBOWY W NAMYSŁOWIE
2810	URZĄD SKARBOWY W NIDZICY
1823	URZĄD SKARBOWY W NISKU
215	URZĄD SKARBOWY W NOWEJ RUDZIE
805	URZĄD SKARBOWY W NOWEJ SOLI
1414	URZĄD SKARBOWY W NOWYM DWORZE MAZOWIECKIM
2811	URZĄD SKARBOWY W NOWYM MIEŚCIE LUBAWSKIM
1217	URZĄD SKARBOWY W NOWYM SĄCZU
1218	URZĄD SKARBOWY W NOWYM TARGU
3016	URZĄD SKARBOWY W NOWYM TOMYŚLU
1607	URZĄD SKARBOWY W NYSIE
3038	URZĄD SKARBOWY W OBORNIKACH
2812	URZĄD SKARBOWY W OLECKU
216	URZĄD SKARBOWY W OLEŚNICY
1608	URZĄD SKARBOWY W OLEŚNIE
1219	URZĄD SKARBOWY W OLKUSZU
2813	URZĄD SKARBOWY W OLSZTYNIE
217	URZĄD SKARBOWY W OŁAWIE
2607	URZĄD SKARBOWY W OPATOWIE
1015	URZĄD SKARBOWY W OPOCZNIE
614	URZĄD SKARBOWY W OPOLU LUBELSKIM
1415	URZĄD SKARBOWY W OSTROŁĘCE
2608	URZĄD SKARBOWY W OSTROWCU ŚWIĘTOKRZYSKIM
1416	URZĄD SKARBOWY W OSTROWI MAZOWIECKIEJ
3017	URZĄD SKARBOWY W OSTROWIE WIELKOPOLSKIM
2814	URZĄD SKARBOWY W OSTRÓDZIE
3018	URZĄD SKARBOWY W OSTRZESZOWIE
1220	URZĄD SKARBOWY W OŚWIĘCIMIU
1417	URZĄD SKARBOWY W OTWOCKU
1016	URZĄD SKARBOWY W PABIANICACH
1029	URZĄD SKARBOWY W PAJĘCZNIE
615	URZĄD SKARBOWY W PARCZEWIE
1418	URZĄD SKARBOWY W PIASECZNIE
2423	URZĄD SKARBOWY W PIEKARACH ŚLĄSKICH
3019	URZĄD SKARBOWY W PILE
2609	URZĄD SKARBOWY W PIŃCZOWIE
1017	URZĄD SKARBOWY W PIOTRKOWIE TRYBUNALSKIM
2815	URZĄD SKARBOWY W PISZU
3039	URZĄD SKARBOWY W PLESZEWIE
1419	URZĄD SKARBOWY W PŁOCKU
1420	URZĄD SKARBOWY W PŁOŃSKU
1018	URZĄD SKARBOWY W PODDĘBICACH
234	URZĄD SKARBOWY W POLKOWICACH
1221	URZĄD SKARBOWY W PROSZOWICACH
1611	URZĄD SKARBOWY W PRUDNIKU
2221	URZĄD SKARBOWY W PRUSZCZU GDAŃSKIM
1421	URZĄD SKARBOWY W PRUSZKOWIE
1422	URZĄD SKARBOWY W PRZASNYSZU
1813	URZĄD SKARBOWY W PRZEMYŚLU
1814	URZĄD SKARBOWY W PRZEWORSKU
1448	URZĄD SKARBOWY W PRZYSUSZE
2424	URZĄD SKARBOWY W PSZCZYNIE
2215	URZĄD SKARBOWY W PUCKU
616	URZĄD SKARBOWY W PUŁAWACH
1423	URZĄD SKARBOWY W PUŁTUSKU
3213	URZĄD SKARBOWY W PYRZYCACH
2425	URZĄD SKARBOWY W RACIBORZU
1019	URZĄD SKARBOWY W RADOMSKU
413	URZĄD SKARBOWY W RADZIEJOWIE
617	URZĄD SKARBOWY W RADZYNIU PODLASKIM
3027	URZĄD SKARBOWY W RAWICZU
1020	URZĄD SKARBOWY W RAWIE MAZOWIECKIEJ
1815	URZĄD SKARBOWY W ROPCZYCACH
2426	URZĄD SKARBOWY W RUDZIE ŚLĄSKIEJ
2427	URZĄD SKARBOWY W RYBNIKU
622	URZĄD SKARBOWY W RYKACH
414	URZĄD SKARBOWY W RYPINIE
2610	URZĄD SKARBOWY W SANDOMIERZU
1817	URZĄD SKARBOWY W SANOKU
423	URZĄD SKARBOWY W SĘPÓLNIE KRAJEŃSKIM
1426	URZĄD SKARBOWY W SIEDLCACH
2428	URZĄD SKARBOWY W SIEMIANOWICACH ŚLĄSKICH
2010	URZĄD SKARBOWY W SIEMIATYCZACH
1021	URZĄD SKARBOWY W SIERADZU
1427	URZĄD SKARBOWY W SIERPCU
2611	URZĄD SKARBOWY W SKARŻYSKU-KAMIENNEJ
1022	URZĄD SKARBOWY W SKIERNIEWICACH
806	URZĄD SKARBOWY W SŁUBICACH
3028	URZĄD SKARBOWY W SŁUPCY
2216	URZĄD SKARBOWY W SŁUPSKU
1428	URZĄD SKARBOWY W SOCHACZEWIE
1429	URZĄD SKARBOWY W SOKOŁOWIE PODLASKIM
2011	URZĄD SKARBOWY W SOKÓŁCE
2217	URZĄD SKARBOWY W SOPOCIE
2429	URZĄD SKARBOWY W SOSNOWCU
1818	URZĄD SKARBOWY W STALOWEJ WOLI
2612	URZĄD SKARBOWY W STARACHOWICACH
3214	URZĄD SKARBOWY W STARGARDZIE
2218	URZĄD SKARBOWY W STAROGARDZIE GDAŃSKIM
2613	URZĄD SKARBOWY W STASZOWIE
1612	URZĄD SKARBOWY W STRZELCACH OPOLSKICH
218	URZĄD SKARBOWY W STRZELINIE
1819	URZĄD SKARBOWY W STRZYŻOWIE
1222	URZĄD SKARBOWY W SUCHEJ BESKIDZKIEJ
813	URZĄD SKARBOWY W SULĘCINIE
2012	URZĄD SKARBOWY W SUWAŁKACH
3029	URZĄD SKARBOWY W SZAMOTUŁACH
3218	URZĄD SKARBOWY W SZCZECINKU
2816	URZĄD SKARBOWY W SZCZYTNIE
1430	URZĄD SKARBOWY W SZYDŁOWCU
3030	URZĄD SKARBOWY W ŚREMIE
219	URZĄD SKARBOWY W ŚRODZIE ŚLĄSKIEJ
3031	URZĄD SKARBOWY W ŚRODZIE WIELKOPOLSKIEJ
220	URZĄD SKARBOWY W ŚWIDNICY
807	URZĄD SKARBOWY W ŚWIEBODZINIE
415	URZĄD SKARBOWY W ŚWIECIU
3219	URZĄD SKARBOWY W ŚWINOUJŚCIU
1820	URZĄD SKARBOWY W TARNOBRZEGU
2430	URZĄD SKARBOWY W TARNOWSKICH GÓRACH
2219	URZĄD SKARBOWY W TCZEWIE
618	URZĄD SKARBOWY W TOMASZOWIE LUBELSKIM
1023	URZĄD SKARBOWY W TOMASZOWIE MAZOWIECKIM
221	URZĄD SKARBOWY W TRZEBNICY
418	URZĄD SKARBOWY W TUCHOLI
3032	URZĄD SKARBOWY W TURKU
2431	URZĄD SKARBOWY W TYCHACH
1821	URZĄD SKARBOWY W USTRZYKACH DOLNYCH
1225	URZĄD SKARBOWY W WADOWICACH
222	URZĄD SKARBOWY W WAŁBRZYCHU
3220	URZĄD SKARBOWY W WAŁCZU
419	URZĄD SKARBOWY W WĄBRZEŹNIE
3033	URZĄD SKARBOWY W WĄGROWCU
2220	URZĄD SKARBOWY W WEJHEROWIE
1441	URZĄD SKARBOWY W WĘGROWIE
1226	URZĄD SKARBOWY W WIELICZCE
1024	URZĄD SKARBOWY W WIELUNIU
1027	URZĄD SKARBOWY W WIERUSZOWIE
2432	URZĄD SKARBOWY W WODZISŁAWIU ŚLĄSKIM
3034	URZĄD SKARBOWY W WOLSZTYNIE
1442	URZĄD SKARBOWY W WOŁOMINIE
223	URZĄD SKARBOWY W WOŁOWIE
2013	URZĄD SKARBOWY W WYSOKIEM MAZOWIECKIEM
1443	URZĄD SKARBOWY W WYSZKOWIE
2433	URZĄD SKARBOWY W ZABRZU
1227	URZĄD SKARBOWY W ZAKOPANEM
2014	URZĄD SKARBOWY W ZAMBROWIE
620	URZĄD SKARBOWY W ZAMOŚCIU
2434	URZĄD SKARBOWY W ZAWIERCIU
230	URZĄD SKARBOWY W ZĄBKOWICACH ŚLĄSKICH
1025	URZĄD SKARBOWY W ZDUŃSKIEJ WOLI
1026	URZĄD SKARBOWY W ZGIERZU
231	URZĄD SKARBOWY W ZGORZELCU
232	URZĄD SKARBOWY W ZŁOTORYI
3036	URZĄD SKARBOWY W ZŁOTOWIE
1444	URZĄD SKARBOWY W ZWOLENIU
810	URZĄD SKARBOWY W ŻAGANIU
811	URZĄD SKARBOWY W ŻARACH
421	URZĄD SKARBOWY W ŻNINIE
2435	URZĄD SKARBOWY W ŻORACH
1445	URZĄD SKARBOWY W ŻUROMINIE
1446	URZĄD SKARBOWY W ŻYRARDOWIE
2436	URZĄD SKARBOWY W ŻYWCU
1431	URZĄD SKARBOWY WARSZAWA-BEMOWO
1432	URZĄD SKARBOWY WARSZAWA-BIELANY
1433	URZĄD SKARBOWY WARSZAWA-MOKOTÓW
1434	URZĄD SKARBOWY WARSZAWA-PRAGA
1437	URZĄD SKARBOWY WARSZAWA-TARGÓWEK
1438	URZĄD SKARBOWY WARSZAWA-URSYNÓW
1439	URZĄD SKARBOWY WARSZAWA-WAWER
1440	URZĄD SKARBOWY WARSZAWA-WOLA
420	URZĄD SKARBOWY WE WŁOCŁAWKU
619	URZĄD SKARBOWY WE WŁODAWIE
2615	URZĄD SKARBOWY WE WŁOSZCZOWIE
3035	URZĄD SKARBOWY WE WRZEŚNI
814	URZĄD SKARBOWY WE WSCHOWIE
224	URZĄD SKARBOWY WROCŁAW-FABRYCZNA
225	URZĄD SKARBOWY WROCŁAW-KRZYKI
226	URZĄD SKARBOWY WROCŁAW-PSIE POLE
227	URZĄD SKARBOWY WROCŁAW-STARE MIASTO
228	URZĄD SKARBOWY WROCŁAW-ŚRÓDMIEŚCIE
2871	WARMIŃSKO-MAZURSKI URZĄD SKARBOWY W OLSZTYNIE
3271	ZACHODNIOPOMORSKI URZĄD SKARBOWY W SZCZECINIE
						`,
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
							response_message: {
								type: "string",
							},
							nextMode: {
								type: "string",
								enum: ["default", "addressCollection", "finished"],
							},
							userForm: {
								type: "object",
								properties: {
									kodUrzedu: {
										type: "string",
										description:
											"Użytkownik podaje przybliżoną nazwę urzędu w mieście (można zapytać go o podaj nazwę swojego urzędu), następnie na podstawie podanej listy zczytywany jest numer urzędu i podawany jest w tym polu",
									},
									osoba_PESEL: {
										type: "string",
										description:
											"PESEL number (personal identification number). It absolutely has to be 11 digit integer number. Required only if NIP is not provided, so mention a possibility of providing NIP instead, but default to PESEL",
									},
									osoba_NIP: {
										type: "string",
										description:
											"NIP number (tax identification number). Jeśli został podany pesel, nie wymagaj. Jeśli nie ma peselu, pole wymagane. 10 cyfrowy numer, zapisz go BEZ podziału myślnikami, ale nie wymagaj ich braku od użytkownika.",
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
										description:
											"Date of birth (format: YYYY-MM-DD) but ask user without any specific format (but internally convert it at output to (format: YYYY-MM-DD)). Jeśli użytkownik podał numer pesel, możesz atuomatycznie uzupełnić wiek urodzenia. W takim przypadku potwierdź swoje przypuszczenie z użytkownikiem",
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
										description:
											"DATA DOKONANIA CZYNNOŚCI. Pole wymagane. Zasugeruj użytkownikowi, że może napisać wczoraj, przedwczoraj itd, a zostanie to zrozumiałe. Format końcowy: (format: YYYY-MM-DD)",
									},
									p7: {
										type: "string",
										description:
											"PODMIOT SKŁADAJĄCY DEKLARACJĘ. Pole obowiązkowe. Musi przyjmować wartość: 1 (podmiot zobowiązany solidarnie do zapłaty podatku), lub 5 (inny podmiot). Zapytaj o to użytkownika.",
									},
									p21: {
										type: "string",
										description:
											"Miejsce położenia rzeczy lub miejsce wykonywania prawa majątkowego. Musi przyjmować wartość: 0 (jest niewypełnione), 1 (terytorium RP) lub 2 (poza terytorium RP). Pole wymagane!!! Zapytaj użytkownika o opcje i sam wybierz właściwy numer.",
									},
									p22: {
										type: "string",
										description:
											"MIEJSCE DOKONANIA CZYNNOŚCI CYWILNOPRAWNEJ. Musi przyjmować wartość: 0 (jest niewypełnione), 1 (terytorium RP) lub 2 (poza terytorium RP). Pole wymagane!!! Zapytaj użytkownika o opcje i sam wybierz właściwy numer.",
									},
									p23: {
										type: "string",
										description:
											"ZWIĘZŁE OKREŚLENIE TREŚCI I PRZEDMIOTU CZYNNOŚCI CYWILNOPRAWNEJ. Pole obowiązkowe. Tekstowe (należy podać markę, model samochodu, rok produkcji i inne istotne informacje o stanie technicznym)",
									},
									p26: {
										type: "string",
										description:
											"PODSTAWA OPODATKOWANIA DLA UMOWY SPRZEDAŻY. Pole obowiązkowe. WYMAGANE!!!! Musi być większa lub równa 1000 PLN (jeśli nie jest to cały formularz nie jest potrzebny) oraz podana po zaokrągleniu do pełnych złotych.",
									},
									pouczenia: {
										type: "string",
										description:
											"(Potwierdzam i akceptuję pouczenia). Musi przyjmować wartość 1 aby wniosek był poprawny. Zapytaj czy użytkownik akceptuje pouczenia. Nie pozwól ukończyc formularza zanim użytkownik nie potwierdzi pouczenia.",
									},
								},
								required: [
									"kodUrzedu",
									"p4",
									"p7",
									"p21",
									"p22",
									"p23",
									"p26",
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
