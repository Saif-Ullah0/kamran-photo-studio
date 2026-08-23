Drop team photos here.

Kamran's photo is expected at: kamran.jpg
It's used in two places:
- lib/data.ts -> ABOUT_IMAGE (the About section's photo)
- lib/data.ts -> TEAM_MEMBERS (his card in the Team section + his profile page)

Both currently point at the same file. If you want a different photo for
the About section specifically, add a second file here and update
ABOUT_IMAGE in lib/data.ts separately.

The other team members (Ayesha, Bilal, Sara) are still placeholder Unsplash
photos. To swap one in: add the file here (e.g. ayesha-khan.jpg) and update
that person's `image` field in TEAM_MEMBERS in lib/data.ts to "/team/ayesha-khan.jpg".
