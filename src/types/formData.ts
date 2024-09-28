export type FormData = {
	celZlozenia: string;
	dataZlozenia: string;
	kodUrzedu: string;
	osobaFizyczna: {
		PESEL: string;
		NIP: string;
		imie: string;
		nazwisko: string;
		dataUrodzenia: string;
	};
	adresZamieszkaniaSiedziby: {
		kodKraju: string;
		wojewodztwo: string;
		powiat: string;
		gmina: string;
		miejscowosc: string;
		ulica: string;
		nrDomu: string;
		nrLokalu: string;
		kodPocztowy: string;
	};
	p4: string;
	p6: number;
	p7: number;
	p20: number;
	p21: number;
	p22: number;
	p23: string;
	p26: number;
	p27: number;
	p46: number;
	p53: number;
	p62: number;
};
