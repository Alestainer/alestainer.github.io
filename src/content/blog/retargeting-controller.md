---
title: "Retargeting Controller"
description: "Control a simulated robot arm with your hand through a mapping you can rewire."
date: 2026-08-19
tags: ["side-project", "robotics", "simulation"]
---

Weekend experiment: what if we can have sort of a universal controller for anything with just a webcam?

Try it: [alestainer.com/retargeting-controller](https://alestainer.com/retargeting-controller/).

Your webcam tracks one hand. Seven of the fifteen finger-bend angles get wired to the seven joints of a simulated robot. The wiring starts out random and is not anatomical, but you can drag a row in the table to assign the joints yourself. Press `R` for a fresh random set.

MediaPipe for hand tracking, MuJoCo compiled to WebAssembly for physics, Three.js for the view. Everything runs in the browser; no video leaves your device. Source is public at [github.com/Alestainer/retargeting-controller](https://github.com/Alestainer/retargeting-controller) — issues and pull requests welcome, especially new embodiments and signal filters.

## What you are looking at

The page is split into two boxes side by side.

**Left box: you.** Your webcam picture, with colored lines drawn over your fingers. Nothing is recorded or uploaded — the picture never leaves your computer. Before you press "Enable camera" the box just shows a button.

**Right box: the robot.** A drawing of a simulated robot arm with seven bending points. There's a small menu to switch between two shapes: a regular arm, or a floppy tentacle.

**In between:** an arrow, because your fingers are what move the robot.

**Below both boxes: the list.** Seven lines, one per bending point of the robot. Each line says "this finger bend controls this part of the robot." The pairings start out random, so bending your index finger might twist the robot's elbow, but you can drag one line onto another to trade them and build the mapping you want.

Each pairing has a color, and that color shows up on your finger in the left box and on the robot part in the right box, so you can see which goes with which.

**At the bottom: two buttons.** One shuffles all the pairings into a fresh random set. The other pauses, so the robot freezes and stops reacting to your hand.

If your hand leaves the frame, the robot just stops where it is and waits.
