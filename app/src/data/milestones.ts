/* ============================================================
   "BÉ ĐANG HỌC" - skills a baby may start showing during each leap.
   Short, observable, one per line. Used by the leap detail checklist.
   ============================================================ */
export const LEAP_SKILLS: Record<number, string[]> = {
  1: ['Nhìn chăm chú vào mặt người lâu hơn', 'Phản ứng rõ hơn với âm thanh', 'Giật mình ít hơn khi được ôm', 'Bú có nhịp đều hơn'],
  2: ['Nhìn theo đồ vật di chuyển chậm', 'Nhìn bàn tay của chính mình', 'Phát ra tiếng "ê, a" ngắn', 'Quay đầu về phía tiếng mẹ'],
  3: ['Đưa tay vào miệng có chủ đích', 'Với về phía đồ chơi', 'Cười đáp lại khi được nói chuyện', 'Thử các tiếng cao, thấp khác nhau'],
  4: ['Nhận ra một chuỗi việc quen (tắm rồi ngủ)', 'Lắc đồ chơi để nghe tiếng', 'Nhìn theo đồ vật rơi', 'Phản ứng khi gọi tên'],
  5: ['Tìm đồ chơi bị che một phần', 'Khóc hoặc bám khi mẹ rời đi', 'Bò hoặc trườn về phía đồ vật', 'Bỏ đồ vào và lấy ra khỏi hộp'],
  6: ['Phân biệt đồ ăn thích và không thích', 'Chỉ vào hình trong sách', 'Xếp đồ theo nhóm đơn giản', 'Bắt chước một âm quen'],
  7: ['Làm theo thứ tự hai bước (lấy rồi đưa)', 'Xếp chồng 2 khối', 'Tìm đồ vật bị giấu hẳn', 'Vẫy tay chào'],
  8: ['Tự khởi động một việc quen (lấy áo để đi chơi)', 'Bắt chước cho búp bê ăn', 'Nói chuyện bập bẹ có ngữ điệu', 'Giả vờ gọi điện thoại'],
  9: ['Tự quyết định cách làm một việc', 'Thử lại khi làm chưa được', 'Nói được vài từ có nghĩa', 'Biết nói "không"'],
  10: ['Nhận ra mình trong gương', 'Gọi tên người thân', 'Chơi giả vờ ngắn', 'Thể hiện ý muốn rõ ràng'],
};

export const skillKey = (leap: number, i: number) => `${leap}:${i}`;
