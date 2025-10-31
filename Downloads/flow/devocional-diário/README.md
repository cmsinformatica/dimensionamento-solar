<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1qbaaBopmLsIFomhfOXrkr_DVPoRQBMUr

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `VITE_API_KEY` in a `.env` or `.env.local` file to your Gemini API key
3. Run the app:
   `npm run dev`
4. Build for production:
   `npm run build`

## Scripts

- `npm run dev`: inicia o servidor de desenvolvimento
- `npm run build`: gera a build de produção
- `npm run preview`: pré-visualiza a build de produção

## Environment variables

Create `.env` (not committed) with:

```bash
VITE_API_KEY=SEU_TOKEN_DA_GEMINI
```

> Note: Only variables prefixed with `VITE_` are available in the browser.

## Push to GitHub

```bash
git init
git add .
git commit -m "chore: initial commit"
git branch -M master
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin master
```

The `.gitignore` already ignores `node_modules/`, `dist/` and `.env`.

## Deploy on Vercel (optional)

- Build Command: `npm run build`
- Output Directory: `dist`
- Environment Variable: `VITE_API_KEY`
