import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const generateInvoicePDF=(invoice, appointment, user)=> {
    console.log("invoice",invoice);
    console.log("appointment",appointment);
    console.log("user",user);

    
  return new Promise((resolve, reject) => {
    const fileName = `invoice-${invoice.invoiceNumber}.pdf`;
    const filePath = path.join(process.cwd(), "tmp", fileName);

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const stream = fs.createWriteStream(filePath);

    doc.pipe(stream);

    // Header
    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();

    // Invoice info
    doc.fontSize(12)
      .text(`Invoice Number: ${invoice.invoiceNumber}`)
      .text(`Date: ${new Date(invoice.createdAt).toDateString()}`)
      .text(`Payment Method: ${invoice.paymentMethod}`)
      .moveDown();

    // Customer
    doc.text(`Patient Name: ${user.name}`);
    doc.text(`Email: ${user.email}`);
    doc.moveDown();

    // Appointment
    doc.text(`Doctor: ${appointment.doctorName}`);
    doc.text(`Appointment Date: ${appointment.date}`);
    doc.text(`Time: ${appointment.startTime} - ${appointment.endTime}`);
    doc.moveDown();

    // Amount
    doc.fontSize(14).text(
      `Total Paid: ${invoice.amount} ${invoice.currency}`,
      { align: "right" }
    );

    doc.end();

    stream.on("finish", () => resolve({ filePath, fileName }));
    stream.on("error", reject);
  });
}
