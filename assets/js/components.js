
// Laden der Komponenten aus den HTML-Dateien und Einfügen in die Seite

async function includeHTML() {
    const elements = document.querySelectorAll("[data-include]");

    for (const element of elements) {
        const file = element.getAttribute("data-include");

        try {
            const response = await fetch(file);
            if (!response.ok) {
                throw new Error("Datei nicht gefunden");
            }

            element.innerHTML = await response.text();

        } catch (error) {
            element.innerHTML = "Komponente konnte nicht geladen werden.";
            console.error(error);   
        }
    }
}

document.addEventListener("DOMContentLoaded", includeHTML);