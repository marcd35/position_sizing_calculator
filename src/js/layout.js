(function initLayout() {
    var NAV_LINKS = [
        { href: 'total-risk-calculator.html', label: 'Total Risk %' },
        { href: 'dollar-risk-calculator.html', label: 'Dollar Risk' },
        { href: 'position-percent-calculator.html', label: 'Position %' },
        { href: 'calculatorinstructions.html', label: 'FAQ' },
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
        var validThemes = ['light', 'dark', 'grayscale'];
        var safeTheme = validThemes.indexOf(theme) !== -1 ? theme : 'light';
        document.documentElement.setAttribute('data-theme', safeTheme);
        return safeTheme;
    }

    function initTheme() {
        // Default: light, supports light/dark/grayscale
        var stored = getStoredTheme();
        var validThemes = ['light', 'dark', 'grayscale'];
        var theme = validThemes.indexOf(stored) !== -1 ? stored : 'light';
        return applyTheme(theme);
    }

    function insertHeader() {
        if (document.querySelector('.site-header')) return;

        var currentTheme = initTheme();

        var currentFile = getCurrentFile();

        var calculatorLinks = NAV_LINKS.slice(0, 3).map(function (link) {
            var isCurrent = link.href === currentFile;
            return (
                '<a class="site-nav__link calculator-link" href="' +
                escapeText(link.href) +
                '"' +
                (isCurrent ? ' aria-current="page"' : '') +
                '>' +
                escapeText(link.label) +
                '</a>'
            );
        }).join('');

        var instructionsLink = NAV_LINKS[3]; // Instructions is the 4th item
        var isInstructionsCurrent = instructionsLink.href === currentFile;

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

        // Theme switcher segmented buttons
        var themeSwitcherHtml = 
            '<div class="theme-switcher" role="radiogroup" aria-label="Select theme">' +
            '  <button type="button" role="radio" class="theme-switcher__btn" data-theme-value="light" ' +
            '    aria-checked="' + (currentTheme === 'light' ? 'true' : 'false') + '" ' +
            '    title="Light theme">☀️</button>' +
            '  <button type="button" role="radio" class="theme-switcher__btn" data-theme-value="dark" ' +
            '    aria-checked="' + (currentTheme === 'dark' ? 'true' : 'false') + '" ' +
            '    title="Dark theme">🌙</button>' +
            '  <button type="button" role="radio" class="theme-switcher__btn" data-theme-value="grayscale" ' +
            '    aria-checked="' + (currentTheme === 'grayscale' ? 'true' : 'false') + '" ' +
            '    title="Grayscale theme">⚙️</button>' +
            '</div>';

        var themeButtonLabel = '';

        var headerHtml =
            '<header class="site-header" role="banner">' +
            '  <div class="site-header__inner">' +
            '    <a class="site-brand" href="total-risk-calculator.html" aria-label="Position Sizing Calculator home">' +
            '      <img class="site-brand__icon" src="public/media/rswingtrading_icon.jpg" alt="" width="32" height="32" />' +
            '      <span class="site-brand__text">Position Sizing Calculator</span>' +
            '    </a>' +
            '    <div class="site-nav__desktop calculator-nav">' +
                   calculatorLinks +
            '    </div>' +
            '    <div class="site-header__actions">' +
            '      <a class="site-nav__link instructions-link desktop-only" href="' + escapeText(instructionsLink.href) + '"' + (isInstructionsCurrent ? ' aria-current="page"' : '') + '>' + escapeText(instructionsLink.label) + '</a>' +
            '      <div class="theme-switcher-desktop desktop-only">' + themeSwitcherHtml + '</div>' +
            '      <button class="site-nav__toggle" type="button" data-nav-toggle aria-expanded="false" aria-controls="primary-nav">Menu</button>' +
            '    </div>' +
            '  </div>' +
            '  <nav id="primary-nav" class="site-nav" hidden>' +
            '    <div class="site-nav__links">' +
                   linksHtml +
            '      <div class="mobile-theme-switcher">' +
            '        <div class="theme-switcher-label">Theme</div>' +
                     themeSwitcherHtml +
            '      </div>' +
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
        var themeSwitchers = document.querySelectorAll('.theme-switcher');

        function isDesktop() {
            return window.matchMedia && window.matchMedia('(min-width: 1024px)').matches;
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

        // Theme switcher segmented button handlers - works for both desktop and mobile
        themeSwitchers.forEach(function (themeSwitcher) {
            var themeButtons = themeSwitcher.querySelectorAll('.theme-switcher__btn');
            themeButtons.forEach(function (btn) {
                btn.addEventListener('click', function () {
                    var selectedTheme = btn.getAttribute('data-theme-value');
                    var applied = applyTheme(selectedTheme);
                    setStoredTheme(applied);

                    // Update aria-checked states for all buttons in all theme switchers
                    themeSwitchers.forEach(function (ts) {
                        ts.querySelectorAll('.theme-switcher__btn').forEach(function (b) {
                            b.setAttribute('aria-checked', b.getAttribute('data-theme-value') === applied ? 'true' : 'false');
                        });
                    });
                });
            });
        });

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
