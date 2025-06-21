const skapi = new Skapi('ap22om7W752rojueeFEc', 'f8e16604-69e4-451c-9d90-4410f801c006');

function updateAuthState() {
    skapi.getProfile().then(user => {
        document.querySelectorAll('.auth-on').forEach(el => {
            el.style.display = user ? '' : 'none';
        });
        document.querySelectorAll('.auth-off').forEach(el => {
            el.style.display = user ? 'none' : '';
        });
        let nameEls = document.querySelectorAll('.user-name');
        nameEls.forEach(el => el.textContent = user ? user.name : '');
    });
}

function signup(e) {
    skapi.signup(e)
        .then(() => window.location.href = 'login.html')
        .catch(err => alert(err.message));
    return false;
}

function login(e) {
    skapi.login(e)
        .then(() => window.location.href = 'index.html')
        .catch(err => alert(err.message));
    return false;
}

function logout(e) {
    skapi.logout(e)
        .then(() => window.location.href = 'index.html')
        .catch(err => alert(err.message));
    return false;
}

function uploadPhoto(e) {
    const progress = document.getElementById('upload-progress');
    skapi.postRecord(e, {
        table: 'photos',
        progress: p => {
            progress.textContent = `Uploading ${p.uploaded} / ${p.size}`;
        }
    })
    .then(() => window.location.href = 'gallery.html')
    .catch(err => alert(err.message));
    return false;
}

function loadGallery() {
    const container = document.getElementById('gallery');
    if (!container) return;
    skapi.getRecords({ table: 'photos' }).then(res => {
        res.list.forEach(rec => {
            if (rec.bin && rec.bin.picture) {
                rec.bin.picture.forEach(file => {
                    const wrap = document.createElement('div');
                    wrap.className = 'photo-item';

                    const img = document.createElement('img');
                    img.src = file.url;
                    wrap.appendChild(img);

                    const btn = document.createElement('button');
                    btn.textContent = 'Delete';
                    btn.addEventListener('click', () => deletePhoto(rec.record_id, wrap));
                    wrap.appendChild(btn);

                    container.appendChild(wrap);
                });
            }
        });
    });
}

function deletePhoto(record_id, element) {
    if (!confirm('Delete this photo?')) {
        return;
    }
    skapi.deleteRecords({ table: 'photos', record_id })
        .then(() => {
            if (element) {
                element.remove();
            }
        })
        .catch(err => alert(err.message));
}

document.addEventListener('DOMContentLoaded', () => {
    updateAuthState();
    loadGallery();
});
