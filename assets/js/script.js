// const menuData = [
//     {
//         label: 'Product',
//         hasDropdown: true,
//         items: [
//             { title: 'Analytics', href: '#analytics' },
//             { title: 'Automation', href: '#automation' },
//             { title: 'Integrations', href: '#integrations' },
//             { title: 'API', href: '#api' }
//         ]
//     },
//     {
//         label: 'Use Cases',
//         hasDropdown: true,
//         items: [
//             { title: 'Marketing', href: '#marketing' },
//             { title: 'Sales', href: '#sales' },
//             { title: 'Support', href: '#support' }
//         ]
//     },
//     { label: 'Compare', hasDropdown: false, href: '#compare' },
//     {
//         label: 'Resources',
//         hasDropdown: true,
//         items: [
//             { title: 'Blog', href: '#blog' },
//             { title: 'Docs', href: '#docs' },
//             { title: 'Community', href: '#community' },
//             {
//                 title: 'Guides',
//                 hasDropdown: true,
//                 items: [
//                     { title: 'Getting Started', href: '#getting-started' },
//                     { title: 'Advanced', href: '#advanced' },
//                     {
//                         title: 'Tutorials',
//                         hasDropdown: true,
//                         items: [
//                             { title: 'Video Tutorials', href: '#video' },
//                             { title: 'Written Tutorials', href: '#written' },
//                             {
//                                 title: 'Deep Dive',
//                                 hasDropdown: true,
//                                 items: [
//                                     { title: 'Architecture', href: '#architecture' },
//                                     { title: 'Best Practices', href: '#best-practices' }
//                                 ]
//                             }
//                         ]
//                     }
//                 ]
//             }
//         ]
//     },
//     { label: 'Pricing', hasDropdown: false, href: '#pricing' }
// ];

// function renderDropdownItems(items, level = 1) {
//     if (level > 4) return '';
//     return items.map(item => {
//         if (item.hasDropdown && item.items) {
//             return `<div class="dropdown__item dropdown__item--nested">
//             <span class="dropdown__nested-arrow">
//               ${item.title}
//               <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
//             </span>
//             <div class="dropdown__nested">
//               ${renderDropdownItems(item.items, level + 1)}
//             </div>
//           </div>`;
//         }
//         return `<a href="${item.href || '#'}" class="dropdown__item">${item.title}</a>`;
//     }).join('');
// }

// function renderDesktopMenu() {
//     const navMenu = document.getElementById('navMenu');
//     navMenu.innerHTML = menuData.map((item, index) => {
//         if (item.hasDropdown) {
//             return `<li class="nav-menu__item" data-index="${index}">
//             <a href="#" class="nav-menu__link">
//               ${item.label}
//               <svg class="nav-menu__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>
//             </a>
//             <div class="dropdown">
//               ${renderDropdownItems(item.items, 1)}
//             </div>
//           </li>`;
//         } else {
//             return `<li class="nav-menu__item"><a href="${item.href || '#'}" class="nav-menu__link">${item.label}</a></li>`;
//         }
//     }).join('');
// }

// function renderMobileMenu() {
//     const mobileMenu = document.getElementById('mobileMenu');
//     mobileMenu.innerHTML = `
//         <div class="mobile-menu__header">
//           <a href="#" class="logo">
//             <div class="logo__icon"></div>
//             <span class="logo__text">Leadvaro</span>
//           </a>
//           <button class="mobile-menu__close" id="mobileCloseBtn" aria-label="Close menu">
//             <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
//           </button>
//         </div>
//         <div class="mobile-menu__scroll" id="mobileMenuScroll">
//           ${renderMobileItems(menuData)}
//         </div>
//         <div class="mobile-menu__actions">
//           <a href="#" class="btn btn--signin">Sign in</a>
//           <a href="#" class="btn btn--primary">Get free Consultation</a>
//         </div>
//       `;
// }

// function renderMobileItems(items, level = 0) {
//     if (level > 4) return '';
//     return items.map((item, idx) => {
//         const uniqueId = `mob-${level}-${idx}-${Math.random().toString(36).substr(2, 5)}`;
//         if (item.hasDropdown && item.items) {
//             return `<div class="mobile-menu__item" id="${uniqueId}">
//             <button class="mobile-menu__link" onclick="toggleMobileAccordion(event, '${uniqueId}')">
//               <span style="padding-left:${level * 12}px">${item.label || item.title}</span>
//               <svg class="mobile-menu__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:18px;height:18px;transition:transform 0.3s"><path d="m6 9 6 6 6-6"/></svg>
//             </button>
//             <div class="mobile-menu__submenu">
//               ${renderMobileItems(item.items, level + 1)}
//             </div>
//           </div>`;
//         }
//         return `<div class="mobile-menu__item">
//           <a href="${item.href || '#'}" class="mobile-menu__link" style="padding-left:${16 + level * 12}px">${item.label || item.title}</a>
//         </div>`;
//     }).join('');
// }

function toggleMobileAccordion(event, id) {
    event.stopPropagation();
    const target = document.getElementById(id);
    if (!target) return;
    target.classList.toggle('mobile-menu__item--active');
}

const mobileToggle = document.getElementById('mobileToggle');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileMenu = document.getElementById('mobileMenu');

function toggleMobileMenu() {
    mobileToggle.classList.toggle('mobile-toggle--active');
    mobileMenu.classList.toggle('mobile-menu--active');
    mobileOverlay.classList.toggle('mobile-overlay--active');
    document.body.style.overflow = mobileMenu.classList.contains('mobile-menu--active') ? 'hidden' : '';
}

mobileToggle.addEventListener('click', toggleMobileMenu);
mobileOverlay.addEventListener('click', toggleMobileMenu);

document.addEventListener('click', (e) => {
    if (e.target.closest('#mobileCloseBtn')) toggleMobileMenu();
});

const navbarInner = document.getElementById('navbarInner');
window.addEventListener('scroll', () => { navbarInner.classList.toggle('navbar__inner--scrolled', window.pageYOffset > 50); });

renderDesktopMenu();
renderMobileMenu();

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (mobileMenu.classList.contains('mobile-menu--active')) toggleMobileMenu();
    }
});