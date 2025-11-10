import React, { useState, useRef } from "react";
import { analisarImagem } from "./geminiService.js";
import gerarRelatorio from "./Relatorio.js"; // ✅ Importa a função certa
import "./App.css";

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
    <div className="app-container">
      <div className="app-content">
        <div className="section-card">
          <h2 className="section-title">📋 Dados do Paciente</h2>

          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Nome"
              value={dados.nome}
              onChange={(e) => setDados({ ...dados, nome: e.target.value })}
            />
          </div>

          <div className="form-group">
            <input
              type="number"
              className="form-input"
              placeholder="Idade"
              value={dados.idade}
              onChange={(e) => setDados({ ...dados, idade: e.target.value })}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Sexo"
              value={dados.sexo}
              onChange={(e) => setDados({ ...dados, sexo: e.target.value })}
            />
          </div>

          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Leito"
              value={dados.leito}
              onChange={(e) => setDados({ ...dados, leito: e.target.value })}
            />
          </div>

          <div className="form-group">
            <textarea
              className="form-textarea"
              placeholder="Observações"
              value={dados.observacoes}
              onChange={(e) => setDados({ ...dados, observacoes: e.target.value })}
            />
          </div>
        </div>

        <div className="section-card">
          <h3 className="section-subtitle">📷 Captura da Imagem</h3>
          <div className="video-container">
            <video ref={videoRef} autoPlay playsInline />
          </div>
          <div className="button-group">
            <button className="btn btn-primary" onClick={iniciarCamera}>
              📹 Iniciar Câmera
            </button>
            <button className="btn btn-secondary" onClick={capturarFoto}>
              📸 Capturar Foto
            </button>
          </div>
          <canvas ref={canvasRef} style={{ display: "none" }} />

          {imagem && (
            <>
              <h4 className="preview-label">Prévia:</h4>
              <img src={imagem} alt="capturada" className="image-preview" />
              <div className="button-group">
                <button
                  className={`btn btn-primary ${processando ? "processing" : ""}`}
                  onClick={analisar}
                  disabled={processando}
                >
                  {processando ? "⏳ Analisando..." : "🔍 Analisar Imagem"}
                </button>
              </div>
            </>
          )}
        </div>

        {resultado && (
          <div className="section-card">
            <div className="result-container">
              <h3 className="result-title">🩺 Resultado:</h3>
              <p className="result-text">{resultado}</p>
            </div>

            <div className="button-group">
              <button
                className="btn btn-success"
                onClick={async () => {
                  try {
                    await gerarRelatorio(dados, imagem, resultado);
                  } catch (e) {
                    console.error("Erro ao gerar relatório:", e);
                    alert("Ocorreu um erro ao gerar o relatório. Verifique o console.");
                  }
                }}
              >
                📄 Gerar Relatório PDF
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
