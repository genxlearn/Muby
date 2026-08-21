/* ============================================================
   DATE FIELD — masked DD/MM/YYYY input + inline calendar picker.
   Used by onboarding (ngày sinh / ngày dự sinh) and the baby-edit
   sheet in Mama. The calendar expands below the input (no second
   modal, so it works inside bottom sheets too).
   ============================================================ */
import React, { useMemo, useState } from 'react';
import { LayoutAnimation, Platform, Pressable, UIManager, View } from 'react-native';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';
import { Ic } from './Icon';
import { Input } from './primitives';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/** Progressive DD/MM/YYYY mask — a slash appears only once the next group
 *  has a digit, so deleting characters never gets stuck on a separator. */
export function maskDateInput(raw: string): string {
  const d = raw.replace(/\D/g, '').slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

function parseLoose(v: string): Date | null {
  const m = v.trim().match(/^(\d{1,2})\s*[\/\-.]\s*(\d{1,2})\s*[\/\-.]\s*(\d{4})$/);
  if (!m) return null;
  const day = +m[1], mo = +m[2], y = +m[3];
  const dt = new Date(y, mo - 1, day);
  if (dt.getFullYear() !== y || dt.getMonth() !== mo - 1 || dt.getDate() !== day) return null;
  return dt;
}

const fmt = (d: Date) =>
  `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}/${d.getFullYear()}`;

const sameDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

const DOW = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];

function CalendarPanel({
  selected,
  onPick,
  minDate,
  maxDate,
  initialMonth,
}: {
  selected: Date | null;
  onPick: (d: Date) => void;
  minDate?: Date;
  maxDate?: Date;
  initialMonth?: Date;
}) {
  const { colors, radii, shadows } = useTheme();
  const today = useMemo(() => new Date(), []);
  const [view, setView] = useState(() => {
    const base = selected ?? initialMonth ?? maxDate ?? today;
    return new Date(base.getFullYear(), base.getMonth(), 1);
  });

  const cells = useMemo(() => {
    const first = new Date(view.getFullYear(), view.getMonth(), 1);
    const lead = (first.getDay() + 6) % 7; // Monday-first offset
    const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
    const out: (Date | null)[] = [];
    for (let i = 0; i < lead; i++) out.push(null);
    for (let d = 1; d <= days; d++) out.push(new Date(view.getFullYear(), view.getMonth(), d));
    while (out.length % 7 !== 0) out.push(null);
    return out;
  }, [view]);

  const canPrev = !minDate || view.getTime() > new Date(minDate.getFullYear(), minDate.getMonth(), 1).getTime();
  const canNext = !maxDate || new Date(view.getFullYear(), view.getMonth() + 1, 1).getTime() <= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1).getTime();
  const move = (dir: -1 | 1) => setView((v) => new Date(v.getFullYear(), v.getMonth() + dir, 1));

  const disabled = (d: Date) =>
    (minDate ? d.getTime() < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate()).getTime() : false) ||
    (maxDate ? d.getTime() > new Date(maxDate.getFullYear(), maxDate.getMonth(), maxDate.getDate()).getTime() : false);

  return (
    <View
      style={[
        { marginTop: 10, backgroundColor: colors.bgElevated, borderRadius: radii.lg, borderWidth: 1, borderColor: colors.borderSubtle, padding: 12 },
        shadows[2],
      ]}
    >
      {/* month header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <Pressable
          disabled={!canPrev}
          onPress={() => move(-1)}
          style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgSunken, opacity: canPrev ? 1 : 0.35 }}
        >
          <Ic name="back" size={18} color={colors.textPrimary} />
        </Pressable>
        <Txt style={{ fontSize: 15, fontWeight: '700', color: colors.textPrimary }}>
          Tháng {view.getMonth() + 1} · {view.getFullYear()}
        </Txt>
        <Pressable
          disabled={!canNext}
          onPress={() => move(1)}
          style={{ width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.bgSunken, opacity: canNext ? 1 : 0.35 }}
        >
          <Ic name="chevron" size={18} color={colors.textPrimary} />
        </Pressable>
      </View>
      {/* weekday header */}
      <View style={{ flexDirection: 'row' }}>
        {DOW.map((d) => (
          <View key={d} style={{ flex: 1, alignItems: 'center', paddingVertical: 4 }}>
            <Txt style={{ fontSize: 11, fontWeight: '700', color: colors.textMuted }}>{d}</Txt>
          </View>
        ))}
      </View>
      {/* day grid */}
      <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
        {cells.map((d, i) => {
          if (!d) return <View key={i} style={{ width: `${100 / 7}%`, height: 40 }} />;
          const off = disabled(d);
          const isSel = !!selected && sameDay(d, selected);
          const isToday = sameDay(d, today);
          return (
            <Pressable
              key={i}
              disabled={off}
              onPress={() => onPick(d)}
              style={{ width: `${100 / 7}%`, height: 40, alignItems: 'center', justifyContent: 'center' }}
            >
              <View
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isSel ? colors.accentPrimary : 'transparent',
                  borderWidth: isToday && !isSel ? 1.5 : 0,
                  borderColor: colors.accentPrimary,
                }}
              >
                <Txt
                  style={{
                    fontSize: 14,
                    fontWeight: isSel || isToday ? '700' : '500',
                    color: off ? colors.borderDefault : isSel ? '#fff' : colors.textPrimary,
                  }}
                >
                  {d.getDate()}
                </Txt>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export function DateField({
  label,
  value,
  onChange,
  placeholder = 'DD/MM/YYYY',
  error,
  minDate,
  maxDate,
  initialMonth,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  error?: string;
  /** Selectable range for the calendar (typed dates are validated by the caller). */
  minDate?: Date;
  maxDate?: Date;
  /** Month the calendar opens on when nothing is selected yet. */
  initialMonth?: Date;
}) {
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const selected = parseLoose(value);

  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setOpen((o) => !o);
  };

  return (
    <View>
      <Input
        label={label}
        value={value}
        onChange={(v) => onChange(maskDateInput(v))}
        placeholder={placeholder}
        type="tel"
        error={error || ''}
        rightSlot={
          <Pressable onPress={toggle} hitSlop={10} accessibilityLabel="Mở lịch">
            <Ic name="cal" size={20} color={open ? colors.accentPrimary : colors.textMuted} />
          </Pressable>
        }
      />
      {open ? (
        <CalendarPanel
          selected={selected}
          minDate={minDate}
          maxDate={maxDate}
          initialMonth={initialMonth}
          onPick={(d) => {
            onChange(fmt(d));
            LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
            setOpen(false);
          }}
        />
      ) : null}
    </View>
  );
}
