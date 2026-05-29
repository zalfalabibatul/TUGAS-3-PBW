Vue.component('stok-table', {
  template: '#tpl-stock',
  props: {
    items: { type: Array, default: function() { return []; } }
  },
  data: function() {
    return {
      filters: {
        keyword: '',
        upbjj: '',
        kategori: '',
        sortBy: 'judul',
        onlyLow: false,
        onlyZero: false
      },
      newItem: {
        kode: '', judul: '', kategori: '', upbjj: '',
        lokasiRak: '', qty: 0, safety: 10, harga: 0, catatanHTML: ''
      },
      editForm: { qty: 0, safety: 0, harga: 0, catatanHTML: '' },
      editingId: null,
      formErrors: {},
      editFormErrors: {},
      editError: ''
    };
  },
  computed: {
    upbjjOptions: function() {
      var map = {}; var result = [];
      this.items.forEach(function(i) { if (i.upbjj && !map[i.upbjj]) { map[i.upbjj] = true; result.push(i.upbjj); } });
      return result.sort();
    },
    allKategoriOptions: function() {
      var map = {}; var result = [];
      this.items.forEach(function(i) { if (i.kategori && !map[i.kategori]) { map[i.kategori] = true; result.push(i.kategori); } });
      return result.sort();
    },
    filteredKategoriOptions: function() {
      var self = this;
      var map = {}; var result = [];
      this.items.forEach(function(i) {
        if (i.upbjj === self.filters.upbjj && i.kategori && !map[i.kategori]) {
          map[i.kategori] = true; result.push(i.kategori);
        }
      });
      return result.sort();
    },
    filteredItems: function() {
      var self = this;
      var res = this.items.slice();
      if (this.filters.keyword) {
        var kw = this.filters.keyword.toLowerCase();
        res = res.filter(function(i) {
          return (i.kode && i.kode.toLowerCase().indexOf(kw) >= 0) ||
                 (i.judul && i.judul.toLowerCase().indexOf(kw) >= 0) ||
                 (i.nama && i.nama.toLowerCase().indexOf(kw) >= 0);
        });
      }
      if (this.filters.upbjj) {
        res = res.filter(function(i) { return i.upbjj === self.filters.upbjj; });
      }
      if (this.filters.kategori) {
        res = res.filter(function(i) { return i.kategori === self.filters.kategori; });
      }
      if (this.filters.onlyLow) {
        res = res.filter(function(i) { return i.qty < i.safety; });
      }
      if (this.filters.onlyZero) {
        res = res.filter(function(i) { return i.qty === 0; });
      }
      if (this.filters.sortBy === 'judul') {
        res.sort(function(a, b) { return (a.judul || a.nama || '').localeCompare(b.judul || b.nama || ''); });
      } else if (this.filters.sortBy === 'qty') {
        res.sort(function(a, b) { return a.qty - b.qty; });
      } else if (this.filters.sortBy === 'harga') {
        res.sort(function(a, b) { return a.harga - b.harga; });
      }
      return res;
    },
    stockSummary: function() {
      var total = this.items.length;
      var filtered = this.filteredItems.length;
      if (total === filtered) return 'Menampilkan <strong>' + total + '</strong> data stok bahan ajar.';
      return 'Menampilkan <strong>' + filtered + '</strong> dari <strong>' + total + '</strong> data stok bahan ajar.';
    },
    activeFilterHint: function() {
      var hints = [];
      if (this.filters.keyword) hints.push('Cari: "' + this.filters.keyword + '"');
      if (this.filters.upbjj) hints.push('UT-Daerah: ' + this.filters.upbjj);
      if (this.filters.kategori) hints.push('Kategori: ' + this.filters.kategori);
      if (this.filters.onlyLow) hints.push('Stok di bawah safety');
      if (this.filters.onlyZero) hints.push('Stok kosong');
      if (hints.length === 0) return '';
      return 'Filter aktif: ' + hints.join(', ') + '.';
    }
  },
  watch: {
    'filters.upbjj': function(val) {
      if (!val) this.filters.kategori = '';
    },
    editingId: function() {
      this.editFormErrors = {};
    }
  },
  methods: {
    toRupiah: function(val) {
      return 'Rp' + Number(val || 0).toLocaleString('id-ID');
    },
    scrollToTable: function() {
      var el = this.$refs.tableWrap;
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    },
    resetFilters: function() {
      this.filters.keyword = '';
      this.filters.upbjj = '';
      this.filters.kategori = '';
      this.filters.onlyLow = false;
      this.filters.onlyZero = false;
      this.filters.sortBy = 'judul';
    },
    resetNewForm: function() {
      this.newItem = { kode: '', judul: '', kategori: '', upbjj: '', lokasiRak: '', qty: 0, safety: 10, harga: 0, catatanHTML: '' };
      this.formErrors = {};
    },
    addItem: function() {
      var errors = {};
      if (!this.newItem.kode) errors.kode = 'Kode MK wajib diisi.';
      if (!this.newItem.judul) errors.judul = 'Judul MK wajib diisi.';
      if (!this.newItem.kategori) errors.kategori = 'Kategori wajib dipilih.';
      if (!this.newItem.upbjj) errors.upbjj = 'UT-Daerah wajib dipilih.';
      if (!this.newItem.lokasiRak) errors.lokasiRak = 'Lokasi Rak wajib diisi.';
      if (this.newItem.qty < 0) errors.qty = 'Stok tidak boleh negatif.';
      if (this.newItem.safety < 0) errors.safety = 'Safety tidak boleh negatif.';
      if (this.newItem.harga < 0) errors.harga = 'Harga tidak boleh negatif.';
      this.formErrors = errors;
      if (Object.keys(errors).length > 0) return;
      this.items.push({
        id: Date.now(),
        kode: this.newItem.kode,
        judul: this.newItem.judul,
        nama: this.newItem.judul,
        kategori: this.newItem.kategori || '—',
        upbjj: this.newItem.upbjj || '—',
        lokasiRak: this.newItem.lokasiRak || '—',
        qty: this.newItem.qty || 0,
        safety: this.newItem.safety || 10,
        harga: this.newItem.harga || 0,
        catatanHTML: this.newItem.catatanHTML || ''
      });
      this.resetNewForm();
      Swal.fire({
        html: '<div style="text-align:center;padding:4px 0"><div style="width:56px;height:56px;margin:0 auto 10px;border-radius:50%;background:linear-gradient(135deg,#4ade80,#22c55e);display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 40 40" width="24" height="24"><polyline points="12,22 18,28 29,14" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><p style="margin:0;font-size:14px;font-weight:600;color:#1e293b">Stok berhasil ditambahkan</p></div>',
        timer: 1200,
        showConfirmButton: false,
        customClass: { popup: 'swal-popup-custom' }
      });
    },
    startEdit: function(item) {
      this.editingId = item.id || item.kode;
      this.editForm = {
        qty: item.qty,
        safety: item.safety,
        harga: item.harga,
        catatanHTML: item.catatanHTML || ''
      };
      this.editError = '';
    },
    saveEdit: function(item) {
      var errors = {};
      if (this.editForm.qty < 0) errors.qty = 'Stok tidak boleh negatif.';
      if (this.editForm.safety < 0) errors.safety = 'Safety tidak boleh negatif.';
      if (this.editForm.harga < 0) errors.harga = 'Harga tidak boleh negatif.';
      this.editFormErrors = errors;
      if (Object.keys(errors).length > 0) return;
      var idx = -1;
      for (var i = 0; i < this.items.length; i++) {
        if ((this.items[i].id || this.items[i].kode) === (item.id || item.kode)) {
          idx = i; break;
        }
      }
      if (idx >= 0) {
        this.items[idx].qty = this.editForm.qty;
        this.items[idx].safety = this.editForm.safety;
        this.items[idx].harga = this.editForm.harga;
        this.items[idx].catatanHTML = this.editForm.catatanHTML;
        this.$set(this.items, idx, this.items[idx]);
        this.cancelEdit();
        Swal.fire({
          html: '<div style="text-align:center;padding:4px 0"><div style="width:56px;height:56px;margin:0 auto 10px;border-radius:50%;background:linear-gradient(135deg,#4ade80,#22c55e);display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 40 40" width="24" height="24"><polyline points="12,22 18,28 29,14" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><p style="margin:0;font-size:14px;font-weight:600;color:#1e293b">Stok berhasil diperbarui</p></div>',
          timer: 1200,
          showConfirmButton: false,
          customClass: { popup: 'swal-popup-custom' }
        });
      }
    },
    cancelEdit: function() {
      this.editingId = null;
      this.editError = '';
      this.editFormErrors = {};
    },
    deleteItem: function(item) {
      var self = this;
      Swal.fire({
        html: '<div style="text-align:center"><div style="width:72px;height:72px;margin:0 auto 16px;border-radius:50%;background:linear-gradient(135deg,#f87171,#ef4444);display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 40 40" width="32" height="32"><line x1="13" y1="13" x2="27" y2="27" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/><line x1="27" y1="13" x2="13" y2="27" stroke="#fff" stroke-width="3.5" stroke-linecap="round"/></svg></div><h2 style="margin:0 0 4px;font-size:18px;font-weight:700;color:#1e293b">Hapus ' + (item.judul || item.nama || item.kode) + '?</h2><p style="margin:0;font-size:14px;color:#64748b">Data yang dihapus tidak dapat dikembalikan.</p></div>',
        showCancelButton: true,
        confirmButtonText: 'Ya, hapus',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#ef4444',
        reverseButtons: true,
        customClass: { popup: 'swal-popup-custom' }
      }).then(function(result) {
        if (result.isConfirmed) {
          for (var i = 0; i < self.items.length; i++) {
            if ((self.items[i].id || self.items[i].kode) === (item.id || item.kode)) {
              self.items.splice(i, 1);
              break;
            }
          }
          Swal.fire({
            html: '<div style="text-align:center"><div style="width:56px;height:56px;margin:0 auto 12px;border-radius:50%;background:linear-gradient(135deg,#4ade80,#22c55e);display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 40 40" width="24" height="24"><polyline points="12,22 18,28 29,14" fill="none" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round"/></svg></div><p style="margin:0;font-size:15px;font-weight:600;color:#1e293b">Berhasil dihapus</p></div>',
            timer: 1200,
            showConfirmButton: false,
            customClass: { popup: 'swal-popup-custom' }
          });
        }
      });
    },
    goToDashboard: function() {
      this.$emit('navigate', 'dashboard');
    }
  }
});
