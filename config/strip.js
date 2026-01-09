import Stripe from "stripe";
import CONFIG from "./config.js";
console.log(CONFIG.STRIP_KEY);


const stripe = new Stripe(CONFIG.STRIP_KEY);

export default stripe;
