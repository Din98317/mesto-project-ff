// @todo: Темплейт карточки

// @todo: DOM узлы

// @todo: Функция создания карточки

// @todo: Функция удаления карточки

// @todo: Вывести карточки на страницу

const placesList = document.querySelector(".places__list");

const deleteCard = (cardElement) => {
  cardElement.remove();
};

const createCard = (initialCard) => {
  const cardTemplate = document.querySelector("#card-template").content;
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardImage = cardElement.querySelector(".card__image");
  cardImage.src = initialCard.link;
  cardImage.alt = initialCard.name;
  cardElement.querySelector(".card__title").textContent = initialCard.name;
  const deleteButton = cardElement.querySelector(".card__delete-button");
  deleteButton.addEventListener("click", () => deleteCard(cardElement));
  return cardElement;
};

initialCards.forEach(function (cardData) {
  const cardElement = createCard(cardData);
  placesList.append(cardElement);
});
