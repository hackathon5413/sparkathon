import jsPDF from 'jspdf';
import QRCode from 'qrcode';

const CARD_CONFIG = {
  width: 90,
  height: 60,
  margin: 5,
  cardsPerRow: 2,
  cardsPerCol: 4,
  pageWidth: 210,
  pageHeight: 297
};

export const generateDiscountCards = async (products) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  let cardCount = 0;
  
  for (const product of products) {
    if (cardCount > 0 && cardCount % 8 === 0) {
      pdf.addPage();
    }
    
    await drawCard(pdf, product, cardCount % 8);
    cardCount++;
  }
  
  return pdf;
};

const drawCard = async (pdf, product, position) => {
  const row = Math.floor(position / CARD_CONFIG.cardsPerRow);
  const col = position % CARD_CONFIG.cardsPerRow;
  
  const x = CARD_CONFIG.margin + col * (CARD_CONFIG.width + CARD_CONFIG.margin);
  const y = CARD_CONFIG.margin + row * (CARD_CONFIG.height + CARD_CONFIG.margin);
  
  // Card background with shadow effect
  pdf.setFillColor(250, 250, 250);
  pdf.rect(x + 1, y + 1, CARD_CONFIG.width, CARD_CONFIG.height, 'F');
  
  // Main card
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.5);
  pdf.rect(x, y, CARD_CONFIG.width, CARD_CONFIG.height, 'FD');
  
  // Header with gradient effect
  pdf.setFillColor(0, 113, 197);
  pdf.rect(x, y, CARD_CONFIG.width, 12, 'F');
  pdf.setFillColor(0, 90, 170);
  pdf.rect(x, y + 8, CARD_CONFIG.width, 4, 'F');
  
  // Header text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('WALMART SPECIAL OFFER', x + 3, y + 8);
  
  // Product name with better formatting
  pdf.setTextColor(40, 40, 40);
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  const productName = product.name.length > 32 ? product.name.substring(0, 32) + '...' : product.name;
  const lines = pdf.splitTextToSize(productName, CARD_CONFIG.width - 6);
  pdf.text(lines, x + 3, y + 18);
  
  // Calculate text height for proper spacing
  const textHeight = lines.length * 3;
  const priceStartY = y + 18 + textHeight + 2;
  
  // Price section background
  pdf.setFillColor(248, 249, 250);
  pdf.rect(x + 2, priceStartY, CARD_CONFIG.width - 4, 10, 'F');
  
  // Original price with diagonal strikethrough - LARGER
  pdf.setTextColor(80, 80, 80); // Darker gray for better visibility
  pdf.setFontSize(16); // Larger font for original price
  pdf.setFont('helvetica', 'bold');
  const originalPriceText = `${product.price.toFixed(2)}`;
  pdf.text(originalPriceText, x + 4, priceStartY + 6);
  const priceWidth = pdf.getTextWidth(originalPriceText);
  
  // Thin diagonal strikethrough line properly through the text
  pdf.setLineWidth(0.8);
  pdf.setDrawColor(255, 0, 0); // Red strikethrough
  // Diagonal line through the middle of text (from bottom-left to top-right)
  const textMiddleY = priceStartY + 3; // Middle of the larger text height
  pdf.line(x + 3, textMiddleY + 2, x + 5 + priceWidth, textMiddleY - 2);
  
  // New price with smaller styling
  pdf.setTextColor(220, 38, 127);
  pdf.setFontSize(14); // Smaller than original price
  pdf.setFont('helvetica', 'bold');
  pdf.text(`${product.discountedPrice.toFixed(2)}`, x + 4, priceStartY + 16);
  
  // Discount badge with better design
  const badgeX = x + CARD_CONFIG.width - 18;
  const badgeY = y + 16;
  
  // Badge shadow
  pdf.setFillColor(200, 200, 200);
  pdf.circle(badgeX + 1, badgeY + 1, 9, 'F');
  
  // Main badge
  pdf.setFillColor(255, 67, 54);
  pdf.circle(badgeX, badgeY, 9, 'F');
  
  // Badge text
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  const discountText = `${product.discount}%`;
  const textWidth = pdf.getTextWidth(discountText);
  pdf.text(discountText, badgeX - textWidth/2, badgeY + 2);
  pdf.setFontSize(6);
  pdf.text('OFF', badgeX - 4, badgeY + 6);
  
  // Department tag - ensure it stays within card bounds
  const maxDeptY = y + CARD_CONFIG.height - 15; // Leave space for valid until text
  const deptTagY = Math.min(priceStartY + 20, maxDeptY);
  pdf.setFillColor(76, 175, 80);
  pdf.rect(x + 3, deptTagY, 25, 6, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7);
  pdf.setFont('helvetica', 'bold');
  pdf.text(product.section.toUpperCase(), x + 4, deptTagY + 4);
  
  // Valid until with icon - ensure it stays within card
  pdf.setTextColor(100, 100, 100);
  pdf.setFontSize(6);
  pdf.setFont('helvetica', 'normal');
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 7);
  const validY = Math.min(deptTagY + 8, y + CARD_CONFIG.height - 3);
  pdf.text(`Valid until: ${validUntil.toLocaleDateString('en-GB')}`, x + 3, validY);
  
  // QR Code with constrained positioning
  const maxQrY = y + CARD_CONFIG.height - 15; // Ensure QR fits
  const maxQrX = x + CARD_CONFIG.width - 15; // Ensure QR fits horizontally
  const qrY = Math.min(Math.max(y + 25, deptTagY - 8), maxQrY);
  const qrX = Math.min(x + CARD_CONFIG.width - 16, maxQrX);
  
  try {
    const qrDataUrl = await QRCode.toDataURL(`WALMART:${product.id}:${product.discount}%`, {
      width: 50,
      margin: 0,
      color: { dark: '#000000', light: '#FFFFFF' }
    });
    pdf.addImage(qrDataUrl, 'PNG', qrX, qrY, 12, 12);
  } catch (error) {
    // QR code fallback - simple product ID
    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(6);
    pdf.text(`ID: ${product.id}`, qrX, qrY + 6);
  }
  
  // Decorative cut lines
  pdf.setDrawColor(180, 180, 180);
  pdf.setLineDashPattern([2, 2], 0);
  pdf.setLineWidth(0.3);
  
  // Horizontal cut lines
  if (row > 0) {
    pdf.line(x - 3, y, x + CARD_CONFIG.width + 3, y);
    // Scissors icon simulation
    pdf.setFontSize(8);
    pdf.setTextColor(150, 150, 150);
    pdf.text('✂', x - 5, y + 2);
  }
  
  // Vertical cut lines
  if (col > 0) {
    pdf.line(x, y - 3, x, y + CARD_CONFIG.height + 3);
    pdf.text('✂', x - 2, y - 5);
  }
  
  pdf.setLineDashPattern([], 0);
  pdf.setLineWidth(0.5);
};

export const downloadPDF = (pdf, filename = 'discount-cards') => {
  pdf.save(`${filename}-${new Date().toISOString().split('T')[0]}.pdf`);
};
