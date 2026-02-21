// Warten, bis das DOM vollständig geladen ist
document.addEventListener("DOMContentLoaded", function () {
  
  // Formular-Element holen
  const form = document.getElementById("contactForm");

  if (!form) return; // Falls kein Formular vorhanden, Abbruch

  // Absende-Button innerhalb des Formulars holen
  const button = form.querySelector(".contact-button");

  // Eventlistener für Formular-Submit
  form.addEventListener("submit", function (e) {
    e.preventDefault(); // Standard-Formular-Submit verhindern

    // Ladezustand anzeigen
    button.disabled = true; // Button deaktivieren
    const originalText = button.textContent; // Originaltext merken
    button.textContent = "Wird gesendet..."; // Feedback an Nutzer

    // Formulardaten sammeln
    const formData = new FormData(form);

    // Simulierte Verzögerung für UX (z.B. Verarbeitung sichtbar machen)
    setTimeout(() => {
      try {

        // Bei Erfolg: Weiterleitung auf Erfolgsseite
        window.location.href = "contactsuccess.html"; 
      } catch (error) {

        // Fehlerbehandlung
        console.error("Fehler beim Senden:", error);
        alert("Beim Senden ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut.");
        button.disabled = false; // Button wieder aktivieren
        button.textContent = originalText; // Originaltext wiederherstellen
      }
    }, 800); // 800ms Verzögerung
  });
});