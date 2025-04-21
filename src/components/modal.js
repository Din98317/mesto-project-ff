function openModal(popupElement) {
  popupElement.classList.add("popup_is-opened");
  document.addEventListener("keydown", closeModalKeydown);
}

function closeModal(popupElement) {
  popupElement.classList.remove("popup_is-opened");
  document.removeEventListener("keydown", closeModalKeydown);
}

function closeModalKeydown(evt) {
  if (evt.key === "Escape") {
    const opened = document.querySelector(".popup_is-opened");
    if (opened) closeModal(opened);
  }
}

function closeModalByClick(evt, popupElement) {
  const isOverlay = evt.target.classList.contains("popup_is-opened");
  const isCloseBtn = evt.target.classList.contains("popup__close");
  if (isOverlay || isCloseBtn) {
    closeModal(popupElement);
  }
}

export { openModal, closeModal, closeModalByClick };
