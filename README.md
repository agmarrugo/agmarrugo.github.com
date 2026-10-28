# Andres Marrugo — bilingual Hugo site

This `source` branch contains the English half of the Hugo and PaperMod site.
The production workflow checks out `agmarrugo/agmarrugo-es`, builds both
languages together, verifies every legacy blog route, and deploys the result
to GitHub Pages.

## Write from iPhone or iPad

1. Open this repository on GitHub and press `.` to launch github.dev, or use
   the **Edit this post** link at the bottom of a post.
2. Add or edit a file in `content/en/posts/`.
3. Commit the change to the `source` branch.

GitHub rebuilds and publishes the site automatically. Use
`archetypes/default.md` as the front-matter pattern for a new post. Images
belong in `static/images/` and can be referenced as `/images/filename.jpg`.

## One-time GitHub Pages setting

In **Settings → Pages**, choose **GitHub Actions** as the publishing source.

## Local preview

Install Hugo 0.161.1 or newer, initialize the PaperMod submodule, check out
the Spanish repository at `_spanish`, copy its static files into `static/es`,
and run `hugo server --buildDrafts`.

## Poetry layout

Set `layout: poetry` in a poem's front matter (in either language). Keep
`description` for social cards; this layout omits its repetition below the title.
Set `ShowReadingTime: false` and `ShowToc: false` for poems.

Wrap the stanzas in `<div class="poetry-verse">`, using one `<p>` per
stanza and explicit `<br>` line breaks. Close the wrapper, then add the
closing ornament as `<div class="poetry-end" aria-hidden="true">☙</div>`.
Place any artwork after the poem in `<figure class="poetry-art">` with
its image and caption. Keep the image in the `cover` metadata for social
cards, with `hiddenInSingle: true`.

The layout uses a centered block of left-aligned Georgia text and a small,
uncropped painting below it. Shared styles live in
`assets/css/extended/poetry.css`; the template is `layouts/poetry.html`.

## List previews

Homepage and list cards use the first 200 characters of rendered body text,
excluding figures, captions, and the closing ornament. Line breaks become
spaces. This is independent of social-card descriptions and manual summaries.
Set `params.listExcerptLength` in `hugo.yaml` to change the character limit.
The implementation is in `layouts/_partials/post_excerpt.html` and is used
by `layouts/list.html` for both languages.
