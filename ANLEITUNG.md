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
| `sitemap.xml`, `robots.txt` | Für Google |
| `img/` | Alle Bilder (fürs Web verkleinert, ohne GPS-Daten) |
| `admin/` | Decap CMS (erreichbar unter `/admin`) |
| `.github/` | Automatik, die hochgeladene Bilder verkleinert |
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
   - **Startbild**: das große Bild ganz oben. Eigenes Bild hochladen (Querformat fürs Computer, optional Hochformat fürs Handy) und den Ausschnitt wählen. Rechts siehst du Computer und Handy nebeneinander.
   - **So geht's**: die drei Schritte mit Titel, Text und Foto (Hochformat). Es bleiben immer drei.
   - **Was blüht gerade**: beliebig viele Etiketten mit Name und Bild. Jedes hat einen Schalter **Sichtbar auf der Webseite**: Blüht etwas, Schalter ein, blüht es nicht mehr, Schalter aus. Die Blume bleibt gespeichert und muss nicht neu angelegt werden. Mit den Punkten links lässt sich die Reihenfolge ändern. Sind alle ausgeblendet, erscheint der Text „Im Moment blüht nichts …“.
   - **Saison-Hinweis**: Schalter **Hinweis anzeigen** ein = oben auf der Seite erscheint ein ockerfarbener Streifen, zum Beispiel „Saison beendet, ab März sind wir wieder da.“. Im März wieder ausschalten.
   - **Über uns**: Einleitung und die Personen (Name, Aufgabe, Text, Foto). Ohne Foto erscheint „Foto folgt“.
   - **Betrieb**: Text und zwei Bilder. Eine Leerzeile im Text beginnt einen neuen Absatz.
   - **Impressionen**: Bilder für die Galerie. Die ersten 9 sind sofort sichtbar, der Rest nach „Weitere Bilder zeigen“.
   - **Kontakt & soziale Medien**: E-Mail-Adresse sowie Instagram- und Facebook-Link. Die E-Mail erscheint bei Kontakt, Impressum und Datenschutz, sobald sie eingetragen ist.
3. **Ausschnitt wählen und Vorschau ansehen:** Bei jedem Bild gibt es zwei Auswahlfelder, **Ausschnitt waagrecht** (links bis rechts) und **Ausschnitt senkrecht** (oben bis unten). Ein Bild wird immer in einen festen Rahmen geschnitten (Quadrat, Hochformat, Querformat). Mit den Feldern bestimmst du, welcher Teil sichtbar bleibt, zum Beispiel «Oben», damit ein Gesicht nicht abgeschnitten wird. Rechts neben dem Formular zeigt die **Vorschau** sofort, wie es auf der Webseite aussieht. Erst wenn es gut aussieht, auf **Veröffentlichen** klicken.
4. **Veröffentlichen**. Nach ca. 1 Minute ist die Änderung online.

**Bilder:** Fotos können direkt vom Handy hochgeladen werden, Verkleinern ist nicht nötig. Etwa eine Minute nach dem Veröffentlichen verkleinert GitHub sie automatisch (längste Seite 1600 Pixel, beim Startbild 2400), dreht sie richtig und entfernt versteckte Daten wie den Aufnahmeort. Danach baut Cloudflare die Seite noch einmal neu auf, ca. 1 Minute später ist alles fertig. Am besten JPG oder PNG verwenden (keine HEIC-Dateien vom iPhone). Die Zuschneidung auf Quadrat oder Hochformat macht die Seite selbst.
Das erledigt die Datei `.github/workflows/bilder-optimieren.yml`. Sie muss im Repo liegen (Ordner `.github` mit hochladen).

---

## Was noch offen ist

- [ ] E-Mail-Adresse eintragen (im CMS unter **Kontakt & soziale Medien**)
- [ ] Foto und Text für Hans-Peter, Texte für alle Personen bei **Über uns**
- [ ] Eigenes Foto von Ruth und Walter (im CMS bei **Über uns** hochladen)
- [ ] Optional: ein Foto der Kasse für Schritt 3 bei „So geht's“ (im CMS unter **So geht's** austauschen)
