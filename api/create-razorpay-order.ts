import Razorpay from "razorpay";

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { amount, currency, receipt } = req.body || {};
    const key_id = process.env.RAZORPAY_KEY_ID || "rzp_live_Tprh049e7AQJkZ";
    const key_secret = process.env.RAZORPAY_KEY_SECRET || "SiWqjht0zcLM0FBufp41HAM0";

    const razorpay = new Razorpay({
      key_id,
      key_secret,
    });

    const options = {
      amount: Math.round(Number(amount) * 100),
      currency: currency || "INR",
      receipt: receipt || `rcpt_${Date.now()}`,
    };

    const order = await razorpay.orders.create(options);
    return res.status(200).json({ ...order, key_id });
  } catch (error: any) {
    console.error("Razorpay Order Error:", error);
    return res.status(500).json({
      error: error?.error?.description || error.message || "Failed to create Razorpay order",
    });
  }
}
