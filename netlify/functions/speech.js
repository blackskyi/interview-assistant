const multipart = require('parse-multipart-data');
const OpenAI = require('openai');
const { writeFile, unlink } = require('fs/promises');
const { join } = require('path');
const { tmpdir } = require('os');
const fs = require('fs');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  let tempFilePath = null;

  try {
    const contentType = event.headers['content-type'];
    const boundary = contentType.split('boundary=')[1];
    const parts = multipart.parse(Buffer.from(event.body, 'base64'), boundary);

    // Find the audio file part
    const audioPart = parts.find(part => part.name === 'audio');

    if (!audioPart) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({ error: 'No audio file uploaded' })
      };
    }

    // Save to temp file (Whisper API requires a file)
    tempFilePath = join(tmpdir(), `audio-${Date.now()}.webm`);
    await writeFile(tempFilePath, audioPart.data);

    console.log('Transcribing audio...');

    // Transcribe using Whisper
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream(tempFilePath),
      model: 'whisper-1',
      language: 'en',
      response_format: 'json'
    });

    // Clean up temp file
    if (tempFilePath) {
      await unlink(tempFilePath).catch(() => {});
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        success: true,
        transcription: transcription.text,
        timestamp: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Transcription error:', error);

    // Clean up temp file on error
    if (tempFilePath) {
      await unlink(tempFilePath).catch(() => {});
    }

    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        error: 'Failed to transcribe audio',
        message: error.message
      })
    };
  }
};
