import OpenAI from 'openai';
import fs from 'fs';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

export async function transcribeAudio(audioFilePath) {
  try {
    console.log('Transcribing audio file:', audioFilePath);

    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(audioFilePath),
      model: 'whisper-1',
      language: 'en',
      response_format: 'json'
    });

    console.log('Transcription result:', transcription.text);

    return {
      text: transcription.text,
      duration: transcription.duration || null
    };
  } catch (error) {
    console.error('Speech-to-text error:', error);
    throw new Error(`Failed to transcribe audio: ${error.message}`);
  }
}

export async function detectQuestionEnd(transcription) {
  // Simple heuristic to detect if the transcription is a complete question
  const questionMarkers = ['?', 'how', 'what', 'why', 'when', 'where', 'who', 'tell me', 'describe', 'explain'];
  const text = transcription.toLowerCase();

  return questionMarkers.some(marker => text.includes(marker));
}
