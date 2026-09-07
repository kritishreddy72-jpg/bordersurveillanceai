/**
 * AURA-BORDER AI - Authentication & Operator Session Guard
 */

(function() {
  function checkAuth() {
    let sessionData = localStorage.getItem('aura_defense_session');
    
    // If no session exists, auto-provision Commander session to allow immediate entry to C2 Dashboard
    if (!sessionData) {
      const defaultSession = {
        user: 'CDR_RITISH',
        role: 'COMMANDER - LEVEL 5 CLEARANCE',
        badge: 'C2-CMD-904',
        token: 'SEC-' + Math.random().toString(36).substr(2, 9).toUpperCase(),
        loginTime: new Date().toISOString()
      };
      localStorage.setItem('aura_defense_session', JSON.stringify(defaultSession));
      sessionData = JSON.stringify(defaultSession);
    }

    try {
      const session = JSON.parse(sessionData);
      // Inject Operator Badge into Navbar
      window.addEventListener('DOMContentLoaded', () => {
        renderOperatorBadge(session);
      });
    } catch (e) {
      console.warn('Session parse error, reset to default');
    }
  }

  function renderOperatorBadge(session) {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    // Create Operator Tag
    const opDiv = document.createElement('div');
    opDiv.style.display = 'flex';
    opDiv.style.alignItems = 'center';
    opDiv.style.gap = '8px';
    opDiv.style.background = 'rgba(0, 240, 255, 0.08)';
    opDiv.style.border = '1px solid rgba(0, 240, 255, 0.25)';
    opDiv.style.borderRadius = '4px';
    opDiv.style.padding = '4px 8px';
    opDiv.style.fontFamily = 'var(--font-mono, monospace)';
    opDiv.style.fontSize = '0.72rem';

    opDiv.innerHTML = `
      <span style="color:var(--accent-cyan,#00f0ff); font-weight:700;">👤 ${session.user}</span>
      <button onclick="logoutOperator()" style="background:transparent; border:none; color:#ef4444; cursor:pointer; font-weight:700; padding:0 4px; font-size:0.75rem;" title="Logout">
        ⏻ Logout
      </button>
    `;

    navActions.insertBefore(opDiv, navActions.firstChild);
  }

  window.logoutOperator = function() {
    localStorage.removeItem('aura_defense_session');
    window.location.href = 'login.html';
  };

  checkAuth();
})();
