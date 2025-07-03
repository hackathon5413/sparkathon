import jsPDF from "jspdf";
import QRCode from "qrcode";

const CARD_CONFIG = {
  width: 92,
  height: 62,
  margin: 8,
  cardsPerRow: 2,
  cardsPerCol: 4,
  pageWidth: 210,
  pageHeight: 297,
  // Calculated for perfect centering
  get totalWidth() { return this.cardsPerRow * this.width + (this.cardsPerRow - 1) * this.margin; },
  get totalHeight() { return this.cardsPerCol * this.height + (this.cardsPerCol - 1) * this.margin; },
  get startX() { return (this.pageWidth - this.totalWidth) / 2; },
  get startY() { return (this.pageHeight - this.totalHeight) / 2; }
};

export const generateDiscountCards = async (products) => {
  const pdf = new jsPDF("p", "mm", "a4");
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

  // Perfect pixel alignment with centered layout
  const x = CARD_CONFIG.startX + col * (CARD_CONFIG.width + CARD_CONFIG.margin);
  const y = CARD_CONFIG.startY + row * (CARD_CONFIG.height + CARD_CONFIG.margin);

  // Card shadow with precise offset
  pdf.setFillColor(230, 230, 230);
  pdf.roundedRect(x + 1, y + 1, CARD_CONFIG.width, CARD_CONFIG.height, 3, 3, "F");

  // Main card with precise border
  pdf.setFillColor(255, 255, 255);
  pdf.setDrawColor(220, 220, 220);
  pdf.setLineWidth(0.3);
  pdf.roundedRect(x, y, CARD_CONFIG.width, CARD_CONFIG.height, 3, 3, "FD");

  // Header background with perfect alignment
  pdf.setFillColor(30, 58, 138);
  pdf.roundedRect(x, y, CARD_CONFIG.width, 12, 3, 3, "F");

  // Header text perfectly centered
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(9);
  pdf.setFont("helvetica", "bold");
  pdf.text("WALMART OFFER", x + CARD_CONFIG.width / 2, y + 7.5, { align: "center" });

  // Product name with consistent padding
  const productName = product.name.length > 35 ? product.name.slice(0, 35) + "..." : product.name;
  pdf.setTextColor(33, 37, 41);
  pdf.setFontSize(8.5);
  pdf.setFont("helvetica", "bold");
  const lines = pdf.splitTextToSize(productName, CARD_CONFIG.width - 8);
  pdf.text(lines, x + 4, y + 18);

  // Calculate precise spacing for price section
  const textHeight = lines.length * 3.5;
  const priceY = y + 18 + textHeight + 6;

  // === PERFECTLY ALIGNED PRICES ON SAME LINE ===
  const originalPriceText = `$${product.price.toFixed(2)}`;
  const discountedPriceText = `$${product.discountedPrice.toFixed(2)}`;

  // Original price (left side with strikethrough)
  pdf.setFontSize(10);
  pdf.setTextColor(150, 150, 150);
  pdf.setFont("helvetica", "bold");
  pdf.text(originalPriceText, x + 4, priceY);
  const originalWidth = pdf.getTextWidth(originalPriceText);
  
  // Strikethrough line for original price
  pdf.setDrawColor(255, 0, 0);
  pdf.setLineWidth(0.5);
  pdf.line(x + 4, priceY-3, x + 4 + originalWidth, priceY);

  // Discounted price (positioned after original price with 2 spaces gap)
  const spaceWidth = pdf.getTextWidth("  "); // 2 spaces
  const discountedX = x + 4 + originalWidth + spaceWidth;
  
  pdf.setFontSize(14);
  pdf.setTextColor(255, 82, 82);
  pdf.setFont("helvetica", "bold");
  pdf.text(discountedPriceText, discountedX, priceY);

  // === PERFECTLY CENTERED DISCOUNT BADGE ===
  const badgeX = x + CARD_CONFIG.width - 15;
  const badgeY = y + 15;
  pdf.setDrawColor(255, 255, 255);
  pdf.setLineWidth(0.8);
  pdf.setFillColor(255, 67, 54);
  pdf.circle(badgeX, badgeY, 9.5, "FD");

  const discountText = `${product.discount}%`;
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");

  // Perfectly centered discount percentage
  pdf.setFontSize(8.5);
  const textW = pdf.getTextWidth(discountText);
  pdf.text(discountText, badgeX - textW / 2, badgeY - 0.5);

  // Perfectly centered "OFF" text
  pdf.setFontSize(5.5);
  const offW = pdf.getTextWidth("OFF");
  pdf.text("OFF", badgeX - offW / 2, badgeY + 3.5);

  // Department Tag with precise positioning
  const tagY = y + CARD_CONFIG.height - 19;
  pdf.setFillColor(76, 175, 80);
  pdf.roundedRect(x + 4, tagY, 32, 8, 2, 2, "F");
  pdf.setFontSize(7);
  pdf.setTextColor(255, 255, 255);
  pdf.setFont("helvetica", "bold");
  const sectionText = product.section.toUpperCase();
  const sectionWidth = pdf.getTextWidth(sectionText);
  pdf.text(sectionText, x + 4 + (32 - sectionWidth) / 2, tagY + 5);

  // Valid Until with precise bottom alignment
  const validUntil = new Date();
  validUntil.setDate(validUntil.getDate() + 7);
  pdf.setFontSize(6);
  pdf.setTextColor(100, 100, 100);
  pdf.setFont("helvetica", "normal");
  pdf.text(`Valid until: ${validUntil.toLocaleDateString("en-GB")}`, x + 4, y + CARD_CONFIG.height - 4);

  // QR Code with perfect positioning
  const qrSize = 13;
  const qrX = x + CARD_CONFIG.width - qrSize - 3;
  const qrY = y + CARD_CONFIG.height - qrSize - 3;

  try {
    const qrDataUrl = await QRCode.toDataURL(`WALMART:${product.id}:${product.discount}%`, {
      width: 52,
      margin: 0,
      color: { dark: "#000000", light: "#FFFFFF" },
    });
    // QR code border for better visibility
    pdf.setDrawColor(200, 200, 200);
    pdf.setLineWidth(0.3);
    pdf.rect(qrX - 0.5, qrY - 0.5, qrSize + 1, qrSize + 1);
    pdf.addImage(qrDataUrl, "PNG", qrX, qrY, qrSize, qrSize);
  } catch {
    // Fallback ID display
    pdf.setTextColor(150, 150, 150);
    pdf.setFontSize(5);
    pdf.setFont("helvetica", "normal");
    pdf.text(`ID: ${product.id}`, qrX, qrY + qrSize / 2);
  }

  // Reset line dash and width for next card
  pdf.setLineDashPattern([], 0);
  pdf.setLineWidth(0.3);
};

export const downloadPDF = (pdf, filename = "discount-cards") => {
  pdf.save(`${filename}-${new Date().toISOString().split("T")[0]}.pdf`);
};
