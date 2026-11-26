/* ============================================================
   COMMUNITY - MVP v2.1 "Sắp ra mắt" (Figma F1)
   Explains what is coming and collects interest. No feed yet.
   ============================================================ */
import React from 'react';
import { ScrollView, View } from 'react-native';
import { AvatarButton, ButtonPrimary, ButtonText, Card, Ic, NAV_CLEARANCE, Tag } from '../components';
import type { IconName } from '../components';
import { Bong } from '../mascot/Bong';
import { useApp } from '../navigation/AppContext';
import { useBaby } from '../state/BabyContext';
import { useTheme } from '../theme/ThemeContext';
import { Txt } from '../theme/Txt';

const FEATURES: { icon: IconName; tone: 'sleep' | 'diaper' | 'feed'; title: string; sub: string }[] = [
  { icon: 'users', tone: 'sleep', title: 'Nhóm của bé', sub: 'Tự xếp theo leap và tháng sinh' },
  { icon: 'shield', tone: 'diaper', title: 'Hỏi đáp có chuyên gia', sub: 'Câu hỏi sức khoẻ được kiểm tra' },
  { icon: 'heart', tone: 'feed', title: 'Mẹ tin dùng', sub: 'Đồ chơi, sách hợp kỹ năng bé đang học' },
];

export function CommunityScreen() {
  const { colors, radii } = useTheme();
  const ctx = useApp();
  const { state: st } = useBaby();
  const leapN = st.leap.n;
  return (
    <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: NAV_CLEARANCE }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 12 }}>
        <Txt serif style={{ flex: 1, fontSize: 34, lineHeight: 41 }}>Cộng đồng</Txt>
        <AvatarButton onPress={() => ctx.go('me')} />
      </View>
      <View style={{ paddingHorizontal: 20, paddingTop: 12, alignItems: 'center', gap: 12 }}>
        <Bong emotion="excited" onesie="orange" size={128} />
        <Tag tone="ai">Sắp ra mắt</Tag>
        <Txt serif style={{ fontSize: 28, lineHeight: 34, textAlign: 'center' }}>Nơi các mẹ cùng leap gặp nhau</Txt>
        <Txt style={{ fontSize: 15, lineHeight: 22, color: colors.textSecondary, textAlign: 'center', maxWidth: 330 }}>
          Muby đang chuẩn bị một góc nhỏ để mẹ hỏi, kể và học từ những mẹ có bé cùng tuổi, cùng leap.
        </Txt>
        <Card pad={4} style={{ alignSelf: 'stretch', paddingHorizontal: 16 }}>
          {FEATURES.map((f, i) => (
            <View key={f.title} style={{ flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12, borderTopWidth: i ? 1 : 0, borderTopColor: colors.borderSubtle }}>
              <View style={{ width: 40, height: 40, borderRadius: radii.md, backgroundColor: colors.activity[f.tone].bg, alignItems: 'center', justifyContent: 'center' }}>
                <Ic name={f.icon} size={20} color={colors.activity[f.tone].fg} />
              </View>
              <View style={{ flex: 1 }}>
                <Txt style={{ fontSize: 15, fontWeight: '600' }}>{f.title}</Txt>
                <Txt style={{ fontSize: 13, color: colors.textSecondary, marginTop: 2 }}>{f.sub}</Txt>
              </View>
            </View>
          ))}
        </Card>
        <View style={{ alignSelf: 'stretch', gap: 4, marginTop: 4 }}>
          <ButtonPrimary onPress={() => ctx.toast('Mình sẽ báo mama ngay khi Cộng đồng mở')}>Báo cho mình khi mở</ButtonPrimary>
          <ButtonText onPress={() => ctx.toast(`Link nhóm Zalo Leap ${leapN} sẽ có trong bản tới`)} style={{ alignSelf: 'center' }}>
            {`Tham gia nhóm Zalo Leap ${leapN}`}
          </ButtonText>
        </View>
      </View>
    </ScrollView>
  );
}
