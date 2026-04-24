/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');
  console.log('Gemini API Key defined:', !!process.env.GEMINI_API_KEY);
  if (process.env.GEMINI_API_KEY) {
    console.log('Key length:', process.env.GEMINI_API_KEY.length);
    console.log('Key prefix:', process.env.GEMINI_API_KEY.substring(0, 4));
  }
  
  // Initialize model with Google Search grounding for real-time data
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    // @ts-ignore - tools might not be in the current types but supported by the model
    tools: [
      {
        googleSearch: {},
      } as any,
    ],
  });

  app.use(express.json());

  // API Route for real-time stock data
  app.get('/api/stocks', async (req, res) => {
    try {
      const prompt = `
        Search for the LATEST, real-time market data from Google Finance as of today (Simulated Date: April 24, 2026) for:
        1. Indices: KOSPI, KOSDAQ, NASDAQ, S&P 500, DOW JONES
        2. Forex: USD/KRW (1달러당 원화 가격, e.g., 1380.5)
        3. Stocks (KRW): 삼성전자 (005930), SK하이닉스 (000660), NAVER (035420), 에코프로비엠 (247540), HLB (028300), 레인보우로보틱스 (277810), 셀트리온 (068270)
        4. Stocks (USD): Apple (AAPL), NVIDIA (NVDA)
        
        CRITICAL INSTRUCTION: 
        - For NVIDIA (NVDA), ensure you provide the POST-SPLIT price (likely between $100 and $150). Do NOT provide the old pre-split price of $800+.
        - Ensure values are as accurate as possible for April 2024-2025 actual trends if 2026 data is not literally searchable.
        
        Format as JSON ONLY:
        {
          "indices": [{"name": "KOSPI", "value": 2650.1, "change": -5.2, "changePercent": -0.19}, ...],
          "stocks": [{"symbol": "005930", "price": 78000, "change": 1200, "changePercent": 1.56}, ...],
          "forex": [{"name": "USD/KRW", "value": 1380.5, "change": 2.5, "changePercent": 0.18}]
        }
        Only return the JSON. No markdown, no conversational text.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Basic JSON extraction
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const data = JSON.parse(jsonMatch[0]);
        res.json(data);
      } else {
        throw new Error("Failed to parse JSON from AI response");
      }
    } catch (error) {
      console.error("Error fetching stock data:", error);
      res.status(500).json({ error: "Failed to fetch real-time data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
