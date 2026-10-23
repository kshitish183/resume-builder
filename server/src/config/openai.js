import OpenAI from 'openai';

let client = null;

export const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) return null;
  if (!client) {
    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }
  return client;
};

export const isAIConfigured = () => Boolean(process.env.OPENAI_API_KEY);
