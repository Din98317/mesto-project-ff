import "../pages/index.css";
import { initialCards } from "./cards.js";
import { createCard } from "../components/card.js";
import { openModal, closeModal, closeModalByClick, } from "../components/modal.js";

const pageContent = document.querySelector(".page__content");
const content = pageContent.querySelector(".content");
const cardsContainer = content.querySelector(".places__list");
const modalList = pageContent.querySelectorAll(".popup");
const imagePopup = pageContent.querySelector(".popup_type_image");
const profilePopup = pageContent.querySelector(".popup_type_edit");
const newPlacePopup = pageContent.querySelector(".popup_type_new-card");
const formsCollection = document.forms;
const profileTitle = pageContent.querySelector(".profile__title");
const profileSubtitle = pageContent.querySelector(".profile__description");
const popupImage = imagePopup.querySelector(".popup__image");
const popupCaption = imagePopup.querySelector(".popup__caption");

initialCards.forEach((place) => {
  cardsContainer.append(createCard(place.name, place.link, openImagePopup));
});

content.querySelector(".profile__edit-button").addEventListener("click", () => {
  fillProfileForm();
  openModal(profilePopup);
  formsCollection.editProfile.addEventListener("submit", onProfileSubmit);
});

content.querySelector(".profile__add-button").addEventListener("click", () => {
  openModal(newPlacePopup);
  formsCollection.newPlace.addEventListener("submit", onNewPlaceSubmit);
});

modalList.forEach((popup) => {
  popup.addEventListener("click", (evt) => closeModalByClick(evt, popup));
});

function onProfileSubmit(evt) {
  evt.preventDefault();
  profileTitle.textContent = formsCollection.editProfile.name.value;
  profileSubtitle.textContent = formsCollection.editProfile.description.value;
  formsCollection.editProfile.reset();
  fillProfileForm();
  closeModal(profilePopup);
}

function fillProfileForm() {
  formsCollection.editProfile.name.value = profileTitle.textContent;
  formsCollection.editProfile.description.value = profileSubtitle.textContent;
}

function onNewPlaceSubmit(evt) {
  evt.preventDefault();
  const title = formsCollection.newPlace.placeName.value;
  const url = formsCollection.newPlace.link.value;
  cardsContainer.prepend(createCard(title, url, openImagePopup));
  formsCollection.newPlace.reset();
  closeModal(newPlacePopup);
}

function openImagePopup(evt) {
  popupImage.src = evt.target.src;
  popupImage.alt = evt.target.alt;
  popupCaption.textContent = evt.target.alt;
  openModal(imagePopup);
}