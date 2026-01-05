// @ts-check
/**
 * Initializes copy-to-clipboard functionality for elements with class 'copyable'
 */
function initClipboard() {
    // Ensure copyable elements are focusable and have a button-like role
    document.querySelectorAll('.copyable').forEach((el) => {
        if (!(el instanceof HTMLElement)) return;
        if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
        if (!el.hasAttribute('role')) el.setAttribute('role', 'button');
        if (!el.hasAttribute('aria-label')) el.setAttribute('aria-label', 'Copy value');
    });

    document.addEventListener('click', function(e) {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        if (target.classList.contains('copyable')) {
            const text = target.textContent || '';
            if (!text || text === '-') return;
            copyToClipboard(text, target);
        }
    });

    document.addEventListener('keydown', function (e) {
        const target = e.target;
        if (!(target instanceof HTMLElement)) return;
        if (!target.classList.contains('copyable')) return;

        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const text = target.textContent || '';
            if (!text || text === '-') return;
            copyToClipboard(text, target);
        }
    });
}

/**
 * Copies text to clipboard and shows visual feedback
 * @param {string} text - Text to copy
 * @param {HTMLElement} element - Element that was clicked
 */
function copyToClipboard(text, element) {
    // Use modern API if available
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
            showCopiedFeedback(element);
        }).catch(err => {
            console.error('Failed to copy: ', err);
            fallbackCopy(text, element);
        });
    } else {
        fallbackCopy(text, element);
    }
}

/**
 * Fallback for older browsers
 * @param {string} text 
 * @param {HTMLElement} element 
 */
function fallbackCopy(text, element) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    
    // Ensure it's not visible
    textArea.style.position = "fixed";
    textArea.style.left = "-9999px";
    textArea.style.top = "0";
    
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        const successful = document.execCommand('copy');
        if (successful) {
            showCopiedFeedback(element);
        }
    } catch (err) {
        console.error('Fallback: Oops, unable to copy', err);
    }
    
    document.body.removeChild(textArea);
}

/**
 * Shows a "Copied!" tooltip near the element
 * @param {HTMLElement} element 
 */
function showCopiedFeedback(element) {
    const feedbackEl = document.createElement('span');
    feedbackEl.classList.add('copied-feedback');
    feedbackEl.textContent = 'Copied!';
    document.body.appendChild(feedbackEl);
    
    const rect = element.getBoundingClientRect();
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
    
    feedbackEl.style.left = `${rect.left + scrollLeft}px`;
    feedbackEl.style.top = `${rect.top + scrollTop - 30}px`;
    feedbackEl.style.display = 'block';
    
    // Trigger animation
    requestAnimationFrame(() => {
        feedbackEl.style.opacity = '1';
        feedbackEl.style.transform = 'translateY(0)';
    });
    
    setTimeout(() => {
        feedbackEl.style.opacity = '0';
        feedbackEl.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            if (feedbackEl.parentNode) {
                document.body.removeChild(feedbackEl);
            }
        }, 300);
    }, 1000);
}
