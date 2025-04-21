import "../pages/index.css";
import { initialCards } from "./cards.js";
import { createCard } from "../components/card.js";
import {
  openModal,
  closeModal,
  closeModalByClick,
} from "../components/modal.js";

const pageContent   = document.querySelector(".page__content");
const cardsContainer= pageContent.querySelector(".places__list");

// попапы
const editPopup     = pageContent.querySelector(".popup_type_edit");
const addPopup      = pageContent.querySelector(".popup_type_new-card");
const imagePopup    = pageContent.querySelector(".popup_type_image");

// формы и поля
const editForm      = editPopup.querySelector('form[name="edit-profile"]');
const nameInput     = editForm.querySelector(".popup__input_type_name");
const aboutInput    = editForm.querySelector(".popup__input_type_description");

const addForm       = addPopup.querySelector('form[name="new-place"]');
const titleInput    = addForm.querySelector(".popup__input_type_card-name");
const linkInput     = addForm.querySelector(".popup__input_type_url");

// профиль на странице
const profileTitle   = pageContent.querySelector(".profile__title");
const profileAbout   = pageContent.querySelector(".profile__description");

// попапы закрытия по оверлею и кнопке
pageContent
  .querySelectorAll(".popup")
  .forEach(popup =>
    popup.addEventListener("click", evt => closeModalByClick(evt, popup))
  );

// отрисовываем начальные карточки
initialCards.forEach(place => {
  const card = createCard(place.name, place.link, handleCardClick);
  cardsContainer.append(card);
});

// открытие и заполнение формы редактирования профиля
pageContent
  .querySelector(".profile__edit-button")
  .addEventListener("click", () => {
    nameInput.value  = profileTitle.textContent;
    aboutInput.value = profileAbout.textContent;
    openModal(editPopup);
  });

// сохранение профиля
editForm.addEventListener("submit", evt => {
  evt.preventDefault();
  profileTitle.textContent = nameInput.value;
  profileAbout.textContent = aboutInput.value;
  closeModal(editPopup);
});

// открытие формы добавления новой карточки
pageContent
  .querySelector(".profile__add-button")
  .addEventListener("click", () => {
    addForm.reset();
    openModal(addPopup);
  });

// добавление карточки
addForm.addEventListener("submit", evt => {
  evt.preventDefault();
  const newCard = createCard(
    titleInput.value,
    linkInput.value,
    handleCardClick
  );
  cardsContainer.prepend(newCard);
  closeModal(addPopup);
});

// открытие большого изображения
function handleCardClick(evt) {
  const popupImage   = imagePopup.querySelector(".popup__image");
  const popupCaption = imagePopup.querySelector(".popup__caption");
  popupImage.src     = evt.target.src;
  popupImage.alt     = evt.target.alt;
  popupCaption.textContent = evt.target.alt;
  openModal(imagePopup);
}