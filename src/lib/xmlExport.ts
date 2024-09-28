import { XMLBuilder } from "fast-xml-parser";
import fileDownload from "js-file-download";

// Function to download XML using js-file-download
function downloadXML(xmlString: string, fileName: string) {
	fileDownload(xmlString, fileName);
}

// Create a new instance of XMLBuilder
const builder = new XMLBuilder({
	ignoreAttributes: false, // Set to true to ignore attributes
	format: true, // Format the output
});

// Function to generate XML with the option to include OsobaFizyczna
const generateXML = (includeOsobaFizyczna: boolean): string => {
	// Construct the data object
	const data: any = {
		Deklaracja: {
			"@_xmlns": "http://crd.gov.pl/wzor/2023/12/13/13064/", // Namespace
			Naglowek: {
				KodFormularza: {
					"@_kodSystemowy": "PCC-3 (6)",
					"@_kodPodatku": "PCC",
					"@_rodzajZobowiazania": "Z",
					"@_wersjaSchemy": "1-0E",
					"#text": "PCC-3",
				},
				WariantFormularza: "6",
				CelZlozenia: {
					"@_poz": "P_6",
					"#text": "1",
				},
				Data: {
					"@_poz": "P_4",
					"#text": "2024-07-29",
				},
				KodUrzedu: "0271",
			},
			Podmiot1: {
				"@_rola": "Podatnik",
				...(includeOsobaFizyczna
					? {
							OsobaFizyczna: {
								PESEL: "54121832134",
								ImiePierwsze: "KAMIL",
								Nazwisko: "WIRTUALNY",
								DataUrodzenia: "1954-12-18",
							},
					  }
					: {}),
				AdresZamieszkaniaSiedziby: {
					"@_rodzajAdresu": "RAD",
					AdresPol: {
						KodKraju: "PL",
						Wojewodztwo: "ŚLĄSKIE",
						Powiat: "M. KATOWICE",
						Gmina: "M. KATOWICE",
						Ulica: "ALPEJSKA",
						NrDomu: "6",
						NrLokalu: "66",
						Miejscowosc: "KATOWICE",
						KodPocztowy: "66-666",
					},
				},
			},
			PozycjeSzczegolowe: {
				P_7: "2",
				P_20: "1",
				P_21: "1",
				P_22: "1",
				P_23: "Sprzedałem auto",
				P_24: "10000",
				P_25: "100",
				P_46: "100",
				P_53: "100",
				P_62: "1",
			},
			Pouczenia: "1",
		},
	};

	// Generate XML from the data object
	return builder.build(data);
};

export function downloadTestXml() {
	const xml1 = generateXML(true);
	const xml2 = generateXML(false);
	downloadXML(xml1, "withfizyczna.xml");
	downloadXML(xml2, "withoutfizyczna.xml");
}
