# Gemini AI Integration

This project includes Google Gemini AI integration for AI-powered features.

## Setup

1. Create a `.env.local` file in the root directory with your Gemini API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

2. The API key is already configured: `AIzaSyC-DuztLeWHjZqcEi4ZjW0ZEApK1mLwTCU`

## Usage

### Server-Side (API Route)

The Gemini API is available at `/api/gemini`:

```typescript
// Simple prompt
const response = await fetch('/api/gemini', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    prompt: 'What is the weather today?',
    model: 'gemini-pro' // optional
  })
});

const data = await response.json();
console.log(data.result);
```

### Client-Side (React Hook)

Use the `useGemini` hook in your components:

```typescript
import { useGemini } from '@/lib/hooks/useGemini';

function MyComponent() {
  const { generateText, chat, loading, error } = useGemini();

  const handleClick = async () => {
    const result = await generateText('Explain quantum computing');
    if (result) {
      console.log(result);
    }
  };

  return (
    <button onClick={handleClick} disabled={loading}>
      {loading ? 'Generating...' : 'Ask Gemini'}
    </button>
  );
}
```

### Direct Server-Side Usage

You can also use the Gemini service directly in server components or API routes:

```typescript
import { generateText, chatWithGemini } from '@/lib/gemini';

// Simple text generation
const result = await generateText('Your prompt here');

// Chat mode
const chatResult = await chatWithGemini([
  { role: 'user', parts: 'Hello' },
  { role: 'model', parts: 'Hi there!' },
  { role: 'user', parts: 'How are you?' }
]);
```

## Available Models

- `gemini-pro` (default) - Best for text generation
- `gemini-pro-vision` - For image understanding (requires image input)

## Error Handling

All functions include error handling. Check the `error` state when using the hook, or catch errors when using the API directly.

