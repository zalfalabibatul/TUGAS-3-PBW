Vue.component('laporan-page', {
  template: `
    <div class="fade-in">

      <!-- HOME TAB -->
      <div v-if="subTab === 'home'">
        <div class="info-banner-blue">
          <div class="page-header-left">
            <div class="page-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <div>
              <h1 class="page-header-title">Laporan</h1>
              <p class="page-header-subtitle">Pusat akses laporan bahan ajar SITTA</p>
            </div>
          </div>
          <button type="button" class="btn-back-dash" @click="goToDashboard">
            Dashboard
          </button>
        </div>
        <div class="report-grid">
          <div class="selector-box">
            <h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;vertical-align:middle;color:var(--navy-600)"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              Monitoring List Bahan Ajar
            </h3>
            <p>Memantau stok, safety stock, dan daftar item yang perlu reorder.</p>
            <button type="button" @click="openMonitoring">Buka Monitoring</button>
          </div>
          <div class="selector-box">
            <h3>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;vertical-align:middle;color:var(--navy-600)"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
              Rekap Bahan Ajar
            </h3>
            <p>Melihat ringkasan total judul, qty, dan nilai stok per UT-Daerah.</p>
            <button type="button" @click="openRekap">Buka Rekap</button>
          </div>
        </div>
      </div>

      <!-- MONITORING TAB -->
      <div v-else-if="subTab === 'monitoring'">
        <div class="info-banner-blue">
          <div class="page-header-left">
            <div class="page-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
            </div>
            <div>
              <h1 class="page-header-title">Monitoring List Bahan Ajar</h1>
              <p class="page-header-subtitle">Pemantauan stok, safety stock, dan kebutuhan reorder</p>
            </div>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button type="button" class="btn-back-dash" @click="subTab = 'home'">
              Kembali
            </button>
            <button type="button" class="btn-back-dash" @click="goToDashboard">
              Dashboard
            </button>
          </div>
        </div>
        <div class="monitor-toolbar">
          <input type="text" v-model="mKeyword" placeholder="Cari kode / judul">
          <select v-model="mUpbjj">
            <option value="">Semua UT-Daerah</option>
            <option v-for="u in upbjjOptions" :key="u" :value="u" v-text="u"></option>
          </select>
          <select v-model="mStatus">
            <option value="">Semua Kondisi</option>
            <option value="low">Perlu Reorder (qty &lt; safety)</option>
          </select>
          <button type="button" @click="resetMonitoring">Reset</button>
        </div>
        <div class="monitor-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Kode</th><th>Judul</th><th>UT-Daerah</th>
                <th>Stock</th><th>Safety</th><th>Selisih</th><th>Status</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="filteredMonitoring.length === 0">
                <td colspan="7" class="monitor-empty">Data monitoring tidak ditemukan.</td>
              </tr>
              <tr v-for="item in filteredMonitoring" :key="item.kode">
                <td v-text="item.kode"></td>
                <td v-text="item.judul"></td>
                <td v-text="item.upbjj || '-'"></td>
                <td v-text="item.qty"></td>
                <td v-text="item.safety"></td>
                <td v-text="selisih(item)"></td>
                <td>
                  <span v-if="isLow(item)" class="monitor-status monitor-low">Perlu Reorder</span>
                  <span v-else class="monitor-status monitor-ok">Aman</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="monitor-summary">
          <span><strong>Total Item:</strong> {{ filteredMonitoring.length }}</span>
          <span><strong>Total Stock:</strong> {{ monitoringTotalQty }}</span>
          <span><strong>Perlu Reorder:</strong> {{ monitoringLowCount }}</span>
        </div>
      </div>

      <!-- REKAP TAB -->
      <div v-else>
        <div class="info-banner-blue">
          <div class="page-header-left">
            <div class="page-header-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
            </div>
            <div>
              <h1 class="page-header-title">Rekap Bahan Ajar</h1>
              <p class="page-header-subtitle">Ringkasan total stok dan nilai per UT-Daerah</p>
            </div>
          </div>
          <div style="display:flex;gap:10px;flex-wrap:wrap;">
            <button type="button" class="btn-back-dash" @click="subTab = 'home'">
              Kembali
            </button>
            <button type="button" class="btn-back-dash" @click="goToDashboard">
              Dashboard
            </button>
          </div>
        </div>
        <div class="rekap-cards">
          <div class="rekap-card">
            <div class="label">Total Judul</div>
            <div class="value" v-text="totalJudul"></div>
          </div>
          <div class="rekap-card">
            <div class="label">Jumlah Stok</div>
            <div class="value" v-text="totalQty"></div>
          </div>
          <div class="rekap-card">
            <div class="label">Total Nilai Stok</div>
            <div class="value" style="font-size:20px" v-text="toRupiah(totalNilai)"></div>
          </div>
        </div>
        <div class="rekap-table-wrap">
          <table>
            <thead>
              <tr>
                <th>UT-Daerah</th><th>Jumlah Judul</th>
                <th>Total Semua Stok</th><th>Total Nilai Stok</th><th>Item Menipis</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(val, upbjj) in grouped" :key="upbjj">
                <td v-text="upbjj"></td>
                <td v-text="val.judul"></td>
                <td v-text="val.qty"></td>
                <td v-text="toRupiah(val.nilai)"></td>
                <td v-text="val.low"></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  `,
  props: {
    items: { type: Array, required: true }
  },
  data: function() {
    return {
      subTab: 'home',
      mKeyword: '',
      mUpbjj: '',
      mStatus: ''
    };
  },
  computed: {
    upbjjOptions: function() {
      var arr = [];
      (this.items || []).forEach(function(item) {
        if (item.upbjj && arr.indexOf(item.upbjj) === -1) arr.push(item.upbjj);
      });
      return arr.sort(function(a, b) { return a.localeCompare(b); });
    },
    filteredMonitoring: function() {
      var data = (this.items || []).slice();
      var keyword = (this.mKeyword || '').trim().toLowerCase();
      var upbjj = this.mUpbjj;
      var status = this.mStatus;
      if (keyword) {
        data = data.filter(function(item) {
          return (item.kode || '').toLowerCase().indexOf(keyword) !== -1 ||
                 (item.judul || '').toLowerCase().indexOf(keyword) !== -1;
        });
      }
      if (upbjj) data = data.filter(function(item) { return item.upbjj === upbjj; });
      if (status === 'low') data = data.filter(function(item) { return Number(item.qty) < Number(item.safety); });
      return data;
    },
    monitoringTotalQty: function() {
      return this.filteredMonitoring.reduce(function(s, i) { return s + Number(i.qty || 0); }, 0);
    },
    monitoringLowCount: function() {
      return this.filteredMonitoring.filter(function(i) { return Number(i.qty) < Number(i.safety); }).length;
    },
    grouped: function() {
      var map = {};
      (this.items || []).forEach(function(item) {
        var key = item.upbjj || 'Tidak Diketahui';
        if (!map[key]) map[key] = { judul: 0, qty: 0, nilai: 0, low: 0 };
        map[key].judul += 1;
        map[key].qty += Number(item.qty || 0);
        map[key].nilai += Number(item.qty || 0) * Number(item.harga || 0);
        if (Number(item.qty) < Number(item.safety)) map[key].low += 1;
      });
      var sorted = {};
      Object.keys(map).sort(function(a, b) { return a.localeCompare(b); }).forEach(function(k) { sorted[k] = map[k]; });
      return sorted;
    },
    totalJudul: function() { return (this.items || []).length; },
    totalQty: function() {
      return (this.items || []).reduce(function(s, i) { return s + Number(i.qty || 0); }, 0);
    },
    totalNilai: function() {
      return (this.items || []).reduce(function(s, i) { return s + Number(i.qty || 0) * Number(i.harga || 0); }, 0);
    }
  },
  methods: {
    goToDashboard: function() { this.$emit('navigate', 'dashboard'); },
    openMonitoring: function() { this.subTab = 'monitoring'; },
    openRekap: function() { this.subTab = 'rekap'; },
    resetMonitoring: function() { this.mKeyword = ''; this.mUpbjj = ''; this.mStatus = ''; },
    isLow: function(item) { return Number(item.qty) < Number(item.safety); },
    selisih: function(item) { return Number(item.qty || 0) - Number(item.safety || 0); },
    toRupiah: function(val) {
      return 'Rp' + Number(val || 0).toLocaleString('id-ID');
    }
  }
});
