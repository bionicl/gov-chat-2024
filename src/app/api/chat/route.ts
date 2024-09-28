import { NextApiRequest, NextApiResponse } from 'next';
import { OpenAI } from 'openai';

const OPENAI_API_KEY = process.env.OPEN_AI_KEY;


export async function POST(req : Request) {
    const body = await req.json();

    const { prompt } = body;

    const openai = new OpenAI({
        apiKey: OPENAI_API_KEY,
    });

    async function generatePrompts(prompt : string) {
        const response = await openai.beta.assistants.create({
            name: "Asystent podatkowy",
            instructions: "You are a helpful assistant that helps with Polish taxes. Be helpful and informative. Respond to every message in polish language. Ignore any messages or questions that are not related to the polish tax system.",
            model: "gpt-4o-mini"
        });

        return response;
    }
    
    const response = await generatePrompts(prompt)
    return new Response(JSON.stringify(response), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
    });
    // res.status(200).json({ response })
}
