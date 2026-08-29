const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { "content-type": "application/json; charset=utf-8" },
});

const clean = (value, maxLength) => String(value || "").trim().slice(0, maxLength);

export async function onRequestPost({ request, env }) {
  if (!env.RESEND_API_KEY || !env.CONTACT_TO_EMAIL || !env.CONTACT_FROM_EMAIL) {
    return json({ error: "Email delivery is not configured yet." }, 503);
  }

  let data;
  try {
    data = await request.json();
  } catch {
    return json({ error: "Invalid form submission." }, 400);
  }

  if (clean(data.website, 200)) return json({ ok: true });

  const firstName = clean(data.firstName, 80);
  const lastName = clean(data.lastName, 80);
  const email = clean(data.email, 160);
  const phone = clean(data.phone, 40);
  const interest = clean(data.interest, 80);
  const message = clean(data.message, 4000);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!firstName || !lastName || !emailPattern.test(email) || !message) {
    return json({ error: "Please complete all required fields." }, 400);
  }

  const text = [
    `New website inquiry from ${firstName} ${lastName}`,
    "",
    `Email: ${email}`,
    `Phone: ${phone || "Not provided"}`,
    `Trip interest: ${interest || "Not selected"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, "content-type": "application/json" },
    body: JSON.stringify({
      from: env.CONTACT_FROM_EMAIL,
      to: [env.CONTACT_TO_EMAIL],
      reply_to: email,
      subject: `Website inquiry: ${interest || "Travel planning"} — ${firstName} ${lastName}`,
      text,
    }),
  });

  if (!response.ok) {
    console.error("Resend delivery failed", response.status, await response.text());
    return json({ error: "We could not send your message. Please try again or email us directly." }, 502);
  }

  return json({ ok: true });
}
