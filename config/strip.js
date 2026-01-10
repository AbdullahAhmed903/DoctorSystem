import Stripe from "stripe";
import CONFIG from "./config.js";

const stripe = new Stripe(CONFIG.STRIP_KEY);

export default stripe;
