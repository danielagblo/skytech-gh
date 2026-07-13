// api/sms.js
// We are using Vercel's native fetch (no external library needed)

export default async function handler(req, res) {
  // 1. Only accept POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { name, phone } = req.body;

    if (!phone) {
      return res.status(400).json({ error: "Phone number is required" });
    }

    // 2. Prepare the variables from Environment Variables
    const apiKey = process.env.ARKESEL_API_KEY;
    // If sender ID isn't set, use "Arkesel" as a fallback (which works without approval)
    const senderId = process.env.ARKESEL_SENDER_ID || "Arkesel";

    const message = `Hi ${name}, we've received your interest. Our team will reply on WhatsApp shortly. - SkyTech Ghana`;

    // 3. Build the URL with Query Parameters
    const arkeselUrl = new URL("https://sms.arkesel.com/sms/api");
    arkeselUrl.searchParams.append("action", "send-sms");
    arkeselUrl.searchParams.append("api_key", apiKey);
    arkeselUrl.searchParams.append("to", phone);
    arkeselUrl.searchParams.append("from", senderId);
    arkeselUrl.searchParams.append("sms", message);

    console.log("Attempting to send to:", arkeselUrl.toString());

    // 4. Send the request to Arkesel using native fetch
    const response = await fetch(arkeselUrl.toString(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    // 5. Get the response (Arkesel returns plain text)
    const data = await response.text();

    // 6. Send success back to the website
    return res
      .status(200)
      .json({ success: true, message: "SMS triggered", data });
  } catch (error) {
    console.error("Server Error:", error);
    return res
      .status(500)
      .json({ error: "Internal Server Error", details: error.message });
  }
}
