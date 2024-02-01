const project = (title, description, url) => ({
  title, description, url,
  render: function() {
    return `
    <li>
      <a class="project" href="${this.url}">
        <h3>${this.title}</h3>
        <span>${this.description}</span>
      </a>
    </li>`
  }
})

const link = (title, url, icon) => ({
  title, url, icon,
  render: function () {
    return `
    <li>
      <a href="${this.url}" alt="${this.title}">
        <ion-icon name="${this.icon}" aria-hidden="true"></ion-icon>
      </a>
    </li>`
  }
})

const links = [
  link("Reddit", "https://www.reddit.com/user/dheison0", "logo-reddit"),
  link("Telegram", "https://t.me/dheison0", "paper-plane-outline"),
  link("Github", "https://github.com/dheison0", "logo-github"),
  link("Tabnews", "https://www.tabnews.com.br/dheison0", "folder-outline"),
  link("E-mail", "mailto:dheisomgomes0@gmail.com", "mail-outline"),
]

const projects = [
  project(
    "Anna's Archive",
    "App não oficial do website Annas Archive criado usando React Native, possui algumas funcionalidades úteis.",
    "https://github.com/dheison0/annas-archive"
  ),
  project(
    "Anna's Archive API",
    "API não oficial do website Anna's Archive criado usando Python & BeautifulSoup4 para raspagem de dados.",
    "https://github.com/dheison0/annas-archive-api"
  ),
  project(
    "Telegram Downloader",
    "Bot para telegram útil para automatizar o download de arquivos enviados nos canais em que está inscrito.",
    "https://github.com/dheison0/telegram-downloader"
  ),
  project(
    "Scripts",
    "Aqui é onde eu salvo os scripts que automatizam meu sistema Linux :)",
    "https://github.com/dheison0/scripts"
  ),
]

const renderAll = items => items.map(i => i.render()).join('\n')

function onLoad() {
  document.querySelector("ul.project-list").innerHTML = renderAll(projects)
  document.querySelector("ul.contact").innerHTML = renderAll(links)
}

onLoad()
