# Nifemi's Birthday Site

A single-page birthday celebration site. Structure:

```
nifemi-birthday-site/
├── index.html
├── css/style.css
├── js/script.js
├── images/
│   ├── nifemi-photo.jpg          (hero photo)
│   ├── message-poster.jpg        (cover frame for the big video)
│   └── poster-1.jpg … poster-8.jpg  (preview frame for each clip)
└── videos/
    ├── message-to-nifemi.mp4     (the big "A message for you" video, with sound)
    └── clip-1.mp4 … clip-8.mp4   (muted looping clips)
```

## Where each piece of media appears

- Hero collage: `nifemi-photo.jpg`, `clip-5.mp4`, `clip-7.mp4`
- "Moments worth replaying" gallery: `clip-1`, `clip-2`, `clip-3`, `clip-4`, `clip-6`, `clip-8`
- "A message for you": `message-to-nifemi.mp4` (the same footage as `clip-8`)

To swap something, replace the file (keep the name) or edit the `src` /
`data-src` / `poster` in `index.html`. If you swap a clip, also replace its
`poster-N.jpg` (a still frame from the clip).

## Running it

Open `index.html` in a browser, or serve the folder:

```
python3 -m http.server 8000
```

Then visit `http://localhost:8000`. To put it online, upload the whole folder
to any static host (Netlify, GitHub Pages, Vercel, etc.).

## What's interactive

- Falling petals across the page
- Hero and gallery clips load and play only while they're on screen
  (saves data and battery; they pause when scrolled away)
- Gallery polaroids reveal as you scroll
- The main video plays with a custom play button
- Tap each candle on the cake; the last one triggers confetti
