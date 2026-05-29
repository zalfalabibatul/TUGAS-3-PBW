Vue.component('dashboard-home', {
  template: `
    <div class="fade-in">
      <div class="hero-greeting">
        <div class="hero-glow-1"></div>
        <div class="hero-glass">
          <div class="hero-ut-logo-wrap">
            <img src="assets/img/UT.png" alt="Universitas Terbuka" class="hero-ut-logo" onerror="this.style.display='none'">
          </div>
          <h1 class="hero-greeting-text">{{ greeting }}, {{ userName }}!</h1>
          <p class="hero-subtitle">Selamat datang di <strong>SITTA</strong> — Sistem Informasi Tracking dan Transaksi Ajar. Pantau dan kelola bahan ajar Universitas Terbuka secara real-time.</p>
          <div class="hero-actions">
            <button class="hero-btn-primary" @click="$emit('navigate','stok')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              Kelola Stok
            </button>
            <button class="hero-btn-secondary" @click="$emit('navigate','tracking')">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
              Tracking DO
            </button>
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card fade-up stagger-1">
          <div class="stat-top">
            <div class="stat-icon-box icon-total">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#6366f1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
            </div>
          </div>
          <div class="stat-number">{{ stats.total }}</div>
          <div class="stat-label">Total Bahan Ajar</div>
        </div>
        <div class="stat-card fade-up stagger-2">
          <div class="stat-top">
            <div class="stat-icon-box icon-safe">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            </div>
          </div>
          <div class="stat-number">{{ stats.aman }}</div>
          <div class="stat-label">Stok Aman</div>
        </div>
        <div class="stat-card fade-up stagger-3">
          <div class="stat-top">
            <div class="stat-icon-box icon-low">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
          </div>
          <div class="stat-number">{{ stats.menipis }}</div>
          <div class="stat-label">Stok Menipis</div>
        </div>
        <div class="stat-card fade-up stagger-4">
          <div class="stat-top">
            <div class="stat-icon-box icon-empty">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            </div>
          </div>
          <div class="stat-number">{{ stats.kosong }}</div>
          <div class="stat-label">Stok Kosong</div>
        </div>
        <div class="stat-card fade-up stagger-5">
          <div class="stat-top">
            <div class="stat-icon-box icon-value">
              <span style="font-size:16px;font-weight:800;color:#10b981;letter-spacing:-1px;">Rp</span>
            </div>
          </div>
          <div class="stat-number" style="font-size:18px;">{{ formatRupiah(stats.totalNilai) }}</div>
          <div class="stat-label">Total Nilai Stok</div>
        </div>
      </div>

      <div class="dashboard-grid">
        <div class="card fade-up stagger-3">
          <div class="card-header">
            <h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;vertical-align:middle;color:#f59e0b"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Bahan Ajar Perlu Reorder
            </h3>
            <span class="card-badge-count" v-if="reorderList.length" v-text="reorderList.length + ' item'"></span>
          </div>
          <div class="card-body">
            <div class="table-wrap" v-if="reorderList.length">
              <table class="modern">
                <thead><tr><th>Kode</th><th>Nama Bahan Ajar</th><th>Stok</th><th>Safety</th><th>Status</th></tr></thead>
                <tbody>
                  <tr v-for="item in reorderList" :key="item.kode">
                    <td><span class="cell-code" v-text="item.kode"></span></td>
                    <td><span class="cell-name" v-text="item.nama || item.judul"></span></td>
                    <td v-text="item.qty"></td>
                    <td v-text="item.safety"></td>
                    <td><span :class="getBadgeClass(item)" v-text="getStatusText(item)"></span></td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div v-else class="empty-state">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
              <p>Semua stok dalam kondisi aman</p>
            </div>
          </div>
        </div>

        <div class="card fade-up stagger-4">
          <div class="card-header">
            <h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;vertical-align:middle;color:var(--navy-600)"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Ringkasan Stok
            </h3>
            <button class="card-link-btn" @click="$emit('navigate','stok')">Lihat Semua</button>
          </div>
          <div class="card-body">
            <div class="table-wrap">
              <table class="modern">
                <thead><tr><th>Kode</th><th>Nama</th><th>Stok</th><th>Status</th></tr></thead>
                <tbody>
                  <tr v-for="item in summaryItems" :key="item.kode">
                    <td><span class="cell-code" v-text="item.kode"></span></td>
                    <td><span class="cell-name" v-text="item.nama || item.judul"></span></td>
                    <td v-text="item.qty"></td>
                    <td><span :class="getBadgeClass(item)" v-text="getStatusText(item)"></span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  props: {
    items: Array,
    userName: String
  },
  computed: {
    greeting: function() {
      return getGreeting();
    },
    stats: function() {
      var total = this.items.length;
      var aman = this.items.filter(function(i) { return i.qty >= i.safety; }).length;
      var menipis = this.items.filter(function(i) { return i.qty > 0 && i.qty < i.safety; }).length;
      var kosong = this.items.filter(function(i) { return i.qty === 0; }).length;
      var totalNilai = this.items.reduce(function(sum, i) { return sum + (i.harga || 0) * i.qty; }, 0);
      return { total: total, aman: aman, menipis: menipis, kosong: kosong, totalNilai: totalNilai };
    },
    reorderList: function() {
      return this.items
        .filter(function(i) { return i.qty < i.safety; })
        .sort(function(a, b) {
          if (a.qty === 0 && b.qty !== 0) return -1;
          if (a.qty !== 0 && b.qty === 0) return 1;
          return a.qty - b.qty;
        });
    },
    summaryItems: function() {
      return this.items.slice(0, 8);
    }
  },
  methods: {
    formatRupiah: function(val) {
      return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(Number(val) || 0);
    },
    getStatusText: function(item) {
      if (item.qty === 0) return 'Kosong';
      return item.qty < item.safety ? 'Menipis' : 'Aman';
    },
    getBadgeClass: function(item) {
      if (item.qty === 0) return 'badge badge-danger';
      return item.qty < item.safety ? 'badge badge-warning' : 'badge badge-success';
    }
  }
});
