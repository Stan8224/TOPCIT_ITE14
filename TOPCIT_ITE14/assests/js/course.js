// Function to handle progress bar calculation and update
function updateProgress() {
    // --- Data to update the bar ---
    const totalCourses = 5; 
    const completedCourses = 0; 

    // --- DOM Elements ---
    const progressBarFill = document.querySelector('.header__bar-fill');
    const progressRatioText = document.querySelector('.header__ratio');

    // --- Calculation ---
    const defaultRatio = completedCourses / totalCourses;
    const defaultPercentage = defaultRatio * 100;

    // Try to infer total and completed from DOM or from localStorage set
    const listItems = document.querySelectorAll('.course-item--clickable');
    const detectedTotal = listItems && listItems.length ? listItems.length : totalCourses;

    // Update completed class on each item
    if (listItems && listItems.length) {
        listItems.forEach(item => {
            const numberEl = item.querySelector('.course-item__number');
            if (!numberEl) return;
            const rawId = numberEl.textContent.trim();
            const parsed = parseInt(rawId, 10);
            const courseId = Number.isNaN(parsed) ? rawId : String(parsed);
            if (completedIds.includes(courseId)) {
                item.classList.add('completed');
            } else {
                item.classList.remove('completed');
            }
        });
    }

    function getCompletedIds() {
        const raw = localStorage.getItem('courseCompletedIds');
        if (!raw) return [];
        try { const arr = JSON.parse(raw); return Array.isArray(arr) ? arr : []; } catch (e) { return []; }
    }

    const completedIds = getCompletedIds();
    const computedPercentFromIds = (completedIds.length / detectedTotal) * 100;

    // If a percentage was stored by an interactive control, use that as highest priority.
    const storedPercentRaw = localStorage.getItem('courseProgressPercent');
    const storedPercent = storedPercentRaw !== null ? Number(storedPercentRaw) : null;
    let percentage = defaultPercentage;
    if (storedPercent !== null && !Number.isNaN(storedPercent)) {
        percentage = Math.min(100, Math.max(0, storedPercent));
    } else if (completedIds.length > 0) {
        percentage = Math.min(100, Math.max(0, Math.round(computedPercentFromIds)));
    }

    // --- Safely Update Elements ---
    // If neither element exists on the current page, there's nothing to do.
    if (!progressBarFill && !progressRatioText) return;

    if (progressBarFill) {
        progressBarFill.style.width = `${percentage}%`;
    }
    if (progressRatioText) {
        const computedCompleted = Math.round((percentage / 100) * detectedTotal);
        progressRatioText.textContent = `${computedCompleted}/${detectedTotal} COURSES`;
    }
}

// Run the update function once the page is fully loaded
document.addEventListener('DOMContentLoaded', updateProgress);

// Attach handlers so clicking on a course item increments progress
function attachCourseClickHandlers() {
    const items = document.querySelectorAll('.course-item--clickable');
    if (!items || items.length === 0) return;
    const total = items.length;

    function getCompletedIds() {
        const raw = localStorage.getItem('courseCompletedIds');
        if (!raw) return [];
        try { const arr = JSON.parse(raw); return Array.isArray(arr) ? arr : []; } catch (e) { return []; }
    }

    function saveCompletedIds(arr) {
        const unique = Array.from(new Set(arr));
        localStorage.setItem('courseCompletedIds', JSON.stringify(unique));
    }

    items.forEach(el => {
        el.addEventListener('click', (ev) => {
            // Determine the course id (number inside .course-item__number)
            const numberEl = el.querySelector('.course-item__number');
            if (!numberEl) return;
            const rawId = numberEl.textContent.trim();
            const parsed = parseInt(rawId, 10);
            const courseId = Number.isNaN(parsed) ? rawId : String(parsed);

            // Load completed ids and check
            const completed = new Set(getCompletedIds());
            if (!completed.has(courseId)) {
                completed.add(courseId);
                saveCompletedIds(Array.from(completed));

                // Compute percent and write to storage
                const pct = Math.round((completed.size / total) * 100);
                localStorage.setItem('courseProgressPercent', String(Math.min(100, pct)));
                // Update the UI immediately if we're still on the same page
                try { updateProgress(); } catch (e) { /* ignore */ }
            }
            // Let the navigation proceed normally; UI will be updated on the next page load
        });
    });
}

document.addEventListener('DOMContentLoaded', attachCourseClickHandlers);