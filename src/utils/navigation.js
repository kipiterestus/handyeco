/**
 * Client-side SPA navigation helper for SEO landing pages
 */
export function navigateTo(path) {
  if (window.location.pathname === path) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function handleInternalLinkClick(e, path) {
  // If holding Ctrl, Cmd, or middle click, allow default browser behavior (new tab)
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
    return;
  }
  e.preventDefault();
  navigateTo(path);
}
