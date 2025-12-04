# TOPCIT_ITE14

This repo contains small static pages for the Integrative Technologies course UI.

- `course.html` — course list
- `course_details.html` — details for course 05 (including progress control & pagination)
- `course.css` and `course_details.css` — styles for the pages
- `course.js` — shared progress behavior (reads/writes progress from localStorage)
- `course_progress_control.js` — a small React control that lets you adjust header progress bar interactively (uses localStorage)
- `course_detail_pagination.js` — a small React component that switches pages via links

How to use:
1. Open `course.html` to see the list page and `course_details.html` to see the detail page.
2. On the detail page, use the 'Adjust Progress' control to change the header progress (persists via localStorage).
