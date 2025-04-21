const cardTemplate = document.querySelector("#card-template").content;

function createCard(title, imageUrl, handleImageClick) {
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);
  const cardPhoto = cardElement.querySelector(".card__image");

  cardPhoto.src = imageUrl;
  cardPhoto.alt = title;
  cardElement.querySelector(".card__title").textContent = title;

  cardElement
    .querySelector(".card__like-button")
    .addEventListener("click", evt =>
      evt.target.classList.toggle("card__like-button_is-active")
    );

  cardElement
    .querySelector(".card__delete-button")
    .addEventListener("click", () => cardElement.remove());

  cardPhoto.addEventListener("click", handleImageClick);

  return cardElement;
}

export { createCard };