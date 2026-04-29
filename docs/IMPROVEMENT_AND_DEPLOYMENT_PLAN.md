# Improvement and Deployment Plan

## Goal

Turn StackSensei from a local demo package into a GitHub-ready project and eventually a hosted web application that users can open by link without downloading a zip or configuring a local model.

## Priority 1: Make the Current Project Reproducible

Recommended changes:

- Move source into a clean repository structure:
  - `frontend/`
  - `backend/`
  - `docs/`
  - `data/` or external dataset links
  - `models/` or external model links
- Add a root `README.md` with quick start instructions.
- Add `.gitignore` for:
  - Python cache files,
  - virtual environments,
  - model weights,
  - large datasets,
  - local API keys.
- Add `.env.example` with:
  - `DEEPSEEK_API_KEY=`
  - `MODEL_DIR=`
  - `CORS_ORIGINS=`
- Replace hardcoded frontend backend URL with an environment/config value.
- Remove `__pycache__/` from source control.
- Fix the missing `poker-logo.png` reference or remove it.

## Priority 2: Fix Encoding and UI Integrity

The current frontend and backend contain mojibaked Chinese text. This should be fixed before publishing.

Recommended changes:

- Ensure all files are saved as UTF-8.
- Rebuild bilingual strings in a clean translation dictionary instead of mixing `data-zh` text throughout damaged HTML.
- Validate `index.html` because several attributes appear malformed.
- Keep UI copy in `i18n/en.json` and `i18n/zh.json` or a JS object.
- Reduce duplicated prompt text between frontend and backend; backend should own model prompts.

## Priority 3: Make the Backend Production-ready

Current backend is good for a demo, but production needs safer configuration.

Recommended changes:

- Restrict CORS instead of `allow_origins=["*"]`.
- Do not send user API keys through the frontend for a public app.
- Store provider API keys only on the server or use a serverless secret manager.
- Add request validation for poker cards, player count, chip/pot values, and positions.
- Add rate limiting.
- Add structured logging.
- Add `/health` details:
  - backend version,
  - model loaded status,
  - model directory status,
  - DeepSeek key configured status without revealing the key.
- Add tests for:
  - request schema,
  - player routing,
  - action extraction,
  - prompt building,
  - health endpoint.

## Priority 4: Decide the Hosted Model Strategy

The user goal is "open by link without local model setup." The local Phi-3 Mini weight file is too large for the zip and likely too heavy for simple static hosting. Choose one of these paths.

### Option A: Hosted Backend With GPU

Use a backend server with GPU or enough CPU/RAM to load Phi-3 Mini.

Pros:

- Keeps the fine-tuned local model behavior.
- User only opens the frontend URL.

Cons:

- More expensive.
- Needs model storage and deployment operations.
- Cold start may be slow.

Possible hosts:

- Hugging Face Spaces with GPU.
- RunPod.
- Modal.
- Replicate.
- AWS/GCP/Azure GPU instance.

### Option B: Model Inference API

Upload the merged model to Hugging Face Hub or another model host and call it from the backend.

Pros:

- Cleaner app server.
- Easier GitHub repo because weights are external.

Cons:

- Requires model hosting configuration.
- Private model access needs tokens.

### Option C: DeepSeek-only Public MVP

Deploy a public web app that uses DeepSeek for all responses first, then add local model hosting later.

Pros:

- Fastest path to a working public link.
- Cheapest and easiest deployment.

Cons:

- Loses the fine-tuned 6-max decision model unless recreated through prompting or retrieval.

### Option D: Browser-only Static Site

Pure GitHub Pages frontend without backend.

Pros:

- Very easy to share.

Cons:

- Cannot safely hide API keys.
- Cannot run Phi-3 Mini local model in normal browsers.
- Not recommended for a serious public app.

Recommended path:

1. Publish a clean GitHub repo.
2. Deploy frontend on Vercel or Netlify.
3. Deploy backend on Render/Fly.io/Railway for DeepSeek-only MVP.
4. Add hosted model inference later through Hugging Face Spaces, Modal, Replicate, or a GPU server.

## Priority 5: Improve Poker Quality

The current model input is much simpler than the dataset training prompts. For better action quality:

- Convert frontend game state into the same natural-language hand-history style used in training.
- Add fields for:
  - street,
  - blinds,
  - effective stack,
  - action history,
  - hero position,
  - villain positions,
  - bet sizes,
  - pot before action.
- Add card parser and validator.
- Add canonical position names matching the dataset.
- Add a deterministic fallback rules engine for invalid or incomplete states.
- Add evaluation set and report model accuracy by street/action type.

## Priority 6: Improve User Experience

Recommended frontend changes:

- Convert static HTML/JS into a small React/Vite app or keep static files but modularize JS.
- Add card selectors instead of free-text card input.
- Add visual board and hole-card display.
- Add loading/error states that are friendly and specific.
- Add mobile layout testing.
- Add "share hand" or "copy analysis" feature.
- Add example hands for first-time users.

## Suggested GitHub Repository Layout

```text
stacksensei/
  README.md
  LICENSE
  .gitignore
  .env.example
  docs/
    README_FOR_COLLABORATORS.md
    MODEL_AND_DATA_CARD.md
    IMPROVEMENT_AND_DEPLOYMENT_PLAN.md
  backend/
    app/
      main.py
      schemas.py
      model_service.py
      deepseek_service.py
      prompt_builder.py
    tests/
    requirements.txt
  frontend/
    index.html
    styles.css
    app.js
    assets/
      joker-avatar.png
      suits-background.png
  data/
    README.md
  models/
    README.md
```

## Immediate Next Implementation Tasks

1. Create the GitHub-ready folder structure.
2. Move current source into `frontend/` and `backend/`.
3. Add `.gitignore`, `.env.example`, and root `README.md`.
4. Fix UTF-8 Chinese copy.
5. Add backend tests.
6. Add deployment config for frontend and backend.
7. Decide whether first public version uses DeepSeek-only or hosted Phi-3 inference.

