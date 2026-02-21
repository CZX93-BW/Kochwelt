// Warten, bis das DOM vollständig geladen ist
window.addEventListener("DOMContentLoaded", function () {
  
  // Fade-in Animation für die Success-Card
  const card = document.getElementById("successCard");
  setTimeout(() => {
    card.classList.add("show"); // Klasse "show" hinzufügen, um CSS-Fade-In auszulösen
  }, 100); // kurze Verzögerung, damit Animation sichtbar ist

  // EventListener für "Home"-Button
  const homeBtn = document.getElementById("homeBtn");
  if (homeBtn) {
    homeBtn.addEventListener("click", function () {
      window.location.href = "../index.html"; // Weiterleitung zur Startseite (relativer Pfad)
    });
  }
});