const project = (title, description, url) => (`
  <li>
    <a class="project" href="${url}" target="_blank">
      <h3>${title}</h3>
      <span>${description}</span>
    </a>
  </li>
`)

const link = (title, url, icon) => (`
  <a class="contact-item" href="${url}" alt="${title}" target="_blank">
    <img class="icon" src="img/icons/${icon}.svg" />
  </a>
`)

const links = [
  link("Reddit", "https://www.reddit.com/user/dheison0", "reddit"),
  link("Telegram", "https://t.me/dheison0", "telegram"),
  link("Github", "https://github.com/dheison0", "github"),
  link("Tabnews", "https://www.tabnews.com.br/dheison0", "tabnews"),
  link("E-mail", "mailto:dheisomgomes0@gmail.com", "email"),
]

const projects = [
  project(
    "SubCreator",
    "Programa de linha de comando criado para adicionar legendas automaticamente em vídeos curtos utilizando Google Tradutor, Whisper e FFmpeg",
    "https://github.com/dheison0/subcreator"
  ),
  project(
    "PS2 Game Manager",
    "Um gerenciador de jogos para PS2 que rodam através de pendrive ou HDD externo usando o OPL",
    "https://github.com/dheison0/ps2-game-manager"
  ),
  project(
    "Audio Forward",
    "Pequeno programa feito em Go para fazer streaming de audio de um sistema linux para outro usando o PulseAudio",
    "https://github.com/dheison0/audio-forward"
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

document.querySelector("ul.project-list").innerHTML = projects.join("")
document.querySelector("ul.contact").innerHTML = links.join("")
