export function computeLineTotal(quantity: number, unitPrice: number): number {
  return Math.round(quantity * unitPrice);
}

export function computeInvoiceTotals(lines: { lineTotal: number }[], vatRate: number = 18.00) {
  const subtotal = lines.reduce((sum, line) => sum + line.lineTotal, 0);
  const vatAmount = Math.round(subtotal * (vatRate / 100));
  const total = subtotal + vatAmount;
  
  return { subtotal, vatAmount, total };
}

export function formatFCFA(amount: number): string {
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF',
      maximumFractionDigits: 0
    }).format(amount);
  } catch (e) {
    return `${amount.toLocaleString('fr-FR')} FCFA`;
  }
}
