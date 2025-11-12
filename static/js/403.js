// Function to get URL parameters
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    var results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Check for unique_id in URL parameters or common ModSecurity variables
var uniqueId = getUrlParameter('id') || 
               getUrlParameter('unique_id') || 
               getUrlParameter('incident_id') ||
               getUrlParameter('request_id');

// Also check if it's passed in the hash
if (!uniqueId && window.location.hash) {
    uniqueId = window.location.hash.substring(1);
}

// Display the unique ID if found
if (uniqueId) {
    document.getElementById('unique-id').textContent = uniqueId;
    document.getElementById('unique-id-container').style.display = 'block';
}

// Make the unique ID selectable/copyable on click
var idElement = document.getElementById('unique-id');
if (idElement) {
    idElement.style.cursor = 'pointer';
    idElement.onclick = function() {
        // Select the text
        var range = document.createRange();
        range.selectNode(idElement);
        window.getSelection().removeAllRanges();
        window.getSelection().addRange(range);
        
        // Try to copy to clipboard
        try {
            document.execCommand('copy');
            var originalText = idElement.textContent;
            idElement.textContent = '[copied!]';
            setTimeout(function() {
                idElement.textContent = originalText;
            }, 1000);
        } catch(err) {
            console.log('Copy failed:', err);
        }
    };
}