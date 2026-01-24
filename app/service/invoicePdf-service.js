import PDFDocument from "pdfkit";
import imagekitUploding from "../utils/image-kit.js";

export async function generateInvoicePDFBuffer(invoice, appointment, doctorName, patientName, patientEmail) {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    // ===== HEADER =====
    doc
      .fontSize(20)
      .text("Appointment Invoice", { align: "center" })
      .moveDown(0.5);

    doc
      .fontSize(12)
      .text(`Invoice Number: ${invoice.invoiceNumber}`, { align: "left" })
      .text(`Date: ${new Date(invoice.createdAt).toLocaleDateString()}`, { align: "left" })
      .text(`Payment Method: ${invoice.paymentMethod}`, { align: "left" })
      .moveDown(1);

    // ===== BILL TO / DETAILS =====
    doc
      .fontSize(14)
      .text("Bill To:", { underline: true })
      .moveDown(0.2);

    doc
      .fontSize(12)
      .text(`Patient Name: ${patientName}`)
      .text(`Email: ${patientEmail}`)
      .moveDown(0.5);


    doc.text(`Doctor: ${doctorName}`).moveDown(1);

    // ===== APPOINTMENT DETAILS TABLE =====
    doc.fontSize(14).text("Appointment Details", { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12);
    doc.text(`Date: ${appointment.date}`);
    doc.text(`Time: ${appointment.startTime} - ${appointment.endTime}`);
    doc.text(`Fees: ${invoice.amount} ${invoice.currency}`);
    doc.moveDown(1);

    // ===== TOTAL =====
    doc.fontSize(16).text(`Total Paid: ${invoice.amount} ${invoice.currency}`, { align: "right", bold: true });
    doc.moveDown(1);

    // ===== FOOTER =====
    doc
      .fontSize(10)
      .fillColor("gray")
      .text(
        "Thank you for booking your appointment with us. If you have any questions, contact support.",
        { align: "center" }
      );

    doc.end();
  });
}


// Upload directly
export async function uploadInvoiceBufferToImageKit(buffer, fileName) {
  const result = await imagekitUploding.upload({
    file: buffer,
    fileName,
    folder: "/invoices",
    useUniqueFileName: true,
  });

  return result.url;
}
