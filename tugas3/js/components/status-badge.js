Vue.component('status-badge', {
  template: '#tpl-status-badge',
  props: {
    qty:    { type: Number, required: true },
    safety: { type: Number, required: true },
    catatan: { type: String, default: '' }
  },
  data: function() {
    return { showTooltip: false, tooltipAbove: false };
  },
  methods: {
    onMouseEnter: function(e) {
      if (!this.catatan) return;
      var rect = e.currentTarget.getBoundingClientRect();
      this.tooltipAbove = rect.bottom + 48 > window.innerHeight;
      this.showTooltip = true;
    },
    onMouseLeave: function() {
      this.showTooltip = false;
    }
  },
  computed: {
    status: function () {
      if (this.qty === 0)             return 'kosong';
      if (this.qty < this.safety)     return 'menipis';
      return 'aman';
    },
    label: function () {
      return { aman: 'Aman', menipis: 'Menipis', kosong: 'Kosong' }[this.status];
    },
    badgeClass: function () {
      return {
        aman:    'badge badge-success',
        menipis: 'badge badge-warning',
        kosong:  'badge badge-danger'
      }[this.status];
    },
    statusIcon: function () {
      return {
        aman:    '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
        menipis: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
        kosong:  '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>'
      }[this.status];
    }
  }
});
