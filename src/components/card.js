const cardTemplate = document.querySelector("#card-template").content;

function createCard(title, imageUrl, onImageClick) {
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);
  const cardPhoto = cardElement.querySelector(".card__image");

  cardPhoto.src = imageUrl;
  cardPhoto.alt = title;
  cardElement.querySelector(".card__title").textContent = title;

  cardElement
    .querySelector(".card__like-button")
    .addEventListener("click", likeCard);

  cardPhoto.addEventListener("click", onImageClick);

  cardElement
    .querySelector(".card__delete-button")
    .addEventListener("click", () => deleteCard(cardElement));

  return cardElement;
}

function deleteCard(cardElem) {
  cardElem.remove();
}

function likeCard(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}

export { createCard };
