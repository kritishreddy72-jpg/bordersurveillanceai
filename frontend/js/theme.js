/**
 * AURA-BORDER AI - Theme & Light Color Customizer
 * Supports Tactical Dark, Titanium Clean (Light), Arctic Defense (Light),
 * Sandstorm Khaki (Light), and Tactical Sage (Light).
 */

(function() {
  const THEMES = [
    { id: 'tactical-dark', name: '🌑 Tactical Dark', bg: '#070b12', text: '#f1f5f9', accent: '#00f0ff' },
    { id: 'light-titanium', name: '⚪ Titanium Clean (Light)', bg: '#f8fafc', text: '#0f172a', accent: '#0284c7' },
    { id: 'light-arctic', name: '🧊 Arctic Defense (Light)', bg: '#f0f9ff', text: '#0c4a6e', accent: '#0284c7' },
    { id: 'light-sandstorm', name: '🏜️ Sandstorm Khaki (Light)', bg: '#fefce8', text: '#451a03', accent: '#b45309' },
    { id: 'light-sage', name: '🌿 Tactical Sage (Light)', bg: '#f0fdf4', text: '#052e16', accent: '#16a34a' }
  ];

  function applyTheme(themeId) {
    document.documentElement.setAttribute('data-theme', themeId);
    document.body.setAttribute('data-theme', themeId);
    localStorage.setItem('aura_theme', themeId);

    // Update active state in theme dropdown/buttons if present
    const select = document.getElementById('themeSelect');
    if (select) select.value = themeId;

    document.querySelectorAll('.theme-btn').forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-theme') === themeId);
    });
  }

  // Load saved theme immediately
  const savedTheme = localStorage.getItem('aura_theme') || 'tactical-dark';
  document.documentElement.setAttribute('data-theme', savedTheme);

  window.setAuraTheme = applyTheme;
  window.AURA_THEMES = THEMES;

  document.addEventListener('DOMContentLoaded', () => {
    document.body.setAttribute('data-theme', savedTheme);

    // If theme selector exists in HTML, hook it up
    const select = document.getElementById('themeSelect');
    if (select) {
      select.value = savedTheme;
      select.addEventListener('change', (e) => {
        applyTheme(e.target.value);
      });
    }

    // Quick theme swatches if container exists
    const swatchesContainer = document.getElementById('themeSwatches');
    if (swatchesContainer) {
      swatchesContainer.innerHTML = THEMES.map(t => `
        <button class="theme-swatch-btn ${t.id === savedTheme ? 'active' : ''}" 
                data-theme="${t.id}" 
                onclick="window.setAuraTheme('${t.id}')"
                title="${t.name}"
                style="background:${t.bg}; border-color:${t.accent}; color:${t.text};">
          <span style="display:inline-block; width:8px; height:8px; border-radius:50%; background:${t.accent};"></span>
          ${t.name}
        </button>
      `).join('');
    }
  });
})();
