import express from "express";
import multer from "multer";
import cors from "cors";
import fs from "fs";
import { GoogleGenerativeAI } from "@google/generative-ai";

const app = express();
app.use(cors());
const upload = multer({ dest: "uploads/" });

// 🔑 Cole aqui sua API KEY do Gemini
const genAI = new GoogleGenerativeAI("SUA_API_KEY_GEMINI_AQUI");

app.post("/analisar", upload.single("imagem"), async (req, res) => {
  try {
    const filePath = req.file.path;
    const image = fs.readFileSync(filePath);

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent([
      {
        role: "user",
        parts: [
          { text: "Analise essa imagem de lesão por pressão e descreva o estágio e possíveis recomendações clínicas:" },
          { inlineData: { mimeType: "image/jpeg", data: image.toString("base64") } },
        ],
      },
    ]);

    fs.unlinkSync(filePath); // apaga a imagem temporária
    res.json({ resposta: result.response.text() });
  } catch (error) {
