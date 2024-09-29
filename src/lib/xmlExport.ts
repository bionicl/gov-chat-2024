import { FormUserData } from "@/types/formData";
import { XMLBuilder } from "fast-xml-parser";
import fileDownload from "js-file-download";

// Function to download XML using js-file-download
export function downloadXML(xmlString: string, fileName: string) {
	fileDownload(xmlString, fileName);
}

// Create a new instance of XMLBuilder
const builder = new XMLBuilder({
	ignoreAttributes: false, // Set to true to ignore attributes
	format: true, // Format the output
});

// Function to generate XML with the option to include OsobaFizyczna
export const generateXML = (userForm: Partial<FormUserData>): string => {
	// Construct the data object

	console.log("Hello: " + userForm.osoba_imie);

	const price = parseInt(userForm.p26 ?? "0");

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
					"#text": userForm.p6,
				},
				Data: {
					"@_poz": "P_4",
					"#text": userForm.p4,
				},
				KodUrzedu: userForm.kodUrzedu,
			},
			Podmiot1: {
				"@_rola": "Podatnik",
				...(true // replace with includeOsobaFizyczna
					? {
							OsobaFizyczna: {
								PESEL: userForm.osoba_PESEL,
								ImiePierwsze: userForm.osoba_imie,
								Nazwisko: userForm.osoba_nazwisko,
								DataUrodzenia: userForm.osoba_dataUrodzenia,
							},
					  }
					: {}),
				AdresZamieszkaniaSiedziby: {
					"@_rodzajAdresu": "RAD",
					AdresPol: {
						KodKraju: userForm.adres_kodKraju,
						Wojewodztwo: userForm.adres_wojewodztwo,
						Powiat: userForm.adres_powiat,
						Gmina: userForm.adres_gmina,
						Ulica: userForm.adres_ulica,
						NrDomu: userForm.adres_nrDomu,
						NrLokalu: userForm.adres_nrLokalu,
						Miejscowosc: userForm.adres_miejscowosc,
						KodPocztowy: userForm.adres_kodPocztowy,
					},
				},
			},
			PozycjeSzczegolowe: {
				P_7: userForm.p7,
				P_20: 1,
				P_21: userForm.p21,
				P_22: userForm.p22,
				P_23: userForm.p23,
				P_26: price,
				P_27: Math.round(price * 0.02),
				P_46: Math.round(price * 0.02),
				P_53: Math.round(price * 0.02),
				P_62: 1,
			},
			Pouczenia: 1,
		},
	};

	// Generate XML from the data object
	return builder.build(data);
};
