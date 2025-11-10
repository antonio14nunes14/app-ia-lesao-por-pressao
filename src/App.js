import React, { useState, useRef } from "react";
import { analisarImagem } from "./geminiService.js";
import gerarRelatorio from "./Relatorio.js"; // ✅ Importa a função certa

function App() {
  const [dados, setDados] = useState({
    nome: "",
    idade: "",
    sexo: "",
    leito: "",
    observacoes: "",
  });
  const [imagem, setImagem] = useState(null);
  const [resultado, setResultado] = useState("");
  const [processando, setProcessando] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  // 🟩 Iniciar câmera traseira
  const iniciarCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" }, width: 640, height: 480 },
      });
      videoRef.current.srcObject = stream;
    } catch (error) {
      alert("Erro ao acessar a câmera: " + error.message);
    }
  };

  // 📸 Capturar e comprimir imagem
  const capturarFoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = 640;
    const height = 480;
    canvas.width = width;
    canvas.height = height;
    ctx.drawImage(video, 0, 0, width, height);
    const dataURL = canvas.toDataURL("image/jpeg", 0.7); // 🔧 compressão
    setImagem(dataURL);
  };

  // 🧠 Enviar para o Gemini
  const analisar = async () => {
    if (!imagem) {
      alert("Capture uma imagem primeiro!");
      return;
    }

    setProcessando(true);
    setResultado("🔄 Analisando imagem...");

    const resposta = await analisarImagem(imagem);
    setResultado(resposta);
    setProcessando(false);
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2>📋 Dados do Paciente</h2>

      <input
        type="text"
        placeholder="Nome"
        value={dados.nome}
        onChange={(e) => setDados({ ...dados, nome: e.target.value })}
      />
      <input
        type="number"
        placeholder="Idade"
        value={dados.idade}
        onChange={(e) => setDados({ ...dados, idade: e.target.value })}
      />
      <input
        type="text"
        placeholder="Sexo"
        value={dados.sexo}
        onChange={(e) => setDados({ ...dados, sexo: e.target.value })}
      />
      <input
        type="text"
        placeholder="Leito"
        value={dados.leito}
        onChange={(e) => setDados({ ...dados, leito: e.target.value })}
      />
      <textarea
        placeholder="Observações"
        value={dados.observacoes}
        onChange={(e) => setDados({ ...dados, observacoes: e.target.value })}
      />

      <h3>📷 Captura da Imagem</h3>
      <video ref={videoRef} autoPlay playsInline style={{ width: "100%" }} />
      <button onClick={iniciarCamera}>Iniciar Câmera</button>
      <button onClick={capturarFoto}>Capturar Foto</button>
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {imagem && (
        <>
          <h4>Prévia:</h4>
          <img src={imagem} alt="capturada" style={{ width: "100%", borderRadius: 8 }} />
          <button onClick={analisar} disabled={processando}>
            {processando ? "⏳ Analisando..." : "🔍 Analisar Imagem"}
          </button>
        </>
      )}

      {resultado && (
        <div style={{ marginTop: 20 }}>
          <h3>🩺 Resultado:</h3>
          <p>{resultado}</p>

          {/* ✅ Botão de geração de relatório com await e tratamento de erro */}
          <button
            onClick={async () => {
              try {
                await gerarRelatorio(dados, imagem, resultado);
              } catch (e) {
                console.error("Erro ao gerar relatório:", e);
                alert("Ocorreu um erro ao gerar o relatório. Verifique o console.");
              }
            }}
            style={{
              marginTop: 10,
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "10px 15px",
              border: "none",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            📄 Gerar Relatório PDF
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
