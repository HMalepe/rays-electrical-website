# Hero video

`hero.mp4` and `hero.webm` play behind the home page hero, with `hero-poster.jpg` as the still frame.

The files currently here are an **ambient placeholder** made from the house photo (slow push-in, breathing light).
Replace them with real footage of Ray at work, keeping the same file names. No code change is needed.

## Footage tips

- 8 to 15 seconds, no audio, shot landscape. Close, steady shots read best: hands on a DB board, a breaker being tested, a light being fitted.
- Frame the subject on the right or centre. The headline sits over the left side.
- Loop-friendly: end where you started, or ask for a cross-dissolve at the join.

## Encode (ffmpeg), target under 2 MB each

```sh
ffmpeg -i source.mov -vf "scale=1280:-2,fps=24" -an -c:v libx264 -preset slow -crf 27 -movflags +faststart hero.mp4
ffmpeg -i source.mov -vf "scale=1280:-2,fps=24" -an -c:v libvpx-vp9 -b:v 0 -crf 38 -row-mt 1 hero.webm
ffmpeg -i hero.mp4 -frames:v 1 -q:v 4 hero-poster.jpg
```
