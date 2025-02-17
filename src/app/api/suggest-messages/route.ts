import {  openai } from '@ai-sdk/openai';
import { streamText } from 'ai';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
try {
      const { messages } = await req.json();
    
      const result = await streamText({
        model: openai('gpt-4-turbo'),
        messages,
      });
    
      return result.toAIStreamResponse();
} catch (error) {
   console.error("An unexpected error occured", error)
   return Response.json({
    success: false,
    message: "Internal server error "
   },{status: 500})
}
}