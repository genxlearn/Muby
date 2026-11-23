# Phát hành Muby lên App Store và Google Play

Làm lần lượt từ trên xuống. Phần đánh dấu **(một lần)** chỉ làm lần đầu.

## 1. Tài khoản (một lần)

| Việc | Ở đâu | Phí |
|---|---|---|
| Apple Developer Program | developer.apple.com/programs | 99 USD/năm |
| Google Play Console | play.google.com/console | 25 USD một lần |
| Expo (EAS) | expo.dev | Miễn phí (gói Free đủ cho vài bản build/tháng) |
| Supabase | supabase.com | Miễn phí lúc đầu |

## 2. SMS OTP thật bằng Supabase (một lần)

1. Tạo project mới trên Supabase, chọn vùng Singapore (gần Việt Nam).
2. **Authentication › Sign In / Providers › Phone**: bật Phone.
3. Chọn nhà cung cấp SMS (ví dụ Twilio) và điền thông tin tài khoản của nhà cung cấp đó. Supabase không tự gửi SMS, phí SMS tính theo nhà cung cấp.
4. **Authentication › Sign In / Providers › Phone › Test phone numbers**: thêm một số để Apple/Google duyệt app, ví dụ `+84900000000` với mã `123456`. Số này không tốn SMS.
5. **Project Settings › API**: chép `Project URL` và `anon public key`.
6. Trong máy Mac, vào thư mục `app`, sao chép `.env.example` thành `.env.local` và dán 2 giá trị vào. File `.env.local` không được đưa lên GitHub.
7. (Để nút "Xoá tài khoản" xoá cả trên máy chủ) cài Supabase CLI rồi chạy trong thư mục gốc repo:
   `supabase functions deploy delete-account --project-ref <mã project>`

Không có `.env.local`, app chạy chế độ demo: mã OTP hiện trên màn hình, không gửi SMS.

## 3. Sản phẩm Premium 79.000đ (một lần)

Mã sản phẩm phải giống hệt trên cả hai store: **`muby_premium_lifetime`**

**App Store Connect**
1. My Apps › **+** › New App: tên Muby, bundle ID `com.genxlearn.muby`, ngôn ngữ chính Tiếng Việt.
2. Monetization › In-App Purchases › **+** › **Non-Consumable**.
3. Product ID `muby_premium_lifetime`, tên hiển thị "Muby Premium trọn đời".
4. Price: chọn mức giá 79.000đ ở Việt Nam (bảng giá của Apple; các nước khác tự quy đổi).
5. Thêm ảnh chụp màn hình Paywall cho mục Review, rồi gửi kèm bản app đầu tiên.
6. Agreements, Tax, and Banking: ký thoả thuận Paid Apps và điền tài khoản ngân hàng, nếu không sẽ không bán được.

**Google Play Console**
1. Tạo ứng dụng Muby, package `com.genxlearn.muby`.
2. Phải tải lên một bản build trước (bước 4) thì mới tạo được sản phẩm.
3. Monetize › Products › **In-app products** › Create: ID `muby_premium_lifetime`, giá 79.000đ, Activate.
4. Thiết lập hồ sơ thanh toán (Payments profile) để nhận tiền.

App lấy giá hiển thị từ store, nên đổi giá sau này chỉ cần sửa trên store.

## 4. Đóng gói và gửi lên store

Nhấp đúp **`Dong goi Muby.command`** ở thư mục gốc repo. Script sẽ:
1. Lấy code mới nhất nhánh `ui-v2`.
2. Kiểm tra `.env.local` và đưa khoá Supabase lên EAS.
3. Hỏi đăng nhập Expo (lần đầu), hỏi chọn iOS / Android.
4. Build trên máy chủ EAS rồi tự gửi lên TestFlight và Google Play (thử nghiệm nội bộ).

Lần đầu, EAS sẽ hỏi Apple ID và tự tạo chứng chỉ; với Android cần tải file khoá dịch vụ Google (Service Account) theo hướng dẫn hiện ra. Cứ làm theo câu hỏi trong cửa sổ.

Mỗi lần build, số build tự tăng. Khi ra phiên bản mới cho người dùng, tăng `version` trong `app/app.json` (ví dụ 1.0.0 → 1.0.1).

## 5. Thử trước khi nộp duyệt

- iOS: cài từ TestFlight, mua Premium bằng tài khoản Sandbox (App Store Connect › Users and Access › Sandbox).
- Android: thêm email vào danh sách người thử nội bộ và danh sách License testing để mua thử không mất tiền.
- Kiểm tra: đăng nhập SMS, "Dùng thử, đăng nhập sau", mua, "Khôi phục giao dịch", "Xoá tài khoản".

## 6. Nộp duyệt

**Ghi chú cho người duyệt (App Review Notes)**, dán nguyên văn:

> Muby can be used without an account: tap "Dùng thử, đăng nhập sau" on the first screen.
> To test SMS login, use phone 900000000 (+84) and code 123456.
> Premium (muby_premium_lifetime) is a one-time non-consumable purchase. "Khôi phục giao dịch" is in the paywall and in Mama › Tài khoản. Account deletion: Mama › Tài khoản › Xoá tài khoản.

**Những mục bắt buộc trên store**
- Đường link Chính sách quyền riêng tư (xem trang đã chuẩn bị, bấm Share để công khai link).
- App Privacy (Apple) / Data safety (Google): app lưu số điện thoại (đăng nhập) và dữ liệu chăm bé trên máy; không quảng cáo, không theo dõi người dùng, không bán dữ liệu.
- Ảnh chụp màn hình: iPhone 6,9" (1320×2868) và điện thoại Android, tối thiểu 3 ảnh.
- Phân loại độ tuổi: chọn "không có nội dung nhạy cảm"; app dành cho cha mẹ, không phải cho trẻ em.

## 7. Nội dung trang store (tiếng Việt)

**Tên**: Muby - Hiểu bé theo từng leap
**Phụ đề (iOS, ≤ 30 ký tự)**: Leap, nhật ký bé, dỗ bé
**Từ khoá (iOS, ≤ 100 ký tự)**: wonder weeks,tuần khủng hoảng,leap,nhật ký bé,theo dõi bé,cữ bú,giấc ngủ,mẹ bỉm,sơ sinh

**Mô tả ngắn (Android, ≤ 80 ký tự)**: Biết trước tuần khó chịu của bé, ghi cữ bú, giấc ngủ chỉ hai chạm.

**Mô tả**
Muby giúp mama hiểu vì sao bé quấy, bám mẹ hay ngủ kém trong những tuần phát triển nhảy vọt (leap), và nên làm gì mỗi ngày.

- Dự báo leap theo ngày dự sinh: biết trước tuần nào bé dễ khó chịu, mức độ từng ngày trong 7 ngày tới.
- Việc nên làm hôm nay: gợi ý ngắn, đúng giai đoạn bé đang trải qua.
- Ghi nhanh hai chạm: cữ ăn, giấc ngủ, tã, cảm xúc; chọn được giờ khi ghi muộn.
- Đếm giờ bú mẹ trái/phải, nhắc bên bú lần trước. Đếm giờ ngủ, bấm "Bé dậy rồi" là xong.
- "Bé đang học": đánh dấu kỹ năng mới của bé trong mỗi leap.
- Tiếng ồn trắng và âm thanh dỗ bé, phát không cần mạng.

Muby Premium: mua một lần 79.000đ, dùng trọn đời, không gia hạn, không trừ tiền tự động. 7 ngày đầu mọi tính năng đều mở.

Nội dung trong Muby mang tính tham khảo, không thay thế tư vấn y khoa. Khi lo lắng về sức khoẻ của bé, hãy hỏi bác sĩ nhi.
