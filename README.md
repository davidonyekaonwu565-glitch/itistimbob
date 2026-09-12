# ItsTimbob — Official Creator & VIP Host Website

A modern, high-performance, dark-mode creator website for **ItsTimbob** (streamer, VIP host, and official WTF Games partner).

---

## ⚡ Quick Start (Local Development)

### Recommended: Local HTTP Server
Run the local HTTP server to avoid browser `file://` cross-origin security restrictions:
- **Option 1**: Double-click `start-server.bat` in this folder.
- **Option 2**: Run `node server.js` (or use the running background instance).
- Open your browser to: **http://localhost:3000/**

### Direct File Preview
You can also open `index.html` directly in any web browser, though modern browsers enforce tighter frame/CORS restrictions on `file://` URLs.

---

## 🔗 How to Update Links (When Client Sends Real URLs)

All links are managed centrally in `js/config.js`. You only need to change the values in this file, and the entire website will automatically update!

Open `js/config.js` and edit:

```javascript
const SITE_CONFIG = {
  // 1. WTF Games Referral Link
  wtfReferralUrl: "https://www.wtfgames.com", // <-- PASTE REAL REFERRAL LINK HERE

  // 2. Social & Community Links
  kickUrl: "https://kick.com/itstimbob",
  xUrl: "https://x.com/ItsTimbob",
  discordUrl: "https://discord.gg/hKkG9NxuEg", // <-- Official Discord Invite Link
  telegramUrl: "https://t.me/+GjSgJUK0AUYxNmZh", // <-- PASTE REAL TELEGRAM CHANNEL HERE
  
  // 3. Contact Email
  contactEmail: "hey@timbob.space",

  // 4. Live Stream Status
  stream: {
    isLive: false, // Set to true when streaming!
  }
};
```

---

## 🚀 How to Host & Show the Client for Free

You can host this live on the web in 60 seconds using any of these free platforms:

1. **Netlify Drop**:
   - Go to [app.netlify.com/drop](https://app.netlify.com/drop)
   - Drag and drop the `itstimbob` folder
   - Instantly get a live, shareable URL (e.g., `itstimbob.netlify.app`) to send to the client!

2. **Vercel**:
   - Drag the folder into Vercel or connect via GitHub repository.

3. **GitHub Pages**:
   - Push to a GitHub repository, go to **Settings > Pages**, and select `main` branch root.

---

## 📁 Project Structure

```
itstimbob/
├── index.html        # Clean, semantic, accessible HTML5 structure
├── css/
│   └── styles.css    # Premium cyber-dark theme, typography, animations, responsive layout
├── js/
│   ├── config.js     # Central configuration file for all client links
│   └── main.js       # Mobile drawer, FAQ accordion, clipboard copy, scroll effects
└── README.md         # Project documentation
```

---

## 💎 Features Built specifically for the Client

- **Personal Brand Focus**: Dedicated to ItsTimbob's streams, personality, and community.
- **70% Commission & VIP Host Section**: Prominent spotlight on the client's 70% commission model and direct 1-on-1 VIP host communication.
- **"YOUR PLAYERS" WTF Games Perks**: Highlights 10% uncapped lossback, automatic VIP tier matching, high-value host care, and activity cash bonuses.
- **"GROWTH & UPSIDE" Section**: Spotlights the client's exact phrase: *"not the ceiling as I grow we all grow."*
- **Community Hub**: Features Discord, Telegram, Kick, and X (Twitter) with direct action buttons.
- **Interactive FAQ**: Accordion answering visitor and player questions cleanly without invented facts.
- **1-Click Email Copy**: Smooth clipboard copy with toast feedback.
- **Responsible Gaming**: Built-in 18+ and BeGambleAware disclosures.
