# Gấu Trúc Săn Chữ

Web game học từ vựng tiếng Trung theo đề HSK mới, cấp 1 đến cấp 3. Dùng trên laptop và điện thoại, mở được khi mất mạng.

## Cấu trúc

| Phần | Vai trò |
|---|---|
| `index.html`, `app.js`, `style.css` | Giao diện và các trò chơi |
| `data.js` | Bài học gốc |
| `audio.json` | Giọng đọc tạo sẵn, tạo bằng `tools/amthanh.py` |
| `sw.js`, `manifest.webmanifest` | Mở khi mất mạng, thêm ra màn hình chính |
| `apps-script/` | Máy chủ: Google Apps Script gắn với Sheet riêng |
| `tests/` | Kiểm thử, chạy bằng `node --test "tests/*.js"` |

## Dữ liệu ở đâu

Repo công khai và không chứa tiến độ của ai. Tiến độ, lịch và bài mới nằm trong Google Sheet riêng. Địa chỉ máy chủ và khoá nằm sau dấu `#` của link riêng (`LINK-RIENG.txt`, không có trong repo), trình duyệt không gửi phần đó lên GitHub.

Sheet có 3 trang:

- `TIEN_DO`: tiến độ đã gộp từ mọi máy.
- `LICH`: lịch từng ngày. Cột `bai` là tên bài, `tro` là mã trò cách nhau dấu phẩy (ví dụ `snake,fish,word`), `loi_nhan` hiện trên màn Hôm nay. Ngày không có dòng thì app tự xoay.
- `KHO_BAI`: bài thêm mới, chỉ thêm không sửa. Đặt cột `bat` thành `0` để tắt một bài lỗi.
- `SAI`: mọi câu trả lời sai, gồm lúc nào, ở trò nào, câu hỏi, đã chọn gì, đáp án đúng. Cột `bao_loi` có chữ là người học đã bấm 🚩 báo nghi đáp án của app sai, cần kiểm tra lại nội dung bài.

## Phát hành

- Giao diện: đẩy lên `main`, GitHub Pages tự cập nhật. Đổi `KHO` trong `sw.js` khi cần máy cũ tải lại toàn bộ.
- Máy chủ: trong `apps-script/` chạy `clasp push --force` rồi `clasp update-deployment <id đang dùng>`. Bản triển khai đầu tiên phải tạo từ trình soạn thảo Apps Script, bản tạo bằng `clasp` bị Google chặn người ngoài dù cấu hình đúng.

## Nguồn dữ liệu

Danh sách từ theo đề cương HSK 2025 lấy từ [ofou/hsk](https://github.com/ofou/hsk). Đề trong Phòng thi là đề mô phỏng do Claude soạn, không phải đề gốc của kỳ thi.
