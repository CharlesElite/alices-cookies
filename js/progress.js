/**
 * Alice's Girl Scout Cookie Website
 * Real-time Progress Bar Updates
 */

const PROGRESS_API_URL = 'https://script.google.com/macros/s/AKfycbwDCVid0MXSJ48gnwAA1RiDjdMLf3fIwZRtm8-O9e0hX4tcDbiOUcjdx8ad2JO6FsGq/exec';

// Load progress on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProgress();
});

async function loadProgress() {
    try {
        const response = await fetch(PROGRESS_API_URL);
        const data = await response.json();

        updateProgressDisplay(data);

    } catch (error) {
        console.error('Error loading progress:', error);
        // Fallback to hardcoded values if API fails
        updateProgressDisplay({
            boxesSold: 73,
            boxesGoal: 1000,
            percentage: 7.3
        });
    }
}

function updateProgressDisplay(data) {
    // Update boxes sold
    const boxesSoldEl = document.getElementById('boxes-sold');
    if (boxesSoldEl) {
        boxesSoldEl.textContent = data.boxesSold;
    }

    // Update goal
    const boxesGoalEl = document.getElementById('boxes-goal');
    if (boxesGoalEl) {
        boxesGoalEl.textContent = data.boxesGoal;
    }

    // Update percentage
    const percentageEl = document.getElementById('percentage');
    if (percentageEl) {
        percentageEl.textContent = data.percentage;
    }

    // Update progress bar fill
    const progressFillEl = document.getElementById('progress-fill');
    if (progressFillEl) {
        progressFillEl.setAttribute('data-progress', data.percentage);
        progressFillEl.style.width = data.percentage + '%';
    }
}
