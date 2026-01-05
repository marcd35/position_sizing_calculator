// @ts-check
/**
 * Escapes HTML special characters to prevent XSS when injecting into HTML strings
 * @param {string} str
 * @returns {string}
 */
function escapeHTML(str){
    return String(str)
        .replace(/&/g,'&amp;')
        .replace(/</g,'&lt;')
        .replace(/>/g,'&gt;')
        .replace(/"/g,'&quot;')
        .replace(/'/g,'&#39;');
}