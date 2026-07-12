// api/sms.js
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

    // 2. Prepare the Arkesel API Request
    const arkeselUrl = "https://api.arkesel.com/sms/send";
    const payload = {
      sender: process.env.ARKESEL_SENDER_ID, // Use your approved Arkesel Sender ID
      message: `Hi ${name}, we've received your interest. Our team will reply on WhatsApp shortly. - SkyTech Ghana`,
      recipients: [phone],
    };

    // 3. Send to Arkesel
    const response = await fetch(arkeselUrl, {
      method: "POST",
      headers: {
        "api-key": process.env.ARKESEL_API_KEY, // We will set this in Vercel next
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // 4. Send success back to the website
    return res.status(200).json({ success: true, message: "SMS triggered" });
  } catch (error) {
    console.error("Server Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
