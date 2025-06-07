import "../pages/index.css";
import { createCard, updateLikeStatus } from "../components/card.js";
import { openModal, closeModal } from "../components/modal.js";
import { enableValidation, clearValidation } from "./validation.js";
import { initialCards } from "./cards.js";
import {
  getUserInfo,
  updateUserInfo,
  updateUserAvatar,
  getInitialCards,
  addNewCard,
  deleteCard,
  likeCard,
  unlikeCard,
} from "./api.js";

document.addEventListener("DOMContentLoaded", () => {
  const getElement = (selector) => {
    const element = document.querySelector(selector);
    if (!element) {
      console.error(`Элемент не найден: ${selector}`);
    }
    return element;
  };

  const profileEditButton = getElement(".profile__edit-button");
  const profileAddButton = getElement(".profile__add-button");
  const avatarEditButton = getElement(".profile__image-edit");
  const pageContent = getElement(".page__content");

  if (!pageContent) {
    console.error("Основной контейнер page__content не найден!");
    return;
  }

  const cardsContainer = getElement(".places__list");
  const editPopup = getElement(".popup_type_edit");
  const addPopup = getElement(".popup_type_new-card");
  const avatarPopup = getElement(".popup_type_avatar");
  const imagePopup = getElement(".popup_type_image");
  const editForm = getElement('form[name="edit-profile"]');
  const avatarForm = getElement('form[name="edit-avatar"]');
  const addForm = getElement('form[name="new-place"]');
  const profileTitle = getElement(".profile__title");
  const profileAbout = getElement(".profile__description");
  const profileAvatar = getElement(".profile__image");
  const nameInput = getElement("#name-input");
  const aboutInput = getElement("#input_description");
  const placeNameInput = getElement("#input_place_name");
  const linkInput = getElement("#input_link");
  const avatarInput = getElement("#input_avatar");

  if (
    !cardsContainer ||
    !editPopup ||
    !addPopup ||
    !profileTitle ||
    !profileAbout
  ) {
    console.error("Один или несколько ключевых элементов DOM не найдены!");
    return;
  }

  const validationConfig = {
    formSelector: ".popup__form",
    inputSelector: ".popup__input",
    submitButtonSelector: ".popup__button",
    inactiveButtonClass: "popup__button_disabled",
    inputErrorClass: "popup__input_type_error",
    errorClass: "popup__error_visible",
  };

  let currentUserId = null;

  function handleCardClick(cardData) {
    if (!imagePopup) return;

    const popupImage = imagePopup.querySelector(".popup__image");
    const popupCaption = imagePopup.querySelector(".popup__caption");

    if (popupImage && popupCaption) {
      popupImage.src = cardData.link;
      popupImage.alt = cardData.name;
      popupCaption.textContent = cardData.name;
      openModal(imagePopup);
    }
  }

  function handleDeleteCard(cardId, cardElement) {
    deleteCard(cardId)
      .then(() => cardElement.remove())
      .catch((err) => console.error("Ошибка при удалении карточки:", err));
  }

  function handleLikeCard(cardId, cardElement) {
    const likeButton = cardElement.querySelector(".card__like-button");
    if (!likeButton) return;

    const isLiked = likeButton.classList.contains(
      "card__like-button_is-active"
    );
    const likeMethod = isLiked ? unlikeCard : likeCard;

    likeMethod(cardId)
      .then((updatedCard) => {
        updateLikeStatus(cardElement, updatedCard.likes);
      })
      .catch((err) => console.error("Ошибка при обработке лайка:", err));
  }

  function loadInitialData() {
    Promise.all([getUserInfo(), getInitialCards()])
      .then(([userData, cards]) => {
        currentUserId = userData._id;

        if (profileTitle && userData.name)
          profileTitle.textContent = userData.name;
        if (profileAbout && userData.about)
          profileAbout.textContent = userData.about;
        if (profileAvatar && userData.avatar) {
          profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
        }

        if (profileTitle) profileTitle.textContent = userData.name;
        if (profileAbout) profileAbout.textContent = userData.about;
        if (profileAvatar) {
          profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
        }

        if (cardsContainer) {
          cards.forEach((card) => {
            const cardElement = createCard(
              card,
              handleCardClick,
              (cardId) => handleDeleteCard(cardId, cardElement),
              (cardId) => handleLikeCard(cardId, cardElement),
              currentUserId
            );
            cardsContainer.append(cardElement);
          });
        }
      })
      .catch((err) => console.error("Ошибка при загрузке данных:", err));
  }

  function initModals() {
    if (!pageContent) return;

    const popups = pageContent.querySelectorAll(".popup");
    if (popups.length === 0) {
      console.warn("Попапы не найдены");
      return;
    }

    popups.forEach((popup) => {
      popup.addEventListener("click", (evt) => {
        if (
          evt.target.classList.contains("popup_is-opened") ||
          evt.target.classList.contains("popup__close")
        ) {
          closeModal(popup);
        }
      });
    });
  }

  function initButtons() {
    if (profileEditButton && editPopup && editForm) {
      profileEditButton.addEventListener("click", () => {
        if (nameInput)
          nameInput.value = profileTitle ? profileTitle.textContent : "";
        if (aboutInput)
          aboutInput.value = profileAbout ? profileAbout.textContent : "";
        if (editForm) clearValidation(editForm, validationConfig);
        openModal(editPopup);
      });
    }

    if (profileAddButton && addPopup && addForm) {
      profileAddButton.addEventListener("click", () => {
        if (addForm) {
          addForm.reset();
          clearValidation(addForm, validationConfig);
        }
        openModal(addPopup);
      });
    }

    if (avatarEditButton && avatarPopup && avatarForm) {
      avatarEditButton.addEventListener("click", () => {
        if (avatarForm) {
          avatarForm.reset();
          clearValidation(avatarForm, validationConfig);
        }
        openModal(avatarPopup);
      });
    }
  }

  function initForms() {
    if (editForm && nameInput && aboutInput && profileTitle && profileAbout) {
      editForm.addEventListener("submit", (evt) => {
        evt.preventDefault();
        const submitButton = editForm.querySelector(".popup__button");
        if (submitButton) submitButton.textContent = "Сохранение...";

        updateUserInfo(nameInput.value, aboutInput.value)
          .then((res) => {
            if (profileTitle) profileTitle.textContent = res.name;
            if (profileAbout) profileAbout.textContent = res.about;
            closeModal(editPopup);
          })
          .catch((err) => console.error("Ошибка при обновлении профиля:", err))
          .finally(() => {
            if (submitButton) submitButton.textContent = "Сохранить";
          });
      });
    }

    if (addForm && placeNameInput && linkInput) {
      addForm.addEventListener("submit", (evt) => {
        evt.preventDefault();
        const submitButton = addForm.querySelector(".popup__button");
        if (submitButton) submitButton.textContent = "Создание...";

        addNewCard(placeNameInput.value, linkInput.value)
          .then((card) => {
            const cardElement = createCard(
              card,
              handleCardClick,
              (cardId) => handleDeleteCard(cardId, cardElement),
              (cardId) => handleLikeCard(cardId, cardElement),
              currentUserId
            );
            if (cardsContainer) cardsContainer.prepend(cardElement);
            if (addForm) addForm.reset();
            closeModal(addPopup);
          })
          .catch((err) => console.error("Ошибка при добавлении карточки:", err))
          .finally(() => {
            if (submitButton) submitButton.textContent = "Создать";
          });
      });
    }

    if (avatarForm && avatarInput && profileAvatar) {
      avatarForm.addEventListener("submit", (evt) => {
        evt.preventDefault();
        const submitButton = avatarForm.querySelector(".popup__button");
        if (submitButton) submitButton.textContent = "Сохранение...";

        updateUserAvatar(avatarInput.value)
          .then((res) => {
            if (profileAvatar) {
              profileAvatar.style.backgroundImage = `url(${res.avatar})`;
            }
            closeModal(avatarPopup);
          })
          .catch((err) => console.error("Ошибка при обновлении аватара:", err))
          .finally(() => {
            if (submitButton) submitButton.textContent = "Сохранить";
          });
      });
    }
  }

  function init() {
    initModals();
    initButtons();
    initForms();
    loadInitialData();
    enableValidation(validationConfig);
  }

  init();
});
