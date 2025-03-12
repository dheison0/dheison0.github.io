package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"os"
	"path"
	"strings"
	"text/template"

	"github.com/alecthomas/chroma"
	crhtml "github.com/alecthomas/chroma/formatters/html"
	"github.com/alecthomas/chroma/lexers"
	crstyles "github.com/alecthomas/chroma/styles"
	"github.com/gomarkdown/markdown"
	"github.com/gomarkdown/markdown/ast"
	mdhtml "github.com/gomarkdown/markdown/html"
	mdparser "github.com/gomarkdown/markdown/parser"
	"gopkg.in/yaml.v3"
)

type JSONItems []map[string]any

type Config struct {
	Title       string    `json:"title" yaml:"title"`
	Description string    `json:"description" yaml:"description"`
	Date        string    `json:"date" yaml:"date"`
	Items       JSONItems `json:"items" yaml:"items"`
	Content     string
}

const inputDir = "./src"
const outputDir = "./dist"
const styleName = "dracula" // Code hightlight color scheme

var posts JSONItems
var defaultTemplate, postTemplate *template.Template
var (
	htmlFormatter  *crhtml.Formatter
	highlightStyle *chroma.Style
)

func init() {
	// Load basic templates
	var err error
	defaultTemplate, err = template.ParseFiles(path.Join(inputDir, "templates", "default.html"))
	if err != nil {
		log.Fatalf("failed to load default template: %v", err)
	}
	postTemplate, err = template.ParseFiles(path.Join(inputDir, "templates", "post.html"))
	if err != nil {
		log.Fatalf("failed to load post template: %v", err)
	}

	// Configure code highlight
	htmlFormatter = crhtml.New(crhtml.WithClasses(false), crhtml.TabWidth(2))
	if htmlFormatter == nil {
		panic("couldn't create html formatter")
	}
	highlightStyle = crstyles.Get(styleName)
	if highlightStyle == nil {
		panic(fmt.Sprintf("didn't find style '%s'", styleName))
	}
}

func main() {
	postDir, err := os.ReadDir(path.Join(inputDir, "posts"))
	if err != nil {
		log.Fatalf("failed to read posts dir")
	}
	for _, post := range postDir {
		if !post.IsDir() {
			fmt.Printf("Compiling post %v...\n", post.Name())
			content, item := parsePost(path.Join(inputDir, "posts", post.Name()))
			outputFileName := strings.ReplaceAll(post.Name(), ".md", ".html")
			posts = append(posts, map[string]any{
				"title":    item.Title,
				"filename": outputFileName,
			})
			writeOutput(path.Join(outputDir, "posts", outputFileName), content)
		}
	}
	pages, err := os.ReadDir(path.Join(inputDir, "pages"))
	if err != nil {
		log.Fatalf("failed to read pages folder: %v", err)
	}
	for _, page := range pages {
		if page.IsDir() {
			fmt.Printf("Compiling %s page...\n", page.Name())
			content := parseHtmlDirectory(path.Join(inputDir, "pages", page.Name()))
			writeOutput(path.Join(outputDir, page.Name()+".html"), content)
		}
	}
	fmt.Println("Copying assets...")
	os.CopyFS(path.Join(outputDir, "assets"), os.DirFS("./assets"))
}

func writeOutput(file string, content string) {
	if err := os.MkdirAll(path.Dir(file), 0750); err != nil {
		log.Fatalf("failed to create output dir: %s", path.Dir(file))
	}
	out, err := os.Create(file)
	if err != nil {
		log.Fatalf("failed to create output file: %v", err)
	}
	out.Write([]byte(content))
	out.Sync()
	out.Close()
}

func parsePost(md string) (string, Config) {
	// Load basic file
	mdFile, err := os.Open(md)
	if err != nil {
		log.Fatalf("failed to open %s file! %s", md, err.Error())
	}
	mdData, err := io.ReadAll(mdFile)
	if err != nil {
		log.Fatalf("failed to read data from %s file: %s", md, err.Error())
	}
	if string(mdData[:3]) != "---" {
		log.Fatalf("missing configuration section of post!")
	}
	yamlEnd := bytes.Index(mdData[3:], []byte("---"))
	if yamlEnd == -1 {
		log.Fatal("configuration section not finished!")
	}
	yamlData := mdData[3 : 3+yamlEnd]
	mdContent := mdData[6+yamlEnd:]

	// Load config
	config := Config{}
	if err := yaml.Unmarshal(yamlData, &config); err != nil {
		log.Fatalf("failed to parse yaml data: %s", err.Error())
	}

	// Parse Markdown content
	p := mdparser.NewWithExtensions(mdparser.CommonExtensions | mdparser.AutoHeadingIDs)
	doc := p.Parse(mdContent)
	r := mdhtml.NewRenderer(mdhtml.RendererOptions{
		Flags:          mdhtml.CommonFlags | mdhtml.HrefTargetBlank,
		RenderNodeHook: codeHighlightHook,
	})
	config.Content = string(markdown.Render(doc, r))

	// Insert it into template
	buffer := bytes.NewBufferString("")
	postTemplate.Execute(buffer, config)
	config.Content = buffer.String()
	buffer.Truncate(0) // Reset buffer
	defaultTemplate.Execute(buffer, config)
	return buffer.String(), config
}

func parseHtmlDirectory(dir string) string {
	// Load template and configuration file
	indexTemplate, err := template.ParseFiles(path.Join(dir, "index.html"))
	if err != nil {
		log.Fatalln("failed to load template file for " + dir)
	}
	configFile, err := os.Open(path.Join(dir, "config.json"))
	if err != nil && os.IsExist(err) {
		log.Fatalln("failed to open config.json file")
	}
	data, err := io.ReadAll(configFile)
	if err != nil {
		log.Fatalf("failed to read config content: %v", err)
	}

	// Load config into struct and insert it to template
	config := Config{}
	if err := json.Unmarshal(data, &config); err != nil {
		log.Fatalf("Failed to parse JSON config: %v", err)
	}
	if strings.Contains(dir, "posts") {
		config.Items = posts
	}
	buffer := bytes.NewBufferString("")
	if err = indexTemplate.Execute(buffer, config); err != nil {
		log.Fatalf("failed to execute template: config=%+v err=%v", config, err)
	}
	config.Content = buffer.String()
	buffer.Truncate(0) // Reset buffer
	if err = defaultTemplate.Execute(buffer, config); err != nil {
		log.Fatalf("failed to execute default template: %v", err)
	}
	return buffer.String()
}

func htmlHighlight(w io.Writer, source, lang, defaultLang string) error {
	if lang == "" {
		lang = defaultLang
	}
	l := lexers.Get(lang)
	if l == nil {
		l = lexers.Analyse(source)
	}
	if l == nil {
		l = lexers.Fallback
	}
	l = chroma.Coalesce(l)

	it, err := l.Tokenise(nil, source)
	if err != nil {
		return err
	}
	return htmlFormatter.Format(w, highlightStyle, it)
}

func codeHighlightHook(w io.Writer, node ast.Node, entering bool) (ast.WalkStatus, bool) {
	if code, ok := node.(*ast.CodeBlock); ok {
		defaultLang := ""
		lang := string(code.Info)
		htmlHighlight(w, string(code.Literal), lang, defaultLang)
		return ast.GoToNext, true
	}
	return ast.GoToNext, false
}
