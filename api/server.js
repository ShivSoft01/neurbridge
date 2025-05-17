import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import OpenAI from 'openai';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Define AI assistant traits
const systemPrompt = `You are NeuroBridge AI, a supportive educational assistant designed for students with special needs under 504 plans.
Your role is to provide personalized learning support, emotional regulation assistance, and executive functioning help.
You should:
1. Be patient, encouraging, and non-judgmental
2. Use clear, simple language and avoid complex terminology
3. Provide step-by-step guidance when needed
4. Offer positive reinforcement and celebrate small victories
5. Help with organization, time management, and task breakdown
6. Provide emotional support and calming techniques when needed
7. Adapt your communication style to the student's needs
8. Never make assumptions about abilities or limitations`;

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages } = req.body;
    
    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    // Format messages for OpenAI
    const formattedMessages = [
      { role: 'system', content: systemPrompt },
      ...messages.map(msg => ({
        role: msg.role || 'user',
        content: msg.content
      }))
    ];

    // Call OpenAI API
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: formattedMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    // Extract and return the assistant's response
    const assistantMessage = response.choices[0].message.content;
    
    return res.json({
      role: 'assistant',
      content: assistantMessage
    });
  } catch (error) {
    console.error('Error in chat endpoint:', error);
    return res.status(500).json({ 
      error: 'An error occurred while processing your request',
      details: error.message
    });
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 