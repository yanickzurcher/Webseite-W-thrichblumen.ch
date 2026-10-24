# wüthrichblumen.ch – Anleitung

Onepager für Wüthrich Blumen, Brittnau. Reines HTML/CSS/JS, kein Build-Schritt.
Inhalte für „Was blüht gerade“, die Bildergalerie und die E-Mail-Adresse werden mit **Decap CMS** gepflegt.

## Ordnerübersicht

| Ordner / Datei | Inhalt |
|---|---|
| `index.html` | Die Seite mit allen Abschnitten |
| `impressum.html`, `datenschutz.html` | Rechtliches |
| `css/style.css` | Gestaltung (Farben aus dem Logo) |
| `js/main.js` | Menü, Inhalte laden, Bildansicht |
| `content/*.json` | Inhalte, die Saskia im CMS ändert |
| `img/` | Alle Bilder (fürs Web verkleinert, ohne GPS-Daten) |
| `admin/` | Decap CMS (erreichbar unter `/admin`) |
| `functions/api/` | GitHub-Anmeldung für das CMS (läuft auf Cloudflare) |
| `fonts/` | Schriften, lokal gehostet (keine Google-Fonts-Verbindung) |

---

## 1. Auf GitHub hochladen

1. Repo öffnen: https://github.com/yanickzurcher/Webseite-W-thrichblumen.ch
2. **Add file → Upload files**, den **Inhalt** dieses Ordners hineinziehen (nicht den Ordner selbst, `index.html` muss ganz oben im Repo liegen).
3. Unten **Commit changes**. Der Branch muss `main` heissen.

## 2. Cloudflare Pages verbinden

1. Cloudflare → **Workers & Pages → Create → Pages → Connect to Git**.
2. Repo `Webseite-W-thrichblumen.ch` wählen.
3. Einstellungen:
   - Framework preset: **None**
   - Build command: *leer lassen*
   - Build output directory: `/`
4. **Save and Deploy**. Danach läuft die Seite unter einer `….pages.dev`-Adresse.
5. **Custom domains → Set up a custom domain** → `wüthrichblumen.ch` eintragen (Cloudflare zeigt es als `xn--wthrichblumen-wob.ch`, das ist dieselbe Adresse). Optional auch `www.wüthrichblumen.ch`.

## 3. Anmeldung für das CMS einrichten (einmalig, ca. 10 Minuten)

Decap speichert Änderungen direkt im GitHub-Repo. Dafür braucht es eine kleine GitHub-„OAuth-App“.

1. GitHub → Profilbild → **Settings → Developer settings → OAuth Apps → New OAuth App**
   - Application name: `Wüthrich Blumen CMS`
   - Homepage URL: `https://xn--wthrichblumen-wob.ch`
   - Authorization callback URL: `https://xn--wthrichblumen-wob.ch/api/callback`
2. **Register application**, dann **Generate a new client secret**. Client ID und Secret kopieren.
3. Cloudflare → dein Pages-Projekt → **Settings → Variables and Secrets** → für *Production* hinzufügen:
   - `GITHUB_CLIENT_ID` = Client ID
   - `GITHUB_CLIENT_SECRET` = Secret (als **Secret** / verschlüsselt)
4. **Deployments → Retry deployment** (damit die Variablen aktiv werden).

**Wichtig:** Die Anmeldung funktioniert erst, wenn die Domain `wüthrichblumen.ch` bei Cloudflare aktiv ist.

### Zugang für Saskia
Saskia braucht ein eigenes (kostenloses) GitHub-Konto. Im Repo unter **Settings → Collaborators → Add people** ihr Konto einladen. Sie muss die Einladung per Mail annehmen.

## 4. Inhalte bearbeiten (für Saskia)

1. `https://wüthrichblumen.ch/admin` öffnen → **Mit GitHub anmelden**.
2. **Webseite** wählen:
   - **Was blüht gerade**: bis zu 8 Etiketten mit Name und Bild. Was gerade nicht blüht, einfach löschen (Papierkorb). Mit „Etikett hinzufügen“ kommt wieder eines dazu, mit den Punkten links lässt sich die Reihenfolge ändern.
   - **Über uns**: Einleitung und die Personen (Name, Aufgabe, Text, Foto). Ohne Foto erscheint „Foto folgt“.
   - **Hofgeschichte**: Text und optional ein Bild. Eine Leerzeile im Text beginnt einen neuen Absatz.
   - **Impressionen**: Bilder für die Galerie. Die ersten 9 sind sofort sichtbar, der Rest nach „Weitere Bilder zeigen“.
   - **Kontakt & soziale Medien**: E-Mail-Adresse sowie Instagram- und Facebook-Link. Die E-Mail erscheint bei Kontakt, Impressum und Datenschutz, sobald sie eingetragen ist.
3. **Veröffentlichen**. Nach ca. 1 Minute ist die Änderung online.

**Tipp zu Bildern:** Fotos vom Handy vor dem Hochladen etwas verkleinern (z. B. auf 1200 px Breite). Dann lädt die Seite schneller.

---

## Was noch offen ist

- [ ] E-Mail-Adresse eintragen (im CMS unter **Kontakt & soziale Medien**)
- [ ] Texte und Fotos für **Über uns** (Hans-Peter, Saskia, Ruth, Walter, Yanick, Baddy)
- [ ] Text für die **Hofgeschichte**
- [ ] Optional: ein Foto der Kasse für Schritt 3 bei „So geht's“ (`img/schritt-3-kasse.jpg` ersetzen)
