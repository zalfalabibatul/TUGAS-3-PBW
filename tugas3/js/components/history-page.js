Vue.component('history-page', {
  template: '#tpl-history',
  props: {
    items: { type: Array, default: function() { return []; } },
    trackingList: { type: Array, default: function() { return []; } }
  },
  data: function() {
    return {
      filters: {
        keyword: '',
        status: '',
        sortBy: 'tanggal'
      },
      statusOptions: ['Diproses', 'Dikirim', 'Dalam Perjalanan', 'Diterima', 'Selesai', 'Terkirim'],
      pendingStatus: {}
    };
  },
  computed: {
    filteredList: function() {
      var self = this;
      var data = this.trackingList.slice();
      var kw = this.filters.keyword.toLowerCase().trim();
      if (kw) {
        data = data.filter(function(item) {
          return (item.nomorDO && item.nomorDO.toLowerCase().indexOf(kw) >= 0) ||
                 (item.nama && item.nama.toLowerCase().indexOf(kw) >= 0);
        });
      }
      if (this.filters.status) {
        data = data.filter(function(item) { return item.status === self.filters.status; });
      }
      if (this.filters.sortBy === 'nomor') {
        data.sort(function(a, b) { return (a.nomorDO || '').localeCompare(b.nomorDO || ''); });
      } else if (this.filters.sortBy === 'nama') {
        data.sort(function(a, b) { return (a.nama || '').localeCompare(b.nama || ''); });
      } else {
        data.sort(function(a, b) { return (b.tanggalKirim || '').localeCompare(a.tanggalKirim || ''); });
      }
      return data;
    },
    historySummary: function() {
      var total = this.trackingList.length;
      var filtered = this.filteredList.length;
      if (total === filtered) return 'Menampilkan <strong>' + total + '</strong> riwayat transaksi.';
      return 'Menampilkan <strong>' + filtered + '</strong> dari <strong>' + total + '</strong> riwayat transaksi.';
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
        'dikirim': 'dikirim',
        'dalam-perjalanan': 'dalam-perjalanan',
        'diterima': 'diterima',
        'selesai': 'selesai',
        'terkirim': 'terkirim'
      };
      return 'status-badge ' + (map[s] || 'default');
    },
    changeStatus: function(item, newStatus) {
      this.$set(this.pendingStatus, item.nomorDO, newStatus);
    },
    saveStatus: function(item) {
      var newStatus = this.pendingStatus[item.nomorDO];
      if (!newStatus) return;
      for (var i = 0; i < this.trackingList.length; i++) {
        if (this.trackingList[i].nomorDO === item.nomorDO) {
          this.trackingList[i].status = newStatus;
          this.$set(this.trackingList, i, this.trackingList[i]);
          break;
        }
      }
      this.$delete(this.pendingStatus, item.nomorDO);
    },
    resetFilters: function() {
      this.filters.keyword = '';
      this.filters.status = '';
      this.filters.sortBy = 'tanggal';
    },
    goToDashboard: function() {
      this.$emit('navigate', 'dashboard');
    }
  }
});
