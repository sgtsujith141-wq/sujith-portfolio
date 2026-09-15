# public/

## Resume

`Sujith_C_Resume.pdf` is the live resume, served at **`/Sujith_C_Resume.pdf`**.

It is wired in three places at once, all resolving from `data/profile.ts`:
the opening interface action, the contact grid card, and the command palette.

If the file is ever removed, set `RESUME_PDF_PRESENT = false` at the top of
`data/profile.ts` and every Resume affordance hides itself rather than
pointing at a URL that would 404. To replace the file, keep the same name —
or change `RESUME_FILENAME` in the same file and the URL follows.

## Project images

`projects/<slug>/*` — screenshots for a project's case file. Reference them from
`data/projects.ts` as `/projects/<slug>/<file>.png`. An empty `images` array
simply omits the gallery block, so nothing breaks if you skip this.
