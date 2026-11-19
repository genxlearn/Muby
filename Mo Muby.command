#!/bin/bash
# ------------------------------------------------------------
#  Mở Muby — nhấp đúp file này trong Finder để chạy app.
#  Tự làm hết: chọn bản UI, tải code mới nhất, cài thư viện
#  khi cần, rồi bật Expo và hiện mã QR để quét bằng Expo Go.
# ------------------------------------------------------------

# Chạy từ một bản sao tạm, để việc đổi nhánh không xoá mất
# chính file này giữa chừng.
if [ -z "$MUBY_LAUNCHER_COPY" ]; then
  REPO="$(cd "$(dirname "$0")" && pwd)"
  TMP="$(mktemp -t muby-launcher).command"
  cp "$0" "$TMP"
  MUBY_LAUNCHER_COPY=1 MUBY_REPO="$REPO" exec bash "$TMP"
fi

REPO="$MUBY_REPO"
cd "$REPO" || exit 1

say_err() {
  echo ""
  echo "❌ $1"
  osascript -e "display alert \"Muby chưa mở được\" message \"$1\"" >/dev/null 2>&1
  echo ""
  read -n 1 -s -r -p "Nhấn phím bất kỳ để đóng cửa sổ này…"
  exit 1
}

clear
echo "🍑  Muby — đang chuẩn bị…"
echo ""

# 1. Cần Node.js
export PATH="/opt/homebrew/bin:/usr/local/bin:$PATH"
if ! command -v npm >/dev/null 2>&1; then
  open "https://nodejs.org/en/download"
  say_err "Máy chưa có Node.js. Mình đã mở trang tải — bạn cài bản LTS (file .pkg), rồi nhấp đúp lại file Mo Muby."
fi

# 2. Chọn bản UI
CHOICE=$(osascript -e 'choose from list {"UI v2.0 (mới)", "UI v1.0 (cũ)"} with title "Muby" with prompt "Bạn muốn mở bản nào?" default items {"UI v2.0 (mới)"}' 2>/dev/null)
case "$CHOICE" in
  "UI v1.0 (cũ)") BRANCH="ui-v1.0-stable" ;;
  "false") echo "Đã huỷ."; exit 0 ;;
  *) BRANCH="ui-v2" ;;
esac
echo "→ Bản đã chọn: $CHOICE ($BRANCH)"

# 3. Lấy code mới nhất của nhánh đó
echo "→ Đang tải code mới nhất…"
git fetch origin "+refs/heads/$BRANCH:refs/remotes/origin/$BRANCH" --quiet || say_err "Không tải được code từ GitHub. Kiểm tra mạng, hoặc mở GitHub Desktop đăng nhập lại."
git checkout -B "$BRANCH" "origin/$BRANCH" --quiet 2>/dev/null \
  || say_err "Có file đang sửa dở trên máy nên chưa đổi bản được. Mở GitHub Desktop, chọn Discard changes (hoặc Stash), rồi thử lại."

# 4. Cài thư viện chỉ khi danh sách thư viện thay đổi
cd "$REPO/app" || say_err "Không thấy thư mục app."
LOCK_HASH=$(cat package.json package-lock.json 2>/dev/null | shasum | cut -d' ' -f1)
if [ ! -d node_modules ] || [ "$(cat node_modules/.muby-hash 2>/dev/null)" != "$LOCK_HASH" ]; then
  echo "→ Đang cài thư viện (lần đầu mất vài phút)…"
  npm install --no-audit --no-fund || say_err "Cài thư viện bị lỗi. Chụp màn hình cửa sổ này gửi Claude nhé."
  echo "$LOCK_HASH" > node_modules/.muby-hash
fi

# 5. Bật Expo
echo ""
echo "✅ Xong! Mở app Expo Go trên điện thoại và quét mã QR bên dưới."
echo "   (Điện thoại và Mac cần dùng chung Wi-Fi. Đóng cửa sổ này để tắt app.)"
echo ""
npx expo start -c
