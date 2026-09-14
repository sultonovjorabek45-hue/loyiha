# Chef Sardor — Oshpaz portfolio sayti

Zamonaviy, to'liq moslashuvchan (responsive) **portfolio sayti oshpaz uchun**.
Dizayn yo'nalishi — **SOFT UI (neumorphism)**, asosiy rang — **jigarrang**,
**kun va tun rejimi** mavjud.

> Faqat HTML + CSS + JavaScript. Framework yo'q, build yo'q, kutubxona yo'q —
> `index.html` faylini brauzerda ochsangiz kifoya.

---

## 1. Ishga tushirish

```bash
# 1-usul: to'g'ridan-to'g'ri
open index.html            # yoki faylni brauzerga tashlang

# 2-usul: lokal server (rasmlar va shriftlarni to'g'ri yuklash uchun tavsiya etiladi)
python3 -m http.server 4173
# so'ng: http://localhost:4173
```

## 2. Fayl tuzilishi

```
loyiha/
├── index.html              # Butun sahifa (semantik HTML, ARIA)
├── assets/
│   ├── css/style.css       # Dizayn tizimi: o'zgaruvchilar, komponentlar, responsive
│   └── js/main.js          # Tema, menyu, filtr, lightbox, forma, animatsiya
├── images/
│   ├── chef-hero.jpg       # Hero portret (dumaloq ramka)
│   ├── chef-cooking.jpg    # "Men haqimda" bo'limi
│   └── dish-*.jpg          # 6 ta taom rasmi (galereya)
└── README.md
```

## 3. Sahifa bo'limlari

| Bo'lim | Mazmuni |
|---|---|
| Hero | Ism, kasb, qisqa tavsif, statistika (tajriba / retsept / mukofot), reyting kartasi |
| Men haqimda | Biografiya, afzalliklar ro'yxati, ko'nikma chiziqlari (animatsiyali %) |
| Taomlar | 6 ta taom kartasi + kategoriya filtri + rasmni kattalashtiruvchi lightbox |
| Xizmatlar | Menyu ishlab chiqish, master-klass, ketering, konsalting va boshqalar |
| Tajriba | Vertikal timeline (2013 — bugun) |
| Fikrlar | Mijozlar sharhlari |
| Aloqa | Aloqa kartalari, ijtimoiy tarmoqlar, validatsiyali forma |
| Footer | Havolalar, email obuna, mualliflik huquqi |

## 4. Kun / tun rejimi (theme)

- Yuqori o'ngdagi **quyosh/oy tugmasi** yoki footer'dagi `kun / tun` havolasi.
- Tanlov `localStorage` da `chef-theme` kaliti bilan saqlanadi.
- Agarda tanlov bo'lmasa — qurilmaning `prefers-color-scheme` sozlamasi olinadi.
- Miltillashning oldini olish uchun mavzu `<head>` ichida, CSS'dan oldin qo'llanadi.
- Ranglar `assets/css/style.css` faylidagi `:root` (kun) va
  `html[data-theme="dark"]` (tun) bloklarida **CSS o'zgaruvchilari** orqali berilgan.

### Palitra

| Rol | Kun | Tun |
|---|---|---|
| Fon | `#ece2d6` | `#241b15` |
| Yuza | `#ece2d6` | `#241b15` |
| Asosiy matn | `#4a3527` | `#f0e2d2` |
| Aksent | `#8b5a35` | `#d59a63` |
| Gradient | `#b07b4e → #8b5a35 → #6d4322` | `#e0b184 → #c98a52 → #a56a38` |

### Soft UI soyalari

```css
--out:    9px 9px 20px var(--sh-dark), -9px -9px 20px var(--sh-light); /* tashqi */
--in:     inset 6px 6px 12px var(--sh-dark), inset -6px -6px 12px var(--sh-light); /* ichki */
```

Sinf sifatida: `.soft-out` — chiqib turgan elementlar (karta, tugma),
`.soft-in` — botiq elementlar (input, progress, ikonka uyasi, faol menyu).

## 5. O'zingizga moslashtirish

**Ism va aloqa:** `index.html` ichida `Sardor Rahimov`,
`+998 90 123 45 67`, `chef.sardor@example.com` qiymatlarini almashtiring.

**Rasmlar:** `images/` papkasidagi fayllarni o'z rasmlaringiz bilan
(shu nomlar bilan) almashtiring. Tavsiya etilgan nisbatlar:

- `chef-hero.jpg` — 3:4 vertikal, kamida 900×1200 px
- `chef-cooking.jpg` — 4:3 yoki 3:2 gorizontal
- `dish-*.jpg` — 1:1 kvadrat, kamida 900×900 px

**Taomlar:** har bir `.dish` kartasida `data-cat` atributi filtr uchun ishlatiladi
(`asosiy`, `salat`, `shorva`, `shirinlik`).

**Ko'nikma foizlari:** `.skill__fill` elementidagi `data-value` va yonidagi matnni
o'zgartiring — animatsiya avtomatik hisoblanadi.

**Statistika:** `.count` elementlaridagi `data-count` sonini o'zgartiring.

## 6. Forma ishlashi (backend ulash)

Hozircha forma **demo** rejimida: validatsiya bajariladi va 900 ms dan keyin
muvaffaqiyat xabari ko'rsatiladi. Haqiqiy yuborish uchun
`assets/js/main.js` faylidagi izohni topib, quyidagini yoqing:

```js
fetch('/api/contact', { method: 'POST', body: new FormData(form) })
  .then(r => r.json())
  .then(() => { toast('Xabaringiz yuborildi!'); form.reset(); })
  .catch(() => toast('Xatolik yuz berdi, qayta urinib ko\'ring'));
```

Tayyor yechimlar: Formspree, Getform, Netlify Forms yoki o'z API'ingiz.

## 7. Amalga oshirilgan funksiyalar

- [x] SOFT UI / neumorphism dizayn tizimi (jigarrang palitra)
- [x] Kun / tun rejimi + `localStorage` da saqlash
- [x] Mobilda off-canvas menyu (Esc bilan yopiladi)
- [x] Scroll progress indikatori va faol bo'limni kuzatish
- [x] Scroll paytida paydo bo'lish animatsiyalari (IntersectionObserver)
- [x] Animatsiyali raqamlar va ko'nikma chiziqlari
- [x] Taomlar filtri va klaviatura bilan boshqariladigan lightbox
- [x] Forma validatsiyasi (ism, aloqa, izoh uzunligi, rozilik)
- [x] Toast bildirishnomalari
- [x] To'liq responsive (1080 / 860 / 620 px breakpointlar)
- [x] `prefers-reduced-motion` va `prefers-color-scheme` qo'llab-quvvatlanadi
- [x] SEO meta teglar, Open Graph, SVG favicon
- [x] Chop etish (print) uslublari

## 8. Brauzerlar

Chrome / Edge / Firefox / Safari (so'nggi 2 versiya).
Ayrim effektlar (`color-mix()`, `backdrop-filter`) eski brauzerlarda
soddaroq ko'rinishda ishlaydi — layout buzilmaydi.

---

© 2026 Chef Sardor portfoli shabloni. Erkin foydalanish va o'zgartirish mumkin.
