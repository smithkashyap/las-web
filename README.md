# las-web-hosted

JSON-driven hosted web app for the loan-against-securities flow. Uses a dynamic rendering engine to build UI from declarative JSON, with path-based routing via react-router-dom. Built on `las-core-sdk`. Designed for mobile WebView integration.

## Tech Stack

- React 19 + TypeScript (strict)
- react-router-dom (path-based routing)
- Tailwind CSS v3 + CSS variables (runtime theming)
- Vite 6
- ESLint + Prettier + Husky

## Project Structure

```
src/
├── components/             # Base UI primitives (rendered by engine)
│   ├── Button.tsx          # <button> with event dispatch
│   ├── Container.tsx       # <div> with recursive children
│   ├── Image.tsx           # <img>
│   ├── Input.tsx           # <input>
│   └── Text.tsx            # <p>
├── config/
│   ├── config.ts           # AppConfig, TextConfig, defaultConfig
│   └── theme.ts            # ThemeConfig, applyTheme()
├── data/                   # Declarative JSON UI definitions
│   ├── landing.json
│   ├── kyc.json
│   ├── otp.json
│   └── portfolio.json
├── hooks/
│   ├── useAuth.ts          # sendOTP, verifyOTP via CoreSDK
│   └── usePortfolio.ts     # getPortfolio via CoreSDK
├── pages/                  # Route pages (import JSON → render)
│   ├── LandingPage.tsx
│   ├── KycPage.tsx
│   ├── OtpPage.tsx
│   └── PortfolioPage.tsx
├── renderer/               # Dynamic rendering engine
│   ├── types.ts            # UINode type definition
│   ├── componentRegistry.ts # Maps type strings → React components
│   └── DynamicRenderer.tsx # Recursive JSON → component renderer
├── router/
│   └── index.tsx           # BrowserRouter with path routes
├── sdk/
│   └── initSDK.ts          # Singleton CoreSDK (fetch + localStorage)
├── styles/
│   └── globals.css         # Tailwind + CSS variable defaults
├── utils/
│   └── handleAction.ts     # Global event handler (navigation + SDK calls)
├── App.tsx                 # Theme init + router mount
└── main.tsx                # Entry point
```

## Setup

```bash
npm install
```

Create a `.env` file:

```env
VITE_API_BASE_URL=https://api.example.com
```

## Scripts

| Command           | Description              |
| ----------------- | ------------------------ |
| `npm run dev`     | Start Vite dev server    |
| `npm run build`   | Type-check + build       |
| `npm run preview` | Preview production build |
| `npm run lint`    | Run ESLint               |
| `npm run format`  | Format with Prettier     |

## Architecture

### Dynamic Rendering Engine

UI is defined as JSON trees of `UINode` objects. Each node has a `type` that maps to a React component via `componentRegistry`:

```
container → Container (renders children recursively)
text      → Text
image     → Image
button    → Button (dispatches events via handleAction)
input     → Input
```

`DynamicRenderer` takes a `UINode`, looks up the component, and renders it. Container nodes recurse into their children.

### JSON UI Format

```json
{
  "type": "container",
  "style": { "padding": "20px" },
  "children": [
    { "type": "text", "value": "Hello" },
    { "type": "button", "label": "Next", "event": "NAVIGATE_KYC" }
  ]
}
```

Styles are standard CSS properties (not React Native). CSS variables from the theme system work inside style values.

### Event System

Button clicks dispatch events through `handleAction(event, navigate, sdk)`:

| Event              | Action                  |
| ------------------ | ----------------------- |
| `NAVIGATE_LANDING` | `navigate('/landing')`  |
| `NAVIGATE_KYC`     | `navigate('/kyc')`      |
| `NAVIGATE_OTP`     | `navigate('/otp')`      |
| `NAVIGATE_PORTFOLIO` | `navigate('/portfolio')` |
| `SEND_OTP`         | `sdk.sendOTP()`         |
| `VERIFY_OTP`       | `sdk.verifyOTP()`       |
| `FETCH_PORTFOLIO`  | `sdk.getPortfolio()`    |

### Routing

Path-based via react-router-dom. No query params.

| Path         | Page          |
| ------------ | ------------- |
| `/landing`   | LandingPage   |
| `/kyc`       | KycPage       |
| `/otp`       | OtpPage       |
| `/portfolio` | PortfolioPage |
| `*`          | → `/landing`  |

### Theming

CSS variables set at runtime via `applyTheme()`. All JSON styles can reference them (e.g. `"color": "var(--color-primary)"`).

## Adding a New Page

1. Create `src/data/newpage.json` with the UI tree
2. Create `src/pages/NewPage.tsx` that imports the JSON and renders `<DynamicRenderer node={data} />`
3. Add a route in `src/router/index.tsx`
4. Add a `NAVIGATE_NEWPAGE` case in `handleAction.ts`
