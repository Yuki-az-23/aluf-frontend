/**
 * PC Configurator - Modal-Based Store Integration (ES5 Compatible)
 *
 * Creates a floating action button (FAB) that opens a modal with the PC Configurator iframe.
 * Similar to the pattern used in vanilla-pc-configurator/FLOATING_BUTTON_VERSION.md
 */

(function (window, document) {
    'use strict';

    // ============================================================
    // CONFIGURATION
    // ============================================================

    var CONFIG = {
        // URL of the hosted PC Configurator app
        iframeUrl: 'https://pcbuilder101.vercel.app',

        // Debug mode
        debug: true
    };

    // Override config from global if exists
    if (window.PCConfiguratorConfig) {
        var key;
        for (key in window.PCConfiguratorConfig) {
            if (window.PCConfiguratorConfig.hasOwnProperty(key)) {
                CONFIG[key] = window.PCConfiguratorConfig[key];
            }
        }
    }

    // ============================================================
    // I18N (TRANSLATIONS)
    // ============================================================

    var TRANSLATIONS = {
        he: {
            btnText: 'בנה מחשב',
            modalTitle: '&#128421;בנה מחשב מותאם אישית',
            modalSubtitle: 'תתחיל מרכיב שאתה מכיר, בשאר נעזור לך',
            loading: 'טוען...',
            successCart: ' מוצרים נוספו לסל! מרענן...',
            warningCartAdded: ' מוצרים, ',
            warningCartFailed: ' נכשלו',
            errorCart: 'שגיאה בהוספת המוצרים לסל',
            successPublish: 'הרכבה פורסמה בהצלחה! מרענן...',
            errorPublish: 'שגיאה בפרסום ההרכבה'
        },
        en: {
            btnText: 'Build a PC',
            modalTitle: '&#128421;Custom PC Builder',
            modalSubtitle: 'Start with a part you know, we\'ll help with the rest',
            loading: 'Loading...',
            successCart: ' items added to cart! Refreshing...',
            warningCartAdded: ' items added, ',
            warningCartFailed: ' failed',
            errorCart: 'Error adding items to cart',
            successPublish: 'Build published successfully! Refreshing...',
            errorPublish: 'Error publishing build'
        },
        ru: {
            btnText: 'Собрать ПК',
            modalTitle: '&#128421;Сборка ПК',
            modalSubtitle: 'Начните с известной детали, с остальным мы поможем',
            loading: 'Загрузка...',
            successCart: ' товаров добавлено в корзину! Обновление...',
            warningCartAdded: ' товаров добавлено, ',
            warningCartFailed: ' не удалось',
            errorCart: 'Ошибка при добавлении товаров в корзину',
            successPublish: 'Сборка опубликована! Обновление...',
            errorPublish: 'Ошибка при публикации сборки'
        }
    };

    function getCurrentLang() {
        var htmlLang = document.documentElement.lang || 'he';
        htmlLang = htmlLang.toLowerCase();

        if (htmlLang.indexOf('ru') === 0) return 'ru';
        if (htmlLang.indexOf('en') === 0) return 'en';
        return 'he';
    }

    var currentLang = getCurrentLang();
    var t = TRANSLATIONS[currentLang] || TRANSLATIONS['he'];

    // ============================================================
    // STATE
    // ============================================================

    var modalOpen = false;
    var iframeElement = null;
    var stylesInjected = false;

    function logDebug() {}

    // ============================================================
    // STYLES INJECTION
    // ============================================================

    function injectStyles() {
        if (stylesInjected) return;
        stylesInjected = true;

        var css = '' +
            '/* ==================== INTEGRATED BUTTON ==================== */' +
            '.pc-builder-btn {' +
            '  display: inline-flex !important;' +
            '  align-items: center !important;' +
            '  justify-content: center !important;' +
            '  background: #ff8c42 !important;' +
            '  color: white !important;' +
            '  font-weight: 700 !important;' +
            '  padding: 8px 16px !important;' +
            '  border-radius: 4px !important;' +
            '  cursor: pointer !important;' +
            '  transition: all 0.2s ease !important;' +
            '  text-decoration: none !important;' +
            '  margin: 0 10px !important;' +
            '  border: none !important;' +
            '  line-height: normal !important;' +
            '}' +
            '.pc-builder-btn:hover {' +
            '  background: #e67e3b !important;' +
            '  transform: translateY(-1px) !important;' +
            '  box-shadow: 0 4px 6px rgba(0,0,0,0.1) !important;' +
            '}' +
            '.pc-builder-btn img {' +
            '  width: 20px !important;' +
            '  height: 20px !important;' +
            '  margin-left: 8px !important;' +
            '  filter: brightness(0) invert(1) !important;' +
            '  display: inline-block !important;' +
            '}' +
            '/* Mobile Specific Adjustments */' +
            '@media screen and (max-width: 768px) {' +
            '  .pc-builder-btn.mobile-btn {' +
            '    width: calc(100% - 20px) !important;' +
            '    margin: 10px auto !important;' +
            '    box-sizing: border-box !important;' +
            '    padding: 12px !important;' +
            '    font-size: 1.1rem !important;' +
            '    display: flex !important;' +
            '  }' +
            '}' +
            '@media screen and (min-width: 769px) {' +
            '  .pc-builder-btn.mobile-btn {' +
            '    display: none !important;' +
            '  }' +
            '}' +
            '/* Overwrite site margin (Mobile only) */' +
            '@media screen and (max-width: 767px) {' +
            '  div#bg_middle {' +
            '    margin-top: 90px !important;' +
            '  }' +
            '}' +
            '' +
            '/* ==================== MODAL OVERLAY ==================== */' +
            '#pc-builder-modal {' +
            '  position: fixed;' +
            '  top: 0;' +
            '  left: 0;' +
            '  right: 0;' +
            '  bottom: 0;' +
            '  background: rgba(0, 0, 0, 0.85);' +
            '  z-index: 2147483647;' +
            '  display: none;' +
            '  opacity: 0;' +
            '  transition: opacity 0.3s ease;' +
            '}' +
            '#pc-builder-modal.active {' +
            '  display: flex;' +
            '  opacity: 1;' +
            '}' +
            '' +
            '/* ==================== MODAL CONTENT ==================== */' +
            '.pc-modal-content {' +
            '  width: 100%;' +
            '  height: 100%;' +
            '  background: #f8f9fa;' +
            '  display: flex;' +
            '  flex-direction: column;' +
            '  overflow: hidden;' +
            '  transform: translateY(100%);' +
            '  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);' +
            '}' +
            '#pc-builder-modal.active .pc-modal-content {' +
            '  transform: translateY(0);' +
            '}' +
            '' +
            '/* ==================== MODAL HEADER ==================== */' +
            '.pc-modal-header {' +
            '  background: linear-gradient(135deg, #030213 0%, #1a1927 100%);' +
            '  color: white;' +
            '  padding: 1rem 1.5rem;' +
            '  display: flex;' +
            '  justify-content: space-between;' +
            '  align-items: center;' +
            '  box-shadow: 0 4px 12px rgba(0,0,0,0.15);' +
            '  direction: rtl;' +
            '  flex-shrink: 0;' +
            '}' +
            '.pc-modal-title {' +
            '  display: flex;' +
            '  align-items: center;' +
            '  gap: 0.75rem;' +
            '}' +
            '.pc-modal-title h2 {' +
            '  margin: 0;' +
            '  font-size: 1.5rem;' +
            '  color: #ff8c42;' +
            '  font-weight: 700;' +
            '}' +
            '.pc-modal-title p {' +
            '  margin: 0;' +
            '  font-size: 0.875rem;' +
            '  opacity: 0.85;' +
            '}' +
            '.pc-modal-close {' +
            '  background: transparent;' +
            '  border: 2px solid rgba(255, 255, 255, 0.3);' +
            '  color: white;' +
            '  width: 44px;' +
            '  height: 44px;' +
            '  border-radius: 50%;' +
            '  cursor: pointer;' +
            '  display: flex;' +
            '  align-items: center;' +
            '  justify-content: center;' +
            '  transition: all 0.3s ease;' +
            '  font-size: 1.5rem;' +
            '  line-height: 1;' +
            '}' +
            '.pc-modal-close:hover {' +
            '  background: rgba(255, 255, 255, 0.1);' +
            '  border-color: #ff8c42;' +
            '  transform: rotate(90deg);' +
            '}' +
            '' +
            '/* ==================== MODAL BODY (IFRAME) ==================== */' +
            '.pc-modal-body {' +
            '  flex: 1;' +
            '  overflow-y: auto;' +
            '  overflow-x: hidden;' +
            '  -webkit-overflow-scrolling: touch;' +
            '  position: relative;' +
            '}' +
            '.pc-modal-body iframe {' +
            '  width: 1px;' +
            '  min-width: 100%;' +
            '  max-width: 100%;' +
            '  height: 100%;' +
            '  border: none;' +
            '  display: block;' +
            '}' +
            '.pc-iframe-loading {' +
            '  position: absolute;' +
            '  top: 50%;' +
            '  left: 50%;' +
            '  transform: translate(-50%, -50%);' +
            '  text-align: center;' +
            '  color: #666;' +
            '}' +
            '.pc-iframe-spinner {' +
            '  width: 50px;' +
            '  height: 50px;' +
            '  border: 4px solid #e0e0e0;' +
            '  border-top-color: #ff8c42;' +
            '  border-radius: 50%;' +
            '  animation: pc-spin 0.8s linear infinite;' +
            '  margin: 0 auto 1rem auto;' +
            '}' +
            '@keyframes pc-spin {' +
            '  to { transform: rotate(360deg); }' +
            '}' +
            '' +
            '/* ==================== MOBILE RESPONSIVE ==================== */' +
            '@media screen and (max-width: 768px) {' +
            '  .pc-modal-header {' +
            '    padding: 0.75rem 1rem;' +
            '  }' +
            '  .pc-modal-title h2 {' +
            '    font-size: 1.125rem;' +
            '  }' +
            '  .pc-modal-title p {' +
            '    display: none;' +
            '  }' +
            '}' +
            '' +
            '/* ==================== NOTIFICATION ==================== */' +
            '.pc-configurator-notification {' +
            '  position: fixed;' +
            '  top: 20px;' +
            '  left: 50%;' +
            '  transform: translateX(-50%);' +
            '  padding: 16px 24px;' +
            '  border-radius: 8px;' +
            '  font-size: 16px;' +
            '  font-weight: 500;' +
            '  z-index: 2147483647;' +
            '  display: flex;' +
            '  align-items: center;' +
            '  gap: 12px;' +
            '  box-shadow: 0 4px 12px rgba(0,0,0,0.15);' +
            '  direction: rtl;' +
            '}' +
            '.pc-configurator-notification--success { background: #10b981; color: white; }' +
            '.pc-configurator-notification--error { background: #ef4444; color: white; }' +
            '.pc-configurator-notification--warning { background: #f59e0b; color: white; }' +
            '.pc-configurator-notification__close {' +
            '  background: none;' +
            '  border: none;' +
            '  color: inherit;' +
            '  font-size: 20px;' +
            '  cursor: pointer;' +
            '  padding: 0;' +
            '  line-height: 1;' +
            '  opacity: 0.8;' +
            '}' +
            '.pc-configurator-notification__close:hover { opacity: 1; }';

        var styleEl = document.createElement('style');
        styleEl.id = 'pc-configurator-styles';
        styleEl.type = 'text/css';
        styleEl.appendChild(document.createTextNode(css));
        document.head.appendChild(styleEl);

        logDebug('Styles injected');
    }

    // ============================================================
    // CREATE DOM ELEMENTS
    // ============================================================

    function createElements() {
        // Helper to create button
        function createButton(isMobile, id) {
            var btn = document.createElement('div');
            if (id) btn.id = id;
            btn.className = 'pc-builder-btn' + (isMobile ? ' mobile-btn' : '');
            btn.innerHTML = '<span>' + t.btnText + '</span>';

            btn.onclick = openModal;
            return btn;
        }

        // 1. Desktop placement: .store_categories .pos_1 (Insert after)
        if (!document.getElementById('pc-builder-btn-desktop')) {
            var desktopContainer = document.querySelector('.store_categories');
            if (desktopContainer) {
                var pos1 = desktopContainer.querySelector('.pos_1');
                if (pos1) {
                    var desktopBtn = createButton(false, 'pc-builder-btn-desktop');
                    var liWrapper = document.createElement('li');
                    liWrapper.className = 'pc-builder-li-wrapper';
                    liWrapper.appendChild(desktopBtn);
                    if (pos1.nextSibling) {
                        desktopContainer.insertBefore(liWrapper, pos1.nextSibling);
                    } else {
                        desktopContainer.appendChild(liWrapper);
                    }
                    logDebug('Inserted button (wrapped in li) after .pos_1');
                } else {
                    logDebug('Could not find .pos_1 inside .store_categories');
                }
            } else {
                logDebug('Could not find .store_categories');
            }
        }

        // 2. Mobile placement: #wrapper #homepage_group1 (Insert before)
        if (!document.getElementById('pc-builder-btn-mobile')) {
            var wrapper = document.getElementById('wrapper');
            if (wrapper) {
                var group1 = wrapper.querySelector('#homepage_group1');
                if (group1) {
                    var mobileBtn = createButton(true, 'pc-builder-btn-mobile');
                    group1.parentNode.insertBefore(mobileBtn, group1);
                    logDebug('Inserted button before #homepage_group1');
                } else {
                    logDebug('Could not find #homepage_group1 inside #wrapper');
                }
            } else {
                logDebug('Could not find #wrapper');
            }
        } else {
            logDebug('Mobile button already exists');
        }

        // Create Modal
        var modal = document.createElement('div');
        modal.id = 'pc-builder-modal';
        modal.innerHTML = '' +
            '<div class="pc-modal-content">' +
            '  <div class="pc-modal-header">' +
            '    <div class="pc-modal-title">' +
            '      <div>' +
            '        <h2>' + t.modalTitle + '</h2>' +
            '        <p>' + t.modalSubtitle + '</p>' +
            '      </div>' +
            '    </div>' +
            '    <button class="pc-modal-close" id="pc-modal-close-btn">×</button>' +
            '  </div>' +
            '  <div class="pc-modal-body">' +
            '    <div class="pc-iframe-loading" id="pc-iframe-loading">' +
            '      <div class="pc-iframe-spinner"></div>' +
            '      <div>' + t.loading + '</div>' +
            '    </div>' +
            '  </div>' +
            '</div>';
        document.body.appendChild(modal);

        var closeBtn = document.getElementById('pc-modal-close-btn');
        if (closeBtn) {
            closeBtn.onclick = closeModal;
        }

        modal.onclick = function (e) {
            if (e.target === modal) {
                closeModal();
            }
        };

        document.addEventListener('keydown', function (e) {
            var keyCode = e.keyCode || e.which;
            if (keyCode === 27 && modalOpen) {
                closeModal();
            }
        });

        logDebug('DOM elements created');
    }

    // ============================================================
    // MODAL CONTROLS
    // ============================================================

    function openModal() {
        modalOpen = true;

        var modal = document.getElementById('pc-builder-modal');

        if (modal) {
            modal.classList.add('active');
        }

        document.body.style.overflow = 'hidden';

        if (!iframeElement) {
            createIframe();
        }

        logDebug('Modal opened');

        if (typeof gtag === 'function') {
            try {
                gtag('event', 'pc_builder_opened', { event_category: 'engagement' });
            } catch (err) {}
        }
    }

    function closeModal() {
        modalOpen = false;

        var modal = document.getElementById('pc-builder-modal');

        if (modal) {
            modal.classList.remove('active');
        }

        document.body.style.overflow = '';

        logDebug('Modal closed');
    }

    // ============================================================
    // IFRAME MANAGEMENT
    // ============================================================

    function createIframe() {
        var modalBody = document.querySelector('.pc-modal-body');
        if (!modalBody) return;

        iframeElement = document.createElement('iframe');
        iframeElement.id = 'pc-configurator-iframe';

        var urlObj;
        try {
            urlObj = new URL(CONFIG.iframeUrl);
            urlObj.searchParams.set('lang', currentLang);
            iframeElement.src = urlObj.toString();
        } catch (e) {
            var separator = CONFIG.iframeUrl.indexOf('?') !== -1 ? '&' : '?';
            iframeElement.src = CONFIG.iframeUrl + separator + 'lang=' + currentLang;
        }

        iframeElement.setAttribute('scrolling', 'auto');
        iframeElement.setAttribute('frameborder', '0');
        iframeElement.setAttribute('allowfullscreen', 'true');

        iframeElement.onload = function () {
            var loading = document.getElementById('pc-iframe-loading');
            if (loading) {
                loading.style.display = 'none';
            }
            logDebug('Iframe loaded');
        };

        modalBody.appendChild(iframeElement);
        logDebug('Iframe created');
    }

    // ============================================================
    // MESSAGE HANDLING (from iframe)
    // ============================================================

    function handleMessage(event) {
        var data = event.data;
        if (!data || typeof data.type !== 'string') {
            return;
        }

        logDebug('Message received from iframe:', data);

        switch (data.type) {
            case 'CONFIGURATOR_READY':
                logDebug('Configurator is ready');
                if (window.location.hostname === 'alufshop.konimbo.co.il') {
                    if (iframeElement && iframeElement.contentWindow) {
                        logDebug('Sending ADMIN_MODE to iframe:', iframeElement.src);
                        sendToIframe('ADMIN_MODE', {});
                    } else {
                        logDebug('ADMIN_MODE not sent: iframeElement or contentWindow missing');
                    }
                }
                break;

            case 'ADD_TO_CART':
                if (data.payload && data.payload.products) {
                    handleAddToCart(data.payload.products, data.payload.totalPrice);
                }
                break;

            case 'BUILD_PUBLISHED':
                showNotification('success', t.successPublish);
                setTimeout(function () {
                    closeModal();
                    window.location.reload();
                }, 1500);
                break;

            case 'BUILD_PUBLISH_ERROR':
                var errorMsg = (data.payload && data.payload.message) ? data.payload.message : t.errorPublish;
                showNotification('error', errorMsg);
                break;
        }
    }

    // ============================================================
    // CART INTEGRATION
    // ============================================================

    function getStoreName() {
        if (CONFIG.storeName) {
            return CONFIG.storeName;
        }

        try {
            var jStorageRaw = localStorage.getItem('jStorage');
            if (jStorageRaw) {
                var jStorage = JSON.parse(jStorageRaw);
                var allKeys = Object.keys(jStorage);

                var cartKeys = allKeys.filter(function (k) {
                    return k.indexOf('cart_') === 0 && k !== 'cart_www';
                });

                if (cartKeys.length > 0) {
                    var detected = cartKeys[0].replace('cart_', '');
                    return detected;
                }
            }
        } catch (e) {}

        var hostname = window.location.hostname;
        var domainMappings = {
            'aluf.co.il': 'alufshop',
            'www.aluf.co.il': 'alufshop'
        };
        if (domainMappings[hostname]) {
            return domainMappings[hostname];
        }

        if (hostname.indexOf('.konimbo.co.il') > -1) {
            var subdomain = hostname.split('.')[0];
            return subdomain;
        }

        return 'alufshop';
    }

    function getCookieDomain() {
        var hostname = window.location.hostname;

        if (hostname.indexOf('aluf.co.il') > -1) {
            return '.aluf.co.il';
        }

        if (hostname.indexOf('.konimbo.co.il') > -1) {
            return '.konimbo.co.il';
        }

        return hostname;
    }

    function resetCartProducts(sharedJStorage) {
        try {
            var storeName = getStoreName();
            var cartKey = 'cart_' + storeName;

            localStorage.setItem('order_items', '[]');

            if (sharedJStorage) {
                sharedJStorage[cartKey] = '';
            }

            document.cookie = 'num_of_cart_items=0; path=/; domain=' + getCookieDomain();

        } catch (e) {}
    }

    function handleAddToCart(products, totalPrice) {
        logDebug('Adding products to cart:', products);

        var jStorageRaw = localStorage.getItem('jStorage');
        var sharedJStorage;
        try {
            sharedJStorage = jStorageRaw ? JSON.parse(jStorageRaw) : { '__jstorage_meta': { 'CRC32': {}, 'TTL': {} } };
        } catch (e) {
            sharedJStorage = { '__jstorage_meta': { 'CRC32': {}, 'TTL': {} } };
        }

        resetCartProducts(sharedJStorage);

        var successCount = 0;
        var failCount = 0;
        var currentIndex = 0;

        function addNextProduct() {
            if (currentIndex >= products.length) {
                onCartComplete(successCount, failCount, totalPrice, sharedJStorage);
                return;
            }

            var product = products[currentIndex];
            currentIndex++;

            addSingleProductToCart(product, sharedJStorage, function (success) {
                if (success) {
                    successCount++;
                    logDebug('Added to cart: ' + product.title);
                } else {
                    failCount++;
                }
                addNextProduct();
            });
        }

        addNextProduct();
    }

    function onCartComplete(successCount, failCount, totalPrice, sharedJStorage) {

        if (sharedJStorage) {
            var storeName = getStoreName();
            var cartKey = 'cart_' + storeName;

            var crcValue = '2.' + Math.floor(Math.random() * 10000000000);
            if (!sharedJStorage['__jstorage_meta']) {
                sharedJStorage['__jstorage_meta'] = { 'CRC32': {}, 'TTL': {} };
            }
            if (!sharedJStorage['__jstorage_meta']['CRC32']) {
                sharedJStorage['__jstorage_meta']['CRC32'] = {};
            }
            sharedJStorage['__jstorage_meta']['CRC32'][cartKey] = crcValue;

            localStorage.setItem('jStorage', JSON.stringify(sharedJStorage));
            localStorage.setItem('jStorage_update', (+new Date()).toString());

            if (typeof jQuery !== 'undefined' && typeof jQuery.jStorage !== 'undefined') {
                try {
                    jQuery.jStorage.reInit();
                } catch (e) {}
            }
        }

        sendToIframe('CART_UPDATED', {
            success: failCount === 0,
            cartTotal: totalPrice
        });

        if (failCount === 0) {
            showNotification('success', successCount + t.successCart);

            setTimeout(function () {
                closeModal();
                window.location.reload();
            }, 1500);

        } else if (successCount > 0) {
            showNotification('warning', successCount + t.warningCartAdded + failCount + t.warningCartFailed);
        } else {
            showNotification('error', t.errorCart);
        }
    }

    function addSingleProductToCart(product, sharedJStorage, callback) {
        try {
            var orderItemsRaw = localStorage.getItem('order_items');
            var orderItems = [];

            if (orderItemsRaw) {
                try {
                    orderItems = JSON.parse(orderItemsRaw);
                    if (!Array.isArray(orderItems)) {
                        orderItems = [];
                    }
                } catch (e) {
                    orderItems = [];
                }
            }

            var productId = String(product.id);
            var quantity = product.quantity || 1;

            var existingIndex = -1;
            for (var i = 0; i < orderItems.length; i++) {
                if (String(orderItems[i].item_id) === productId) {
                    existingIndex = i;
                    break;
                }
            }

            if (existingIndex > -1) {
                orderItems[existingIndex].quantity = (orderItems[existingIndex].quantity || 1) + quantity;
            } else {
                var newItem = {
                    item_id: productId,
                    item_name: product.title || '',
                    price: product.price || 0,
                    quantity: quantity,
                    item_category: product.category || '',
                    item_brand: product.brand || '',
                    item_image: product.image || ''
                };

                orderItems.push(newItem);
            }

            localStorage.setItem('order_items', JSON.stringify(orderItems));

            var totalItems = orderItems.reduce(function (sum, item) {
                return sum + (item.quantity || 1);
            }, 0);
            document.cookie = 'num_of_cart_items=' + totalItems + '; path=/; domain=' + getCookieDomain();

            updateJStorageCart(product, sharedJStorage);

            if (typeof jQuery !== 'undefined') {
                jQuery(document).trigger('cart:updated');
                jQuery(document).trigger('cartUpdated');
                jQuery(document).trigger('order_items:updated');
            }

            if (typeof window.refreshCart === 'function') {
                window.refreshCart();
            }
            if (typeof window.updateCart === 'function') {
                window.updateCart();
            }
            if (typeof window.update_cart === 'function') {
                window.update_cart();
            }

            callback(true);

        } catch (e) {
            callback(false);
        }
    }

    function updateJStorageCart(product, sharedJStorage) {
        try {
            var storeName = getStoreName();
            var cartKey = 'cart_' + storeName;

            var quantity = product.quantity || 1;
            var price = product.price || 0;
            var priceFormatted = price.toLocaleString('he-IL') + ' ₪';
            var imageUrl = product.image || '';
            var title = product.title || '';
            var productId = String(product.id);

            var tr = document.createElement('tr');
            tr.setAttribute('data-id', 'item_id_' + productId);
            tr.setAttribute('style', 'height: auto; max-height: 999px;');

            var td1 = document.createElement('td');
            var qtyHidden = document.createElement('div');
            qtyHidden.className = 'quantity_step_value_in_cart';
            qtyHidden.style.display = 'none';
            qtyHidden.textContent = '1';
            var qtyDiv = document.createElement('div');
            qtyDiv.className = 'quantity';
            qtyDiv.setAttribute('tabindex', '0');
            qtyDiv.setAttribute('aria-live', 'polite');
            qtyDiv.textContent = String(quantity);
            var btnDiv = document.createElement('div');
            btnDiv.className = 'cart_small_button';
            var aReduce = document.createElement('a');
            aReduce.className = 'reduce';
            aReduce.setAttribute('role', 'button');
            aReduce.setAttribute('aria-label', title);
            aReduce.setAttribute('tabindex', '0');
            aReduce.textContent = '-';
            var aPlus = document.createElement('a');
            aPlus.className = 'plus';
            aPlus.setAttribute('role', 'button');
            aPlus.setAttribute('aria-label', title);
            aPlus.setAttribute('tabindex', '0');
            aPlus.textContent = '+';
            btnDiv.appendChild(aReduce);
            btnDiv.appendChild(aPlus);
            td1.appendChild(qtyHidden);
            td1.appendChild(qtyDiv);
            td1.appendChild(btnDiv);

            var td2 = document.createElement('td');
            td2.className = 'img_item';
            var img = document.createElement('img');
            img.setAttribute('data-lazy', 'false');
            img.src = imageUrl;
            td2.appendChild(img);

            var td3 = document.createElement('td');
            td3.className = 'title';
            var aTitle = document.createElement('a');
            aTitle.href = '/items/' + productId;
            aTitle.setAttribute('tabindex', '0');
            aTitle.textContent = title;
            td3.appendChild(aTitle);

            var td4 = document.createElement('td');
            td4.className = 'delete_btn';
            var aDelete = document.createElement('a');
            aDelete.setAttribute('role', 'button');
            aDelete.setAttribute('aria-label', title);
            aDelete.setAttribute('tabindex', '0');
            td4.appendChild(aDelete);

            var td5 = document.createElement('td');
            td5.className = 'price_item_x';
            td5.setAttribute('tabindex', '0');
            td5.textContent = priceFormatted;

            tr.appendChild(td1);
            tr.appendChild(td2);
            tr.appendChild(td3);
            tr.appendChild(td4);
            tr.appendChild(td5);

            var cartRowHtml = tr.outerHTML;

            var jStorage = sharedJStorage;
            if (!jStorage) {
                return;
            }

            var currentCart = jStorage[cartKey] || '';

            if (currentCart.indexOf('data-id="item_id_' + productId + '"') === -1) {
                jStorage[cartKey] = currentCart + cartRowHtml;
            }
        } catch (e) {}
    }

    function updateCartDisplay() {
        var cartCountElements = document.querySelectorAll('.cart-count, .cart-counter, #cart-count, .items_in_cart, .cart_items_count, .header_cart_count');
        var jStorageRaw = localStorage.getItem('jStorage');

        if (jStorageRaw) {
            try {
                var jStorage = JSON.parse(jStorageRaw);
                var storeName = getStoreName();
                var cartKey = 'cart_' + storeName;
                var cartHtml = jStorage[cartKey] || '';

                var matches = cartHtml.match(/data-id="item_id_/g);
                var count = matches ? matches.length : 0;

                var i;
                for (i = 0; i < cartCountElements.length; i++) {
                    cartCountElements[i].textContent = count;
                }

                var cartContainer = document.querySelector('.cart_items_list, .cart_table, #cart_items, .small_cart_items');
                if (cartContainer) {
                    cartContainer.innerHTML = cartHtml;
                    logDebug('Updated cart container HTML directly');
                }

                try {
                    var storageEvent = document.createEvent('StorageEvent');
                    storageEvent.initStorageEvent('storage', false, false, 'jStorage', null, jStorageRaw, window.location.href, localStorage);
                    window.dispatchEvent(storageEvent);
                } catch (e) {
                    window.dispatchEvent(new Event('storage'));
                }

                if (typeof jQuery !== 'undefined') {
                    jQuery(document).trigger('cart:updated');
                    jQuery(document).trigger('cartUpdated');
                    jQuery('.cart_items_list').trigger('change');

                    if (typeof jQuery.fn.updateCart === 'function') {
                        jQuery('.cart_container').updateCart();
                    }

                    if (typeof jQuery.jStorage !== 'undefined') {
                        jQuery.jStorage.reInit();
                        jQuery.jStorage.listenKeyChange(cartKey, function () {
                            logDebug('jStorage key change detected');
                        });
                    }
                }

                var customEvent;
                if (typeof CustomEvent === 'function') {
                    customEvent = new CustomEvent('pc-configurator-cart-updated', { detail: { count: count } });
                } else {
                    customEvent = document.createEvent('CustomEvent');
                    customEvent.initCustomEvent('pc-configurator-cart-updated', true, true, { count: count });
                }
                document.dispatchEvent(customEvent);

            } catch (e) {
                logDebug('Error updating cart display');
            }
        }
    }

    function sendToIframe(type, payload) {
        if (iframeElement && iframeElement.contentWindow) {
            var message = { type: type, payload: payload || {} };
            iframeElement.contentWindow.postMessage(message, '*');
        }
    }

    // ============================================================
    // UI HELPERS
    // ============================================================

    function showNotification(type, message) {
        if (typeof window.showFlashMessage === 'function') {
            window.showFlashMessage(message, type);
            return;
        }

        var notification = document.createElement('div');
        notification.className = 'pc-configurator-notification pc-configurator-notification--' + type;
        var msgSpan = document.createElement('span');
        msgSpan.textContent = message;
        var closeBtn = document.createElement('button');
        closeBtn.className = 'pc-configurator-notification__close';
        closeBtn.textContent = '×';
        notification.appendChild(msgSpan);
        notification.appendChild(closeBtn);

        document.body.appendChild(notification);

        closeBtn.onclick = function () {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        };

        setTimeout(function () {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
    }

    function updateCartCounter() {
        updateCartDisplay();
    }

    // ============================================================
    // INITIALIZATION
    // ============================================================

    function init() {
        var checkoutUrl = sessionStorage.getItem('pc_configurator_checkout');
        if (checkoutUrl) {
            sessionStorage.removeItem('pc_configurator_checkout');
            setTimeout(function () {
                window.location.href = checkoutUrl;
            }, 2000);
            return;
        }

        injectStyles();
        createElements();
        window.addEventListener('message', handleMessage);
        logDebug('PC Configurator Modal Integration initialized');
    }

    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1);
    } else {
        document.addEventListener('DOMContentLoaded', init);
    }

    // ============================================================
    // EXPOSE API
    // ============================================================

    window.PCConfiguratorIntegration = {
        open: openModal,
        close: closeModal,
        isOpen: function () { return modalOpen; }
    };

})(window, document);
