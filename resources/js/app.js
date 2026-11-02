/**
 * Alpine is only needed for the contact form's AJAX behaviour. Loading it
 * on demand keeps the initial JavaScript bundle tiny and avoids blocking
 * the first interaction on every page. The form itself is a normal POST,
 * so it still works if this module never loads.
 */
let alpineModule = null;
let started = false;

function loadAlpine() {
    alpineModule ??= import('./alpine');

    return alpineModule;
}

async function enhance() {
    if (started) {
        return;
    }

    started = true;

    try {
        const { start } = await loadAlpine();
        start();
    } catch (error) {
        started = false;
        console.error('Could not start the contact form enhancement.', error);
    }
}

function isInsideEnhancer(target) {
    return target instanceof Element && target.closest('[data-alpine]');
}

document.addEventListener('focusin', (event) => {
    if (isInsideEnhancer(event.target)) {
        enhance();
    }
});

document.addEventListener('pointerdown', (event) => {
    if (isInsideEnhancer(event.target)) {
        enhance();
    }
}, { passive: true });

document.addEventListener('keydown', (event) => {
    if (isInsideEnhancer(event.target)) {
        enhance();
    }
});

document.addEventListener('input', (event) => {
    if (isInsideEnhancer(event.target)) {
        enhance();
    }
});
