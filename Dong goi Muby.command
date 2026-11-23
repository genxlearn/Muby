#!/bin/bash
# ------------------------------------------------------------
#  Đóng gói Muby - nhấp đúp để build bản phát hành và gửi lên
#  App Store Connect (TestFlight) và Google Play (thử nghiệm nội bộ).
#  Lần đầu, EAS sẽ hỏi đăng nhập Expo, Apple ID và tạo chứng chỉ:
#  cứ làm theo câu hỏi trong cửa sổ này.
# ------------------------------------------------------------
REPO="$(cd "$(dirname "$0")" && pwd)"
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"

fail() {
  echo ""; echo "❌ $1"
  osascript -e "display alert \"Chưa đóng gói được\" message \"$1\"" >/dev/null 2>&1
  read -n 1 -s -r -p "Nhấn phím bất kỳ để đóng…"; exit 1
}

clear
echo "📦  Muby - chuẩn bị đóng gói bản phát hành"
echo ""
command -v npm >/dev/null 2>&1 || { open "https://nodejs.org/en/download"; fail "Máy chưa có Node.js. Cài bản LTS rồi chạy lại nhé."; }

cd "$REPO" || exit 1
echo "→ Lấy code mới nhất (nhánh ui-v2)…"
git fetch origin "+refs/heads/ui-v2:refs/remotes/origin/ui-v2" --quiet || fail "Không tải được code từ GitHub."
git checkout -B ui-v2 origin/ui-v2 --quiet 2>/dev/null || fail "Có file đang sửa dở. Mở GitHub Desktop, chọn Discard changes rồi thử lại."

cd "$REPO/app" || fail "Không thấy thư mục app."

# 1. Khoá Supabase cho SMS thật
if [ ! -f .env.local ] || ! grep -q "^EXPO_PUBLIC_SUPABASE_URL=https://" .env.local || grep -q "xxxxxxxx" .env.local; then
  ANSWER=$(osascript -e 'button returned of (display dialog "Chưa có khoá Supabase trong app/.env.local, nên bản build sẽ dùng chế độ demo (mã OTP hiện trên màn hình, không gửi SMS).\n\nXem hướng dẫn trong docs/PHAT-HANH.md." buttons {"Huỷ", "Vẫn build bản demo"} default button "Huỷ" with title "Muby")' 2>/dev/null)
  [ "$ANSWER" = "Vẫn build bản demo" ] || { echo "Đã huỷ."; exit 0; }
fi

echo "→ Cài thư viện…"
npm install --no-audit --no-fund || fail "Cài thư viện bị lỗi."

echo "→ Kiểm tra đăng nhập Expo…"
npx --yes eas-cli whoami >/dev/null 2>&1 || npx --yes eas-cli login || fail "Chưa đăng nhập được Expo."

# 2. Đưa khoá Supabase lên EAS (bản build trên máy chủ EAS không đọc .env.local)
if [ -f .env.local ]; then
  while IFS='=' read -r KEY VALUE; do
    case "$KEY" in
      EXPO_PUBLIC_SUPABASE_URL|EXPO_PUBLIC_SUPABASE_ANON_KEY)
        [ -n "$VALUE" ] && npx --yes eas-cli env:create --name "$KEY" --value "$VALUE" --environment production --visibility plaintext --force --non-interactive >/dev/null 2>&1 \
          && echo "   ✓ $KEY đã lưu trên EAS" ;;
    esac
  done < .env.local
fi

# 3. Chọn nền tảng
CHOICE=$(osascript -e 'choose from list {"iOS và Android", "Chỉ iOS", "Chỉ Android"} with title "Muby" with prompt "Đóng gói cho nền tảng nào?" default items {"iOS và Android"}' 2>/dev/null)
case "$CHOICE" in
  "Chỉ iOS") PLATFORM=ios ;;
  "Chỉ Android") PLATFORM=android ;;
  "false") echo "Đã huỷ."; exit 0 ;;
  *) PLATFORM=all ;;
esac

echo ""
echo "→ Build bản phát hành ($PLATFORM) trên máy chủ EAS và tự gửi lên store…"
echo "   (thường mất 15-30 phút; có thể đóng cửa sổ, tiến độ xem ở expo.dev)"
echo ""
npx --yes eas-cli build --platform "$PLATFORM" --profile production --auto-submit || fail "Build hoặc gửi lên store bị lỗi. Xem dòng báo lỗi phía trên."

echo ""
echo "✅ Xong. iOS: vào App Store Connect › TestFlight. Android: Play Console › Thử nghiệm nội bộ."
read -n 1 -s -r -p "Nhấn phím bất kỳ để đóng…"
