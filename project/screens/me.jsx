/* ============================================================
   SCREEN 9A Notifications · 9B Profile/Me · Premium Paywall
   ============================================================ */

function NotificationsScreen({ ctx }) {
  const { NOTIFS } = BWW_DATA;
  const empty = false;
  const Group = ({ title, items }) =>
  <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', margin: '0 2px 12px' }}>{title}</div>
      <Card pad={6}>
        {items.map((nt, i) =>
      <div key={i} style={{ borderTop: i ? '1px solid var(--border-subtle)' : 'none', display: 'flex', gap: 12, padding: '13px 8px', alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--bg-sunken)', display: 'grid', placeItems: 'center', fontSize: 19, flexShrink: 0 }}>{nt.icon}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, lineHeight: 1.45, color: 'var(--text-primary)' }}>{nt.text}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{nt.time}</div>
            </div>
            {nt.unread && <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-primary)', marginTop: 6, flexShrink: 0 }} />}
          </div>
      )}
      </Card>
    </div>;

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>
      <AppBar title="Thông báo" onBack={ctx.back} />
      <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '0 20px 40px' }}>
        {empty ?
        <EmptyState emotion="happy" onesie="orange" heading="Hết rồi" helper="Dành chút thời gian cho mama nhé ☕" /> :

        <>
            <Group title="Hôm nay" items={NOTIFS.today} />
            <Group title="Trước đó" items={NOTIFS.earlier} />
            <div style={{ textAlign: 'center', padding: '16px 0', color: 'var(--text-muted)', fontSize: 13 }}>
              Hết rồi. Dành chút thời gian cho mama nhé ☕
            </div>
          </>
        }
      </div>
    </div>);

}

/* ---- Settings row helpers ---- */
function SettingsGroup({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ fontSize: 12.5, fontWeight: 700, color: 'var(--text-muted)', margin: '0 2px 12px', letterSpacing: 0.3 }}>{title}</div>
      <Card pad={6}>{children}</Card>
    </div>);

}
function Toggle({ on, onClick }) {
  return (
    <button onClick={onClick} style={{ width: 50, height: 30, borderRadius: 'var(--r-full)', background: on ? 'var(--accent-primary)' : 'var(--border-default)', position: 'relative', flexShrink: 0, transition: 'background .2s' }}>
      <span style={{ position: 'absolute', top: 3, left: on ? 23 : 3, width: 24, height: 24, borderRadius: '50%', background: '#fff', transition: 'left .2s', boxShadow: 'var(--shadow-1)' }} />
    </button>);

}
function SettingRow({ icon, label, sub, right, last, onClick }) {
  const Tag = onClick ? 'button' : 'div';
  return (
    <Tag onClick={onClick} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 8px', minHeight: 48, width: '100%', textAlign: 'left' }}>
      <span style={{ fontSize: 18, width: 24, textAlign: 'center' }}>{icon}</span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 500, color: 'var(--text-primary)' }}>{label}</div>
        {sub && <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 1 }}>{sub}</div>}
      </div>
      {right}
    </Tag>);

}

function MeScreen({ ctx }) {
  const [reminders, setReminders] = useState(true);
  const [sheet, setSheet] = useState(null); // 'baby' | 'invite' | 'units' | 'terms'
  const [units, setUnits] = useState('kg · cm');
  const [inviteMail, setInviteMail] = useState('');
  const dark = ctx.theme === 'dark';
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
    <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '6px 20px 44px' }}>
      <div className="serif" style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Mama & Bống</div>

      {/* Premium / trial state card */}
      {ctx.purchased ?
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 16px', minHeight: 44, borderRadius: 'var(--r-full)', background: 'var(--accent-soft-bg)', color: 'var(--text-primary)', fontWeight: 700, fontSize: 14, marginBottom: 24 }}>
          <Ic name="check" size={17} sw={2.6} stroke="var(--accent-primary)" /> Wonder Premium ✓
        </div> :
        ctx.trial ?
        <Card pad={16} style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'var(--success-soft)', display: 'grid', placeItems: 'center', fontSize: 20, flexShrink: 0 }}>✨</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>Đang dùng thử Premium</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-muted)', marginTop: 2 }}>Còn {ctx.trial.daysLeft} ngày · không tự gia hạn</div>
            </div>
            <button onClick={() => ctx.openPaywall('Giữ Premium mãi mãi')} style={{ padding: '11px 15px', minHeight: 44, borderRadius: 'var(--r-full)', background: 'var(--accent-primary)', color: '#fff', fontWeight: 700, fontSize: 13 }}>Giữ mãi mãi</button>
          </div>
        </Card> :

        <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', background: 'var(--text-primary)', padding: 20, position: 'relative', marginBottom: 24 }}>
          <div style={{ position: 'absolute', right: 12, bottom: 0 }}><Bong emotion="excited" onesie="orange" size={92} /></div>
          <div className="serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--bg-canvas)' }}>Wonder Premium</div>
          <div style={{ fontSize: 13.5, color: 'var(--bg-canvas)', opacity: 0.7, marginTop: 4, fontWeight: 600 }}>199.000đ · Một lần · Trọn đời</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
            {['10 leaps đầy đủ', 'Sunny Play', '3 tiếng ồn trắng', 'Đồng bộ gia đình'].map((p) =>
            <span key={p} style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--bg-canvas)', background: 'color-mix(in srgb, var(--bg-canvas) 20%, transparent)', border: '1px solid color-mix(in srgb, var(--bg-canvas) 30%, transparent)', padding: '5px 10px', borderRadius: 'var(--r-full)' }}>{p}</span>
            )}
          </div>
          <button onClick={() => ctx.openPaywall('Mở khóa Wonder Premium')} style={{ marginTop: 16, padding: '13px 22px', minHeight: 48, borderRadius: 'var(--r-full)', background: 'var(--accent-primary)', color: '#fff', fontWeight: 700, fontSize: 15 }}>Dùng thử miễn phí 1 tháng</button>
          <div style={{ fontSize: 11.5, color: 'var(--bg-canvas)', opacity: 0.55, marginTop: 12, maxWidth: 225 }}>Không cần thẻ. Không tự gia hạn. Sau 1 tháng: 199.000đ trọn đời hoặc dùng bản Free.</div>
        </div>
        }

      {/* Baby card */}
      <Card pad={16} style={{ marginBottom: 24 }}>
        <button onClick={() => setSheet('baby')} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left' }}>
          <BongFace emotion="happy" size={54} ring />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }}>{BWW_DATA.BABY.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{BWW_DATA.BABY.gender} · {BWW_DATA.BABY.ageLabel}</div>
          </div>
          <Ic name="chevron" size={18} stroke="var(--text-muted)" />
        </button>
      </Card>

      {/* Caregivers */}
      <SettingsGroup title="Người chăm bé">
        <SettingRow icon="👩" label="Mama (bạn)" sub="Chủ tài khoản" />
        <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <SettingRow icon="➕" label="Mời bố vào cùng" sub="Đồng bộ mọi ghi chép" onClick={() => setSheet('invite')} right={<Ic name="chevron" size={18} stroke="var(--text-muted)" />} />
        </div>
      </SettingsGroup>

      {/* Display */}
      <SettingsGroup title="Hiển thị">
        <SettingRow icon="🌙" label="Chế độ tối" sub="Luôn miễn phí" right={<Toggle on={dark} onClick={() => ctx.setTheme(dark ? 'light' : 'dark')} />} />
      </SettingsGroup>

      {/* Info & reminders */}
      <SettingsGroup title="Thông tin & Nhắc">
        <SettingRow icon="🔔" label="Nhắc nhẹ nhàng" sub="Cữ ăn, giấc ngủ" right={<Toggle on={reminders} onClick={() => setReminders((r) => !r)} />} />
        <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <SettingRow icon="📏" label="Đơn vị đo" sub={units} onClick={() => setSheet('units')} right={<Ic name="chevron" size={18} stroke="var(--text-muted)" />} />
        </div>
      </SettingsGroup>

      {/* About */}
      <SettingsGroup title="Về Baby Wonder Weeks">
        <SettingRow icon="💛" label="Đánh giá ứng dụng" onClick={() => ctx.toast('Cảm ơn mama! Chờ chút để mở App Store nhé 💛')} right={<Ic name="chevron" size={18} stroke="var(--text-muted)" />} />
        <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <SettingRow icon="📄" label="Điều khoản & Quyền riêng tư" onClick={() => setSheet('terms')} right={<Ic name="chevron" size={18} stroke="var(--text-muted)" />} />
        </div>
      </SettingsGroup>

      <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
        <button onClick={() => ctx.goFlow('auth', { authStep: 'A1' })} style={{ color: 'var(--danger)', fontWeight: 600, fontSize: 14.5, padding: 10 }}>Đăng xuất</button>
      </div>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>Baby Wonder Weeks v3 · 1.0.0</div>
    </div>

      {/* --- Sheets --- */}
      <Sheet open={sheet === 'baby'} onClose={() => setSheet(null)} height="52%" title={BWW_DATA.BABY.name} sub="Thông tin bé">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}><BongFace emotion="happy" size={72} ring /></div>
          <Input label="Tên bé" defaultValue={BWW_DATA.BABY.name} />
          <Input label="Ngày sinh" defaultValue="23/03/2026" />
          <ButtonPrimary onClick={() => {setSheet(null);ctx.toast('Đã lưu thông tin bé 💚');}}>Lưu thay đổi</ButtonPrimary>
        </div>
      </Sheet>

      <Sheet open={sheet === 'invite'} onClose={() => setSheet(null)} height="46%" title="Mời bố vào cùng" sub="Bố cũng thấy mọi ghi chép, dự báo của bé">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 6 }}>
          <Input label="Email của bố" type="email" placeholder="bo@email.com" value={inviteMail} onChange={(v) => setInviteMail(v)} />
          <ButtonPrimary onClick={() => {setSheet(null);setInviteMail('');ctx.toast('Đã gửi lời mời tới bố 💛');}} disabled={!inviteMail.includes('@')}>Gửi lời mời</ButtonPrimary>
          <ButtonText onClick={() => setSheet(null)} style={{ textAlign: 'center' }}>Để sau cũng được</ButtonText>
        </div>
      </Sheet>

      <Sheet open={sheet === 'units'} onClose={() => setSheet(null)} height="38%" title="Đơn vị đo">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 6 }}>
          {['kg · cm', 'lb · in'].map((u) =>
          <button key={u} onClick={() => {setUnits(u);setSheet(null);ctx.toast('Đã đổi đơn vị đo');}} style={{
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 16px', minHeight: 52,
            borderRadius: 'var(--r-md)', background: units === u ? 'var(--bg-accent-soft)' : 'var(--bg-sunken)',
            border: units === u ? '1.5px solid var(--accent-primary)' : '1.5px solid transparent',
            fontSize: 15, fontWeight: 600, color: 'var(--text-primary)'
          }}>
              {u}
              {units === u && <Ic name="check" size={19} sw={2.4} stroke="var(--accent-primary)" />}
            </button>
          )}
        </div>
      </Sheet>

      <Sheet open={sheet === 'terms'} onClose={() => setSheet(null)} height="62%" title="Điều khoản & Quyền riêng tư">
        <div style={{ fontSize: 13.5, color: 'var(--text-secondary)', lineHeight: 1.65, display: 'flex', flexDirection: 'column', gap: 12, paddingTop: 4 }}>
          <div><b style={{ color: 'var(--text-primary)' }}>Dữ liệu của bé là của bạn.</b> Mọi ghi chép (cữ ăn, giấc ngủ, đo lường, ảnh) thuộc về bạn mãi mãi — kể cả khi không dùng Premium.</div>
          <div><b style={{ color: 'var(--text-primary)' }}>Không bán dữ liệu.</b> Chúng mình không chia sẻ thông tin của bạn và bé cho bên thứ ba.</div>
          <div><b style={{ color: 'var(--text-primary)' }}>Nội dung tham khảo.</b> Dự báo leap và gợi ý EASY mang tính tham khảo, không thay thế tư vấn y khoa. Khi lo lắng về sức khoẻ của bé, hãy hỏi bác sĩ nhi.</div>
          <div><b style={{ color: 'var(--text-primary)' }}>Premium một lần.</b> 199.000đ trọn đời. Không tự gia hạn, không phí ẩn.</div>
        </div>
      </Sheet>
    </div>);

}

/* ---- Premium Paywall (soft gate) ---- */
function Paywall({ ctx }) {
  const open = !!ctx.paywall;
  // audit #16: never gate when intensity >= 4
  if (ctx.intensity >= 4 && open) {ctx.closePaywall();return null;}
  return (
    <Sheet open={open} onClose={ctx.closePaywall} height="72%" title="Wonder Premium" sub="Một lần · Trọn đời · Không tự gia hạn">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 4 }}>
        <Bong emotion="excited" onesie="orange" size={130} float />
        <div className="serif" style={{ fontSize: 30, fontWeight: 600, marginTop: 8 }}>199.000đ</div>
        <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 2 }}>{ctx.paywall ? ctx.paywall.title : ''}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 20 }}>
        {[
        ['📖', '10 leaps đầy đủ', 'Dấu hiệu, mẹo & hoạt động cho từng leap'],
        ['🌼', 'Sunny Play từng bước', 'Hướng dẫn chi tiết cho mỗi hoạt động'],
        ['🌧️', '3 âm thanh dỗ bé', 'Mưa, suối & shh-shh, phát không cần mạng'],
        ['👨‍👩‍👧', 'Đồng bộ gia đình', 'Cả nhà cùng chăm bé trên một tài khoản']].
        map(([e, t, d], i) =>
        <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'center', padding: '4px 2px' }}>
            <div style={{ width: 42, height: 42, borderRadius: 'var(--r-md)', background: 'var(--bg-sunken)', display: 'grid', placeItems: 'center', fontSize: 19, flexShrink: 0 }}>{e}</div>
            <div style={{ textAlign: 'left' }}>
              <div style={{ fontSize: 14.5, fontWeight: 700 }}>{t}</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-secondary)' }}>{d}</div>
            </div>
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 22 }}>
        {!ctx.trial ?
        <>
            <ButtonPrimary onClick={() => {ctx.startTrial();ctx.closePaywall();ctx.toast('Đã mở khóa 1 tháng dùng thử 💛');}}>Dùng thử miễn phí 1 tháng</ButtonPrimary>
            <ButtonSecondary onClick={() => {ctx.setPremium(true);ctx.closePaywall();ctx.toast('Đã mở khóa Wonder Premium 💛');}}>Mua trọn đời · 199.000đ</ButtonSecondary>
          </> :

        <ButtonPrimary onClick={() => {ctx.setPremium(true);ctx.closePaywall();ctx.toast('Wonder Premium là của bạn mãi mãi 💛');}}>Giữ mãi mãi · 199.000đ</ButtonPrimary>
        }
        <ButtonText onClick={ctx.closePaywall} style={{ textAlign: 'center' }}>Để sau</ButtonText>
      </div>
      <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--text-muted)', marginTop: 6, paddingBottom: 8 }}>Không cần thẻ. Không tự gia hạn. Dữ liệu bé đã ghi luôn thuộc về bạn — mãi mãi.</div>
    </Sheet>);

}

/* ---- Market tab — Coming Soon (sau MVP) ---- */
function MarketScreen({ ctx }) {
  return (
    <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '6px 20px 16px' }}>
      <div className="serif" style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Market</div>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: '32px 24px', gap: 6 }}>
        <Bong emotion="curious" onesie="sage" size={160} float />
        <span style={{ marginTop: 16, display: 'inline-flex', padding: '8px 16px', borderRadius: 'var(--r-full)', background: 'var(--bg-accent-soft)', color: 'var(--accent-primary)', fontSize: 12.5, fontWeight: 700, letterSpacing: 0.5 }}>SẮP RA MẮT</span>
        <div className="serif" style={{ fontSize: 22, fontWeight: 600, marginTop: 10 }}>Đồ tốt cho mẹ & bé</div>
        <div style={{ fontSize: 14.5, color: 'var(--text-secondary)', maxWidth: 260, lineHeight: 1.55 }}>
          Mình đang chuẩn bị góc mua sắm nhỏ — chỉ những món thật sự hữu ích theo từng leap của bé.
        </div>
        <div style={{ width: '100%', marginTop: 20 }}>
          <ButtonSecondary onClick={() => ctx.toast('Đã ghi nhớ. Mình sẽ báo bạn ngay khi mở nhé 💛')}>Báo mình khi mở nhé</ButtonSecondary>
        </div>
      </div>
    </div>);
}

Object.assign(window, { NotificationsScreen, MeScreen, MarketScreen, Paywall });