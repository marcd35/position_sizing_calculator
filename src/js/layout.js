(function initLayout() {
    var NAV_LINKS = [
        { href: 'total-risk-calculator.html', label: 'Total Risk %' },
        { href: 'dollar-risk-calculator.html', label: 'Dollar Risk' },
        { href: 'position-percent-calculator.html', label: 'Position %' },
        { href: 'calculatorinstructions.html', label: 'Instructions' },
    ];

    function getCurrentFile() {
        try {
            var path = window.location.pathname || '';
            var file = path.split('/').pop();
            if (!file) return 'total-risk-calculator.html';
            return file;
        } catch {
            return 'total-risk-calculator.html';
        }
    }

    function escapeText(value) {
        return String(value)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function getStoredTheme() {
        try {
            return window.localStorage ? window.localStorage.getItem('theme') : null;
        } catch {
            return null;
        }
    }

    function setStoredTheme(theme) {
        try {
            if (window.localStorage) {
                window.localStorage.setItem('theme', theme);
            }
        } catch {
            // Ignore storage errors
        }
    }

    function applyTheme(theme) {
        var safeTheme = theme === 'dark' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', safeTheme);
        return safeTheme;
    }

    function initTheme() {
        // Default: light
        var stored = getStoredTheme();
        var theme = stored === 'dark' ? 'dark' : 'light';
        return applyTheme(theme);
    }

    function insertHeader() {
        if (document.querySelector('.site-header')) return;

        var currentTheme = initTheme();

        var currentFile = getCurrentFile();

        var linksHtml = NAV_LINKS.map(function (link) {
            var isCurrent = link.href === currentFile;
            return (
                '<a class="site-nav__link" href="' +
                escapeText(link.href) +
                '"' +
                (isCurrent ? ' aria-current="page"' : '') +
                '>' +
                escapeText(link.label) +
                '</a>'
            );
        }).join('');

        var themeButtonLabel = '';

        var headerHtml =
            '<header class="site-header" role="banner">' +
            '  <div class="site-header__inner">' +
            '    <a class="site-brand" href="total-risk-calculator.html" aria-label="Position Sizing Calculator home">' +
            '      <img class="site-brand__icon" src="public/media/rswingtrading_icon.jpg" alt="" width="28" height="28" />' +
            '      <span class="site-brand__text">Position Sizing Calculator</span>' +
            '    </a>' +
            '    <div class="site-header__actions">' +
            '      <button class="site-theme-toggle" type="button" data-theme-toggle aria-pressed="' +
            (currentTheme === 'dark' ? 'true' : 'false') +
            '" aria-label="Toggle dark mode"></button>' +
            '      <button class="site-nav__toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="primary-nav">Menu</button>' +
            '    </div>' +
            '  </div>' +
            '  <nav id="primary-nav" class="site-nav" aria-label="Primary" hidden>' +
            '    <div class="site-nav__links">' +
            linksHtml +
            '    </div>' +
            '  </nav>' +
            '</header>';

        var anchor = document.getElementById('aria-live');
        if (anchor && anchor.parentNode) {
            anchor.insertAdjacentHTML('afterend', headerHtml);
        } else {
            document.body.insertAdjacentHTML('afterbegin', headerHtml);
        }

        var toggle = document.querySelector('[data-nav-toggle]');
        var nav = document.getElementById('primary-nav');
        var themeToggle = document.querySelector('[data-theme-toggle]');

        function isDesktop() {
            return window.matchMedia && window.matchMedia('(min-width: 720px)').matches;
        }

        function setOpen(isOpen) {
            if (!toggle || !nav) return;
            toggle.setAttribute('aria-expanded', String(isOpen));

            if (isDesktop()) {
                nav.removeAttribute('hidden');
                return;
            }

            if (isOpen) {
                nav.removeAttribute('hidden');
            } else {
                nav.setAttribute('hidden', '');
            }
        }

        // Default state
        setOpen(false);

        if (themeToggle) {
            themeToggle.addEventListener('click', function () {
                var current = document.documentElement.getAttribute('data-theme');
                var next = current === 'dark' ? 'light' : 'dark';
                var applied = applyTheme(next);
                setStoredTheme(applied);

                themeToggle.setAttribute('aria-pressed', applied === 'dark' ? 'true' : 'false');
                // No text content needed - CSS handles the visual with emojis
            });
        }

        if (toggle) {
            toggle.addEventListener('click', function () {
                var expanded = toggle.getAttribute('aria-expanded') === 'true';
                setOpen(!expanded);
            });
        }

        if (nav) {
            nav.addEventListener('click', function (event) {
                var target = event.target;
                if (target && target.tagName === 'A') {
                    setOpen(false);
                }
            });
        }

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape') {
                setOpen(false);
            }
        });

        window.addEventListener('resize', function () {
            setOpen(false);
        });
    }

    function insertFooter() {
        if (document.querySelector('.site-footer')) return;

        var footerHtml =
            '<footer class="site-footer" role="contentinfo">' +
            '  <div class="site-footer__inner">' +
            '    <div class="site-footer__block">' +
            '      <div class="site-footer__title">Disclaimer</div>' +
            '      <div class="site-footer__text">Educational use only. Not financial advice. <a href="calculatorinstructions.html#disclaimer">Read more</a></div>' +
            '    </div>' +
            '    <div class="site-footer__block">' +
            '      <div class="site-footer__title">About</div>' +
            '      <div class="site-footer__text">Built by the r/swingtrading community. <a href="calculatorinstructions.html#about">Read more</a></div>' +
            '    </div>' +
            '    <div class="site-footer__block">' +
            '      <div class="site-footer__title">Support</div>' +
            '      <div class="site-footer__text">If this free tool helps, support is appreciated: <a href="https://buymeacoffee.com/rswingtrading" target="_blank" rel="noopener noreferrer">Buy me a coffee</a></div>' +
            '    </div>' +
            '    <div class="site-footer__icons" aria-label="Community links">' +
            '      <a class="external-link" href="https://www.reddit.com/r/swingtrading/" target="_blank" rel="noopener noreferrer" aria-label="r/swingtrading on Reddit">' +
            '        <img src="public/media/redditicon.jpg" alt="" />' +
            '      </a>' +
            '      <a class="external-link" href="https://discord.gg/yWFavAVQpm" target="_blank" rel="noopener noreferrer" aria-label="Swing trading Discord">' +
            '        <img src="public/media/discordicon.png" alt="" />' +
            '      </a>' +
            '    </div>' +
            '  </div>' +
            '</footer>';

        document.body.insertAdjacentHTML('beforeend', footerHtml);
    }

    function removeRedundantSections() {
        // Calculators: remove legacy in-page sections now replaced by the shared footer.
        var ids = ['disclaimer-info', 'about-info', 'support-info'];
        ids.forEach(function (id) {
            var el = document.getElementById(id);
            if (el && el.parentNode) {
                el.parentNode.removeChild(el);
            }
        });

        // Remove “scrolldown” jump links block if present.
        var scrolldown = document.querySelector('.scrolldown');
        if (scrolldown && scrolldown.parentNode) {
            scrolldown.parentNode.removeChild(scrolldown);
        }
    }

    function init() {
        // Apply theme early even if header is missing for some reason.
        initTheme();
        insertHeader();
        insertFooter();
        removeRedundantSections();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
