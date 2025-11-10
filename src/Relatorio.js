// src/Relatorio.js
import jsPDF from "jspdf";

export default function gerarRelatorio(dados, imagem, analise) {
  const doc = new jsPDF();

  // 🕓 Data e hora automáticas
  const dataAtual = new Date();
  const dataFormatada = dataAtual.toLocaleDateString("pt-BR");
  const horaFormatada = dataAtual.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  // 🏫 Logo da UFRN
  const logoUfrn = "https://upload.wikimedia.org/wikipedia/commons/f/f5/Brasao_UFRN.PNG";

  // Cabeçalho
  doc.addImage(logoUfrn, "PNG", 10, 8, 35, 15);
  doc.setFont("Arial", "bold");
  doc.setFontSize(14);
  doc.text("Universidade Federal do Rio Grande do Norte", 50, 15);
  doc.setFontSize(12);
  doc.text(
    "Programa de Pós-Graduação em Engenharia Elétrica e de Computação",
    45,
    22
  );

  doc.line(10, 28, 200, 28);

  // Título
  doc.setFont("Arial", "bold");
  doc.setFontSize(16);
  doc.text("Relatório da Análise de Lesão por Pressão", 105, 40, { align: "center" });

  // Data e hora
  doc.setFont("Arial", "normal");
  doc.setFontSize(12);
  doc.text(`Data: ${dataFormatada}`, 150, 50);
  doc.text(`Hora: ${horaFormatada}`, 150, 57);

  // Dados do paciente
  doc.text(`Nome: ${dados.nome}`, 14, 55);
  doc.text(`Idade: ${dados.idade}`, 14, 63);
  doc.text(`Sexo: ${dados.sexo}`, 14, 71);
  doc.text(`Leito: ${dados.leito}`, 14, 79);
  doc.text(`Observações: ${dados.observacoes}`, 14, 87);

  // Imagem capturada
  let posY = 100;
  if (imagem) {
    doc.text("Imagem analisada:", 14, posY);
    doc.addImage(imagem, "JPEG", 14, posY + 5, 90, 70);
    posY += 80;
  }

  // 🧠 Tratamento do texto da análise
  let texto = analise || "";
  texto = texto.replace(/\*/g, ""); // remove * isolados
  const partes = texto.split(/(\*\*[^*]+\*\*)/g); // separa blocos **negrito**

  doc.setFontSize(12);
  doc.text("Análise gerada pelo sistema:", 14, posY);
  posY += 8;

  partes.forEach((parte) => {
    if (parte.startsWith("**") && parte.endsWith("**")) {
      doc.setFont("Arial", "bold");
      doc.text(parte.replace(/\*\*/g, ""), 14, posY, { maxWidth: 180 });
    } else {
      doc.setFont("Arial", "normal");
      const linhas = doc.splitTextToSize(parte.trim(), 180);
      doc.text(linhas, 14, posY, { maxWidth: 180 });
    }
    posY += 6 + (parte.length / 90) * 6;
  });

  // Campo de assinatura
  let posAssinatura = posY + 25;
  if (posAssinatura > 250) {
    doc.addPage();
    posAssinatura = 40;
  }

  doc.setFont("Arial", "bold");
  doc.line(60, posAssinatura, 150, posAssinatura);
  doc.text("Profissional Responsável pela Análise", 80, posAssinatura + 7);
  doc.setFont("Arial", "normal");
  doc.text("(Carimbo e Assinatura)", 82, posAssinatura + 14);

  // Rodapé
  doc.setFont("Arial", "bold");
  doc.setFontSize(10);
  doc.text(
    "Desenvolvido por Antonio de Oliveira e Ernane Ferreira — Protótipo da Disciplina de Sistemas Embarcados",
    14,
    285
  );
  doc.text("Professor Dr. Ricardo Valentim — PPGEEC/UFRN", 14, 291);

  doc.save(
    `Relatorio_${dados.nome || "Paciente"}_${dataFormatada}_${horaFormatada}.pdf`
  );
}
