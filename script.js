const projectsContainer = document.querySelector("div.project-list");
const contactsContainer = document.querySelector("div.contact");

const project = (title, description, url) => ({
  title, description, url,
  render: function () {
    return `
      <a class="project" href="${this.url}">
        <h3>${this.title}</h3>
        <span>${this.description}</span>
      </a>
    `
  }
})

const link = (title, url, icon) => ({
  title, url, icon,
  render: function () {
    return `
      <a href="${this.url}" alt="${this.title}">
        <ion-icon name="${this.icon}" aria-hidden="true"></ion-icon>
      </a>
    `
  }
});

const links = [
  link("Github", "https://github.com/dheison0", "logo-github"),
  link("Instagram", "https://instagram.com/dheison0", "logo-instagram"),
  link("Telegram", "https://t.me/dheison0", "paper-plane-outline"),
  link("Tabnews", "https://www.tabnews.com.br/dheison0", "folder-outline"),
  link("E-mail", "mailto:dheisomgomes0@gmail.com", "mail-outline"),
];

const projects = [
  project(
    "Anna's Archive",
    "Aplicativo não oficial criado para android usando React Native com a finalidade de facilitar o download de livros da biblioteca Anna's Archive.",
    "https://github.com/dheison0/annas-archive"
  ),
  project(
    "Anna's Archive API",
    "API não oficial do website Anna's Archive criado usando Python & BeautifulSoup4 utilizando raspagem de dados,",
    "https://github.com/dheison0/annas-archive-api"
  ),
  project(
    "Telegram Downloader",
    "Bot para telegram com o intuito de facilitar o download de conteúdos públicados em canais por lá fazendo-os diretamente em seu servidor ou NAS.",
    "https://github.com/dheison0/telegram-downloader"
  ),
  project(
    "Scripts",
    "Aqui é onde eu salvo os scripts que automatizam meu sistema Linux :)",
    "https://github.com/dheison0/scripts"
  ),
]

function onLoad() {
  projectsContainer.innerHTML = projects.map(i => i.render()).join();
  contactsContainer.innerHTML = links.map(i => i.render()).join();
}

onLoad();