/*! Combo Zgody 1.0.1 — baner zgód z Google Consent Mode v2. Combo Marketing, licencja MIT.
 *
 * Ładuje go szablon GTM „Combo – Zgody” (Consent Initialization), który wcześniej ustawia domyślne zgody
 * („denied”) i przywraca zapisany wybór. Ten plik tylko pokazuje baner, zapisuje wybór w ciasteczku
 * `combo_zgody` i wysyła `gtag('consent', 'update', …)`. Bez zależności, bez zewnętrznych zapytań.
 * Konfiguracja: window.ComboZgodyConfig = {policyUrl, color, textColor, position, texts{…}, days, version, button,
 *   eventName (zdarzenie dataLayer po wyborze; domyślnie combo_zgody_update)}.
 */
(function () {
  "use strict";
  if (window.ComboZgody && window.ComboZgody.loaded) return;
  var C = window.ComboZgodyConfig || {};
  var NAME = "combo_zgody";
  var DAYS = +C.days || 180;
  var VERSION = String(C.version || "1");
  var EVENT = /^[A-Za-z0-9_.-]{1,40}$/.test(C.eventName || "") ? C.eventName : "combo_zgody_update";
  var T = Object.assign({
    title: "Szanujemy Twoją prywatność",
    body: "Używamy plików cookie, żeby strona działała poprawnie, oraz — za Twoją zgodą — do analizy ruchu i dopasowania reklam. Zgodę możesz w każdej chwili zmienić.",
    accept: "Akceptuję wszystkie",
    reject: "Odrzucam",
    settings: "Ustawienia",
    save: "Zapisz wybór",
    policy: "Polityka prywatności",
    necessary: "Niezbędne",
    necessaryInfo: "Potrzebne do działania strony. Zawsze włączone.",
    analytics: "Analityczne",
    analyticsInfo: "Pomagają nam zrozumieć, jak korzystasz ze strony (np. Google Analytics).",
    marketing: "Marketingowe",
    marketingInfo: "Pozwalają mierzyć skuteczność i dopasowywać reklamy (np. Google Ads, Meta, TikTok).",
    reopen: "Ustawienia cookies"
  }, C.texts || {});
  var color = /^#[0-9a-fA-F]{3,8}$/.test(C.color || "") ? C.color : "#1D1D1B";
  var textColor = /^#[0-9a-fA-F]{3,8}$/.test(C.textColor || "") ? C.textColor : "#FFFFFF";

  function gtag() { (window.dataLayer = window.dataLayer || []).push(arguments); }

  function cookies() {
    try { return document.cookie; } catch (e) { return ""; }   // ciasteczka zablokowane — baner i tak działa
  }

  function read() {
    var m = cookies().match(new RegExp("(?:^|; )" + NAME + "=([^;]*)"));
    if (!m) return null;
    try {
      var v = JSON.parse(decodeURIComponent(m[1]));
      return v && v.v === VERSION ? v : null;
    } catch (e) { return null; }
  }

  function write(a, mk) {
    var v = { v: VERSION, a: a ? 1 : 0, m: mk ? 1 : 0, t: Date.now() };
    var exp = new Date(Date.now() + DAYS * 864e5).toUTCString();
    try {
      document.cookie = NAME + "=" + encodeURIComponent(JSON.stringify(v)) + "; expires=" + exp +
        "; path=/; SameSite=Lax" + (location.protocol === "https:" ? "; Secure" : "");
    } catch (e) { /* ciasteczka zablokowane: wybór działa do końca wizyty */ }
    return v;
  }

  function apply(v) {
    var g = function (x) { return x ? "granted" : "denied"; };
    gtag("consent", "update", {
      analytics_storage: g(v.a), ad_storage: g(v.m), ad_user_data: g(v.m), ad_personalization: g(v.m)
    });
    // consent_analytics / consent_marketing: te same klucze co popularne banery — istniejące wyzwalacze dalej działają
    window.dataLayer.push({ event: EVENT, combo_zgody_analytics: !!v.a, combo_zgody_marketing: !!v.m,
                            consent_analytics: !!v.a, consent_marketing: !!v.m });
  }

  function el(tag, attrs, text) {
    var e = document.createElement(tag);
    for (var k in attrs) if (Object.prototype.hasOwnProperty.call(attrs, k)) e.setAttribute(k, attrs[k]);
    if (text) e.textContent = text;
    return e;
  }

  function css() {
    if (document.getElementById("cz-style")) return;
    var s = el("style", { id: "cz-style" });
    s.textContent =
      "#cz-box{position:fixed;z-index:2147483646;left:16px;right:16px;" + (C.position === "top" ? "top" : "bottom") + ":16px;" +
      "max-width:560px;margin:0 auto;background:#fff;color:#1D1D1B;border-radius:10px;box-shadow:0 6px 30px rgba(0,0,0,.25);" +
      "padding:18px 20px;font:14px/1.5 -apple-system,Segoe UI,Roboto,Arial,sans-serif}" +
      "#cz-box h2{margin:0 0 6px;font-size:16px;line-height:1.3}#cz-box p{margin:0 0 12px}" +
      "#cz-box a{color:inherit;text-decoration:underline}" +
      "#cz-box .cz-row{display:flex;flex-wrap:wrap;gap:8px;margin-top:12px}" +
      "#cz-box button{flex:1 1 auto;min-width:120px;padding:10px 14px;border-radius:6px;font-family:inherit;font-size:14px;font-weight:600;line-height:1.2;cursor:pointer;" +
      "border:2px solid " + color + "}" +
      "#cz-box .cz-main{background:" + color + ";color:" + textColor + "}" +
      "#cz-box .cz-sec{background:#fff;color:" + color + "}" +
      "#cz-box label{display:block;margin:8px 0;cursor:pointer}#cz-box label small{display:block;color:#555;margin-left:24px}" +
      "#cz-box input{margin-right:8px;width:16px;height:16px;vertical-align:-3px}" +
      "#cz-open{position:fixed;z-index:2147483645;left:12px;bottom:12px;padding:6px 10px;border-radius:6px;border:0;" +
      "background:" + color + ";color:" + textColor + ";font:12px/1.2 -apple-system,Segoe UI,Roboto,Arial,sans-serif;opacity:.85;cursor:pointer}" +
      "#cz-box button:focus-visible,#cz-open:focus-visible{outline:3px solid #D20A11;outline-offset:2px}";
    document.head.appendChild(s);
  }

  function close() {
    var b = document.getElementById("cz-box");
    if (b) b.parentNode.removeChild(b);
    button();
  }

  function choose(a, mk) { apply(write(a, mk)); close(); }

  function button() {
    if (C.button === false || document.getElementById("cz-open")) return;
    var o = el("button", { id: "cz-open", type: "button", "aria-label": T.reopen }, T.reopen);
    o.onclick = function () { o.parentNode.removeChild(o); show(true); };
    document.body.appendChild(o);
  }

  function show(withSettings) {
    if (document.getElementById("cz-box")) return;
    css();
    var cur = read() || { a: 0, m: 0 };
    var box = el("div", { id: "cz-box", role: "dialog", "aria-modal": "false", "aria-labelledby": "cz-title" });
    box.appendChild(el("h2", { id: "cz-title" }, T.title));
    var p = el("p", {}, T.body + " ");
    if (C.policyUrl) {
      var a = el("a", { href: C.policyUrl, target: "_blank", rel: "noopener" }, T.policy);
      p.appendChild(a);
    }
    box.appendChild(p);
    var opts = el("div", { id: "cz-opts" });
    function opt(id, label, info, checked, disabled) {
      var l = el("label", {});
      var i = el("input", { type: "checkbox", id: id });
      i.checked = !!checked;
      if (disabled) i.disabled = true;
      l.appendChild(i);
      l.appendChild(document.createTextNode(label));
      l.appendChild(el("small", {}, info));
      opts.appendChild(l);
    }
    opt("cz-n", T.necessary, T.necessaryInfo, true, true);
    opt("cz-a", T.analytics, T.analyticsInfo, cur.a);
    opt("cz-m", T.marketing, T.marketingInfo, cur.m);
    opts.style.display = withSettings ? "block" : "none";
    box.appendChild(opts);
    var row = el("div", { "class": "cz-row" });
    var bAcc = el("button", { type: "button", "class": "cz-main" }, T.accept);
    var bRej = el("button", { type: "button", "class": "cz-sec" }, T.reject);
    var bSet = el("button", { type: "button", "class": "cz-sec" }, withSettings ? T.save : T.settings);
    bAcc.onclick = function () { choose(true, true); };
    bRej.onclick = function () { choose(false, false); };
    bSet.onclick = function () {
      if (opts.style.display === "none") { opts.style.display = "block"; bSet.textContent = T.save; return; }
      choose(document.getElementById("cz-a").checked, document.getElementById("cz-m").checked);
    };
    row.appendChild(bAcc); row.appendChild(bRej); row.appendChild(bSet);
    box.appendChild(row);
    document.body.appendChild(box);
    bAcc.focus({ preventScroll: true });
  }

  function start() {
    if (read()) button(); else show(false);
  }

  window.ComboZgody = { loaded: true, open: function () { var o = document.getElementById("cz-open"); if (o) o.parentNode.removeChild(o); show(true); },
                        get: read };
  if (document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
