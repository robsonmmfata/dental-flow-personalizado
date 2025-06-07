
// Utility para gerar PDFs
export const generateExamPDF = (exam: any) => {
  // Simulação de geração de PDF
  const pdfContent = `
=== RELATÓRIO DE EXAME ===

Paciente: ${exam.patientName}
Tipo de Exame: ${exam.examType}
Data: ${new Date(exam.date).toLocaleDateString('pt-BR')}
Status: ${exam.status}

Observações:
${exam.observations || 'Nenhuma observação registrada.'}

Arquivos:
${exam.files.join(', ') || 'Nenhum arquivo anexado.'}

---
DentalCare - Sistema de Gestão Odontológica
Gerado em: ${new Date().toLocaleString('pt-BR')}
  `;

  // Criar blob e fazer download
  const blob = new Blob([pdfContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `exame_${exam.patientName.replace(/\s+/g, '_')}_${exam.examType.replace(/\s+/g, '_')}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const generateBudgetPDF = (budget: any) => {
  const pdfContent = `
=== ORÇAMENTO ODONTOLÓGICO ===

Paciente: ${budget.patientName}
Data: ${new Date(budget.createdAt).toLocaleDateString('pt-BR')}
Vencimento: ${new Date(budget.dueDate).toLocaleDateString('pt-BR')}

Procedimentos:
${budget.procedures.map((proc: string, index: number) => `${index + 1}. ${proc}`).join('\n')}

Valor Total: R$ ${budget.totalValue.toFixed(2)}
Forma de Pagamento: ${budget.paymentMethod}
Status: ${budget.status}

---
DentalCare - Sistema de Gestão Odontológica
Gerado em: ${new Date().toLocaleString('pt-BR')}
  `;

  const blob = new Blob([pdfContent], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `orcamento_${budget.patientName.replace(/\s+/g, '_')}_${budget.id}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
