# Justin James Gutierrez — Portfolio Website

A high-performance, responsive, and interactive portfolio website showcasing full-stack web platforms, AI vision systems, video editing productions, and enterprise IT experience.

Live Website Demos Featured:
- **JSquared Cinema**: [https://jjsquared.vercel.app/](https://jjsquared.vercel.app/)
- **KTaby (K-Pop Discovery Hub)**: [https://ktabys.vercel.app/](https://ktabys.vercel.app/)
- **FallGuard**: Real-time skeleton-based LSTM AI fall detection system
- **VitalPoint**: Clinic appointment and scheduling system

---

## How to Deploy to Vercel

This portfolio is built with zero-configuration static architecture and is 100% ready to deploy to Vercel.

### Option 1: Deploy with Vercel CLI (Fastest)

1. Open PowerShell / Command Prompt inside this folder:
   ```bash
   cd c:\Users\rosen\Desktop\portfolio
   ```

2. Run the Vercel deployment command:
   ```bash
   npx vercel
   ```

3. Follow the quick prompts in your terminal:
   - Set up and deploy? **Y**
   - Which scope? Select your personal Vercel account
   - Link to existing project? **N**
   - Project name: `justin-gutierrez-portfolio` (or press Enter)
   - In which directory is your code located? `./` (press Enter)
   - Auto-detected project settings: Press Enter to accept defaults.

4. To deploy directly to production:
   ```bash
   npx vercel --prod
   ```

### Option 2: Deploy via GitHub (Automatic CI/CD)

1. Initialize Git and commit the files:
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio commit"
   ```

2. Push to your GitHub account:
   ```bash
   git remote add origin https://github.com/<your-username>/portfolio.git
   git branch -M main
   git push -u origin main
   ```

3. Go to [https://vercel.com/new](https://vercel.com/new), select your GitHub repository, and click **Deploy**. Vercel will instantly build and host your portfolio with global CDN and automated SSL!

---

## Project Structure

```text
portfolio/
├── index.html                        # Main interactive portfolio website
├── resume.html                       # Print-ready, new-tab viewable resume
├── Justin_James_Gutierrez_Resume.pdf # Downloadable vector PDF resume
├── style.css                         # Streamlined modern CSS (dark/light themes, animations)
├── script.js                         # IT terminal CLI, project filtering, dialog modals, video player
├── vercel.json                       # Vercel configuration (headers, clean URLs, cache policies)
├── package.json                      # Dev scripts and metadata
├── .gitignore                        # Git ignore rules
├── favicon.svg                       # Portfolio SVG favicon
├── justin_gutierrez.jpg              # High-definition formal portrait
├── jjsquared.png                     # Live homepage screenshot of JSquared Cinema
├── ktabys.png                        # Live homepage screenshot of KTaby
├── fallguard.png                     # Real-time multi-cam dashboard capture of FallGuard
├── vitalpoint.png                    # System UI capture of VitalPoint
├── dlsud_logo.png                    # De La Salle University - Dasmariñas logo
├── stefanini_logo.png                # Stefanini Philippines official logo
├── origin_logo.png                   # ORIGIN official logo
├── smdc_logo.png                     # SMDC official logo
├── knowles_logo.png                  # Knowles Training Institute official logo
├── after_effects_logo.svg            # Adobe After Effects official logo
├── premiere_pro_logo.svg             # Adobe Premiere Pro official logo
├── capcut_logo.svg                   # CapCut official logo
├── tabby_edit_1.mp4                  # Featured video edit 01
├── tabby_edit_2.mp4                  # Featured video edit 02
└── tabby_edit_3.mp4                  # Featured video edit 03
```

---

## Features

- **New-Tab Viewable & Downloadable Resume**: Opens a clean, print-optimized resume in a new tab (`resume.html`) with 1-click **Download PDF** and **Print** functionality.
- **Realistic Browser Mockups**: Displays high-fidelity captures of [jjsquared.vercel.app](https://jjsquared.vercel.app/) and [ktabys.vercel.app](https://ktabys.vercel.app/) in browser frames with direct live links.
- **Top-Layer Dialog Modals**: Uses native HTML `<dialog>` elements with `@starting-style` and `transition-behavior: allow-discrete` transitions conforming to modern web standards.
- **Interactive IT Terminal**: Full-featured diagnostic CLI with simulated network latency tests, hardware specifications, and career logs.
- **Video Editing Studio Suite**: After Effects-styled workspace with real video playback, clip switcher, scrub slider, and TikTok creator channel launcher buttons.
- **Dark / Light Theme Toggle**: Persistent theme switching with automatic system preference synchronization.
- **Responsive & Accessible**: Optimized for mobile, tablet, and desktop viewports with `prefers-reduced-motion` compliance.
- **1-Click Contact**: Instant email copy with toast notifications and contact messaging.
