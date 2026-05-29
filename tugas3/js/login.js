var loginApp = new Vue({
    el: '#login-app',
    data: {
        email: '',
        password: '',
        load: false,
        users: [],
        rememberMe: false,
        showPassword: false,
        showForgotModal: false,
        showRegisterModal: false,
        forgotEmail: '',
        regNama: '',
        regEmail: '',
        regNim: ''
    },
    async mounted() {
        const data = await DataService.fetchUsers();
        if (data && data.users) {
            this.users = data.users;
        }
        // Restore remembered email
        var remembered = localStorage.getItem('sitta_remember_email');
        if (remembered) {
            this.email = remembered;
            this.rememberMe = true;
        }
    },
    methods: {
        doLogin() {
            this.load = true;
            if (!this.email.trim() || !this.password) {
                Swal.fire({
                    html: '<div style="text-align:center"><div class="swal-icon-glow" style="width:88px;height:88px;margin:0 auto 20px;border-radius:50%;background:linear-gradient(135deg,#fbbf24,#f59e0b);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 32px rgba(245,158,11,0.3)"><svg viewBox="0 0 40 40" width="38" height="38"><line x1="20" y1="10" x2="20" y2="24" stroke="#fff" stroke-width="4" stroke-linecap="round"/><line x1="20" y1="30" x2="20" y2="32" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg></div><h2 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#92400e">Lengkapi Data</h2><p style="margin:0;font-size:14px;color:#64748b">Email dan password wajib diisi.</p></div>',
                    timer: 2000,
                    showConfirmButton: false,
                    background: 'rgba(255,255,255,0.92)',
                    backdrop: 'rgba(11, 27, 79, 0.75)',
                    customClass: { popup: 'swal-popup-custom' }
                });
                this.load = false;
                return;
            }
            if (!this.users || !this.users.length) {
                Swal.fire({
                    html: '<div style="text-align:center"><div class="swal-icon-glow" style="width:88px;height:88px;margin:0 auto 20px;border-radius:50%;background:linear-gradient(135deg,#f87171,#ef4444);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 32px rgba(239,68,68,0.3)"><svg viewBox="0 0 40 40" width="38" height="38"><line x1="13" y1="13" x2="27" y2="27" stroke="#fff" stroke-width="4" stroke-linecap="round"/><line x1="27" y1="13" x2="13" y2="27" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg></div><h2 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#991b1b">Gagal</h2><p style="margin:0;font-size:14px;color:#64748b">Data user tidak tersedia.</p></div>',
                    showConfirmButton: false,
                    background: 'rgba(255,255,255,0.92)',
                    backdrop: 'rgba(10, 24, 78, 0.75)',
                    customClass: { popup: 'swal-popup-custom' }
                });
                this.load = false;
                return;
            }
            var user = null;
            for (var i = 0; i < this.users.length; i++) {
                if (this.users[i].email === this.email.trim() && this.users[i].password === this.password) {
                    user = this.users[i];
                    break;
                }
            }
            if (user) {
                // Handle remember me
                if (this.rememberMe) {
                    localStorage.setItem('sitta_remember_email', this.email.trim());
                } else {
                    localStorage.removeItem('sitta_remember_email');
                }
                Swal.fire({
                    html: '<div style="text-align:center"><div class="swal-icon-glow" style="width:88px;height:88px;margin:0 auto 20px;border-radius:50%;background:linear-gradient(135deg,#4ade80,#22c55e);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 32px rgba(34,197,94,0.3)"><svg viewBox="0 0 40 40" width="38" height="38"><polyline points="12,22 18,28 29,14" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg></div><h2 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#166534">Berhasil Masuk!</h2><p style="margin:0;font-size:14px;color:#64748b">Selamat datang, ' + user.nama + '</p></div>',
                    timer: 1800,
                    showConfirmButton: false,
                    background: 'rgba(255,255,255,0.92)',
                    backdrop: 'rgba(14, 32, 95, 0.75)',
                    customClass: { popup: 'swal-popup-custom' }
                });
                var userData = { name: user.nama, email: user.email, role: user.role, lokasi: user.lokasi };
                sessionStorage.setItem('ut_user', JSON.stringify(userData));
                setTimeout(function() { window.location.href = 'index.html'; }, 1800);
            } else {
                Swal.fire({
                    html: '<div style="text-align:center"><div class="swal-icon-glow" style="width:88px;height:88px;margin:0 auto 20px;border-radius:50%;background:linear-gradient(135deg,#f87171,#ef4444);display:flex;align-items:center;justify-content:center;box-shadow:0 8px 32px rgba(239,68,68,0.3)"><svg viewBox="0 0 40 40" width="38" height="38"><line x1="13" y1="13" x2="27" y2="27" stroke="#fff" stroke-width="4" stroke-linecap="round"/><line x1="27" y1="13" x2="13" y2="27" stroke="#fff" stroke-width="4" stroke-linecap="round"/></svg></div><h2 style="margin:0 0 6px;font-size:20px;font-weight:700;color:#991b1b">Gagal Masuk</h2><p style="margin:0;font-size:14px;color:#64748b">Email atau password salah.</p></div>',
                    timer: 2000,
                    showConfirmButton: false,
                    background: 'rgba(255,255,255,0.92)',
                    backdrop: 'rgba(7, 31, 129, 0.75)',
                    customClass: { popup: 'swal-popup-custom' }
                });
                this.load = false;
            }
        },
        doForgotPassword() {
            if (!this.forgotEmail.trim()) {
                Swal.fire({ text: 'Masukkan email terlebih dahulu.', icon: 'warning', timer: 1800, showConfirmButton: false });
                return;
            }
            this.showForgotModal = false;
            Swal.fire({
                html: '<div style="text-align:center"><div style="width:72px;height:72px;margin:0 auto 16px;border-radius:50%;background:linear-gradient(135deg,#60a5fa,#3b82f6);display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 40 40" width="32" height="32" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><path d="M4 8h32v24H4z" rx="2"/><polyline points="4,8 20,22 36,8"/></svg></div><h2 style="margin:0 0 6px;font-size:18px;font-weight:700;color:#1e40af">Instruksi Terkirim</h2><p style="margin:0;font-size:13px;color:#64748b">Cek email <strong>' + this.forgotEmail + '</strong> untuk instruksi reset password.</p></div>',
                timer: 3000,
                showConfirmButton: false,
                customClass: { popup: 'swal-popup-custom' }
            });
            this.forgotEmail = '';
        },
        doRegister() {
            if (!this.regNama.trim() || !this.regEmail.trim()) {
                Swal.fire({ text: 'Nama dan email wajib diisi.', icon: 'warning', timer: 1800, showConfirmButton: false });
                return;
            }
            this.showRegisterModal = false;
            Swal.fire({
                html: '<div style="text-align:center"><div style="width:72px;height:72px;margin:0 auto 16px;border-radius:50%;background:linear-gradient(135deg,#4ade80,#22c55e);display:flex;align-items:center;justify-content:center"><svg viewBox="0 0 40 40" width="32" height="32" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="12,22 18,28 29,14"/></svg></div><h2 style="margin:0 0 6px;font-size:18px;font-weight:700;color:#166534">Permintaan Terkirim</h2><p style="margin:0;font-size:13px;color:#64748b">Permintaan akun untuk <strong>' + this.regNama + '</strong> telah dikirim ke administrator.</p></div>',
                timer: 3000,
                showConfirmButton: false,
                customClass: { popup: 'swal-popup-custom' }
            });
            this.regNama = ''; this.regEmail = ''; this.regNim = '';
        },
        handleKeydown(e) {
            if (e.key === 'Enter') this.doLogin();
        }
    }
});