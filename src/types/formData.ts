export type FormUserData = {
	celZlozenia: string;
	dataZlozenia: string;
	kodUrzedu: string;
	osoba_PESEL: string;
	osoba_NIP: string;
	osoba_imie: string;
	osoba_nazwisko: string;
	osoba_dataUrodzenia: string;
	adres_kodKraju: string;
	adres_wojewodztwo: string;
	adres_powiat: string;
	adres_gmina: string;
	adres_miejscowosc: string;
	adres_ulica: string;
	adres_nrDomu: string;
	adres_nrLokalu: string;
	adres_kodPocztowy: string;
	p4: string;
	p6: string;
	p7: string;
	p20: string;
	p21: string;
	p22: string;
	p23: string;
	p26: string;
	p27: string; // calculate based on p26 * 2%
	p46: string; // = p27
	p53: string; // KWOTA PODATKU DO ZAPŁATY, WYLICZENIE=ROUN(P46, 0)
	p62: string;
	pouczenia: string; // POUCZENIA musi przyjmować wartość: 1 (Potwierdzam i akceptuję pouczenia)
};
