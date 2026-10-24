// Cloudflare Pages Function: nimmt die Antwort von GitHub entgegen und gibt das
// Zugangs-Token an das Decap-CMS-Fenster weiter.

function antwort(status, inhalt) {
  const nachricht = `authorization:github:${status}:${JSON.stringify(inhalt)}`;
  const html = `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Anmeldung</title></head>
<body><p>${status === "success" ? "Anmeldung erfolgreich, dieses Fenster schliesst sich gleich." : "Anmeldung fehlgeschlagen."}</p>
<script>
(function () {
  var nachricht = ${JSON.stringify(nachricht)};
  function empfangen(e) {
    window.opener.postMessage(nachricht, e.origin);
    window.removeEventListener("message", empfangen, false);
    setTimeout(function () { window.close(); }, 400);
  }
  window.addEventListener("message", empfangen, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script></body></html>`;
  return new Response(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Set-Cookie": "decap_state=; Path=/api; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
    },
  });
}

export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookie = request.headers.get("Cookie") || "";
  const gespeichert = (cookie.match(/(?:^|;\s*)decap_state=([^;]+)/) || [])[1];

  if (!code || !state || state !== gespeichert) {
    return antwort("error", { message: "Ungültige Anmeldung, bitte nochmals versuchen." });
  }

  try {
    const r = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json", "User-Agent": "wuethrichblumen-decap" },
      body: JSON.stringify({
        client_id: env.GITHUB_CLIENT_ID,
        client_secret: env.GITHUB_CLIENT_SECRET,
        code,
        redirect_uri: `${url.origin}/api/callback`,
      }),
    });
    const daten = await r.json();
    if (!daten.access_token) {
      return antwort("error", { message: daten.error_description || "Kein Token erhalten." });
    }
    return antwort("success", { token: daten.access_token, provider: "github" });
  } catch (e) {
    return antwort("error", { message: "GitHub war nicht erreichbar." });
  }
}
