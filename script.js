// Mobil menü
const ham = document.querySelector('.hamburger');
const nav = document.querySelector('#nav');
ham?.addEventListener('click', ()=> nav.style.display = nav.style.display === 'block' ? 'none' : 'block');

// Yıl
document.getElementById('year').textContent = new Date().getFullYear();

// Galeri modal
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modal-img');
const modalCap = document.getElementById('modal-cap');
document.querySelectorAll('.gallery img').forEach(img=>{
  img.addEventListener('click', ()=>{
    modal.classList.add('open');
    modalImg.src = img.src;
    modalCap.textContent = img.alt || '';
    modal.setAttribute('aria-hidden','false');
  });
});
document.querySelector('.modal-close')?.addEventListener('click', ()=>{
  modal.classList.remove('open'); modal.setAttribute('aria-hidden','true');
});
modal?.addEventListener('click', (e)=>{
  if(e.target===modal) { modal.classList.remove('open'); }
});

// Yukarı çık
const toTop = document.getElementById('to-top');
window.addEventListener('scroll', ()=>{
  if(window.scrollY > 600) toTop.classList.add('show'); else toTop.classList.remove('show');
});
toTop?.addEventListener('click', ()=> window.scrollTo({top:0, behavior:'smooth'}));

// Form doğrulama + örnek gönderim
const form = document.getElementById('randevu-form');
const msg = document.querySelector('.form-msg');

form?.addEventListener('submit', async (e)=>{
  e.preventDefault();
  msg.textContent = '';

  const data = Object.fromEntries(new FormData(form).entries());
  if(!data.name || !data.phone || !data.service){
    msg.style.color = '#f87171';
    msg.textContent = 'Lütfen zorunlu alanları doldurun.';
    return;
  }

  // ---- GÖNDERİM SEÇENEKLERİ ----
  // 1) Mailto (en basit, e-posta istemcisi açar):
  // window.location.href = `mailto:info@ornekdomain.com?subject=Randevu Talebi - ${encodeURIComponent(data.service)}&body=${encodeURIComponent(JSON.stringify(data, null, 2))}`;

  // 2) Formspree / kendi endpoint’in: (https://formspree.io ile form endpointi açıp URL’yi değiştir)
  try{
    const res = await fetch('https://formspree.io/f/your-id', {
      method:'POST',
      headers:{'Accept':'application/json','Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    if(res.ok){
      msg.style.color = '#7ee787';
      msg.textContent = 'Talebiniz alındı. En kısa sürede dönüş yapacağız.';
      form.reset();
    }else{
      throw new Error('Sunucu hatası');
    }
  }catch(err){
    msg.style.color = '#f6c177';
    msg.textContent = 'Şu an gönderemedik. WhatsApp’tan yazabilirsiniz.';
  }
});
const form = document.getElementById('randevuForm');
const liste = document.querySelector('#randevuListesi ul');

// Daha önce kaydedilenleri yükle
window.addEventListener('load', () => {
  const kayitlar = JSON.parse(localStorage.getItem('randevular')) || [];
  kayitlar.forEach(r => {
    const li = document.createElement('li');
    li.textContent = `${r.tarih} - ${r.ad} (${r.telefon})`;
    liste.appendChild(li);
  });
});

form.addEventListener('submit', function(e){
  e.preventDefault();

  const ad = form.ad.value;
  const tel = form.telefon.value;
  const tarih = form.tarih.value;

  const li = document.createElement('li');
  li.textContent = `${tarih} - ${ad} (${tel})`;
  liste.appendChild(li);

  // localStorage’a kaydet
  const kayitlar = JSON.parse(localStorage.getItem('randevular')) || [];
  kayitlar.push({ad, telefon: tel, tarih});
  localStorage.setItem('randevular', JSON.stringify(kayitlar));

  form.reset();
  alert("Randevu kaydedildi!");
});//// --- HD Randevu: localStorage ile kalıcı kayıt ---
document.addEventListener('DOMContentLoaded', () => {
  const KEY   = 'hd_randevular_v1';
  const form  = document.getElementById('hdRandevuForm');
  const list  = document.querySelector('#hdRandevuListesi ul');
  const clear = document.getElementById('hdTemizle');

  if (!form || !list) return;

  function load(){ return JSON.parse(localStorage.getItem(KEY) || '[]'); }
  function save(arr){ localStorage.setItem(KEY, JSON.stringify(arr)); }
  function render(){
    list.innerHTML = '';
    load().forEach((r, i) => {
      const li = document.createElement('li');
      li.innerHTML = `<span class="meta">${r.tarih} — ${r.ad} (${r.telefon})</span>
                      <button data-i="${i}">Sil</button>`;
      list.appendChild(li);
    });
  }

  // Başlat
  render();

  // Gönderim
  form.addEventListener('submit', (e) => {
    e.preventDefault(); // emniyet
    const ad = form.ad.value.trim();
    const telefon = form.telefon.value.trim();
    const tarih = form.tarih.value;
    if(!ad || !telefon || !tarih) return;

    const items = load();
    items.push({ ad, telefon, tarih });
    save(items);
    render();
    form.reset();
  });

  // Tek tek sil
  list.addEventListener('click', (e)=>{
    if(e.target.tagName === 'BUTTON'){
      const i = +e.target.dataset.i;
      const items = load(); items.splice(i,1); save(items); render();
    }
  });

  // Hepsini temizle
  clear.addEventListener('click', ()=>{
    if(confirm('Tüm randevuları silmek istiyor musunuz?')){
      localStorage.removeItem(KEY); render();
    }
  });
});

