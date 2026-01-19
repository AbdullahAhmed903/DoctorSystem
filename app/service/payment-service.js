import { CustomError } from "../utils/error-handling.js";
import stripe from "../../config/strip.js"

export async function createCheckoutSession({
  customerEmail,
  doctorName,
  appointmentId,
  price,
  metadata = {},
  currency = "egp",
}) {
  if (!customerEmail || !doctorName || !appointmentId || !price) {
    throw new CustomError("Missing required payment data", 400);
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    mode: "payment",
    customer_email: customerEmail,
    success_url:"https://www.google.com/?zx=1759415163065&no_sw_cr=1",
    cancel_url:"https://www.google.com/?zx=1759415163065&no_sw_cr=1",
    line_items: [
      {
        price_data: {
          currency,
          product_data: { name: `Consultation with Dr. ${doctorName}` },
          unit_amount: Math.round(price * 100),
        },
        quantity: 1,
      },
    ],
    metadata: { appointmentId, ...metadata },
    invoice_creation: { enabled: true },
  });  
  return session;
}
