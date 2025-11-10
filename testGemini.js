// testGemini.js
import fetch from "node-fetch";

const apiKey = "AIzaSyDnahFZbDH5EX1VaWZ0x2P7qr1R6Q1J-Is";

async function listarModelos() {
  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`
    );
    const data = await response.json();
    console.log("📋 Modelos disponíveis:");
    console.log(JSON.stringify(data, null, 2));
  } catch (error) {
    console.error("❌ Erro ao listar modelos:", error);
  }
}

listarModelos();
