# Clustering Playground

Explore unsupervised machine learning through a hands-on grouping activity and interactive, step-by-step clustering demonstrations.

**[Open Clustering Playground](https://chiningchang.github.io/clustering-playground/)**

Designed for classroom demonstrations and independent exploration. No coding or login is required.

## Three ways to explore

| Activity | What learners do | What it illustrates |
| --- | --- | --- |
| [Group It Yourself](https://chiningchang.github.io/clustering-playground/#group-it) | Drag 18 foods into 2–5 named groups, explain their reasoning, and copy a summary into class chat. | How chosen features and human interpretation shape grouping decisions. |
| [K-Means Explorer](https://chiningchang.github.io/clustering-playground/#k-means) | Click the plot to assign points and update centroids, change K, and try new random starting centers. | How K-means iteratively adjusts groups and how initialization can change the result. |
| [Hierarchical Explorer](https://chiningchang.github.io/clustering-playground/#hierarchical) | Merge groups step by step, compare linkage methods, and adjust a horizontal tree cut. | How a hierarchy forms and how cut height changes the selected grouping. |

## Classroom features

- **Step-by-step controls:** Back, Next, Play/Pause, and Reset.
- **Click-to-advance K-means:** click the plot, or focus it and press Enter or Space.
- **Visible group outlines:** hierarchical groups appear together in the scatterplot.
- **Linkage comparisons:** average, single, and complete linkage with simple explanations.
- **Tree-cut exploration:** an always-visible slider shows cut height and group count.
- **Prediction prompts:** invite learners to anticipate the next assignment or merge.
- **Teaching notes:** explain centroids, Euclidean distance, dendrograms, and ways to choose a cut.
- **Full-screen viewing:** useful for projection or screen sharing.
- **Direct activity links:** open a specific tab from slides, an LMS, or class chat.

Switching tabs preserves the food activity within the current page session.

## Suggested teaching flow

1. Begin with **Group It Yourself**. Compare how learners organize the same foods and which characteristics they use.
2. Open **K-Means Explorer**. Pause before each step and ask where points or centers will move. Change K or the starting centers and compare results.
3. Open **Hierarchical Explorer**. Predict which groups will merge, compare linkage rules, and use the cut slider to explore different groupings.
4. Discuss whether the resulting groups are meaningful, useful, and appropriate for the intended purpose.

Each activity can also be used on its own.

## What the demonstrations calculate

**K-means** uses 24 observations with two numeric features. It selects distinct observations as initial centers, assigns each point to its nearest center using Euclidean distance, and updates each centroid to its group's mean position. It stops when assignments no longer change, with a 100-iteration safeguard. If a group has no points, its center stays in place. New starting centers use a pseudorandom generator.

**Agglomerative hierarchical clustering** uses eight observations labeled A–H and Euclidean distance. It supports:

- **Single linkage:** minimum distance across all pairs between two groups.
- **Complete linkage:** maximum distance across all pairs between two groups.
- **Average linkage:** mean distance across all pairs between two groups.

The dendrogram records merge distances. A merge at exactly the selected cut height is included. Moving the cut slider displays the complete hierarchy and highlights the selected groups.

The food activity is a manual analogy for clustering. It does not run a machine learning algorithm. The two explorers calculate their clustering steps in the browser using fixed example datasets.

## Privacy and access

No responses are submitted automatically. The activity stores no work on a server and uses no login. Reloading or closing the page clears the current work. Learners choose whether to copy and share their food-grouping summary.

The interface adapts to smaller screens. Food cards support desktop drag and drop, touch dragging, and keyboard pickup and drop. Tabs support arrow-key navigation, and playback controls use standard buttons.

## Run locally

Download both `index.html` and `explorer.js` into the same folder, then open `index.html` in a browser. No build step or external libraries are required.

Clipboard and full-screen availability depend on the browser. If copying is unavailable, select the summary and copy it manually.

## Hosting

The live site uses GitHub Pages. For another deployment, use **Settings → Pages → Deploy from a branch**, select **main** and **/ (root)**, and save.

## Creator

Created by **Dr. Chi-Ning (Nick) Chang**.

GitHub: [@chiningchang](https://github.com/chiningchang)

Free to use and share for teaching and learning.
