import jsPDF from 'jspdf';

export interface OrderItem {
  id: string;
  product?: {
    name: string;
  };
  quantity: number;
  price_at_purchase: number;
}

export interface OrderData {
  id: string;
  customer_name: string;
  phone_number: string;
  delivery_address: string;
  total_amount: number;
  status: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  admin_comment?: string;
}

export const generateOrderReceiptPDF = (order: OrderData) => {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  let yPosition = 15;
  const margin = 12;
  const contentWidth = pageWidth - 2 * margin;

  // Helper function to add text with automatic wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 10) => {
    pdf.setFontSize(fontSize);
    const splitText = pdf.splitTextToSize(text, maxWidth);
    pdf.text(splitText, x, y);
    return y + splitText.length * (fontSize * 0.35);
  };

  // TOP SECTION - FROM and RECEIPT
  pdf.setFontSize(11);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(32, 62, 120); // Dark blue
  pdf.text('FROM', margin, yPosition);

  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(32, 62, 120);
  pdf.text('Fiston Shopping', margin, yPosition + 8);

  // Company details
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(60, 60, 60);
  pdf.text('Online Shopping Platform', margin, yPosition + 14);
  pdf.text('Rwanda', margin, yPosition + 18);

  // RECEIPT section on right
  pdf.setFontSize(18);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(32, 62, 120);
  pdf.text('RECEIPT', pageWidth - margin - 30, yPosition + 5, { align: 'left' });

  // Receipt number and date on right
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(60, 60, 60);
  pdf.text(`Receipt #: ${order.id.substring(0, 8).toUpperCase()}`, pageWidth - margin - 40, yPosition + 13);
  pdf.text(`Receipt Date: ${new Date(order.created_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })}`, pageWidth - margin - 40, yPosition + 17);

  yPosition += 25;

  // DIVIDER
  pdf.setDrawColor(32, 62, 120);
  pdf.setLineWidth(0.5);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 5;

  // TO SECTION
  pdf.setFontSize(10);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(32, 62, 120);
  pdf.text('TO', margin, yPosition);

  pdf.setFontSize(10);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(0, 0, 0);
  pdf.text(order.customer_name, margin, yPosition + 6);

  pdf.setFontSize(9);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(60, 60, 60);
  pdf.text(`${order.delivery_address}`, margin, yPosition + 11);
  pdf.text(`Phone: ${order.phone_number}`, margin, yPosition + 15);

  yPosition += 22;

  // TABLE SECTION
  const colWidths = {
    qty: 12,
    description: (pageWidth - 2 * margin) * 0.5,
    unitPrice: 28,
    amount: 28,
  };

  // Calculate column positions
  const colQtyX = margin + 2;
  const colDescX = colQtyX + colWidths.qty + 3;
  const colUnitPriceX = pageWidth - margin - colWidths.amount - colWidths.unitPrice - 4;
  const colAmountX = pageWidth - margin - colWidths.amount;

  // Table header background
  pdf.setFillColor(32, 62, 120);
  pdf.rect(margin, yPosition - 3, contentWidth, 7, 'F');

  // Table headers
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(255, 255, 255);
  
  pdf.text('QTY', colQtyX, yPosition + 2);
  pdf.text('Description', colDescX, yPosition + 2);
  pdf.text('Unit Price', colUnitPriceX, yPosition + 2);
  pdf.text('Amount', colAmountX, yPosition + 2, { align: 'right' });

  yPosition += 8;

  // TABLE ROWS
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(0, 0, 0);

  let itemIndex = 0;
  order.order_items?.forEach((item) => {
    itemIndex++;
    const itemName = item.product?.name || 'Unknown Product';
    const itemTotal = item.price_at_purchase * item.quantity;

    // Alternating row background
    if (itemIndex % 2 === 0) {
      pdf.setFillColor(240, 245, 250);
      pdf.rect(margin, yPosition - 3, contentWidth, 6, 'F');
    }

    // Row content
    pdf.text(item.quantity.toString(), colQtyX, yPosition);
    pdf.text(itemName, colDescX, yPosition);
    pdf.text(`${item.price_at_purchase.toLocaleString()} RWF`, colUnitPriceX, yPosition, { align: 'right' });
    pdf.text(`${itemTotal.toLocaleString()} RWF`, colAmountX, yPosition, { align: 'right' });

    yPosition += 6;
  });

  yPosition += 2;

  // DIVIDER
  pdf.setDrawColor(32, 62, 120);
  pdf.line(margin, yPosition, pageWidth - margin, yPosition);
  yPosition += 4;

  // SUBTOTAL AND TOTAL SECTION
  const summaryX = pageWidth - margin - 50;
  
  pdf.setFontSize(9);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(60, 60, 60);
  pdf.text('Subtotal:', summaryX, yPosition);
  pdf.text(`${order.total_amount.toLocaleString()} RWF`, pageWidth - margin - 2, yPosition, { align: 'right' });

  yPosition += 5;

  // Status section
  const statusColors: { [key: string]: [number, number, number] } = {
    pending: [255, 193, 7], // Amber
    approved: [76, 175, 80], // Green
    rejected: [244, 67, 54], // Red
  };

  const statusBgColors: { [key: string]: [number, number, number] } = {
    pending: [255, 243, 224],
    approved: [232, 245, 233],
    rejected: [255, 235, 238],
  };

  const statusColor = statusColors[order.status] || statusColors.pending;
  const statusBgColor = statusBgColors[order.status] || statusBgColors.pending;

  const statusText = order.status === 'pending' ? 'Pending Review' : 
                     order.status === 'approved' ? 'Approved' : 
                     'Rejected';

  pdf.setFillColor(...statusBgColor);
  pdf.rect(summaryX - 5, yPosition - 3, 55, 6, 'F');

  pdf.setFontSize(9);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(...statusColor);
  pdf.text('Status:', summaryX, yPosition);
  pdf.text(statusText, pageWidth - margin - 2, yPosition, { align: 'right' });

  yPosition += 6;

  // TOTAL BOX
  pdf.setFillColor(32, 62, 120);
  pdf.rect(summaryX - 5, yPosition - 3, 55, 8, 'F');

  pdf.setFontSize(11);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(255, 255, 255);
  pdf.text('Total:', summaryX, yPosition + 2);
  pdf.text(`${order.total_amount.toLocaleString()} RWF`, pageWidth - margin - 2, yPosition + 2, { align: 'right' });

  yPosition += 15;

  // Approved status message
  if (order.status === 'approved') {
    pdf.setFillColor(232, 245, 233);
    pdf.rect(margin, yPosition - 4, contentWidth, 12, 'F');

    pdf.setFontSize(10);
    pdf.setFont(undefined, 'bold');
    pdf.setTextColor(76, 175, 80);
    pdf.text('Order Confirmed!', margin + 3, yPosition);

    pdf.setFontSize(9);
    pdf.setFont(undefined, 'normal');
    pdf.setTextColor(32, 62, 120);
    const messageLines = pdf.splitTextToSize('Your order has been received. We will call you within 24 hours at most to confirm delivery details.', contentWidth - 6);
    messageLines.forEach((line: string, index: number) => {
      pdf.text(line, margin + 3, yPosition + 6 + (index * 4));
    });
  }

  // FOOTER
  yPosition = pageHeight - 12;
  pdf.setFontSize(8);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(100, 100, 100);
  pdf.text(`Receipt printed on: ${new Date().toLocaleDateString('en-US')} at ${new Date().toLocaleTimeString('en-US')}`, pageWidth / 2, yPosition, { align: 'center' });

  // Save the PDF
  pdf.save(`order-receipt-${order.id}.pdf`);
};

