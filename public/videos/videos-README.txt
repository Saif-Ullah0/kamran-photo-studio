Drop your intro reel here as: intro-reel.mp4

This file is used in two places (see lib/data.ts -> MEDIA):
- The looping muted background of the "4K Drone & Cinema Showcase" section
- The fullscreen video opened when someone clicks "Elevate Your Story"

Both currently point at the same file for simplicity. If you'd rather use a
shorter/lighter clip for the looping background and a longer one for the
fullscreen modal, add a second file here (e.g. intro-reel-full.mp4) and
update MEDIA.showreelFull in lib/data.ts to point at it.

────────────────────────────────────────────────────────────────────────
IMPORTANT: the file must actually be MP4 (H.264 video codec), not just
named ".mp4". Browsers cannot play .mpg/.mpeg (MPEG-1/2) files at all —
if you have an .mpg file, it needs to be converted first, or it will show
nothing (this is a hard limitation of the file format, not a bug in the
site).
────────────────────────────────────────────────────────────────────────

HOW TO CONVERT + COMPRESS (do both in one step):

Easiest — HandBrake (free, GUI, Windows/Mac/Linux):
  1. Download from handbrake.fr
  2. Open your .mpg file
  3. Preset: "Fast 1080p30" (or "Web" if available)
  4. Format: MP4
  5. On the Video tab, set "Constant Quality" around RF 24-26 for a good
     balance of quality vs. file size
  6. Export, rename the result to intro-reel.mp4, drop it here

Command line — ffmpeg (if you have it installed):
  ffmpeg -i your-file.mpg -vcodec libx264 -crf 25 -preset medium \
    -vf "scale=1920:-2" -acodec aac -b:a 128k -movflags +faststart \
    intro-reel.mp4

Target size: for a short (10-20s) background loop, aim for roughly
3-8 MB. 25MB+ is too heavy for an autoplaying background clip, especially
on mobile connections — it will load slowly or stall.
