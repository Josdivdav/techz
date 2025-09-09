import { GoogleGenAI } from "@google/genai";
import express from "express";
import cors from "cors";
import "dotenv/config";

const apikey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apikey });
const app = express();
app.use(express.json());
app.use(cors({
  origin: "*",
  methods: "POST, GET, PUT"
}))
async function main(query) {
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: query,
    config: {
      thinkingConfig: {
        thinkingBudget: 0, // Disables thinking
      },
    }
  });
  return response.text;
}

app.post("/", async (req, res) => {
  if(req.body.apiKey === "cybernia") {
    res.json({response: await main(req.body.context)})
  } else {
    const error = new Error("Invalid api key")
    res.status(500).json({error: error.message})
  }
})

app.listen(5000, () => console.log("AI is running!"));
