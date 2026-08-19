---
title: "Retargeting Controller"
description: "Control a simulated robot arm with your hand through a random, non-anatomical mapping."
date: 2026-08-19
tags: ["side-project", "robotics", "simulation"]
---

Weekend experiment: what if we can have sort of a universal controller for anything with just a webcam?

Try it: [alestainer.com/retargeting-controller](https://alestainer.com/retargeting-controller/).

Your webcam tracks one hand. Seven of the fifteen finger-bend angles get wired to the seven joints of a simulated robot, and the wiring is random — not anatomical. Press `R` for a new mapping, or drag a row in the table to swap two connections.

Humans are adaptive systems. Give it a minute and you start flying the thing anyway.

MediaPipe for hand tracking, MuJoCo compiled to WebAssembly for physics, Three.js for the view. Everything runs in the browser; no video leaves your device. Source is public at [github.com/Alestainer/retargeting-controller](https://github.com/Alestainer/retargeting-controller) — issues and pull requests welcome, especially new embodiments and signal filters.

## What you are looking at

The page is split into two boxes side by side.

**Left box: you.** Your webcam picture, with colored lines drawn over your fingers. Nothing is recorded or uploaded — the picture never leaves your computer. Before you press "Enable camera" the box just shows a button.

**Right box: the robot.** A drawing of a simulated robot arm with seven bending points. There's a small menu to switch between two shapes: a regular arm, or a floppy tentacle.

**In between:** an arrow, because your fingers are what move the robot.

**Below both boxes: the list.** Seven lines, one per bending point of the robot. Each line says "this finger bend controls this part of the robot." The pairings are chosen at random, so bending your index finger might twist the robot's elbow. That's the point of the experiment — you learn to work it anyway.

Each pairing has a color, and that color shows up on your finger in the left box and on the robot part in the right box, so you can see which goes with which. You can drag one line onto another to trade their pairings.

**At the bottom: two buttons.** One shuffles all the pairings into a fresh random set. The other pauses, so the robot freezes and stops reacting to your hand.

If your hand leaves the frame, the robot just stops where it is and waits.
