import express from "express";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// DeepSeek Chat Proxy
app.post("/api/deepseek/chat", async (req, res) => {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY || process.env.VITE_DEEPSEEK_API_KEY || 'sk-9fafa77cc6f84cdf80c92ca2c17fe2c4';
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
});

// MiniMax TTS Proxy
app.post("/api/minimax/tts", async (req, res) => {
  try {
    const groupId = process.env.MINIMAX_GROUP_ID || process.env.VITE_MINIMAX_GROUP_ID || '1998334836502172241';
    const apiKey = process.env.MINIMAX_API_KEY || process.env.VITE_MINIMAX_API_KEY || 'sk-api-IxmY5uiSH6MmO0EkjXm7L2DG7T2w9KXghoIh6pWOoU-uGRHQ5shTNmrapCZQzL9aRfSAkKX-j9L4TbxOui4O9z9miuP0YW02TzFSr0cAQYSEtCJexb1VjWY';
    const response = await fetch(`https://api.minimax.chat/v1/t2a_v2?GroupId=${groupId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
});

// SiliconFlow Image Generation Proxy
app.post("/api/siliconflow/generate", async (req, res) => {
  try {
    const apiKey = process.env.IMAGE_API_KEY || process.env.VITE_IMAGE_API_KEY || '';
    const response = await fetch('https://api.siliconflow.cn/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(req.body)
    });
    const data = await response.json();
    res.json(data);
  } catch (error: any) {
    res.status(500).json({ error: { message: error.message } });
  }
});

export default app;
