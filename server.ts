import express from "express";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 8080;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

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
      if (data.error) {
        console.error("DeepSeek API Error:", data.error);
      }
      res.json(data);
    } catch (error: any) {
      console.error("DeepSeek Proxy Error:", error);
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

  // Vite middleware for development
  const isProduction = process.env.NODE_ENV === "production" || process.env.ZEABUR === "true";
  
  if (!isProduction) {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
