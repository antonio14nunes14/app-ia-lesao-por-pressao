import jsPDF from "jspdf";

export function gerarPDF(paciente, imagem, resultado) {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.text("Relatório de Análise de Lesão por Pressão", 10, 20);

  doc.setFontSize(10);
  doc.text(`Nome: ${paciente.nome}`, 10, 40);
  doc.text(`Idade: ${paciente.idade}`, 10, 48);
  doc.text(`Sexo: ${paciente.sexo}`, 10, 56);
  doc.text(`Local da Lesão: ${paciente.localLesao}`, 10, 64);

  doc.addImage(imagem, "JPEG", 10, 75, 80, 80);

  doc.text("Resultado da IA:", 10, 165);
  doc.text(resultado, 10, 175, { maxWidth: 180 });

  doc.save(`relatorio_${paciente.nome}.pdf`);
}
