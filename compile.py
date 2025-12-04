import os
import shutil
from os import path
from textwrap import dedent
from time import strptime

from mistletoe import markdown

BASE_DIR = path.dirname(path.abspath(__file__))
SRC_DIR = path.join(BASE_DIR, "src")
OUT_DIR = path.join(BASE_DIR, "dist")
DATE_FMT = "%H:%M - %d/%m/%Y"

POST_TEMPLATE_FILE = path.join(SRC_DIR, "templates", "post.html")
POST_INDEX_TEMPLATE_FILE = path.join(SRC_DIR, "templates", "post-index.html")
POST_TEMPLATE = open(POST_TEMPLATE_FILE, "r").read()
POST_INDEX_TEMPLATE = open(POST_INDEX_TEMPLATE_FILE, "r").read()
POSTS_DIR = path.join(SRC_DIR, "posts")


class Post:
    title: str
    description: str
    date: str
    file: str = "#"

    def __init__(self, filename: str):
        data = open(path.join(POSTS_DIR, filename), "r").read()
        _, config, content = data.strip().split("---", maxsplit=2)
        for cfgLine in config.split("\n"):
            if not cfgLine:
                continue
            key, value = cfgLine.split(":", maxsplit=1)
            setattr(self, key.strip(), value.strip())
        self.content = content
        self.file = path.join(OUT_DIR, "posts", filename.replace(".md", ".html"))

    def epoch(self):
        return strptime(self.date, DATE_FMT)

    def list_item(self) -> str:
        return dedent(
            f"""
            <a href="{path.basename(self.file)}" class="post-item">
              <h3 class="post-title">{self.title}</h3>
              <span class="post-date">{self.date}</span>
            </a>
            """
        )

    def render(self) -> str:
        return POST_TEMPLATE.format(
            post=self,
            content=markdown(self.content),
        )

    def write(self):
        out_file = open(self.file, "w")
        out_file.write(self.render())
        out_file.close()


def reset_dist():
    shutil.rmtree(OUT_DIR, ignore_errors=True)
    shutil.copytree(path.join(SRC_DIR, "static"), OUT_DIR, dirs_exist_ok=True)
    os.mkdir(path.join(OUT_DIR, "posts"))


def render_all():
    posts = []
    for filename in os.listdir(POSTS_DIR):
        if not filename.endswith(".md"):
            print("Skipping", filename)
            continue
        post = Post(filename)
        post.write()
        posts.append(post)
    posts.sort(key=lambda i: i.epoch(), reverse=True)
    post_list = "".join([i.list_item() for i in posts])
    post_index = POST_INDEX_TEMPLATE.format(items=post_list)
    out_file = open(path.join(OUT_DIR, "posts", "index.html"), "w")
    out_file.write(post_index)
    out_file.close()


reset_dist()
render_all()
