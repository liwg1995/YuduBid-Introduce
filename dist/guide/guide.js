const preview = document.querySelector(".guide-preview");
if (preview && typeof preview.showModal === "function") {
  const image = preview.querySelector("img");
  const caption = preview.querySelector("#preview-caption");
  document.querySelector(".guide-content").addEventListener("click", (event) => {
    const link = event.target.closest(".guide-shot a");
    if (!link || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    image.src = link.href;
    image.alt = link.querySelector("img").alt;
    caption.textContent = link.parentElement.querySelector("figcaption").textContent;
    preview.showModal();
  });
  preview.querySelector("button").addEventListener("click", () => preview.close());
  preview.addEventListener("click", (event) => {
    if (event.target === preview) preview.close();
  });
}
