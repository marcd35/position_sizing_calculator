// @ts-check
/**
 * Simple toast notification utility
 */
(function(){
    const containerId = 'toast-container';
    function ensureContainer(){
        let c = document.getElementById(containerId);
        if(!c){
            c = document.createElement('div');
            c.id = containerId;
            c.style.position = 'fixed';
            c.style.top = '12px';
            c.style.right = '12px';
            c.style.zIndex = '9999';
            c.style.display = 'flex';
            c.style.flexDirection = 'column';
            c.style.gap = '8px';
            document.body.appendChild(c);
        }
        return c;
    }
    /**
     * Shows a toast notification
     * @param {'info'|'success'|'error'} type
     * @param {string} message
     */
    function notify(type, message){
        const c = ensureContainer();
        const t = document.createElement('div');
        t.textContent = message;
        t.setAttribute('role','status');
        t.style.padding = '10px 14px';
        t.style.borderRadius = '6px';
        t.style.color = '#fff';
        t.style.boxShadow = '0 2px 6px rgba(0,0,0,0.2)';
        t.style.fontSize = '14px';
        t.style.opacity = '0';
        t.style.transform = 'translateY(-6px)';
        t.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
        const colors = { info: '#007bff', success: '#28a745', error: '#dc3545'};
        t.style.background = colors[type] || colors.info;
        c.appendChild(t);
        requestAnimationFrame(()=>{t.style.opacity = '1'; t.style.transform = 'translateY(0)';});
        setTimeout(()=>{
            t.style.opacity = '0';
            t.style.transform = 'translateY(-6px)';
            setTimeout(()=>{ if(t.parentNode) c.removeChild(t); }, 200);
        }, 2500);
    }
    /** @type {any} */
    (window).notify = notify;
})();