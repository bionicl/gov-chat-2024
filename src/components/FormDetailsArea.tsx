import { FormUserData } from "@/types/formData";
import {
	Card,
	Collapse,
	CollapseProps,
	Descriptions,
	DescriptionsProps,
	Typography,
} from "antd";

const { Title } = Typography;

type Props = {
	formData: Partial<FormUserData>;
};

export default function FormDetailsArea(props: Props) {
	const personalDataFields: DescriptionsProps["items"] = [
		{
			key: "1",
			label: "Imię",
			children: props.formData.osoba_imie,
		},
		{
			key: "2",
			label: "Nazwisko",
			children: props.formData.osoba_nazwisko,
		},
		{
			key: "3",
			label: "Data urodzenia",
			children: props.formData.osoba_dataUrodzenia,
		},
		{
			key: "4",
			label: "NIP",
			children: props.formData.osoba_NIP,
		},
		{
			key: "5",
			label: "PESEL",
			children: props.formData.osoba_PESEL,
		},
	];

	const addressDataFields: DescriptionsProps["items"] = [
		{
			key: "1",
			label: "Kraj",
			children: props.formData.adres_kodKraju,
		},
		{
			key: "2",
			label: "Województwo",
			children: props.formData.adres_wojewodztwo,
		},
		{
			key: "3",
			label: "Powiat",
			children: props.formData.adres_powiat,
		},
		{
			key: "4",
			label: "Gmina",
			children: props.formData.adres_gmina,
		},
		{
			key: "5",
			label: "Miejscowośc",
			children: props.formData.adres_miejscowosc,
		},
		{
			key: "6",
			label: "Ulica",
			children: props.formData.adres_ulica,
		},
		{
			key: "7",
			label: "Numer domu",
			children: props.formData.adres_nrDomu,
		},
		{
			key: "8",
			label: "Numer mieszkania",
			children: props.formData.adres_nrLokalu,
		},
		{
			key: "9",
			label: "Kod pocztowy",
			children: props.formData.adres_kodPocztowy,
		},
	];

	const purchaseDataFields: DescriptionsProps["items"] = [
		{
			key: "1",
			label: "Przedmiot opodatkowania",
			children: props.formData.p20,
		},
		{
			key: "2",
			label: "Miejsce położenia rzeczy",
			children: props.formData.p21,
		},
		{
			key: "3",
			label: "Miejsce dokonania czynności cywilnoprawnej",
			children: props.formData.p22,
		},
		{
			key: "4",
			label: "Opis samochodu",
			children: props.formData.p23,
		},
		{
			key: "5",
			label: "Podstawa opodatkowania",
			children: props.formData.p26,
		},
		{
			key: "6",
			label: "Należny podatek",
			children: Math.round(parseInt(props.formData.p26 ?? "0")) * 0.02,
		},
	];

	const otherDataFields: DescriptionsProps["items"] = [
		{
			key: "1",
			label: "Data dokonania czynności",
			children: props.formData.p4,
		},
		{
			key: "2",
			label: "Cel złożenia deklaracji",
			children: props.formData.p6,
		},
		{
			key: "3",
			label: "Podmiot składający deklarację",
			children: props.formData.p7,
		},
	];

	const items: CollapseProps["items"] = [
		{
			key: "1",
			label: "Dane personalne",
			children: (
				<Descriptions
					column={1}
					// title="Dane personalne"
					items={personalDataFields}
					// style={{ marginBottom: 36, marginTop: 32 }}
				/>
			),
		},
		{
			key: "2",
			label: "Adres",
			children: (
				<Descriptions
					column={1}
					// title="Adres"
					items={addressDataFields}
					// style={{ marginBottom: 36 }}
				/>
			),
		},
		{
			key: "3",
			label: "Informacje o sprzedaży",
			children: (
				<Descriptions
					column={1}
					// title="Informacje o sprzedaży"
					items={purchaseDataFields}
					// style={{ marginBottom: 36 }}
				/>
			),
		},
		{
			key: "4",
			label: "Informacje dodatkowe",
			children: (
				<Descriptions
					column={1}
					// title="Informacje dodatkowe"
					items={otherDataFields}
					// style={{ marginBottom: 36 }}
				/>
			),
		},
	];

	return (
		<Card
			style={{
				width: 400,
				minHeight: "calc(100% - 96px)",
				position: "relative",
			}}
			bordered={false}
		>
			<div
				style={{
					height: "calc(100vh - 96px - 96px - 48px)",
					overflowY: "scroll",
					overflowX: "hidden",
				}}
			>
				<Title level={3}>Postęp wypełnienia formularza</Title>
				<Collapse items={items} defaultActiveKey={["1"]} />
			</div>
			{/* <div style={{ marginTop: 16, height: 40 }}>test</div> */}
		</Card>
	);
}
