# GS Events Website — gs-events.co

Complete website codebase for GitHub deployment and GoDaddy domain connection.

## Files Overview

```
website/
├── index.html          ← Home page
├── about.html          ← About Jennifer
├── services.html       ← Services (Event Strategy + Venue Consulting)
├── portfolio.html      ← Portfolio / Case Studies
├── insights.html       ← Insights / Blog
├── contact.html        ← Contact & Inquiry Form
├── css/
│   └── style.css       ← All styles (design system + page layouts)
├── js/
│   └── main.js         ← Navigation, animations, form handling
├── assets/
│   └── images/         ← All photos and logos go here
└── README.md           ← This file
```

## Image Files

The following images are included. HEIC files from your phone need to be converted to JPG before adding to GitHub. Use a free tool like CloudConvert.com.

**Logos** (in `assets/images/`):
- `logo-1.png` — Main logo (used throughout the site)
- `logo-2.png` — Alternate logo version
- `logo-3.png` — Third logo variant

**Headshots** (in `assets/images/`):
- `headshot-main.PNG` — Primary headshot (used on Home page)
- `headshot-2.PNG` — Secondary headshot (used on About page)
- `headshot-3.PNG`, `headshot-4.PNG` — Additional headshots

**Event Photos** (in `assets/images/`):
- `event-1.jpg` through `event-12.jpg`

**To add HEIC photos:**
1. Convert them at [CloudConvert.com](https://cloudconvert.com)
2. Save as JPG
3. Drop into `assets/images/`
4. Update the `src` attributes in the HTML where you want them used

## GitHub Deployment

### Step 1: Create a GitHub Repository
1. Go to [github.com](https://github.com) and sign in (or create a free account)
2. Click **New repository**
3. Name it `gs-events-website` (or similar)
4. Set it to **Public**
5. Click **Create repository**

### Step 2: Upload Files
**Option A — GitHub Desktop (easiest):**
1. Download [GitHub Desktop](https://desktop.github.com)
2. Clone your new repository
3. Copy all website files into the cloned folder
4. Commit and push

**Option B — Upload via GitHub.com:**
1. Open your repository on GitHub
2. Click **Add file → Upload files**
3. Drag and drop all website files and folders
4. Click **Commit changes**

### Step 3: Enable GitHub Pages
1. In your repository, go to **Settings**
2. Scroll down to **Pages** in the left sidebar
3. Under **Source**, select **Deploy from a branch**
4. Branch: `main` | Folder: `/ (root)`
5. Click **Save**
6. Your site will be live at: `https://yourusername.github.io/gs-events-website/`

## Connecting to GoDaddy Domain (gs-events.co)

### Step 1: Add Custom Domain in GitHub Pages
1. In your repository **Settings → Pages**
2. Under **Custom domain**, type: `gs-events.co`
3. Click **Save**
4. GitHub will create a `CNAME` file automatically

### Step 2: Update GoDaddy DNS Settings
1. Log in to [GoDaddy](https://godaddy.com)
2. Go to **My Products → DNS** for `gs-events.co`
3. Delete any existing A records
4. Add these 4 A records (GitHub's IPs):
   - Type: A | Host: @ | Value: `185.199.108.153`
   - Type: A | Host: @ | Value: `185.199.109.153`
   - Type: A | Host: @ | Value: `185.199.110.153`
   - Type: A | Host: @ | Value: `185.199.111.153`
5. Add a CNAME record:
   - Type: CNAME | Host: www | Value: `yourusername.github.io`
6. Save changes (DNS propagation takes 24–48 hours)

### Step 3: Enable HTTPS
1. Back in GitHub Pages settings, check **Enforce HTTPS** (available after DNS propagates)

## Contact Form Setup

The contact form currently shows a success animation for demo purposes. To make it functional, you have two free options:

**Option A — Formspree (recommended, free tier available):**
1. Go to [formspree.io](https://formspree.io) and sign up
2. Create a new form, get your form endpoint (e.g., `https://formspree.io/f/xyzabc`)
3. In `contact.html`, change `<form>` to:
   ```html
   <form action="https://formspree.io/f/YOUR_FORM_ID" method="POST">
   ```
4. Responses will be emailed to you

**Option B — Netlify Forms (if hosting on Netlify instead):**
Add `netlify` attribute to the form tag:
```html
<form name="contact" netlify>
```

## Analytics

To add Google Analytics:
1. Create a free account at [analytics.google.com](https://analytics.google.com)
2. Get your Measurement ID (e.g., `G-XXXXXXXXXX`)
3. Add this code before `</head>` in all HTML files:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## Customization Notes

- **Colors**: All colors are CSS variables in `css/style.css` under `:root`
- **Fonts**: Using Google Fonts (Cormorant Garamond + Montserrat)
- **Email**: Update all instances of `jennifer@gs-events.co` with your actual email
- **Social Links**: Update LinkedIn and Instagram URLs throughout all pages
- **Phone**: Add phone number to `contact.html` contact details section if desired
- **Testimonials**: Replace placeholder testimonials with real client quotes
- **Images**: Swap placeholder images with your actual event portfolio photos
