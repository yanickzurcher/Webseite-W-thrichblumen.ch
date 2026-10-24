(function () {
  "use strict";

  /* ---------- Leiste: Schatten beim Scrollen ---------- */
  var bar = document.getElementById("bar");
  function barStatus() { bar.classList.toggle("ist-gescrollt", window.scrollY > 8); }
  barStatus();
  window.addEventListener("scroll", barStatus, { passive: true });

  /* ---------- Mobiles Menü ---------- */
  var toggle = document.getElementById("navToggle");
  var nav = document.getElementById("nav");
  function menu(offen) {
    toggle.setAttribute("aria-expanded", String(offen));
    nav.classList.toggle("ist-offen", offen);
  }
  toggle.addEventListener("click", function () { menu(toggle.getAttribute("aria-expanded") !== "true"); });
  nav.addEventListener("click", function (e) { if (e.target.closest("a")) menu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") menu(false); });

  /* ---------- Aktiven Abschnitt in der Leiste markieren ---------- */
  var links = Array.prototype.slice.call(nav.querySelectorAll("a[href^='#']"));
  var abschnitte = links.map(function (a) { return document.querySelector(a.getAttribute("href")); }).filter(Boolean);
  if ("IntersectionObserver" in window) {
    var beobachter = new IntersectionObserver(function (eintraege) {
      eintraege.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (a) { a.classList.toggle("ist-aktiv", a.getAttribute("href") === "#" + e.target.id); });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    abschnitte.forEach(function (s) { beobachter.observe(s); });
  }

  /* ---------- Hilfen ---------- */
  function laden(pfad) {
    return fetch(pfad, { cache: "no-cache" }).then(function (r) {
      if (!r.ok) throw new Error(pfad + " " + r.status);
      return r.json();
    });
  }
  function absaetze(text) {
    return String(text).split(/\n\s*\n/).map(function (t) { return t.trim(); }).filter(Boolean);
  }
  // Bildausschnitt: x und y in Prozent (0 = links/oben, 100 = rechts/unten)
  function pos(x, y, standard) {
    var px = parseFloat(x), py = parseFloat(y);
    if (isNaN(px) && isNaN(py)) return standard || "50% 50%";
    return (isNaN(px) ? 50 : px) + "% " + (isNaN(py) ? 50 : py) + "%";
  }
  function el(tag, attrs, text) {
    var n = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) { n.setAttribute(k, attrs[k]); });
    if (text) n.textContent = text;
    return n;
  }

  /* ---------- Was blüht gerade ---------- */
  laden("/content/aktuell.json").then(function (d) {
    if (d.hinweis) document.getElementById("aktuellHinweis").textContent = d.hinweis;
    if (d.stand) document.getElementById("aktuellStand").textContent = "Stand: " + d.stand;
    var liste = document.getElementById("aktuellListe");
    var sichtbar = (d.blumen || []).filter(function (b) { return b.name && b.sichtbar !== false; });
    var leer = document.getElementById("aktuellLeer");
    if (!sichtbar.length) { if (d.leer) leer.textContent = d.leer; leer.hidden = false; }
    sichtbar.forEach(function (b) {
      var li = el("li", { "class": "etikett" });
      if (b.bild) {
        var eimg = el("img", { src: b.bild, alt: b.name, loading: "lazy", width: "900", height: "900" });
        eimg.style.objectPosition = pos(b.x, b.y);
        li.appendChild(eimg);
      }
      li.appendChild(el("h3", null, b.name));
      liste.appendChild(li);
    });
  }).catch(function () {});

  /* ---------- Startbild ---------- */
  var STANDARD_START = {
    bild: "/img/hero-sonnenblumen-2400.jpg", bild_handy: "/img/hero-sonnenblumen-handy.jpg",
    alt: "Zwei Körbe mit Sonnenblumen und Gladiolen im Abendlicht vor dem Blumenfeld in Brittnau",
    x: "50", y: "0", x_handy: "50", y_handy: "0"
  };
  function startbild(d) {
    d = d && d.bild ? d : STANDARD_START;
    var img = document.getElementById("heroBild");
    var quelle = document.getElementById("heroHandy");
    var hero = document.getElementById("top");
    hero.style.setProperty("--hero-pos", pos(d.x, d.y, "50% 0%"));
    hero.style.setProperty("--hero-pos-handy", pos(d.x_handy, d.y_handy, "50% 0%"));
    img.alt = d.alt || "";
    img.addEventListener("load", function () { img.classList.add("geladen"); });
    quelle.srcset = d.bild_handy || d.bild;
    img.src = d.bild;
    if (img.complete && img.naturalWidth) img.classList.add("geladen");
  }
  laden("/content/startbild.json").then(startbild).catch(function () { startbild(null); });

  /* ---------- So geht's ---------- */
  laden("/content/sogehts.json").then(function (d) {
    var lis = document.querySelectorAll("#so-gehts .schritt");
    (d.schritte || []).slice(0, lis.length).forEach(function (s, i) {
      var li = lis[i];
      if (s.titel) li.querySelector("h3").textContent = s.titel;
      if (s.text) li.querySelector(".schritt__text p").textContent = s.text;
      var img = li.querySelector("img");
      if (s.bild && img.getAttribute("src") !== s.bild) img.src = s.bild;
      if (s.alt) img.alt = s.alt;
      img.style.objectPosition = pos(s.x, s.y);
    });
  }).catch(function () {});

  /* ---------- Saison-Hinweis ---------- */
  laden("/content/hinweis.json").then(function (d) {
    var box = document.getElementById("saisonHinweis");
    if (d.aktiv && d.text) { box.textContent = d.text; box.hidden = false; }
  }).catch(function () {});

  /* ---------- Über uns ---------- */
  laden("/content/ueber-uns.json").then(function (d) {
    if (d.einleitung) document.getElementById("ueberEinleitung").textContent = d.einleitung;
    var liste = document.getElementById("personen");
    (d.personen || []).forEach(function (p) {
      var li = el("li", { "class": "person" });
      var bild = el("div", { "class": "person__bild" });
      if (p.bild) {
        var pimg = el("img", { src: p.bild, alt: p.name || "", loading: "lazy" });
        pimg.style.objectPosition = pos(p.x, p.y);
        bild.appendChild(pimg);
      } else {
        var ph = el("div", { "class": "person__platzhalter" });
        ph.appendChild(el("img", { src: "/img/sonnenblume.png", alt: "", width: "256", height: "256" }));
        ph.appendChild(el("span", null, "Foto folgt"));
        bild.appendChild(ph);
      }
      li.appendChild(bild);
      li.appendChild(el("h3", null, p.name));
      if (p.rolle) li.appendChild(el("p", { "class": "person__rolle" }, p.rolle));
      if (p.text) absaetze(p.text).forEach(function (t) { li.appendChild(el("p", { "class": "person__text" }, t)); });
      liste.appendChild(li);
    });
  }).catch(function () {});

  /* ---------- Betrieb ---------- */
  laden("/content/betrieb.json").then(function (d) {
    var box = document.getElementById("betriebText");
    if (d.text) {
      box.textContent = "";
      absaetze(d.text).forEach(function (t) { box.appendChild(el("p", null, t)); });
    }
    [["betriebBild1", d.bild1, d.bild1text, d.bild1_x, d.bild1_y], ["betriebBild2", d.bild2, d.bild2text, d.bild2_x, d.bild2_y]].forEach(function (b) {
      var img = document.getElementById(b[0]);
      if (b[1]) { img.src = b[1]; img.alt = b[2] || "Bild vom Betrieb"; img.style.objectPosition = pos(b[3], b[4]); }
      else { img.closest("figure").hidden = true; }
    });
  }).catch(function () {});

  /* ---------- Kontakt und soziale Medien ---------- */
  laden("/content/einstellungen.json").then(function (d) {
    var dd = document.getElementById("kontaktEmail");
    if (d.email) {
      dd.textContent = "";
      dd.appendChild(el("a", { href: "mailto:" + d.email }, d.email));
    }
    if (d.instagram) document.querySelectorAll(".js-instagram").forEach(function (a) { a.href = d.instagram; });
    if (d.facebook) document.querySelectorAll(".js-facebook").forEach(function (a) { a.href = d.facebook; });
  }).catch(function () {});

  /* ---------- Impressionen + Bildansicht ---------- */
  var galerie = document.getElementById("galerie");
  var lb = document.getElementById("lightbox");
  var lbImg = document.getElementById("lightboxImg");
  var bilder = [];
  var aktuell = 0;

  function zeige(i) {
    aktuell = (i + bilder.length) % bilder.length;
    lbImg.src = bilder[aktuell].bild;
    lbImg.alt = bilder[aktuell].text || "";
  }
  function oeffne(i) {
    zeige(i);
    if (typeof lb.showModal === "function") lb.showModal();
    else window.open(bilder[i].bild, "_blank");
  }

  laden("/content/galerie.json").then(function (d) {
    bilder = d.bilder || [];
    var ZUERST = 9;
    bilder.forEach(function (b, i) {
      var li = el("li");
      if (i % 10 === 0) li.className = "gross-bild";
      if (i >= ZUERST) li.hidden = true;
      var btn = el("button", { type: "button", "aria-label": "Bild vergrössern: " + (b.text || "Impression") });
      var gimg = el("img", { src: b.bild, alt: b.text || "", loading: "lazy" });
      gimg.style.objectPosition = pos(b.x, b.y);
      btn.appendChild(gimg);
      btn.addEventListener("click", function () { oeffne(i); });
      li.appendChild(btn);
      galerie.appendChild(li);
    });
    if (bilder.length > ZUERST) {
      var mehr = document.getElementById("galerieMehr");
      mehr.hidden = false;
      document.getElementById("galerieMehrBtn").addEventListener("click", function () {
        Array.prototype.forEach.call(galerie.querySelectorAll("li[hidden]"), function (li) { li.hidden = false; });
        mehr.hidden = true;
      });
    }
  }).catch(function () {});

  document.getElementById("lbZu").addEventListener("click", function () { lb.close(); });
  document.getElementById("lbVor").addEventListener("click", function () { zeige(aktuell + 1); });
  document.getElementById("lbZurueck").addEventListener("click", function () { zeige(aktuell - 1); });
  lb.addEventListener("click", function (e) { if (e.target === lb) lb.close(); });
  lb.addEventListener("keydown", function (e) {
    if (e.key === "ArrowRight") zeige(aktuell + 1);
    if (e.key === "ArrowLeft") zeige(aktuell - 1);
  });
  // Wischen auf dem Handy
  var startX = null;
  lb.addEventListener("touchstart", function (e) { startX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener("touchend", function (e) {
    if (startX === null) return;
    var dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) zeige(aktuell + (dx < 0 ? 1 : -1));
    startX = null;
  });
})();
