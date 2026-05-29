/* ========== HELPERS ========== */

function getUserData() {
  try {
    var raw = sessionStorage.getItem('ut_user');
    if (raw) return JSON.parse(raw);
  } catch (e) {}
  return null;
}

function formatDate(d) {
  var opts = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return d.toLocaleDateString('id-ID', opts);
}

function getGreeting() {
  var hour = new Date().getHours();
  if (hour >= 5 && hour < 11) return 'Selamat Pagi';
  if (hour >= 11 && hour < 15) return 'Selamat Siang';
  if (hour >= 15 && hour < 18) return 'Selamat Sore';
  return 'Selamat Malam';
}

/* ========== COMPONENTS ========== */

Vue.component('app-modal', {
  template: '#tpl-modal',
  props: {
    show: { type: Boolean, default: false },
    title: { type: String, default: 'Modal Dialog' },
    size: { type: String, default: 'md' }
  },
  methods: {
    close: function() {
      this.$emit('close');
    },
    handleKeydown: function(e) {
      if (e.key === 'Escape') this.close();
    }
  },
  watch: {
    show: function(val) {
      if (val) {
        document.addEventListener('keydown', this.handleKeydown);
      } else {
        document.removeEventListener('keydown', this.handleKeydown);
      }
    }
  },
  mounted: function() {
    if (this.show) {
      document.addEventListener('keydown', this.handleKeydown);
    }
  },
  beforeDestroy: function() {
    document.removeEventListener('keydown', this.handleKeydown);
  }
});

/* ========== ROOT VUE ========== */

function initApp() {
  var userData = getUserData();
  if (!userData) { window.location.href = 'login.html'; return; }

  new Vue({
    el: '#app',
    data: {
      currentTab: 'dashboard',
      sidebarCollapsed: false,
      userData: userData,
      rawData: null
    },
    computed: {
      items: function() {
        return (this.rawData && this.rawData.stok) || [];
      },
      pengirimanList: function() {
        return (this.rawData && this.rawData.pengirimanList) || [];
      },
      paketList: function() {
        return (this.rawData && this.rawData.paket) || [];
      },
      trackingList: function() {
        if (!this.rawData || !this.rawData.tracking) return [];
        var map = {};
        this.rawData.tracking.forEach(function(item) {
          var keys = Object.keys(item);
          keys.forEach(function(key) {
            if (!map[key]) {
              var d = item[key];
              map[key] = {
                nomorDO: key,
                nim: d.nim,
                nama: d.nama,
                ekspedisi: d.ekspedisi,
                paketKode: d.paket,
                tanggalKirim: d.tanggalKirim,
                totalHarga: d.total,
                status: d.status,
                perjalanan: d.perjalanan || []
              };
            }
          });
        });
        return Object.keys(map).map(function(k) { return map[k]; });
      },
      userName: function() {
        return this.userData.name || 'User';
      },
      userRole: function() {
        return this.userData.role || '-';
      },
      today: function() {
        return formatDate(new Date());
      },
      navMenus: function() {
        var lowStock = this.items.filter(function(i) { return i.qty > 0 && i.qty < i.safety; }).length;
        var emptyStock = this.items.filter(function(i) { return i.qty === 0; }).length;
        var badge = lowStock + emptyStock > 0 ? lowStock + emptyStock : null;
        var iconDashboard = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>';
        var iconStok = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>';
        var iconTracking = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>';
        var iconHistori = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3h18v18H3z" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>';
        var iconLaporan = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>';
        return [
          { id: 'dashboard', title: 'Dashboard', icon: iconDashboard, route: 'dashboard', badge: null },
          { id: 'stok', title: 'Informasi Bahan Ajar', icon: iconStok, route: 'stok', badge: null },
          { id: 'tracking', title: 'Tracking Pengiriman', icon: iconTracking, route: 'tracking', badge: null },
          { id: 'histori', title: 'Histori Transaksi', icon: iconHistori, route: 'histori', badge: null },
          { id: 'laporan', title: 'Laporan', icon: iconLaporan, route: 'laporan', badge: null }
        ];
      }
    },
    watch: {
      rawData: {
        handler: function(val) {
          if (val) {
            try {
              localStorage.setItem('ut_data', JSON.stringify(val));
            } catch (e) {}
          }
        },
        deep: true
      }
    },
    methods: {
      handleNavigate: function(route) {
        if (route === 'laporan') { this.currentTab = 'laporan'; return; }
        this.currentTab = route;
      },
      doLogout: function() {
        sessionStorage.clear();
        window.location.href = 'login.html';
      }
    },
    mounted: function() {
      var self = this;
      var cached = localStorage.getItem('ut_data');
      if (cached) {
        try { self.rawData = JSON.parse(cached); } catch (e) {}
      }
      DataService.fetchData().then(function(data) {
        if (data) {
          if (self.rawData) {
            if (data.stok) self.rawData.stok = data.stok;
            if (data.pengirimanList) self.rawData.pengirimanList = data.pengirimanList;
            if (data.paket) self.rawData.paket = data.paket;
          } else {
            self.rawData = data;
          }
        }
      });
    }
  });
}

if (window.__templatesReady) {
  initApp();
} else {
  document.addEventListener('templates-ready', initApp);
}
