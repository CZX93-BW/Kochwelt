// Funktion zum Auflösen relativer URLs basierend auf einer Basis-URL
function resolveRelativeUrl(url, baseUrl) {
  if (!url) {
    return url; // Gibt die URL zurück, falls sie leer oder null ist
  }

  // Prüft, ob die URL bereits absolut ist (mit Schema, // oder #)
  if (/^(?:[a-z]+:|\/\/|#)/i.test(url)) {
    return url;
  }

  // Wandelt relative URL in absolute URL basierend auf baseUrl um
  return new URL(url, baseUrl).href;
}

// Funktion zum Anpassen aller Pfade innerhalb einer geladenen Komponente
function normalizeComponentPaths(container, componentUrl) {

  // Alle Elemente finden, die href oder src Attribute haben
  const elementsWithUrlAttributes = container.querySelectorAll("[href], [src]");

  for (const currentElement of elementsWithUrlAttributes) {
    if (currentElement.hasAttribute("href")) {
      const href = currentElement.getAttribute("href");

      // href auf absolute URL anpassen
      currentElement.setAttribute(
        "href",
        resolveRelativeUrl(href, componentUrl),
      );
    }

    if (currentElement.hasAttribute("src")) {
      const src = currentElement.getAttribute("src");

      // src auf absolute URL anpassen
      currentElement.setAttribute("src", resolveRelativeUrl(src, componentUrl));
    }
  }

  // Alle Elemente mit onclick Attribut finden
  const elementsWithOnclick = container.querySelectorAll("[onclick]");
  const onclickHrefPattern =
    /(window\.location\.href\s*=\s*["'])([^"']+)(["'])/; // Muster für window.location.href Zuweisungen

  for (const currentElement of elementsWithOnclick) {
    const onclickValue = currentElement.getAttribute("onclick");
    if (!onclickValue || !onclickHrefPattern.test(onclickValue)) {
      continue; // Ignoriert onclicks ohne window.location.href
    }

    // onclick URL auf absolute URL anpassen
    const updatedOnclick = onclickValue.replace(
      onclickHrefPattern,
      (fullMatch, prefix, rawPath, suffix) => {
        const resolvedPath = resolveRelativeUrl(rawPath, componentUrl);
        return `${prefix}${resolvedPath}${suffix}`;
      },
    );

    currentElement.setAttribute("onclick", updatedOnclick);
  }
}

// Hauptfunktion zum Laden und Einfügen von HTML-Komponenten
async function includeHTML() {
  
  // Alle Elemente mit data-include Attribut finden
  const elements = document.querySelectorAll("[data-include]");

  for (const element of elements) {
    const file = element.getAttribute("data-include");

    try {
      const response = await fetch(file); // HTML-Datei laden
      if (!response.ok) {
        throw new Error("Datei nicht gefunden");
      }

      const html = await response.text(); // HTML-Inhalt als Text holen
      const template = document.createElement("template");
      template.innerHTML = html; // HTML in Template-Element einfügen

      const componentUrl = new URL(file, window.location.href); // Absolute Basis-URL erstellen
      normalizeComponentPaths(template.content, componentUrl); // Alle relativen Pfade anpassen

      element.replaceChildren(template.content); // Originalelement ersetzen
    } catch (error) {
      element.innerHTML = "Komponente konnte nicht geladen werden."; // Fehleranzeige
      console.error(error);
    }
  }
}

// includeHTML ausführen, sobald DOM fertig geladen ist
document.addEventListener("DOMContentLoaded", includeHTML);