Vue.component('sidebar-menu', {
  template: `
    <aside class="sidebar" :class="{ collapsed: collapsed }">
      <div class="sidebar-inner">
        <div class="sidebar-brand">
          <div class="logo-box">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
            </svg>
          </div>
          <div class="brand-text">
            <h2>SITTA</h2>
            <div class="brand-sub">Sistem Informasi Bahan Ajar</div>
          </div>
        </div>
        <nav class="sidebar-nav">
          <div class="sidebar-nav-label">Menu Utama</div>
          <div v-for="menu in navMenus" :key="menu.id" class="nav-item" :class="{ active: activeTab === menu.id }" @click="handleNav(menu)">
            <span class="nav-icon" v-html="menu.icon"></span>
            <span class="nav-text" v-text="menu.title"></span>
          </div>
        </nav>
        <div class="sidebar-footer">
          <button class="logout-btn" @click="$emit('logout')">
            <span class="logout-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
            </span>
            <span class="logout-text">Keluar</span>
            <span class="logout-arrow">
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </span>
          </button>
        </div>
        <div class="sidebar-toggle" @click="$emit('toggle-collapse')" :title="collapsed ? 'Perluas' : 'Ciutkan'">
          <svg v-if="!collapsed" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
          <svg v-else width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
        </div>
      </div>
    </aside>
  `,
  props: {
    collapsed: Boolean,
    activeTab: String,
    navMenus: Array
  },
  methods: {
    handleNav: function(menu) {
      this.$emit('navigate', menu.route);
    }
  }
});
