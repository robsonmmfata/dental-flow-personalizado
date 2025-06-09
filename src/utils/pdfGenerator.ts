
// Utility para gerar PDFs
export const generateExamPDF = (exam: any) => {
  // Gerar conteúdo do PDF do exame
  const pdfContent = `
=== RELATÓRIO DE EXAME ===

Paciente: ${exam.patientName}
Tipo de Exame: ${exam.examType}
Data: ${new Date(exam.date).toLocaleDateString('pt-BR')}
Status: ${exam.status}

Observações:
${exam.observations || 'Nenhuma observação registrada.'}

Arquivos:
${exam.files && exam.files.length > 0 ? exam.files.join(', ') : 'Nenhum arquivo anexado.'}

---
DentalCare - Sistema de Gestão Odontológica
Gerado em: ${new Date().toLocaleString('pt-BR')}
  `;

  // Criar blob e fazer download
  const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `exame_${exam.patientName.replace(/\s+/g, '_')}_${exam.examType.replace(/\s+/g, '_')}.txt`;
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

  const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `orcamento_${budget.patientName.replace(/\s+/g, '_')}_${budget.id || Date.now()}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const generatePatientPDF = (patient: any) => {
  const pdfContent = `
=== FICHA DO PACIENTE ===

Nome: ${patient.name}
Telefone: ${patient.phone}
Email: ${patient.email}
Data de Nascimento: ${patient.birthDate ? new Date(patient.birthDate).toLocaleDateString('pt-BR') : 'Não informado'}
Endereço: ${patient.address || 'Não informado'}

Observações:
${patient.observations || 'Nenhuma observação registrada.'}

---
DentalCare - Sistema de Gestão Odontológica
Gerado em: ${new Date().toLocaleString('pt-BR')}
  `;

  const blob = new Blob([pdfContent], { type: 'text/plain;charset=utf-8' });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `paciente_${patient.name.replace(/\s+/g, '_')}.txt`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};
