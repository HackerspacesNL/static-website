{{ range where .Site.RegularPages "Section" "posts" }}
  <a href="{{ .RelPermalink }}">{{ .Title }}</a>
{{ end }}
