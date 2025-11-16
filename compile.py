import os
import shutil
from os import path
from time import strptime

from markdown import markdown

BASE_DIR = path.dirname(path.abspath(__file__))
SRC_DIR = path.join(BASE_DIR, "src")
OUT_DIR = path.join(BASE_DIR, "dist")
DATE_FMT = "%H:%M - %d/%m/%Y"

POST_TEMPL_FILE = path.join(SRC_DIR, "templ/post.html")
POSTS_DIR = path.join(SRC_DIR, "posts")

shutil.rmtree(OUT_DIR, ignore_errors=True)
shutil.copytree(path.join(SRC_DIR, "static"), OUT_DIR, dirs_exist_ok=True)
os.mkdir(path.join(OUT_DIR, "posts"))
template = open(POST_TEMPL_FILE, "r").read()

posts = []

for filename in os.listdir(POSTS_DIR):
    file_data = open(path.join(POSTS_DIR, filename), "r").read()
    data_slices = file_data.split("---")
    config_str = data_slices[1]
    config = {
        item[0].strip(): ":".join(item[1:]).strip()
        for item in [line.split(":") for line in config_str.split("\n") if line]
        if len(item) >= 2
    }
    config["file"] = path.join(OUT_DIR, "posts", filename.replace(".md", ".html"))
    content = "---".join(data_slices[2:]).strip()
    result = template.format(**config, content=markdown(content))
    out_file = open(config["file"], "w")
    out_file.write(result)
    out_file.close()
    posts.append(config)


def post_item(i):
    return f"""
        <a href="{path.basename(i['file'])}" class="post-item">
        <h3 class="post-title">{i['title']}</h3>
        <span class="post-date">{i['date']}</span>
        </a>
    """


posts.sort(key=lambda i: strptime(i["date"], DATE_FMT), reverse=True)

post_list = "\n".join([post_item(i) for i in posts])
post_list_templ = open(path.join(SRC_DIR, "templ", "post-list.html")).read()

result = post_list_templ.format(content=post_list)
out_file = open(path.join(OUT_DIR, "posts", "index.html"), "w")
out_file.write(result)
out_file.close()
