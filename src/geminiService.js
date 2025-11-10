// src/geminiService.js
export async function analisarImagem(base64Image) {
  const apiKey = "AIzaSyDnahFZbDH5EX1VaWZ0x2P7qr1R6Q1J-Is"; // coloque sua chave aqui

  // modelo que foi listado na sua conta
  const modelName = "models/gemini-2.5-flash";

  try {
    if (!base64Image || typeof base64Image !== "string") {
      throw new Error("Imagem inválida (esperado dataURL base64).");
    }

    // remove cabeçalho se existir
    const b64 = base64Image.replace(/^data:image\/(png|jpeg);base64,/, "");

    // evitar enviar payloads gigantescos que travam o browser / API
    const maxSize = 3_000_000; // número de caracteres de base64 ~ 3MB
    if (b64.length > maxSize) {
      console.warn(`Base64 muito grande (${Math.round(b64.length/1000)} KB). Compactando...`);
      // se for muito grande, corta (melhor seria compactar via canvas, mas esse é um fallback)
      // preferível: ajustar capturarFoto() pra reduzir antes de setImagem
      // aqui cortamos e esperamos que ainda seja legível
      // Se quiser, retorne erro para forçar recaptura:
      return "Imagem muito grande. Refaça a captura com menor resolução (tecla Capturar Foto novamente).";
    }

    const endpoint =
      `https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=` + apiKey;

    const body = {
      contents: [
        {
          parts: [
            {
              text:
                "Você é um assistente clínico especializado em feridas (com foco em lesão por pressão). " +
                "Analise a imagem (lesão por pressão) e responda em português técnico, curto e objetivo:" +
                "\n- Provável estágio (I, II, III, IV ou não classificável)" +
                "\n- Tecidos visíveis (epiderme, necrose, esfacelo, granulação, gordura exposta, etc.)" +
                "\n- Sinais de infecção ou exsudato" +
                "\n- Recomendações iniciais para equipe de enfermagem e médica. Caso não encontre lesão só avise que a imagem capturada não apresenta sinais de lesão por pressão, reforço que diga lesão por pressão.",
            },
            {
              inline_data: {
                mime_type: "image/jpeg", // app gera JPEG
                data: b64,
              },
            },
          ],
        },
      ],
    };

    const resp = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("Resposta da API (erro):", data);
      throw new Error(data.error?.message || JSON.stringify(data));
    }

    // tentativa robusta de extrair texto (varia por versão)
    let texto =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.[0]?.text ||
      data?.candidates?.[0]?.text ||
      data?.output?.[0]?.content?.[0]?.text ||
      null;

    if (!texto) {
      // se não encontrar, printa o objeto pra debugar e retorna mensagem amigável
      console.warn("Resposta inesperada da API:", data);
      return "Análise retornou formato inesperado. Verifique console para detalhes.";
    }

    return texto;
  } catch (err) {
    console.error("Erro ao gerar análise (geminiService):", err);
    return `Erro ao gerar análise: ${err.message || err}`;
  }
}

