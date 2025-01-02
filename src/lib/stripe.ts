import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_Secret_Key as string, {
  apiVersion: "2024-12-18.acacia",
  typescript: true,
});
