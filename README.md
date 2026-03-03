You Are Being Optimized
Interactive Browser-Based Artwork : CART 263, Project 1
You Are Being Optimized is a four‑level interactive experience that critiques contemporary systems of data extraction, biometric inference, targeted advertising, and algorithmic conditioning. Built with HTML, CSS, and JavaScript, the project uses the DOM as both a technical structure and a conceptual metaphor for how digital platforms observe, interpret, monetize, and shape users.
The project unfolds across four levels, each representing a different stage in the lifecycle of surveillance capitalism:

Level Structure
Level 1 :Early Data Extraction
A minimal interface that quietly records cursor movement, hesitation, click timing, and idle behavior. The user receives no feedback, mirroring how platforms collect behavioral telemetry long before consent is understood.
Level 2 : Biometric and Invisible Inference
A webcam‑based ASCII portrait and a wave system of interpretive labels simulate biometric analysis, emotional inference, and predictive modeling. The system assigns traits with confidence the user cannot challenge.
Level 3 : Ad Bombardment and Attention Fragmentation
Pop‑ups, micro‑alerts, and interruptions overwhelm the user’s focus. This level critiques the attention economy and the normalization of distraction as a commercial strategy.
Level 4 :Algorithmic Conditioning and Identity Construction
A rapidly accelerating feed blends images of poverty, wealth, politics, crisis, and advertising. The speed and intensity reflect shortened attention spans and the emotional flattening produced by algorithmic content streams.

Conceptual Framework
The project draws on:
* Shoshana Zuboff : Surveillance capitalism and behavioral extraction
* Wendy Hui Kyong Chun : Habitual media and normalization
* Alexander Galloway : Interfaces as control systems
* Kate Crawford : Classification, bias, and the politics of AI
These ideas shape the project’s critique of optimization as a form of power that transforms individuals into data and constructs identities aligned with commercial and political interests.

Technical Overview
* Built with HTML, CSS, JavaScript, and p5.js
* Uses localStorage to pass behavioral data between levels
* Implements a state machine for transitions
* Includes a webcam capture system rendered as ASCII
* Generates dynamic detection boxes with movement, fading, and line‑targeting
* Fully responsive layout with recalculation on window resize
* Custom cursor and timed progression between levels

Repository Notes
This project was developed over several days, but many of the early changes were done locally before I remembered to commit regularly. Once the core structure was complete, I went back through the code to clean, document, and organize it properly, which is reflected in the later commits. 
These commits document the refinement process that happened after the main build.

How to Run
1. Clone or download the repository.
2. Open index.html in a browser.
3. Allow webcam access when prompted (Level 2).
4. Progress through the levels by interacting with the interface.
The project is designed to run locally or through GitHub Pages.

Credits
Created by Denasoha‑Namiko  
Concordia University , CART 263: Creative Computation I
Winter 2026
