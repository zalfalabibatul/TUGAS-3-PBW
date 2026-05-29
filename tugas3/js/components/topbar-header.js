Vue.component('topbar-header', {
  template: `
    <div class="topbar">
      <div class="topbar-left">
        <div class="topbar-date">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;vertical-align:middle;color:var(--navy-500)">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          <strong v-text="today"></strong>
        </div>
        <div class="topbar-divider"></div>
        <div class="topbar-search">
          <svg class="search-icon" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Cari sesuatu...">
        </div>
      </div>
      <div class="topbar-right">
        <div class="topbar-notif" title="Notifikasi">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
        </div>
        <div class="topbar-user-chip">
          <div class="topbar-avatar" v-text="userName.charAt(0).toUpperCase()"></div>
          <span class="topbar-avatar-name" v-text="userName"></span>
        </div>
      </div>
    </div>
  `,
  props: {
    userName: String,
    today: String
  }
});
