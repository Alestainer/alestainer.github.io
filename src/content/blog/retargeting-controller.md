---
title: "Retargeting Controller"
description: "Control a simulated robot arm with your hand through a mapping you can rewire."
date: 2026-08-19
tags: ["side-project", "robotics", "simulation"]
---

Weekend experiment: what if we can have sort of a universal controller for anything with just a webcam?

**[Try it in your browser →](https://alestainer.com/retargeting-controller/)**

Your webcam tracks one hand. Seven of the fifteen finger-bend angles get wired to the seven joints of a simulated robot. The wiring starts out random and is not anatomical — but you can drag a row in the table to assign the joints yourself, or press `R` for a fresh random set.

## What you are looking at

The page is two boxes side by side, with a list underneath.

- **Left box — you.** Your webcam picture, with colored lines drawn over your fingers. Nothing is recorded or uploaded; the picture never leaves your computer. Until you press *Enable camera*, the box is just a button.
- **Right box — the robot.** A simulated arm with seven bending points. A small menu switches the shape: a regular arm, or a floppy tentacle.
- **The list — the wiring.** Seven lines, one per bending point, each naming the finger bend that controls it. Drag one line onto another to trade their pairings.
- **The colors — the map.** Every pairing has a color, shown both on your finger in the left box and on the robot part in the right box, so you can see which goes with which.
- **The buttons.** One shuffles every pairing into a fresh random set. The other pauses, freezing the robot so it stops reacting to your hand.

If your hand leaves the frame, the robot stops where it is and waits.

## How it is built

| Piece | What does it |
| --- | --- |
| Hand tracking | MediaPipe hand landmarker |
| Physics | MuJoCo, compiled to WebAssembly |
| Rendering | Three.js |

No backend, no upload — recognition and physics both run in the browser tab.

## Source

Public at [github.com/Alestainer/retargeting-controller](https://github.com/Alestainer/retargeting-controller). Issues and pull requests welcome.
