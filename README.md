# Jeevan Jacob — Portfolio

A single-page developer portfolio built with React, Vite, TypeScript, and Tailwind CSS —
dark emerald/teal theme, animated mesh-gradient background, expandable experience
timeline, filterable project grid with auto-rotating image carousels, and a contact form.

## Before you deploy — replace the placeholders

- `src/data/profile.ts` — email, GitHub/LinkedIn links, and `portrait` path
- `public/images/portrait.jpg` — your real portrait (referenced by `profile.ts`); until
  it's added, the hero shows a text placeholder instead of a broken image
- `public/resume.pdf` — your resume, linked from the navbar "Resume" button
- `src/data/education.ts` — exact degree title and graduation year
- `public/images/projects/*.svg` — replace with real project screenshots (same file
  names, or update the paths in `src/data/projects.ts`). Each project supports any
  number of images; one image renders as a static thumbnail, two or more become an
  auto-rotating carousel automatically.
- `src/data/projects.ts` — add `github` / `demo` links per project where you have them

## Local development

```bash
npm install
npm run dev
```

Opens at `http://localhost:5173`.

## Build

```bash
npm run build
```

Outputs a static site to `dist/`.

## Deploying to GitHub Pages

This repo includes a GitHub Actions workflow (`.github/workflows/deploy.yml`) that
builds and deploys automatically on every push to `main`.

One-time setup in your GitHub repository:

1. Push this project to a GitHub repository.
2. Go to **Settings → Pages**.
3. Under **Build and deployment → Source**, choose **GitHub Actions**.
4. Push to `main` — the workflow builds the site and publishes it. The Pages URL
   appears in the workflow run summary and in Settings → Pages.

No repository-name configuration is needed: `vite.config.ts` uses a relative
`base: "./"`, so the build works whether the site is served from a custom domain,
`<username>.github.io`, or a project sub-path like `<username>.github.io/<repo>`.

### Manual deploy (alternative)

```bash
npm run build
npm run deploy
```

This uses `gh-pages` to push `dist/` to a `gh-pages` branch — use this if you'd rather
not use the Actions workflow. If you do, set Pages' source to the `gh-pages` branch
instead of GitHub Actions.

## Contact form and SMTP

The contact form posts to `/api/contact`, a Vercel serverless function that sends
messages using SMTP. GitHub Pages only serves static files and cannot run this function;
deploy the project to Vercel for the form to send mail. Vercel detects the Vite app and
the `api/contact.ts` function automatically.

In Vercel project settings, add these environment variables for Production (and Preview
if desired):

```
SMTP_HOST=your SMTP server host
SMTP_PORT=465
SMTP_USER=your SMTP login/email
SMTP_PASS=your SMTP password or app password
CONTACT_EMAIL=jeevanjacobwork@gmail.com
```

Use port `465` for implicit TLS or `587` for STARTTLS. Keep these values in Vercel's
server environment only; never add SMTP credentials to a `VITE_` variable or commit them
to the repository. Redeploy after adding or changing them. `VITE_FORM_ENDPOINT` can be
set at build time if you need the frontend to post to a separately hosted API URL.

## Project structure

```
src/
  components/   UI components (Navbar, Hero, Experience, Projects, ImageCarousel, ...)
  data/         Your content — profile, experience, education, projects, skills
  App.tsx
  main.tsx
public/
  images/       Favicon and project images
  resume.pdf    Add your resume here
```
