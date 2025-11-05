function updateAllTimezoneTooltips() {
    // Find all timezone info elements
    const timezoneElements = document.querySelectorAll('.timezone-info[data-timezone]');
    
    timezoneElements.forEach(element => {
        const tooltip = element.querySelector('.timezone-tooltip');
        
        if (tooltip) {
            const offset = parseInt(element.getAttribute('data-timezone'));
            const now = new Date();
            
            // Calculate time in the target timezone
            const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
            const targetTime = new Date(utc + (3600000 * offset));
            
            // Format time as HH:MM:SS
            const hours = String(targetTime.getHours()).padStart(2, '0');
            const minutes = String(targetTime.getMinutes()).padStart(2, '0');
            const seconds = String(targetTime.getSeconds()).padStart(2, '0');
            
            tooltip.textContent = `${hours}:${minutes}:${seconds}`;
        }
    });
}

// Update immediately and then every second
updateAllTimezoneTooltips();
setInterval(updateAllTimezoneTooltips, 1000);