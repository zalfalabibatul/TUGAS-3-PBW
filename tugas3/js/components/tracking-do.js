Vue.component('tracking-do', {
    template: `
    <div class="tracking-wrap">
      <div class="info-banner-blue">
        <div class="page-header-left">
          <div class="page-header-icon">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
          </div>
          <div>
            <h2 class="page-header-title">Tracking Delivery Order</h2>
            <p class="page-header-subtitle">Pantau dan kelola pengiriman bahan ajar</p>
          </div>
        </div>
        <button type="button" class="btn-back-dash" @click="goToDashboard">
          Dashboard
        </button>
      </div>

      <p class="tracking-summary" v-html="doSummaryText"></p>

      <div v-if="saveMessage" class="alert-success">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
        <span v-text="saveMessage"></span>
      </div>

      <div class="tracking-form-card">
        <h3>
          <span class="form-plus">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="3" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          </span>
          Tambah Delivery Order Baru
        </h3>
        <form @submit.prevent="addDO">
          <div class="tracking-form-grid">
            <div class="form-group">
              <label class="f-label" for="do-nomor">Nomor DO (otomatis)</label>
              <input id="do-nomor" :value="nextDoNumber" readonly class="input-readonly">
            </div>
            <div class="form-group">
              <label class="f-label" for="do-nim">NIM Mahasiswa</label>
              <input id="do-nim" v-model="newDO.nim" :class="{ 'input-error': formErrors.nim }" placeholder="Masukkan NIM">
              <span v-if="formErrors.nim" class="form-error" v-text="formErrors.nim"></span>
            </div>
            <div class="form-group">
              <label class="f-label" for="do-nama">Nama Mahasiswa</label>
              <input id="do-nama" v-model="newDO.nama" :class="{ 'input-error': formErrors.nama }" placeholder="Masukkan nama lengkap">
              <span v-if="formErrors.nama" class="form-error" v-text="formErrors.nama"></span>
            </div>
            <div class="form-group">
              <label class="f-label" for="do-ekspedisi">Ekspedisi</label>
              <select id="do-ekspedisi" v-model="newDO.ekspedisi" :class="{ 'input-error': formErrors.ekspedisi }">
                <option value="">— Pilih Ekspedisi —</option>
                <option v-for="p in pengirimanList" :key="p.kode" :value="p.nama" v-text="p.label"></option>
              </select>
              <span v-if="formErrors.ekspedisi" class="form-error" v-text="formErrors.ekspedisi"></span>
            </div>
            <div class="form-group">
              <label class="f-label" for="do-paket">Paket Bahan Ajar</label>
              <select id="do-paket" v-model="newDO.paketKode" :class="{ 'input-error': formErrors.paketKode }">
                <option value="">— Pilih Paket —</option>
                <option v-for="p in paketList" :key="p.kode" :value="p.kode" v-text="p.kode + ' — ' + p.nama"></option>
              </select>
              <span v-if="formErrors.paketKode" class="form-error" v-text="formErrors.paketKode"></span>
            </div>
            <div class="form-group">
              <label class="f-label" for="do-tanggal">Tanggal Kirim</label>
              <input id="do-tanggal" type="date" v-model="newDO.tanggalKirim" required>
            </div>
          </div>

          <div class="tracking-paket-detail" v-if="selectedPaket">
            <div class="paket-detail-header">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>
              <strong>Detail Paket: {{ selectedPaket.kode }} — {{ selectedPaket.nama }}</strong>
            </div>
            <ul class="paket-isi-list">
              <li v-for="kode in selectedPaket.isi" :key="kode">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                <span v-html="labelBahanHtml(kode)"></span>
              </li>
            </ul>
            <div class="tracking-paket-total">
              <strong>Total Harga: {{ toRupiah(selectedPaket.harga) }}</strong>
            </div>
          </div>
          <p v-else-if="newDO.paketKode" class="tracking-paket-empty">Paket tidak ditemukan.</p>
          <p v-else class="tracking-paket-empty">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;vertical-align:middle"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            Pilih paket untuk melihat detail isi dan harga.
          </p>

          <div class="tracking-form-actions">
            <button type="submit" class="btn btn-primary">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Tambah DO
            </button>
            <button type="button" class="btn btn-secondary" @click="resetForm">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 .49-3.5"/></svg>
              Reset Form
            </button>
          </div>
        </form>
      </div>

      <div class="tracking-search-bar">
        <div class="search-input-wrap">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color:var(--gray-400)"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="search" v-model="searchKeyword" placeholder="Cari nomor DO / NIM..." @keydown.enter.prevent="doSearch" @keyup.escape="clearSearch">
        </div>
        <span v-show="searchKeyword" class="search-clear" @click="clearSearch">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          Reset
        </span>
      </div>

      <div class="tracking-table-card">
        <div class="tracking-table-header">
          <h3>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;vertical-align:middle"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            Daftar Delivery Order
          </h3>
          <span class="do-count-badge">{{ filteredTracking.length }} DO</span>
        </div>
        <div class="tracking-table-wrap">
          <table>
            <thead>
              <tr>
                <th>Nomor DO</th><th>NIM</th><th>Nama</th><th>Ekspedisi</th>
                <th>Paket</th><th>Tgl Kirim</th><th>Total</th><th>Status</th><th>Progress</th>
              </tr>
            </thead>
            <tbody>
              <tr v-if="trackingList.length === 0">
                <td colspan="9" class="tracking-empty">
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:8px;color:var(--gray-300)"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
                  <p>Belum ada data Delivery Order. Tambahkan data baru di form di atas.</p>
                </td>
              </tr>
              <tr v-for="item in filteredTracking" :key="item.nomorDO">
                <td><span class="cell-do" v-text="item.nomorDO"></span></td>
                <td><span class="cell-nim" v-text="item.nim"></span></td>
                <td v-text="item.nama"></td>
                <td>
                  <span class="ekspedisi-badge" v-text="item.ekspedisi"></span>
                </td>
                <td v-text="item.paketKode"></td>
                <td v-text="item.tanggalKirim"></td>
                <td style="font-weight:600;" v-text="toRupiah(item.totalHarga)"></td>
                <td><span class="status-badge" :class="statusClass(item.status)" v-text="item.status"></span></td>
                <td>
                  <button type="button" class="btn-progress" @click="showProgress(item)" :title="'Lihat progress ' + item.nomorDO">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div v-if="selectedDO" class="progress-panel">
        <div class="progress-panel-header">
          <h3>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;vertical-align:middle"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
            Progress Tracking: <strong v-text="selectedDO.nomorDO"></strong>
          </h3>
          <button type="button" class="btn-progress-close" @click="closeProgress">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>
        <p class="progress-panel-sub">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:4px;vertical-align:middle"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          <strong v-text="selectedDO.nama"></strong> &nbsp;|&nbsp; NIM: <strong v-text="selectedDO.nim"></strong>
        </p>
        <div class="progress-timeline">
          <div v-if="!selectedDO.perjalanan || selectedDO.perjalanan.length === 0" class="progress-empty">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="color:var(--gray-300);margin-bottom:6px"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
            <p>Belum ada catatan progress.</p>
          </div>
          <div v-for="(entry, idx) in selectedDO.perjalanan" :key="idx" class="progress-entry">
            <div class="progress-dot">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="white" stroke="none"><circle cx="12" cy="12" r="10"/></svg>
            </div>
            <div class="progress-entry-body">
              <span class="progress-time" v-text="entry.waktu"></span>
              <span class="progress-desc" v-text="entry.keterangan"></span>
            </div>
          </div>
        </div>
        <div class="progress-form">
          <h4>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;vertical-align:middle"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Tambah Progress Baru
          </h4>
          <p v-if="perjalananMsg" class="progress-msg" v-text="perjalananMsg"></p>
          <div class="progress-form-row">
            <input type="text" v-model="perjalananKeterangan" @keydown.enter.prevent="addPerjalanan" placeholder="Keterangan progress (contoh: Paket sampai di gudang UPBJJ)" class="progress-input">
            <button type="button" class="btn btn-primary" @click="addPerjalanan">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              Tambah
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
    props: {
        items: { type: Array, default: function() { return []; } },
        pengirimanList: { type: Array, default: function() { return []; } },
        paketList: { type: Array, default: function() { return []; } },
        trackingList: { type: Array, default: function() { return []; } }
    },
    watch: {
        'newDO.paketKode': function() {
            if (this.formErrors.paketKode) {
                this.$delete(this.formErrors, 'paketKode');
            }
        }
    },
    data: function() {
        return {
            newDO: {
                nim: '',
                nama: '',
                ekspedisi: '',
                paketKode: '',
                tanggalKirim: ''
            },
            formErrors: {},
            saveMessage: '',
            searchKeyword: '',
            searchDO: '',
            selectedDO: null,
            perjalananKeterangan: '',
            perjalananMsg: ''
        };
    },
    computed: {
        filteredTracking: function() {
            if (!this.searchDO) return this.trackingList;
            var kw = this.searchDO.toLowerCase().trim();
            return this.trackingList.filter(function(item) {
                return (item.nomorDO && item.nomorDO.toLowerCase().indexOf(kw) >= 0) ||
                    (item.nim && item.nim.toLowerCase().indexOf(kw) >= 0);
            });
        },
        nextDoNumber: function() {
            var max = 0;
            this.trackingList.forEach(function(t) {
                var parts = (t.nomorDO || '').split('-');
                var num = parseInt(parts[parts.length - 1], 10);
                if (num > max) max = num;
            });
            var next = max + 1;
            var year = new Date().getFullYear();
            var num = String(next).padStart(4, '0');
            return 'DO' + year + '-' + num;
        },
        selectedPaket: function() {
            var self = this;
            if (!this.newDO.paketKode) return null;
            var found = null;
            this.paketList.forEach(function(p) {
                if (p.kode === self.newDO.paketKode) found = p;
            });
            return found;
        },
        doSummaryText: function() {
            var total = this.trackingList.length;
            var filtered = this.filteredTracking.length;
            if (total === 0) return 'Belum ada <strong>Delivery Order</strong>. Silakan tambahkan DO baru.';
            var berjalan = 0;
            var selesai = 0;
            this.filteredTracking.forEach(function(d) {
                if (d.status === 'Terkirim' || d.status === 'Diterima' || d.status === 'Selesai') selesai++;
                else berjalan++;
            });
            var prefix = (this.searchDO && filtered !== total) ? 'Menampilkan <strong>' + filtered + '</strong> dari <strong>' + total + '</strong> DO' : 'Menampilkan <strong>' + total + '</strong> DO';
            return prefix + ' — <strong>' + berjalan + '</strong> dalam proses, <strong>' + selesai + '</strong> selesai.';
        }
    },
    methods: {
        toRupiah: function(val) {
            return 'Rp' + Number(val || 0).toLocaleString('id-ID');
        },
        statusClass: function(status) {
            var s = (status || '').toLowerCase().replace(/\s+/g, '-');
            var map = {
                'diproses': 'diproses',
                'dalam-perjalanan': 'dalam-perjalanan',
                'dikirim': 'dikirim',
                'diterima': 'diterima',
                'selesai': 'selesai',
                'terkirim': 'terkirim',
                'pesanan-baru': 'pesanan-baru'
            };
            return 'status-badge ' + (map[s] || 'default');
        },
        labelBahanHtml: function(kode) {
            var found = null;
            for (var i = 0; i < this.items.length; i++) {
                if (this.items[i].kode === kode) { found = this.items[i]; break; }
            }
            if (found) return found.kode + ' — ' + (found.judul || found.nama || '');
            return kode + ' — (data tidak tersedia)';
        },
        addDO: function() {
            var errors = {};
            if (!this.newDO.nim) errors.nim = 'NIM wajib diisi.';
            else if (!/^\d+$/.test(this.newDO.nim)) errors.nim = 'NIM hanya boleh angka.';
            if (!this.newDO.nama) errors.nama = 'Nama wajib diisi.';
            if (!this.newDO.ekspedisi) errors.ekspedisi = 'Ekspedisi wajib dipilih.';
            if (!this.newDO.paketKode) errors.paketKode = 'Paket wajib dipilih.';
            this.formErrors = errors;
            if (Object.keys(errors).length > 0) return;
            var total = 0;
            var self = this;
            this.paketList.forEach(function(p) {
                if (p.kode === self.newDO.paketKode) total = p.harga;
            });
            var noDO = this.nextDoNumber;
            this.trackingList.unshift({
                nomorDO: noDO,
                nim: this.newDO.nim,
                nama: this.newDO.nama,
                ekspedisi: this.newDO.ekspedisi,
                paketKode: this.newDO.paketKode,
                tanggalKirim: this.newDO.tanggalKirim || new Date().toISOString().slice(0, 10),
                totalHarga: total,
                status: 'Pesanan Baru',
                perjalanan: []
            });
            this.saveMessage = noDO + ' berhasil ditambahkan!';
            this.resetForm();
            var self2 = this;
            setTimeout(function() { self2.saveMessage = ''; }, 3000);
        },
        resetForm: function() {
            this.newDO = { nim: '', nama: '', ekspedisi: '', paketKode: '', tanggalKirim: '' };
            this.formErrors = {};
        },
        showProgress: function(item) {
            this.selectedDO = item;
            this.perjalananKeterangan = '';
            this.perjalananMsg = '';
        },
        closeProgress: function() {
            this.selectedDO = null;
            this.perjalananKeterangan = '';
            this.perjalananMsg = '';
        },
        addPerjalanan: function() {
            if (!this.perjalananKeterangan.trim()) {
                this.perjalananMsg = 'Keterangan wajib diisi.';
                return;
            }
            var now = new Date();
            var pad = function(n) { return String(n).padStart(2, '0'); };
            var waktu = now.getFullYear() + '-' + pad(now.getMonth() + 1) + '-' + pad(now.getDate()) + ' ' + pad(now.getHours()) + ':' + pad(now.getMinutes()) + ':' + pad(now.getSeconds());
            var entry = { waktu: waktu, keterangan: this.perjalananKeterangan.trim() };
            this.selectedDO.perjalanan.push(entry);
            this.perjalananKeterangan = '';
            this.perjalananMsg = 'Progress berhasil ditambahkan!';
            var self = this;
            setTimeout(function() { self.perjalananMsg = ''; }, 3000);
        },
        goToDashboard: function() {
            this.$emit('navigate', 'dashboard');
        },
        doSearch: function() {
            this.searchDO = this.searchKeyword;
        },
        clearSearch: function() {
            this.searchKeyword = '';
            this.searchDO = '';
        }
    }
});