import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: { type: String, required: true, unique: true }, // INV-20260111-001
    appointmentId: { type:String,required: true },
    userId: { type:String, required: true },
    amount: { type: Number, required: true }, // total amount paid
    currency: { type: String, default: "USD" },
    paymentMethod: { type: String, required: true }, // e.g., "Visa", "Stripe"
    status: { type: String, enum: ["Paid", "Pending", "Refunded"], default: "Pending" },
    date: { type: Date, default: Date.now },
    // optional: store extra info like doctor, clinic, notes
    doctorName: { type: String },
    serviceName: { type: String },
    notes: { type: String },
    invoiceUrl: { type: String }, // URL to the PDF invoice
  },
  { timestamps: true }
);

const invoiceModel = mongoose.model("Invoice", invoiceSchema);
export default invoiceModel;
