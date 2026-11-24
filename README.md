# Combo Zgody

Lekki baner zgód na pliki cookie z obsługą Google Consent Mode v2 — po polsku, bez zależności (ok. 8 kB).
Przygotowany przez Combo Marketing.

- Przyciski „Akceptuję wszystkie / Odrzucam / Ustawienia”, kategorie: niezbędne, analityczne, marketingowe.
- Zapisuje wybór w ciasteczku `combo_zgody` (180 dni) i wysyła `gtag('consent', 'update', …)` oraz zdarzenie
  `combo_zgody_update` do `dataLayer`.
- Przycisk „Ustawienia cookies” pozwala w każdej chwili zmienić zgodę.

Domyślny stan zgód (`denied`) ustawia szablon Google Tag Manager uruchamiany na „Consent Initialization”, który
ładuje ten plik. Konfiguracja przez `window.ComboZgodyConfig` (`policyUrl`, `color`, `textColor`, `position`,
`version`, `button`, `texts`).

Wersje są przypięte tagami, np. `https://cdn.jsdelivr.net/gh/combomarketingpl/combo-zgody@1.0.0/combo-zgody.js`.

Licencja: MIT.
