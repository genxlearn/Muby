/* ============================================================
   SCREEN 9A Notifications · 9B Profile/Me · Muby Premium Paywall
   ============================================================ */

function NotificationsScreen({ ctx }) {
  const { NOTIFS } = BWW_DATA;
  const empty = !!ctx.empty;
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
  const [babyName, setBabyName] = useState(BWW_DATA.BABY.name);
  const [babyDob, setBabyDob] = useState(BWW_DATA.BABY.dob);
  const [dueMode, setDueMode] = useState('Đúng / gần đúng');
  const [due, setDue] = useState('');
  const dark = ctx.theme === 'dark';
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0, position: 'relative' }}>
    <div className="screen-scroll" style={{ flex: 1, overflowY: 'auto', padding: '6px 20px 44px' }}>
      <div className="serif" style={{ fontSize: 24, fontWeight: 600, marginBottom: 24 }}>Mama & {BWW_DATA.BABY.name}</div>

      {/* Premium / trial state */}
      {ctx.purchased ?
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, padding: '11px 16px', minHeight: 44, borderRadius: 'var(--r-full)', background: 'var(--accent-soft-bg)', color: 'var(--text-primary)', fontWeight: 700, fontSize: 14, marginBottom: 24 }}>
          <Ic name="check" size={17} sw={2.6} stroke="var(--accent-primary)" /> Muby Premium ✓
        </div> :
        <>
        {ctx.trial &&
        <Banner icon="✨" style={{ marginBottom: 12 }}>7 ngày đầu: mọi thứ đang mở · còn <b>{ctx.trial.daysLeft} ngày</b> · sau đó về gói Miễn phí — không trừ tiền 💛</Banner>
        }
        <div style={{ borderRadius: 'var(--r-xl)', overflow: 'hidden', background: 'var(--text-primary)', padding: 20, position: 'relative', marginBottom: 24 }}>
          <div style={{ position: 'absolute', right: 12, bottom: 0 }}><Bong emotion="excited" onesie="orange" size={92} /></div>
          <div className="serif" style={{ fontSize: 22, fontWeight: 600, color: 'var(--bg-canvas)' }}>Muby Premium</div>
          <div style={{ fontSize: 13.5, color: 'var(--bg-canvas)', opacity: 0.7, marginTop: 4, fontWeight: 600 }}>199.000đ · Một lần · Trọn đời</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }} data-comment-anchor="ff38e97b2f-div-102-11">
            {['10 leaps đầy đủ', 'Sunny Play từng bước', '3 âm thanh dỗ bé', 'Đồng bộ gia đình (sắp có)'].map((p) =>
            <span key={p} style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--bg-canvas)', background: 'color-mix(in srgb, var(--bg-canvas) 20%, transparent)', border: '1px solid color-mix(in srgb, var(--bg-canvas) 30%, transparent)', padding: '5px 10px', borderRadius: 'var(--r-full)' }}>{p}</span>
            )}
          </div>
          <button onClick={() => ctx.openPaywall('Mở khóa Muby Premium')} style={{ marginTop: 16, padding: '13px 22px', minHeight: 48, borderRadius: 'var(--r-full)', background: 'var(--accent-primary)', color: '#fff', fontWeight: 700, fontSize: 15 }}>Mở khóa trọn đời — 199.000đ</button>
          <div style={{ fontSize: 11.5, color: 'var(--bg-canvas)', opacity: 0.55, marginTop: 12, maxWidth: 235 }}>Trả một lần. Không gia hạn. Không trừ tiền tự động.</div>
        </div>
        </>
        }

      {/* Baby card */}
      <Card pad={16} style={{ marginBottom: 24 }}>
        <button onClick={() => setSheet('baby')} style={{ display: 'flex', alignItems: 'center', gap: 14, width: '100%', textAlign: 'left' }}>
          <BongFace emotion="happy" size={54} ring />
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 17, fontWeight: 700, color: 'var(--text-primary)' }} data-comment-anchor="eda971b73c-div-122-13">{BWW_DATA.BABY.name}</div>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 2 }}>{BWW_DATA.BABY.gender} · {BWW_DATA.BABY.ageLabel}</div>
          </div>
          <Ic name="chevron" size={18} stroke="var(--text-muted)" />
        </button>
      </Card>

      {/* Caregivers */}
      <SettingsGroup title="Người chăm bé">
        <SettingRow icon="👩" label="Mama (bạn)" sub="Chủ tài khoản" />
        <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <SettingRow icon="➕" label="Mời bố vào cùng" sub="Đồng bộ gia đình — sắp có" onClick={() => ctx.toast('Sắp có rồi — mình sẽ báo mama ngay khi mở nhé 💛')} right={<Ic name="chevron" size={18} stroke="var(--text-muted)" />} />
        </div>
      </SettingsGroup>

      {/* Display */}
      <SettingsGroup title="Hiển thị">
        <SettingRow icon="🌙" label="Chế độ tối" sub="Luôn miễn phí" right={<Toggle on={dark} onClick={() => ctx.setTheme(dark ? 'light' : 'dark')} />} />
      </SettingsGroup>

      {/* Security */}
      <SettingsGroup title="Bảo mật">
        <SettingRow icon="🙂" label="Đăng nhập bằng Face ID" sub="Vào nhanh, không cần chờ SMS" right={<Toggle on={ctx.faceId !== false} onClick={() => {const next = !(ctx.faceId !== false);ctx.setFaceId && ctx.setFaceId(next);ctx.toast(next ? 'Đã bật Face ID 💚' : 'Đã tắt Face ID. Lần sau đăng nhập bằng mã SMS nhé.');}} />} />
      </SettingsGroup>

      {/* Info & reminders */}
      <SettingsGroup title="Thông tin & Nhắc">
        <SettingRow icon="🔔" label="Nhắc nhẹ nhàng" sub="Từ chính ghi chép của bạn · báo trước leap" right={<Toggle on={reminders} onClick={() => setReminders((r) => !r)} />} />
        <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <SettingRow icon="📏" label="Đơn vị đo" sub={units} onClick={() => setSheet('units')} right={<Ic name="chevron" size={18} stroke="var(--text-muted)" />} />
        </div>
      </SettingsGroup>

      {/* About */}
      <SettingsGroup title="Về Muby">
        <SettingRow icon="💛" label="Đánh giá ứng dụng" onClick={() => ctx.toast('Cảm ơn mama! Chờ chút để mở App Store nhé 💛')} right={<Ic name="chevron" size={18} stroke="var(--text-muted)" />} />
        <div style={{ borderTop: '1px solid var(--border-subtle)' }}>
          <SettingRow icon="📄" label="Điều khoản & Quyền riêng tư" onClick={() => setSheet('terms')} right={<Ic name="chevron" size={18} stroke="var(--text-muted)" />} />
        </div>
      </SettingsGroup>

      <div style={{ textAlign: 'center', padding: '8px 0 4px' }}>
        <button onClick={() => ctx.goFlow('auth', { authStep: 'A1' })} style={{ color: 'var(--danger)', fontWeight: 600, fontSize: 14.5, padding: 10 }}>Đăng xuất</button>
      </div>
      <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: 12 }}>Muby · 1.0.0</div>
    </div>

      {/* --- Sheets --- */}
      <Sheet open={sheet === 'baby'} onClose={() => setSheet(null)} height="72%" title={BWW_DATA.BABY.name} sub="Thông tin bé">
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14, paddingTop: 6 }}>
          <div style={{ display: 'flex', justifyContent: 'center' }}><BongFace emotion="happy" size={72} ring /></div>
          <Input label="Tên bé" value={babyName} onChange={setBabyName} />
          <Input label="Ngày sinh (dd/mm/yyyy)" value={babyDob} onChange={setBabyDob} />
          <DueDateField mode={dueMode} setMode={setDueMode} due={due} setDue={setDue} />
          <ButtonPrimary onClick={() => {ctx.updateBaby(babyName, babyDob);setSheet(null);ctx.toast('Đã lưu. Mọi dự báo đã tính lại theo bé 💚');}}>Lưu thay đổi</ButtonPrimary>
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
          <div><b style={{ color: 'var(--text-primary)' }}>Dữ liệu của bé là của bạn.</b> Mọi ghi chép (cữ ăn, giấc ngủ, đo lường, khoảnh khắc, ảnh) thuộc về bạn mãi mãi — kể cả khi không dùng Premium.</div>
          <div><b style={{ color: 'var(--text-primary)' }}>Không bán dữ liệu.</b> Chúng mình không chia sẻ thông tin của bạn và bé cho bên thứ ba.</div>
          <div><b style={{ color: 'var(--text-primary)' }}>Nội dung tham khảo.</b> Dự báo leap và gợi ý EASY mang tính tham khảo, không thay thế tư vấn y khoa. Khi lo lắng về sức khoẻ của bé, hãy hỏi bác sĩ nhi.</div>
          <div><b style={{ color: 'var(--text-primary)' }}>Muby Premium.</b> 7 ngày đầu sau đăng ký, mọi tính năng đều mở — không cần thẻ, không trừ tiền. Sau đó về gói Miễn phí. Premium là khoản mua một lần 199.000đ, trọn đời, không gia hạn.</div>
        </div>
      </Sheet>
    </div>);

}

/* ---- Muby Premium Paywall (one-time 199k) ---- */
function Paywall({ ctx }) {
  const open = !!ctx.paywall;
  // audit: never gate when intensity >= 4
  if (ctx.intensity >= 4 && open) {ctx.closePaywall();return null;}
  return (
    <Sheet open={open} onClose={ctx.closePaywall} height="76%" title="Muby Premium" sub="199.000đ · Một lần · Trọn đời">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', paddingTop: 4 }}>
        <Bong emotion="excited" onesie="orange" size={124} float />
        <div style={{ fontSize: 13.5, color: 'var(--text-muted)', marginTop: 8 }}>{ctx.paywall ? ctx.paywall.title : ''}</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 18 }}>
        {[
        ['📖', '10 leaps đầy đủ', 'Dấu hiệu, mẹo & cách đồng hành cho từng leap'],
        ['🌼', 'Sunny Play từng bước', 'Hướng dẫn chi tiết cho mỗi hoạt động'],
        ['🌧️', '3 âm thanh dỗ bé', 'Mưa, suối & shh-shh, phát không cần mạng'],
        ['👨‍👩‍👧', 'Đồng bộ gia đình', 'Sắp có — cả nhà cùng chăm bé']].
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
        <ButtonPrimary onClick={() => {ctx.setPremium(true);ctx.closePaywall();ctx.toast('Muby Premium là của bạn mãi mãi 💛');}}>Mở khóa trọn đời — 199.000đ</ButtonPrimary>
        <ButtonText onClick={ctx.closePaywall} style={{ textAlign: 'center' }}>Để sau</ButtonText>
      </div>
      <div style={{ textAlign: 'center', fontSize: 11.5, color: 'var(--text-muted)', marginTop: 8, paddingBottom: 8, lineHeight: 1.5 }}>Trả một lần. Không gia hạn. Không trừ tiền tự động. Kỷ niệm của bé luôn miễn phí.</div>
    </Sheet>);

}

Object.assign(window, { NotificationsScreen, MeScreen, Paywall });
