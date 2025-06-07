const cardTemplate = document.querySelector("#card-template").content;

function createCard(
  cardData,
  handleImageClick,
  handleDeleteClick,
  handleLikeClick,
  userId
) {
  const cardElement = cardTemplate
    .querySelector(".places__item")
    .cloneNode(true);
  const cardPhoto = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeCountElement = cardElement.querySelector(".card__like-button");

  if (cardPhoto) {
    cardPhoto.src = cardData.link;
    cardPhoto.alt = cardData.name;
  }

  if (cardTitle) {
    cardTitle.textContent = cardData.name;
  }

  if (likeCountElement) {
    likeCountElement.textContent = cardData.likes.length;
  }

  cardPhoto.src = cardData.link;
  cardPhoto.alt = cardData.name;
  cardElement.querySelector(".card__title").textContent = cardData.name;
  likeCountElement.textContent = cardData.likes.length;

  if (cardData.owner._id !== userId) {
    deleteButton.remove();
  }

  if (cardData.likes.some((like) => like._id === userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }

  cardPhoto.addEventListener("click", () => handleImageClick(cardData));
  deleteButton.addEventListener("click", () => handleDeleteClick(cardData._id));
  likeButton.addEventListener("click", () => handleLikeClick(cardData._id));

  return cardElement;
}

function updateLikeStatus(cardElement, likes) {
  const likeButton = cardElement.querySelector(".card__like-button");
  const likeCountElement = cardElement.querySelector(".card__like-button");

  likeCountElement.textContent = likes.length;
  likeButton.classList.toggle("card__like-button_is-active");
}

export { createCard, updateLikeStatus };
