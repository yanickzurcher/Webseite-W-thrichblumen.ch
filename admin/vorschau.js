/* Live-Vorschau im Editor: zeigt rechts, wie die Seite nach dem Speichern aussieht.
   Verwendet dieselben Klassen und dasselbe Stylesheet wie die echte Webseite. */
(function () {
  if (!window.CMS) return;
  var h = window.h || (window.React && window.React.createElement);
  if (!h) return;

  CMS.registerPreviewStyle("/css/style.css");
  CMS.registerPreviewStyle(
    "body{background:#F6EFE0;margin:0}" +
    ".vp{padding:18px 16px 28px}" +
    ".vp-hinweis{font:600 12px/1.4 system-ui,sans-serif;color:#6B5B3E;margin:0 0 14px;letter-spacing:.02em}" +
    ".vp .hero{height:auto;min-height:0;padding-top:0}" +
    ".vp .hero picture,.vp .vp-hero-bild{position:absolute;top:0;left:0;right:0;bottom:0}" +
    ".vp .hero::after{inset:0}" +
    ".vp-hero{position:relative;overflow:hidden;border-radius:6px;margin-bottom:16px;background:#2a4433}" +
    ".vp-hero--computer{height:230px}.vp-hero--handy{height:380px;width:210px}" +
    ".vp-hero h1{position:relative;z-index:2;color:#fff;font-size:26px;line-height:1.05;margin:0;padding:22px 20px}" +
    ".vp-hero--handy h1{font-size:20px;padding:18px 14px}" +
    ".vp-hero .hero__ort{display:block;font-style:italic;color:#E9C46A}" +
    ".vp-hero:after{content:'';position:absolute;inset:0;background:linear-gradient(90deg,rgba(0,0,0,.45),rgba(0,0,0,.05));z-index:1}" +
    ".vp .aktuell{padding:16px;border-radius:6px}.vp .abschnitt{padding:0}.vp .schritte{grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}" +
    ".vp .schritt__text{display:block}.vp .schritt__nr{font-size:2rem}" +
    ".vp .etiketten{grid-template-columns:repeat(6,1fr)}.vp .etiketten>li{grid-column:span 2;transform:none}" +
    ".vp .personen{grid-template-columns:repeat(2,minmax(0,1fr))}" +
    ".vp .betrieb__raster{grid-template-columns:1fr}.vp .galerie{grid-template-columns:repeat(3,minmax(0,1fr))}"
  , { raw: true });

  function liste(x) { return x && x.toJS ? x.toJS() : (x || []); }
  function wert(entry, feld, standard) {
    var v = entry.getIn(["data", feld]);
    return (v === undefined || v === null || v === "") ? standard : v;
  }
  function pos(x, y, standard) {
    var px = parseFloat(x), py = parseFloat(y);
    if (isNaN(px) && isNaN(py)) return standard || "50% 50%";
    return (isNaN(px) ? 50 : px) + "% " + (isNaN(py) ? 50 : py) + "%";
  }
  function quelle(getAsset, pfad) {
    if (!pfad) return "";
    try {
      var a = getAsset(pfad);
      var u = a && (a.url || (a.toString && a.toString()));
      return u && u !== "[object Object]" ? u : pfad;
    } catch (e) { return pfad; }
  }
  function absaetze(text) {
    return String(text || "").split(/\n\s*\n/).map(function (t) { return t.trim(); }).filter(Boolean);
  }
  function rahmen(titel, kinder) {
    return h("div", { className: "vp" }, h("p", { className: "vp-hinweis" }, titel), kinder);
  }

  /* Startbild: Computer und Handy nebeneinander */
  CMS.registerPreviewTemplate("startbild", function (p) {
    var e = p.entry, ga = p.getAsset;
    var bild = quelle(ga, wert(e, "bild", ""));
    var handy = quelle(ga, wert(e, "bild_handy", "")) || bild;
    function ansicht(art, src, x, y) {
      return h("div", { className: "vp-hero vp-hero--" + art },
        src ? h("img", { className: "hero__img geladen", src: src, alt: "", style: { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: pos(x, y, "50% 0%") } }) : null,
        h("h1", null, "Blumen selber pflücken ", h("span", { className: "hero__ort" }, "in Brittnau")));
    }
    return rahmen("So sieht das Startbild aus (links Computer, rechts Handy)",
      h("div", { style: { display: "flex", gap: "14px", alignItems: "flex-start", flexWrap: "wrap" } },
        h("div", { style: { flex: "1 1 320px", minWidth: "280px" } }, ansicht("computer", bild, wert(e, "x", "50"), wert(e, "y", "0"))),
        h("div", null, ansicht("handy", handy, wert(e, "x_handy", "50"), wert(e, "y_handy", "0")))));
  });

  /* So geht's */
  CMS.registerPreviewTemplate("sogehts", function (p) {
    var ga = p.getAsset;
    var s = liste(p.entry.getIn(["data", "schritte"]));
    return rahmen("So sieht «So geht's» aus",
      h("ol", { className: "schritte" }, s.map(function (x, i) {
        return h("li", { className: "schritt", key: i },
          h("figure", null, h("img", { src: quelle(ga, x.bild), alt: x.alt || "", style: { objectPosition: pos(x.x, x.y) } })),
          h("div", { className: "schritt__text" },
            h("span", { className: "schritt__nr" }, String(i + 1)),
            h("h3", null, x.titel || ""),
            h("p", null, x.text || "")));
      })));
  });

  /* Was blüht gerade */
  CMS.registerPreviewTemplate("aktuell", function (p) {
    var e = p.entry, ga = p.getAsset;
    var alle = liste(e.getIn(["data", "blumen"]));
    var sichtbar = alle.filter(function (b) { return b && b.name && b.sichtbar !== false; });
    return rahmen("So sieht «Was blüht gerade» aus (" + sichtbar.length + " von " + alle.length + " sichtbar)",
      h("section", { className: "aktuell" },
        h("p", { className: "aktuell__hinweis" }, wert(e, "hinweis", "")),
        wert(e, "stand", "") ? h("p", { className: "aktuell__stand" }, "Stand: " + wert(e, "stand", "")) : null,
        sichtbar.length ? null : h("p", { className: "aktuell__leer" }, wert(e, "leer", "Im Moment blüht nichts, bald geht es wieder los.")),
        h("ul", { className: "etiketten" }, sichtbar.map(function (b, i) {
          return h("li", { className: "etikett", key: i },
            b.bild ? h("img", { src: quelle(ga, b.bild), alt: b.name, style: { objectPosition: pos(b.x, b.y) } }) : null,
            h("h3", null, b.name));
        }))));
  });

  /* Über uns */
  CMS.registerPreviewTemplate("ueber-uns", function (p) {
    var e = p.entry, ga = p.getAsset;
    var personen = liste(e.getIn(["data", "personen"]));
    return rahmen("So sieht «Über uns» aus",
      h("div", null,
        h("p", null, wert(e, "einleitung", "")),
        h("ul", { className: "personen" }, personen.map(function (x, i) {
          return h("li", { className: "person", key: i },
            h("div", { className: "person__bild" },
              x.bild ? h("img", { src: quelle(ga, x.bild), alt: x.name || "", style: { objectPosition: pos(x.x, x.y) } })
                     : h("div", { className: "person__platzhalter" }, h("span", null, "Foto folgt"))),
            h("h3", null, x.name || ""),
            x.rolle ? h("p", { className: "person__rolle" }, x.rolle) : null,
            absaetze(x.text).map(function (t, k) { return h("p", { className: "person__text", key: k }, t); }));
        }))));
  });

  /* Betrieb */
  CMS.registerPreviewTemplate("betrieb", function (p) {
    var e = p.entry, ga = p.getAsset;
    function bild(n) {
      var src = wert(e, "bild" + n, "");
      if (!src) return null;
      return h("figure", { className: "betrieb__bild betrieb__bild--" + n },
        h("img", { src: quelle(ga, src), alt: wert(e, "bild" + n + "text", ""), style: { objectPosition: pos(wert(e, "bild" + n + "_x", "50"), wert(e, "bild" + n + "_y", "50")) } }));
    }
    return rahmen("So sieht «Betrieb» aus",
      h("div", { className: "betrieb__raster" },
        h("div", { className: "betrieb__text" }, h("h2", null, "Betrieb"),
          absaetze(wert(e, "text", "")).map(function (t, i) { return h("p", { key: i }, t); })),
        h("div", { className: "betrieb__bilder" }, bild(1), bild(2))));
  });

  /* Impressionen */
  CMS.registerPreviewTemplate("galerie", function (p) {
    var ga = p.getAsset;
    var b = liste(p.entry.getIn(["data", "bilder"]));
    return rahmen("So sehen die Impressionen aus (alle " + b.length + " Bilder)",
      h("ul", { className: "galerie" }, b.map(function (x, i) {
        return h("li", { key: i, className: i % 10 === 0 ? "gross-bild" : "" },
          h("button", { type: "button" }, h("img", { src: quelle(ga, x.bild), alt: x.text || "", style: { objectPosition: pos(x.x, x.y) } })));
      })));
  });

  /* Saison-Hinweis */
  CMS.registerPreviewTemplate("hinweis", function (p) {
    var e = p.entry;
    var an = e.getIn(["data", "aktiv"]) === true;
    return rahmen(an ? "Der Streifen ist EIN, so sieht er aus" : "Der Streifen ist AUS, die Seite zeigt nichts an",
      an ? h("div", { className: "hero", style: { height: "auto", minHeight: 0, background: "none" } },
        h("p", { className: "saison", style: { position: "static" } }, wert(e, "text", ""))) : null);
  });
})();
