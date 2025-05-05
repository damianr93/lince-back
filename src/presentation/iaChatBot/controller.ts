import { Request, Response, NextFunction } from 'express';
import { envs } from '../../config/envs';
import OpenAI from 'openai';

export class IaOpenAI {
    openai = new OpenAI({
        apiKey: envs.IA_API_KEY,
    });

    iaOpenai = async (req: Request, res: Response, next: NextFunction) => {
        try {
            //  ejemplo: { messages: [ { role: 'user', content: 'Hola' } ] }
            const { messages } = req.body;
            if (!messages || !Array.isArray(messages)) {
                return res.status(400).json({ error: 'Se espera un array "messages" en el body.' });
            }

            const systemPrompt = { role: 'system', content: 'Eres un asistente útil y amable.' };
            const fullMessages = [systemPrompt, ...messages];

            const completion = await this.openai.chat.completions.create({
                model: 'gpt-3.5-turbo',
                messages: fullMessages,
                temperature: 0.7,
            });

            const assistantMessage = completion.choices[0].message;

            return res.json({ message: assistantMessage });

        } catch (error) {
            console.error('Error en IA:', error);
            return next(error);
        }
    };
}
