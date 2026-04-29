# Deployment Guide

This guide deploys the public DeepSeek-only MVP. It does not deploy the future hosted Phi-3 model.

## A. What Local Setup Can Prepare

The local project can prepare and verify:

1. Clean repository structure:
   - `frontend/` for the static website.
   - `backend/` for the FastAPI service.
   - `docs/`, `models/`, and `data/` for supporting notes.
2. GitHub hygiene:
   - `.gitignore` excludes secrets, virtual environments, caches, model weights, datasets, logs, and temporary output.
   - `.env.example` remains trackable.
3. Backend checks:
   - Python syntax check.
   - `pytest` test suite.
   - Local startup command.
   - `/health` endpoint.
4. Frontend checks:
   - `frontend/config.js` loads before `frontend/app.js`.
   - The frontend calls `window.STACKSENSEI_API_BASE_URL`.
   - No user API-key form is required.
   - Beginner card selectors convert ranks and suits to backend notation such as `As Kh`.
   - The chat panel keeps a fixed height and scrolls message history internally.
5. Deployment settings:
   - Render backend commands and environment variables.
   - Vercel frontend root/static settings.
6. GitHub push commands:

```powershell
git init
git add .
git status
git commit -m "Initial GitHub-ready DeepSeek MVP"
git branch -M main
git remote add origin <YOUR_GITHUB_REPO_URL>
git push -u origin main
```

## B. What You Must Do Manually

1. Create a new GitHub repository.
2. Push the local repository to GitHub.
3. Create a Render Web Service.
4. Add backend environment variables on Render.
5. Deploy the backend.
6. Open `/health` on the deployed backend and confirm it is healthy.
7. Create a Vercel project for `frontend/`.
8. Deploy the frontend.
9. Update `frontend/config.js` if needed so the static site calls the Render backend URL.
10. Add the final Vercel URL to Render `CORS_ORIGINS`.
11. Redeploy or restart the Render backend.
12. Smoke test the public website in the browser.

## Backend on Render

1. Push this repository to GitHub.
2. In Render, create a new Web Service from the repository.
3. Set the root directory to `backend`.
4. Use:
   - Build command: `pip install -r requirements.txt`
   - Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - Health check path: `/health`
5. Add environment variables:
   - `DEEPSEEK_API_KEY=<your server-side DeepSeek key>`
   - `CORS_ORIGINS=http://localhost:3000,https://your-vercel-frontend-url.vercel.app`
   - `ENABLE_LOCAL_MODEL=false`
6. Deploy and verify:
   - `https://your-render-service.onrender.com/health`

The health response should look like:

```json
{
  "status": "ok",
  "service": "stacksensei-backend",
  "version": "0.1.0",
  "deepseek_configured": true,
  "local_model_enabled": false
}
```

## Frontend on Vercel

1. Create a Vercel project from the same GitHub repository.
2. Set the project root directory to `frontend`.
3. Framework preset: Other / Static.
4. Build command: leave empty.
5. Output directory: leave default for the static root.
6. Update `frontend/config.js` before production deployment or configure an equivalent runtime replacement:

```js
window.STACKSENSEI_API_BASE_URL = window.STACKSENSEI_API_BASE_URL || "https://your-render-service.onrender.com";
```

The final frontend should call:

```text
https://your-render-service.onrender.com/api/poker-chat
```

7. After Vercel gives you the final frontend URL, update the backend `CORS_ORIGINS` value on Render:

```text
https://your-vercel-app.vercel.app,http://localhost:3000,http://localhost:5173,http://localhost:8000
```

8. Redeploy or restart the backend after changing environment variables.

## Frontend on Netlify

1. Create a Netlify site from the GitHub repository.
2. Set the publish directory to `frontend`.
3. No build command is required.
4. Configure `frontend/config.js` to point to the deployed backend.
5. Add the Netlify URL to backend `CORS_ORIGINS`.

## Required Backend Environment Variables

| Variable | Example |
| --- | --- |
| `DEEPSEEK_API_KEY` | `sk-...` |
| `CORS_ORIGINS` | `https://your-frontend.vercel.app,http://localhost:3000,http://localhost:5173,http://localhost:8000` |
| `ENABLE_LOCAL_MODEL` | `false` |

Do not put `DEEPSEEK_API_KEY` in frontend files, Vercel public environment variables, browser localStorage, or GitHub. Users do not need their own API keys; the key stays on Render.

## Current Product Behavior

- StackSensei supports casual chat, capability questions, poker concept explanations, and hand analysis.
- Structured labels are reserved for specific hand-analysis requests:
  - English: `Recommended Action:`, `Reasoning:`, `Risk Note:`
  - Chinese: `建议行动：`, `理由：`, `风险提示：`
- Incomplete recommendation requests should ask for missing details such as hole cards, position, pot size, and current bet or action history.
- The frontend includes beginner card selectors for hole cards, flop, turn, and river. The selectors convert suits to `s`, `h`, `d`, `c` and `10` to `T`.
- Advanced users can still use the collapsible manual card input.
- Deployment remains Vercel frontend plus Render FastAPI backend plus a server-side DeepSeek key.

## Common Issues

- Browser says backend is unavailable: the free backend instance may be waking up, or the frontend URL is missing from `CORS_ORIGINS`.
- `/api/poker-chat` returns 503: `DEEPSEEK_API_KEY` is not configured on the backend.
- Local frontend cannot call local backend: include `http://localhost:3000` in `CORS_ORIGINS`.

## Public Smoke Test Checklist

Backend:

- Open `https://your-render-service.onrender.com/health`.
- Confirm `status` is `ok`.
- Confirm `deepseek_configured` is `true`.
- Confirm `local_model_enabled` is `false`.

Frontend:

- Open the Vercel URL.
- Submit "Can you chat?" and confirm it does not use the hand-analysis labels.
- Submit "你可以聊天吗？" and confirm it replies naturally in Chinese without `建议行动：`.
- Submit one real hand-analysis question with hole cards, position, pot, and action context; confirm the structured recommendation appears.
- Use the card selectors to produce `As Kh` and `Qh Jd 7c`.
- Add enough messages to confirm the chat panel stays fixed and message history scrolls.
- Confirm the browser console has no major CORS or network errors.

If something fails:

- Check Render logs.
- Check `DEEPSEEK_API_KEY`.
- Check `CORS_ORIGINS`.
- Check `frontend/config.js`.
- Check whether the Render service is asleep or still starting.
