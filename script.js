// --- 1. KHỞI TẠO LENIS --- ✨
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});

function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

window.onload = function() {
  const loading = document.getElementById('loading');
  const columns = [
    document.getElementById('col-1'),
    document.getElementById('col-2'),
    document.getElementById('col-3'),
    document.getElementById('col-4'),
    document.getElementById('col-5')
  ];

  const myImages = ['anh1.jpg', 'anh2.jpg', 'anh3.jpg','anh4.jpg','anh5.jpg','anh6.jpg','anh7.jpg','anh8.png','anh9.jpeg']; // Nhớ bỏ ảnh thật vào thư mục nha!

  function createGridItem() {
    const item = document.createElement('div');
    item.classList.add('grid-item');
    const img = document.createElement('img');
    if (myImages.length > 0) {
      img.src = `images/${myImages[Math.floor(Math.random() * myImages.length)]}`;
    }
    item.appendChild(img);
    return item;
  }

  // CHỐT CHẶN: Ngăn lỗi tải liên tục
  let isFetching = false; 

  function loadMoreItems(itemsPerCol = 4) {
    if (isFetching) return; // Đang tải thì cấm gọi nữa!
    isFetching = true;
    loading.style.display = 'block';
    
    // Đợi 0.5s để ảnh kịp render chiều cao, tránh kẹt vòng lặp
    setTimeout(() => {
      for (let i = 0; i < itemsPerCol; i++) {
        columns.forEach(col => {
          if (col) col.appendChild(createGridItem());
        });
      }
      loading.style.display = 'none';
      isFetching = false; // Xong rồi, mở khóa chốt chặn
    }, 500);
  }

  // Tải đợt đầu tiên
  loadMoreItems(6);

  // --- 2. PARALLAX VÀ INFINITE SCROLL --- 🚀
  lenis.on('scroll', (e) => {
    const y = e.scroll;
    
    if (columns[0]) columns[0].style.transform = `translateY(${-y * 0.6}px)`;
    if (columns[4]) columns[4].style.transform = `translateY(${-y * 0.6}px)`;
    if (columns[1]) columns[1].style.transform = `translateY(${-y * 0.3}px)`;
    if (columns[3]) columns[3].style.transform = `translateY(${-y * 0.3}px)`;
    if (columns[2]) columns[2].style.transform = `translateY(0px)`; // Cột giữa đứng im

    // Kiểm tra nếu đáy của cột chạy nhanh nhất (cột 1) lọt vào tầm nhìn thì tải thêm
    if (columns[0]) {
      const col1Rect = columns[0].getBoundingClientRect();
      if (col1Rect.bottom < window.innerHeight + 600) {
        loadMoreItems(4);
      }
    }
  });

  // --- 3. GIA TỐC PHÍM MŨI TÊN --- 🏎️💨
  let keyVelocity = 0;
  let isDownPressed = false;
  let isUpPressed = false;

  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown') { isDownPressed = true; e.preventDefault(); }
    if (e.key === 'ArrowUp') { isUpPressed = true; e.preventDefault(); }
  });

  window.addEventListener('keyup', (e) => {
    if (e.key === 'ArrowDown') { isDownPressed = false; }
    if (e.key === 'ArrowUp') { isUpPressed = false; }
  });

  function accelerationLoop() {
    if (isDownPressed) {
      keyVelocity += 2.5; 
    } else if (isUpPressed) {
      keyVelocity -= 2.5; 
    } else {
      keyVelocity *= 0.92; // Ma sát phanh từ từ
    }

    if (keyVelocity > 60) keyVelocity = 60;
    if (keyVelocity < -60) keyVelocity = -60;
    if (Math.abs(keyVelocity) < 0.1) keyVelocity = 0;

    if (keyVelocity !== 0) {
      window.scrollBy(0, keyVelocity);
    }
    requestAnimationFrame(accelerationLoop);
  }
  accelerationLoop();
};