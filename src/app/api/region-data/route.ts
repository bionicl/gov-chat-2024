import { Address } from "@/types/address";
import { Message } from "@/types/message";
import csv from 'csv-reader';
import { promises as fs } from 'fs';
import path from 'path';

type Props = {
	address: Address;
	previousInput: Message[];
};

interface ParsedData {
	[key: string]: string; // Dynamic keys (string or number)
}

// Define expected column names
const expectedColumns = [
	'WOJ',
	'POW',
	'GMI',
	'RODZ',
	'NAZWA',
	'NAZWA_DOD',
	'STAN_NA'
];


export const readCsvAndParse = async (fileName: string): Promise<ParsedData[]> => {
	const csvFilePath = path.join(process.cwd(), 'data', fileName);
	const fileContents = await fs.readFile(csvFilePath, 'utf8');

	const records: ParsedData[] = [];

	return new Promise<ParsedData[]>((resolve, reject) => {
		const parser = csv();

		parser.on('data', (row: any) => {
			const parsedRow: ParsedData = {};

			// Ensure the row has the expected number of columns
			if (row.length !== expectedColumns.length) {
				return reject(new Error('CSV row does not match expected column count.'));
			}

			// Map the expected columns to the row values
			expectedColumns.forEach((columnName, index) => {
				parsedRow[columnName] = row[index] || ''; // Assign the value or an empty string if undefined
			});

			records.push(parsedRow);
		});

		parser.on('end', () => {
			resolve(records);
		});

		parser.on('error', (error: Error) => {
			reject(error);
		});

		parser.write(fileContents);
		parser.end();
	});
};


export async function POST(req: Request) {
	const body: Props = await req.json();

	async function validateAddress(address: Address) {
		var outputString = "";
		try {
			const parsedData = await readCsvAndParse('TERC_Urzedowy_2024-09-29.csv');

			console.log(parsedData[0].POW);
			console.log(parsedData[1].POW);
			console.log(parsedData[2].POW);

			// Example: Accessing the parsed data
			// parsedData.forEach((record, index) => {
			// 	console.log(`Record ${index + 1}:`);
			// 	for (const [key, value] of Object.entries(record)) {
			// 		console.log(`  ${key}: ${value}`);
			// 	}
			// });

			// Validate user data

		} catch (error) {
			outputString = "failed";
		}

		const jsonObject = {
			output: outputString,
		};
		return jsonObject;
	}

	const response = await validateAddress(body.address);
	return new Response(JSON.stringify(response), {
		status: 200,
		headers: { "Content-Type": "application/json" },
	});
	// res.status(200).json({ response })
}
