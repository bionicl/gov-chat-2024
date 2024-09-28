export type FormUserData = {
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
	p6: string;
	p7: string;
	p20: string;
	p21: string;
	p22: string;
	p23: string;
	p26: string;
	p27: string;
	p46: string;
	p53: string;
	p62: string;
};
