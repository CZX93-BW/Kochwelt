// Laden der Komponenten aus den HTML-Dateien und Einfügen in die Seite

function resolveRelativeUrl(url, baseUrl) {
  if (!url) {
    return url;
  }

  if (/^(?:[a-z]+:|\/\/|#)/i.test(url)) {
    return url;
  }

  return new URL(url, baseUrl).href;
}

function normalizeComponentPaths(container, componentUrl) {
  const elementsWithUrlAttributes = container.querySelectorAll("[href], [src]");

  for (const currentElement of elementsWithUrlAttributes) {
    if (currentElement.hasAttribute("href")) {
      const href = currentElement.getAttribute("href");
      currentElement.setAttribute(
        "href",
        resolveRelativeUrl(href, componentUrl),
      );
    }

    if (currentElement.hasAttribute("src")) {
      const src = currentElement.getAttribute("src");
      currentElement.setAttribute("src", resolveRelativeUrl(src, componentUrl));
    }
  }

  const elementsWithOnclick = container.querySelectorAll("[onclick]");
  const onclickHrefPattern =
    /(window\.location\.href\s*=\s*["'])([^"']+)(["'])/;

  for (const currentElement of elementsWithOnclick) {
    const onclickValue = currentElement.getAttribute("onclick");
    if (!onclickValue || !onclickHrefPattern.test(onclickValue)) {
      continue;
    }

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

async function includeHTML() {
  const elements = document.querySelectorAll("[data-include]");

  for (const element of elements) {
    const file = element.getAttribute("data-include");

    try {
      const response = await fetch(file);
      if (!response.ok) {
        throw new Error("Datei nicht gefunden");
      }

      const html = await response.text();
      const template = document.createElement("template");
      template.innerHTML = html;

      const componentUrl = new URL(file, window.location.href);
      normalizeComponentPaths(template.content, componentUrl);

      element.replaceChildren(template.content);
    } catch (error) {
      element.innerHTML = "Komponente konnte nicht geladen werden.";
      console.error(error);
    }
  }
}

document.addEventListener("DOMContentLoaded", includeHTML);
