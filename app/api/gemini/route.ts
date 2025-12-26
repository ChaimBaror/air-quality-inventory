import { NextRequest, NextResponse } from 'next/server';
import { generateText, chatWithGemini } from '@/lib/gemini';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { prompt, messages, model } = body;

    if (!prompt && !messages) {
      return NextResponse.json(
        { error: 'Either "prompt" or "messages" must be provided' },
        { status: 400 }
      );
    }

    let result: string;

    if (messages && Array.isArray(messages)) {
      // Chat mode
      result = await chatWithGemini(messages, model || 'gemini-pro');
    } else {
      // Simple prompt mode
      result = await generateText(prompt, model || 'gemini-pro');
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    console.error('Gemini API error:', error);
    return NextResponse.json(
      { 
        error: error.message || 'Failed to generate response from Gemini',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    message: 'Gemini API endpoint. Use POST to send requests.',
    usage: {
      simple: { prompt: 'Your question here' },
      chat: { messages: [{ role: 'user', parts: 'Hello' }] }
    }
  });
}

