const gridContainer = document.getElementById('grid-container');
const loading = document.getElementById('loading');

// Hàm tạo (生成 - seisei) một thẻ hình ảnh mới
function createGridItem() {
  const item = document.createElement('div');
  item.classList.add('grid-item');
  
  const img = document.createElement('img');
  // Lấy ảnh ngẫu nhiên từ Picsum
  img.src = `https://picsum.photos/300/400?random=${Math.random()}`;
  img.alt = "My Project";
  
  item.appendChild(img);
  return item;
}

// Hàm tải thêm dự án
function loadMoreItems(count = 10) {
  // Hiện chữ "Đang tải thêm..."
  loading.style.display = 'block';
  
  // Dùng setTimeout để giả lập thời gian tải mạng (0.5 giây) cho giống thật
  setTimeout(() => {
    for (let i = 0; i < count; i++) {
      gridContainer.appendChild(createGridItem());
    }
    // Tải xong thì ẩn chữ đi
    loading.style.display = 'none';
  }, 500);
}

// Khi vừa mở trang, tải sẵn 15 thẻ đầu tiên nha!
loadMoreItems(15);

// Lắng nghe sự kiện cuộn (スクロール - sukurōru) của toàn bộ trang web
window.addEventListener('scroll', () => {
  // Tổng khoảng cách từ trên cùng + chiều cao màn hình hiện tại
  const scrolled = window.innerHeight + window.scrollY;
  // Chiều cao tổng của toàn bộ trang web
  const totalHeight = document.body.offsetHeight;

  // Nếu cuộn cách đáy khoảng 100px thì bắt đầu load thêm
  if (scrolled >= totalHeight - 100) {
    // Kiểm tra nếu đang không tải (loading bị ẩn) thì mới gọi hàm
    if (loading.style.display === 'none') {
      loadMoreItems(10); // Tải thêm 10 thẻ nữa nè!
    }
  }
});