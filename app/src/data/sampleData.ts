/* ============================================================
   SAMPLE DATA v4 — leap-specific content, action cards, symptoms.
   One baby: Bống, ~3.5 months, mid-Leap 4. Ported from data.jsx.
   ============================================================ */
import { Emotion } from '../mascot/Bong';

export interface Baby {
  name: string; ageWeeks: number; ageLabel: string; dob: string;
  gender: string; weight: number; height: number; head: number;
}

export interface LeapAction {
  emoji: string; title: string; why: string; what: string; hasSound?: boolean;
}
export interface SunnyPlay { title: string; desc: string }
export interface Leap {
  n: number; world: string; fullName: string; wk: number; range: [number, number];
  skill: string; desc: string; symptoms: string[]; actions: LeapAction[]; sunnyPlay: SunnyPlay[];
}

export const BABY: Baby = {
  name: 'Bống',
  ageWeeks: 15,
  ageLabel: '3 tháng 12 ngày',
  dob: '21/02/2026',
  gender: 'Bé gái',
  weight: 6.4,
  height: 61,
  head: 40.2,
};

export const LEAPS: Leap[] = [
  {
    n: 1, world: 'Cảm giác', fullName: 'Thế giới cảm giác', wk: 5, range: [4.5, 5.5],
    skill: 'nhận biết cảm giác mới trên cơ thể',
    desc: 'Con lần đầu cảm nhận rõ xúc giác, thị giác thay đổi. Mọi thứ bỗng "sống động" hơn — có thể khiến bé choáng ngợp.',
    symptoms: ['Giật mình nhiều hơn', 'Nhìn chăm chú xa hơn', 'Muốn bú liên tục'],
    actions: [
      { emoji: '🤱', title: 'Bé bú liên tục, không chịu rời mẹ', why: 'Cảm giác mới khiến bé cần sự an toàn. Da kề da là liều thuốc tốt nhất.', what: 'Bế sát ngực, cho bú theo nhu cầu. Không cần lịch cố định ở tuần này.' },
      { emoji: '😴', title: 'Giật mình, khó ngủ sâu', why: 'Não bộ "bật" cảm giác mới → dễ bị kích thích. Giấc ngủ bị chia nhỏ là bình thường.', what: 'Quấn chặt, tiếng ồn trắng, phòng tối. Cho bé nằm nghiêng khi dỗ.' },
      { emoji: '👀', title: 'Bé nhìn chăm chăm một chỗ', why: 'Thị giác đang "nâng cấp." Con tập lấy nét và theo dõi vật di chuyển.', what: 'Để đồ vật cách 20-30cm, di chuyển chậm. Không cần can thiệp — bé đang học!' },
    ],
    sunnyPlay: [
      { title: 'Nhìn theo đồ chơi', desc: 'Đưa đồ chơi màu sáng qua lại chậm, cách mặt 20-30cm — bé tập theo dõi.' },
      { title: 'Massage nhẹ nhàng', desc: 'Vuốt nhẹ từ vai xuống tay, từ hông xuống chân — bé khám phá xúc giác.' },
      { title: 'Nghe giọng mama', desc: 'Kề sát và nói chuyện nhỏ nhẹ — giọng mẹ là âm thanh an toàn nhất.' },
    ],
  },
  {
    n: 2, world: 'Hoa văn', fullName: 'Thế giới hoa văn', wk: 8, range: [7.5, 9.5],
    skill: 'nhận ra hình mẫu lặp lại quanh mình',
    desc: 'Con bắt đầu nhận ra patterns — bàn tay mình luôn ở đó, tiếng mẹ quen thuộc, mặt người có mắt-mũi-miệng. Thế giới bắt đầu có "trật tự."',
    symptoms: ['Ngắm hai bàn tay', 'Lắng nghe âm thanh lặp lại', 'Hay cười xã giao'],
    actions: [
      { emoji: '🍼', title: 'Bé đòi bú nhưng ngậm rồi nhả', why: 'Con đang "nghiên cứu" cảm giác bú — thử đẩy, kéo, nếm. Không phải từ chối.', what: 'Kiên nhẫn, cho bú nơi yên tĩnh. Nếu bé nhả, chờ 2-3 phút rồi thử lại.' },
      { emoji: '😢', title: 'Khóc đột ngột không rõ lý do', why: 'Não nhận pattern mới → đôi khi "quá tải." Bé cần reset bằng sự gần gũi.', what: 'Ôm sát, vỗ nhẹ lưng theo nhịp đều. Tiếng shh-shh hoặc máy ồn trắng.' },
      { emoji: '🌙', title: 'Giấc ngủ thất thường', why: 'Não hoạt động mạnh hơn bình thường để xử lý hoa văn mới. Giấc ngủ bị phá vỡ.', what: 'Routine trước ngủ ổn định: tắm → massage → bú → hát → tắt đèn. Lặp lại mỗi tối.' },
    ],
    sunnyPlay: [
      { title: 'Gương thần kỳ', desc: 'Đặt gương an toàn trước mặt — bé mê mẩn khuôn mặt mình!' },
      { title: 'Đen trắng tương phản', desc: 'Dùng thẻ đen-trắng hoặc sách tương phản. Bé đang yêu patterns.' },
      { title: 'Nhạc có nhịp', desc: 'Hát hoặc bật nhạc có nhịp rõ. Bé bắt đầu nhận ra sự lặp lại.' },
    ],
  },
  {
    n: 3, world: 'Chuyển tiếp', fullName: 'Thế giới chuyển tiếp mượt mà', wk: 12, range: [11.5, 12.5],
    skill: 'điều khiển cử động mượt mà hơn',
    desc: 'Cử động từ giật cục → mượt mà. Con với lấy đồ vật, đưa tay vào miệng có chủ đích. Giọng nói bắt đầu thay đổi âm lượng, cao thấp.',
    symptoms: ['Với lấy đồ vật', 'Cho tay vào miệng', 'Bi bô nhiều hơn'],
    actions: [
      { emoji: '🤚', title: 'Bé liên tục cho tay vào miệng', why: 'Con đang luyện kỹ năng phối hợp tay-miệng — không phải đói hay mọc răng!', what: 'Để bé tự khám phá. Giữ tay sạch. Đưa đồ chơi an toàn thay thế nếu muốn.' },
      { emoji: '😤', title: 'Bé cáu khi không với được đồ', why: 'Con MUỐN chạm nhưng tay chưa đủ khéo. Sự frustration này là DẤU HIỆU TỐT — bé đang cố gắng.', what: 'Đặt đồ vật gần hơn một chút (không quá dễ). Cổ vũ khi bé chạm được.' },
      { emoji: '🗣️', title: 'Giọng bé thay đổi bất thường', why: 'Bé đang thử nghiệm thanh quản — cao, thấp, to, nhỏ. Đây là tiền ngôn ngữ.', what: 'Trả lời bé! Lặp lại âm thanh bé tạo ra. "Hội thoại" này cực kỳ quan trọng.' },
    ],
    sunnyPlay: [
      { title: 'Tummy Time nâng cao', desc: 'Nằm sấp với đồ chơi phía trước — bé luyện với tay và nâng đầu.' },
      { title: 'Tập lẫy sấp-ngửa', desc: 'Đặt đồ chơi bên cạnh, khuyến khích bé nghiêng người. Hỗ trợ nhẹ nếu cần.' },
      { title: 'Lắc lắc nghe nghe', desc: 'Lắc lục lạc chậm, đổi hướng — bé luyện quay đầu theo âm thanh.' },
    ],
  },
  {
    n: 4, world: 'Sự kiện', fullName: 'Thế giới sự kiện phức tạp', wk: 19, range: [14.5, 19.5],
    skill: 'hiểu nguyên nhân → kết quả',
    desc: 'Con bắt đầu hiểu rằng hành động tạo ra kết quả.\nRơi đồ chơi → tiếng động. Đẩy ti → sữa hết. Khóc → mẹ đến.\nNão bộ đang nâng cấp lớn — thật kỳ diệu!',
    symptoms: ['Cho tay vào miệng', 'Ngủ ngày ngắn', 'Bám mẹ, nhát lạ'],
    actions: [
      { emoji: '🍼', title: 'Bé ọc sữa / từ chối bú', why: 'Bé đang "nghiên cứu" nên dễ phân tâm lúc ăn. Không phải chán sữa!', what: 'Bú ít + thường xuyên hơn. Vỗ ợ 5-10 phút sau mỗi cữ bú. Bế thẳng 20 phút sau ăn.', hasSound: false },
      { emoji: '🌙', title: 'Giấc ngủ ngày ngắn', why: 'Não bộ hoạt động mạnh → giấc bị chia nhỏ. Bé cần nhiều giấc ngắn hơn.', what: 'Phòng tối + ồn trắng + 24-26°C. Đặt bé xuống khi mắt lim dim, chưa ngủ hẳn.', hasSound: true },
      { emoji: '🤱', title: 'Bé bám mẹ, nhát lạ', why: 'Bé MỚI hiểu "mẹ đi = mẹ mất." Đây là bước phát triển nhận thức quan trọng.', what: 'Bế địu da kề da. Chơi peek-a-boo để bé học "mẹ đi rồi mẹ quay lại."', hasSound: false },
    ],
    sunnyPlay: [
      { title: 'Trốn tìm với khăn', desc: 'Che mặt rồi ló ra — bé học nguyên nhân → kết quả (che = mất, mở = có!).' },
      { title: 'Rơi và nhặt', desc: 'Thả đồ vật từ bàn xuống. Bé sẽ mê nhìn — đang học lực hấp dẫn đấy!' },
      { title: 'Nút bấm phát nhạc', desc: 'Đồ chơi bấm → phát nhạc. Bé hiểu "hành động mình tạo ra kết quả."' },
    ],
  },
  {
    n: 5, world: 'Quan hệ', fullName: 'Thế giới của khoảng cách & quan hệ', wk: 26, range: [22.5, 26.5],
    skill: 'nhận biết khoảng cách có ý nghĩa',
    desc: 'Bé hiểu rằng mẹ có thể ĐI XA. Khoảng cách giờ đáng sợ. Separation anxiety bắt đầu — và hoàn toàn bình thường.',
    symptoms: ['Khóc khi mẹ rời phòng', 'Giơ tay đòi bế', 'Không chịu người lạ'],
    actions: [
      { emoji: '🚪', title: 'Bé khóc khi mẹ rời phòng', why: 'Con ĐÃ HIỂU mẹ có thể biến mất — nhưng CHƯA HIỂU mẹ sẽ quay lại.', what: 'Nói "Mẹ ra ngoài rồi quay lại nhé." Peek-a-boo ở cửa phòng. ĐỪNG lẻn đi.' },
      { emoji: '😰', title: 'Nhát lạ đột ngột', why: 'Bé phân biệt rõ "quen" và "lạ." Người lạ = nguy hiểm tiềm tàng trong logic của bé.', what: 'Cho người mới đến gần TỪ TỪ. Bé ngồi trong lòng mẹ khi gặp người lạ.' },
      { emoji: '🛏️', title: 'Thức đêm, đòi mẹ', why: 'Nửa đêm tỉnh dậy + không thấy mẹ = hoảng. Bé cần xác nhận mẹ vẫn ở đây.', what: 'Vỗ nhẹ, không bật đèn sáng. Giọng mẹ trầm, đều. Đặt áo mẹ cạnh bé.' },
    ],
    sunnyPlay: [
      { title: 'Peek-a-boo nâng cao', desc: 'Trốn sau cửa, gọi tên bé, ló ra — bé học mẹ luôn quay lại!' },
      { title: 'Đặt tên mọi thứ', desc: 'Chỉ vào đồ vật và nói tên. Bé đang gắn "từ" vào "vật" rất nhanh.' },
      { title: 'Bò tìm kho báu', desc: 'Giấu đồ chơi dưới chăn. Bé tập bò tới và lật tìm — phần thưởng!' },
    ],
  },
  {
    n: 6, world: 'Phân loại', fullName: 'Thế giới phân loại', wk: 37, range: [33.5, 37.5],
    skill: 'sắp xếp thế giới theo nhóm',
    desc: 'Bé bắt đầu phân loại: đây là chó, đây cũng là chó dù khác màu. Thức ăn vs đồ chơi. Mọi thứ có "loại."',
    symptoms: ['So sánh hai đồ vật', 'Thử sờ mọi bề mặt', 'Bỏ đồ vào hộp'],
    actions: [
      { emoji: '🐕', title: 'Bé chỉ vào mọi thứ, phản ứng lạ', why: 'Con đang "dán nhãn" mọi thứ. Mèo nhà vs mèo ảnh → cùng loại! Bé đang vui mừng.', what: 'Trả lời khi bé chỉ: "Đúng rồi, đó là con mèo!" Mỗi câu trả lời giúp bé phân loại.' },
      { emoji: '🍽️', title: 'Bé chọn lọc thức ăn kỹ hơn', why: 'Bé phân biệt loại thức ăn rồi! "Cái này thuộc nhóm ngon, cái kia không."', what: 'Cho thử nhiều kết cấu. Trộn mới + quen. Không ép — bé đang phân loại.' },
      { emoji: '🧸', title: 'Ném đồ xuống đất liên tục', why: 'Không phải nghịch — bé đang PHÂN LOẠI "gì rơi" vs "gì dính." Đây là thí nghiệm khoa học!', what: 'Cho đồ an toàn. Nói "rơi rồi!" khi bé thả. Bé sẽ mê phản ứng nhất quán của mẹ.' },
    ],
    sunnyPlay: [
      { title: 'Phân loại đồ chơi', desc: 'Bỏ bóng vào rổ, khối vuông vào hộp — bé luyện nhóm theo hình dạng.' },
      { title: 'Sách có nắp lật', desc: 'Flap books cực phù hợp — lật nắp = bất ngờ thuộc cùng "loại" trang.' },
      { title: 'Đồ ăn cầm tay', desc: 'Xếp 2-3 loại finger food khác nhau. Bé tự chọn = luyện phân loại.' },
    ],
  },
  {
    n: 7, world: 'Trình tự', fullName: 'Thế giới trình tự', wk: 46, range: [41.5, 46.5],
    skill: 'hiểu thứ tự trước-sau',
    desc: 'Bé hiểu: mặc giày TRƯỚC KHI ra ngoài. Rửa tay TRƯỚC KHI ăn. Trình tự bắt đầu có ý nghĩa.',
    symptoms: ['Chỉ ra ngoài đòi đi chơi', 'Bắt chước chuỗi hành động', 'Nổi nóng khi bị gián đoạn'],
    actions: [], sunnyPlay: [],
  },
  {
    n: 8, world: 'Kế hoạch', fullName: 'Thế giới kế hoạch', wk: 55, range: [50.5, 55.5],
    skill: 'bắt đầu có ý định & kế hoạch riêng',
    desc: 'Bé không chỉ phản ứng nữa — con bắt đầu LÊN KẾ HOẠCH. Muốn lấy bánh trên bàn → kéo ghế lại → trèo lên.',
    symptoms: ['Tự đi lấy đồ vật', 'Nói "không" nhiều hơn', 'Bắt đầu giận dữ khi bị can'],
    actions: [], sunnyPlay: [],
  },
  {
    n: 9, world: 'Nguyên tắc', fullName: 'Thế giới nguyên tắc', wk: 64, range: [59.5, 64.5],
    skill: 'thử nghiệm ranh giới & nguyên tắc',
    desc: 'Bé thử mọi giới hạn: "Nếu mình ném cơm thì sao?" "Nếu mình không chịu mặc áo?" Đây là nghiên cứu, không phải bướng.',
    symptoms: ['Ném đồ để thử phản ứng', 'Nói "không" và chờ xem', 'Cười khi bị mắng nhẹ'],
    actions: [], sunnyPlay: [],
  },
  {
    n: 10, world: 'Hệ thống', fullName: 'Thế giới hệ thống', wk: 75, range: [70.5, 79.5],
    skill: 'hiểu mình là một cá thể trong hệ thống',
    desc: 'Bé hiểu: "Mình là mình. Mẹ là mẹ. Bạn là bạn." Ý thức bản thân hình thành — một cột mốc vĩ đại.',
    symptoms: ['Nhận ra mình trong gương', 'Dùng "con" hoặc tên mình', 'Muốn tự làm mọi thứ'],
    actions: [], sunnyPlay: [],
  },
];

export const CURRENT_LEAP: Leap = LEAPS[3]; // Leap 4
export const LEAP_DAY = 5;
export const LEAP_TOTAL = 14;

export interface ForecastDay { day: string; n: number; today: boolean }
export const FORECAST: ForecastDay[] = [
  { day: 'T2', n: 3, today: false },
  { day: 'T3', n: 4, today: false },
  { day: 'T4', n: 3, today: true },
  { day: 'T5', n: 5, today: false },
  { day: 'T6', n: 4, today: false },
  { day: 'T7', n: 3, today: false },
  { day: 'CN', n: 2, today: false },
];

export const EASY_INFO = {
  variant: 'EASY 3',
  desc: 'Eat → Activity → Sleep → Your time. Một chu kỳ lặp lại giúp bé dự đoán được điều gì xảy ra tiếp theo.',
  detail: 'Ở 3.5 tháng, hầu hết bé theo nhịp EASY 3 (ăn-chơi-ngủ mỗi 3 giờ). Nhưng mỗi bé có nhịp riêng — EASY là khung tham khảo, không phải lịch cứng.',
  note: 'Trong leap, bé có thể ăn thêm hoặc ngủ sớm — điều đó hoàn toàn bình thường.',
};

export interface RecentLog { type: string; icon: string; label: string; detail: string; time: string; ago: string }
export const RECENT_LOGS: RecentLog[] = [
  { type: 'feed', icon: '🍼', label: 'Cữ ăn', detail: '80ml', time: '08:15', ago: '1g trước' },
  { type: 'sleep', icon: '🌙', label: 'Giấc ngủ', detail: '1g 40p', time: '06:20', ago: '3g trước' },
  { type: 'diaper', icon: '💧', label: 'Tã', detail: 'Ướt', time: '06:10', ago: '3g trước' },
  { type: 'mood', icon: '💛', label: 'Cảm xúc', detail: 'Vui vẻ', time: '05:50', ago: '4g trước' },
  { type: 'feed', icon: '🍼', label: 'Cữ ăn', detail: '90ml', time: '05:30', ago: '4g trước' },
];

export interface LogItem { type: string; icon: string; label: string; time: string }
export interface LogGroup { date: string; items: LogItem[] }
export const LOG_HISTORY: LogGroup[] = [
  {
    date: 'Hôm nay · T4', items: [
      { type: 'feed', icon: '🍼', label: 'Cữ ăn · 80ml', time: '08:15' },
      { type: 'sleep', icon: '🌙', label: 'Giấc ngủ · 1g 40p', time: '06:20' },
      { type: 'diaper', icon: '💧', label: 'Tã · Ướt', time: '06:10' },
      { type: 'mood', icon: '💛', label: 'Cảm xúc · Vui vẻ', time: '05:50' },
    ],
  },
  {
    date: 'Hôm qua · T3', items: [
      { type: 'feed', icon: '🍼', label: 'Cữ ăn · 90ml', time: '21:40' },
      { type: 'soothe', icon: '🎵', label: 'Dỗ bé · Tiếng shh-shh 30p', time: '20:10' },
      { type: 'sleep', icon: '🌙', label: 'Giấc ngủ · 2g 05p', time: '13:30' },
      { type: 'diaper', icon: '💧', label: 'Tã · Bẩn', time: '12:15' },
    ],
  },
];

export interface CalendarWeek { w: number; n: number; current: boolean }
export function buildCalendar(): CalendarWeek[] {
  const weeks: CalendarWeek[] = [];
  for (let w = 1; w <= 77; w++) {
    let n = 1;
    for (const lp of LEAPS) {
      if (w >= lp.range[0] && w <= lp.range[1]) {
        const mid = lp.wk;
        n = Math.max(2, 5 - Math.round(Math.abs(w - mid) * 1.3));
      }
    }
    weeks.push({ w, n, current: w === BABY.ageWeeks });
  }
  return weeks;
}

export interface Article { tag: string; color: string; title: string; mins: number }
/** `color` refers to an intensity level (1-5) or a named token, resolved in the UI. */
export const LIBRARY: { tag: string; colorKey: string; title: string; mins: number }[] = [
  { tag: 'LEAP 4', colorKey: 'intensity4', title: 'Vì sao bé bám mẹ hơn tuần này', mins: 4 },
  { tag: 'EASY', colorKey: 'intensity1', title: 'Phương pháp EASY — khung tham khảo cho nhịp sinh hoạt', mins: 5 },
  { tag: 'GIẤC NGỦ', colorKey: 'intensity2', title: 'Giúp bé vào giấc khi đang leap', mins: 5 },
  { tag: 'ĂN', colorKey: 'accentSoftBg', title: 'Cữ ăn thay đổi trong giai đoạn này', mins: 3 },
  { tag: 'CẢM XÚC', colorKey: 'intensity3', title: 'Chăm sóc chính mình ở tuần khó', mins: 4 },
];

export interface Soothing { id: string; name: string; emoji: string; premium: boolean; tintKey: string }
export const SOOTHING: Soothing[] = [
  { id: 'shh', name: 'Tiếng shh-shh', emoji: '🤫', premium: false, tintKey: 'accentSoftBg' },
  { id: 'rain', name: 'Tiếng mưa rơi', emoji: '🌧️', premium: true, tintKey: 'intensity4' },
  { id: 'stream', name: 'Tiếng suối chảy', emoji: '🌊', premium: true, tintKey: 'intensity1' },
];

export interface Notif { icon: string; text: string; time: string; unread: boolean }
export const NOTIFS: { today: Notif[]; earlier: Notif[] } = {
  today: [
    { icon: '🌧️', text: 'Hôm nay bé cần mama nhiều hơn. Cứ ôm con thật chặt nhé.', time: '07:00', unread: true },
    { icon: '🍼', text: 'Bé đang trong Leap 4 — có thể bú ít hơn bình thường. Hoàn toàn bình thường.', time: '09:15', unread: true },
  ],
  earlier: [
    { icon: '💚', text: 'Đã lưu số đo mới. Bé đang phát triển khoẻ mạnh.', time: 'Hôm qua', unread: false },
    { icon: '🌼', text: 'Tuần tới sẽ nhẹ nhàng hơn. Cùng chờ nắng lên nhé.', time: 'Hôm qua', unread: false },
  ],
};

export interface IntensityCopy { label: string; emoji: string; copy: string }
export const INTENSITY_COPY: Record<number, IntensityCopy> = {
  1: { label: 'Tuần nắng đẹp', emoji: '🌼', copy: 'Bé sẵn sàng học kỹ năng mới!' },
  2: { label: 'Bé thoải mái', emoji: '💛', copy: 'Bé đang thoải mái — thời điểm tuyệt vời để chơi cùng con.' },
  3: { label: 'Bé cần thêm hơi ấm', emoji: '🤍', copy: 'Bé cần thêm hơi ấm. Ôm nhiều hơn chút nhé.' },
  4: { label: 'Hôm nay khá khó', emoji: '☁️', copy: 'Hôm nay khá khó — bạn không một mình ❤️' },
  5: { label: 'Bé cần mama nhất', emoji: '🌧️', copy: 'Bé cần mama nhất hôm nay. Cứ ôm con thật chặt.' },
};

export const FORECAST_EMO: Record<number, Emotion> = {
  1: 'blissful', 2: 'happy', 3: 'uncertain', 4: 'crying', 5: 'crying',
};
