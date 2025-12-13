import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from 'openai';
import FormData from 'form-data';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY || '',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  if (!process.env.OPENAI_API_KEY) {
    return res.status(500).json({ error: 'OpenAI API key not configured' });
  }

  try {
    const { audio_base64 } = req.body;

    if (!audio_base64) {
      return res.status(400).json({ error: 'Missing audio_base64 parameter' });
    }

    // Decode base64 audio
    const audioBuffer = Buffer.from(audio_base64, 'base64');

    // Create a File-like object for OpenAI
    const audioFile = new File([audioBuffer], 'audio.webm', { type: 'audio/webm' });

    // Transcribe using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: audioFile,
      model: 'whisper-1',
      language: 'en',
    });

    const transcribedText = transcription.text;

    // Set headers for newline-delimited JSON streaming
    res.setHeader('Content-Type', 'application/x-ndjson');
    res.setHeader('Transfer-Encoding', 'chunked');
    res.setHeader('Cache-Control', 'no-cache');

    // Send transcription result
    res.write(JSON.stringify({
      type: 'transcription',
      text: transcribedText,
      timestamp: new Date().toISOString()
    }) + '\n');

    // Optional: ElevenLabs TTS integration
    if (process.env.ELEVENLABS_API_KEY && process.env.ELEVENLABS_VOICE_ID) {
      try {
        // Generate response text using OpenAI chat (optional - you can customize this)
        const chatResponse = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'You are Aria, a helpful AI receptionist. Respond briefly and professionally.'
            },
            {
              role: 'user',
              content: transcribedText
            }
          ],
          temperature: 0.7,
        });

        const responseText = chatResponse.choices[0]?.message?.content || 'I understand.';

        // Send AI response text
        res.write(JSON.stringify({
          type: 'response',
          text: responseText,
          timestamp: new Date().toISOString()
        }) + '\n');

        // Generate audio with ElevenLabs
        const elevenLabsResponse = await fetch(
          `https://api.elevenlabs.io/v1/text-to-speech/${process.env.ELEVENLABS_VOICE_ID}`,
          {
            method: 'POST',
            headers: {
              'xi-api-key': process.env.ELEVENLABS_API_KEY,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              text: responseText,
              model_id: 'eleven_monolingual_v1',
              voice_settings: {
                stability: 0.5,
                similarity_boost: 0.5,
              }
            })
          }
        );

        if (elevenLabsResponse.ok) {
          const audioArrayBuffer = await elevenLabsResponse.arrayBuffer();
          const audioBase64 = Buffer.from(audioArrayBuffer).toString('base64');

          // Send audio response
          res.write(JSON.stringify({
            type: 'audio',
            audio_base64: audioBase64,
            timestamp: new Date().toISOString()
          }) + '\n');
        }
      } catch (ttsError) {
        console.error('ElevenLabs TTS error:', ttsError);
        // Continue without TTS
      }
    }

    res.end();
  } catch (error) {
    console.error('Whisper transcription error:', error);
    if (!res.headersSent) {
      return res.status(500).json({ 
        error: 'Failed to process audio',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
}
