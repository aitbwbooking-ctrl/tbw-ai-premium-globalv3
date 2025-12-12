document.addEventListener("DOMContentLoaded", () => {
  const intro = document.getElementById("intro");
  const skip = document.getElementById("skipIntro");

  if (skip && intro) {
    skip.addEventListener("click", () => {
      intro.style.display = "none";
    });
  }
});
