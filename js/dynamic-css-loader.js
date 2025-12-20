const addCss = (href) => {
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
  return link;
}

const addJs = (src) => {
  const script = document.createElement("script");
  script.src = src;
  document.head.appendChild(script);
  return script;
}

function dynamicContentLoad() {
  const codeBlocks = document.querySelectorAll("pre code");
  if (codeBlocks.length == 0) {
    return;
  }
  addCss("../css/dracula.css");
  addJs("https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/highlight.min.js")
    .addEventListener("load", () => hljs.highlightAll());
}

document.addEventListener("DOMContentLoaded", dynamicContentLoad)