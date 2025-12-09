// top.js
document.addEventListener('DOMContentLoaded', () => {
    // ★ タッチ端末なら body にクラスを付与
  const isTouch = window.matchMedia('(pointer: coarse)').matches;
  if (isTouch) {
    document.body.classList.add('is-touch');
  }
  /* ===== HEADER OPEN トグル ===== */
  const brandBtn = document.querySelector('.js-header-toggle');
  if (brandBtn) {
    brandBtn.addEventListener('click', () => {
      document.body.classList.toggle('header-open');
    });
  }

  /* CONTACT は mailto だけ */
  const contactLink = document.querySelector('.js-contact');
  if (contactLink) {
    contactLink.addEventListener('click', () => {
      // mailto なので特別な処理は不要
    });
  }






      /* ===== LIGHTBOX (gm) ===== */
  const gm      = document.getElementById('gm');
  const gmImg   = document.getElementById('gmImage');
  const gmTtl   = gm ? gm.querySelector('.gm-ttl') : null;
  const gmSub   = gm ? gm.querySelector('.gm-sub') : null;
  const gmCount = gm ? gm.querySelector('.gm-counter') : null;
  const btnClose = gm ? gm.querySelector('.gm-close') : null;
  const btnPrev  = gm ? gm.querySelector('.gm-prev') : null;
  const btnNext  = gm ? gm.querySelector('.gm-next') : null;
  const backdrop = gm ? gm.querySelector('.gm-backdrop') : null;

  if (!gm || !gmImg) return;

  const thumbImgs = Array.from(
    document.querySelectorAll('.thumbs .jl-item img')
  );

  const items = thumbImgs.map((img) => ({
    thumbEl: img,
    full: img.dataset.full || img.src,
    title: img.dataset.title || '',
    line1: img.dataset.line1 || '',
    line2: img.dataset.line2 || ''
  }));

  // ★ 現在のインデックス（1回だけ定義）
  let currentIndex = 0;

  // ★ スワイプ用の変数（同じスコープにまとめる）
  let touchStartX = 0;
  let touchStartY = 0;
  let isTouching  = false;

  function updateSlide(index) {
    const item = items[index];
    if (!item) return;
   

    gmImg.src = item.full;
    gmImg.alt = item.title || item.line1 || '';

    if (gmTtl) gmTtl.textContent = item.title || '';
    if (gmSub) {
      gmSub.textContent = [item.line1, item.line2]
        .filter(Boolean)
        .join(' / ');
    }

    if (gmCount) gmCount.textContent = `${index + 1} / ${items.length}`;
  }

  function openLightbox(index) {
    currentIndex = index;
    updateSlide(currentIndex);

    gm.setAttribute('aria-hidden', 'false');
    document.body.classList.add('gm-open');
  }

  function closeLightbox() {
    gm.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('gm-open');
  }

  function showNext(delta) {
    if (!items.length) return;
    currentIndex = (currentIndex + delta + items.length) % items.length;
    updateSlide(currentIndex);
  }

  // サムネクリックでオープン
  thumbImgs.forEach((img, idx) => {
    img.addEventListener('click', () => {
      openLightbox(idx);
    });
  });

  // 閉じる（クリック / タッチを確実に拾う）
if (btnClose) {
  ['click', 'touchend'].forEach((ev) => {
    btnClose.addEventListener(ev, (e) => {
      e.preventDefault();
      e.stopPropagation();
      closeLightbox();
    });
  });
}

// 保険：gm 全体で .gm-close を拾う（X のどこを押しても閉じる）
gm.addEventListener('click', (e) => {
  if (e.target.closest('.gm-close')) {
    e.preventDefault();
    e.stopPropagation();
    closeLightbox();
  }
});

// 背景クリックで閉じる
if (backdrop) {
  backdrop.addEventListener('click', () => {
    closeLightbox();
  });
}

  // 前後
  if (btnPrev) btnPrev.addEventListener('click', () => showNext(-1));
  if (btnNext) btnNext.addEventListener('click', () => showNext(1));


  // ★★ iPhone / タッチ端末用：スワイプで前後 ★★
  gm.addEventListener('touchstart', (e) => {
    if (gm.getAttribute('aria-hidden') === 'true') return;
    const t = e.touches[0];
    touchStartX = t.clientX;
    touchStartY = t.clientY;
    isTouching  = true;
  });

  gm.addEventListener('touchend', (e) => {
    if (!isTouching) return;
    isTouching = false;

    const t = e.changedTouches[0];
    const dx = t.clientX - touchStartX;
    const dy = t.clientY - touchStartY;

    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);

    // 縦方向の動きが大きい / 横の移動が小さいときは無視
    if (absDx < 40 || absDx < absDy) return;

    if (dx < 0) {
      // 左にスワイプ → 次へ
      showNext(1);
    } else {
      // 右にスワイプ → 前へ
      showNext(-1);
    }
  });

  // キーボード
  window.addEventListener('keydown', (e) => {
    if (gm.getAttribute('aria-hidden') === 'true') return;

    if (e.key === 'Escape') {
      closeLightbox();
    } else if (e.key === 'ArrowRight') {
      showNext(1);
    } else if (e.key === 'ArrowLeft') {
      showNext(-1);
    }
  });
});
