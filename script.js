const contacts = document.querySelector("div.contact");
const link = (title, url, icon) => ({ title, url, icon });

const links = [
  link("Github", "https://github.com/dheisom", "logo-github"),
  link("Instagram", "https://instagram.com/dheison.dev", "logo-instagram"),
  link("Telegram", "https://t.me/dheisom", "paper-plane-outline"),
  link("Tabnews", "https://www.tabnews.com.br/dheisom", "folder-outline"),
  link("E-mail", "mailto:dheisomgomes0@gmail.com", "mail-outline"),
];

links.map((item) => {
  var element = `<a href="${item.url}" alt="${item.title}">`;
  element += `<ion-icon name="${item.icon}" aria-hidden="true"></ion-icon>`;
  element += `</a>`;
  contacts.innerHTML += element;
})