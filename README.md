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
