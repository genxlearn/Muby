/* ============================================================
   IN-APP PURCHASE - Muby Premium (one-time, lifetime, non-consumable).
   Product id must exist in App Store Connect AND Google Play Console:
     muby_premium_lifetime   (price tier 79.000đ)
   expo-iap is a native module: it works in EAS builds (TestFlight,
   Play internal testing, store), not in Expo Go. In Expo Go the
   module is missing, so every call reports 'unavailable'.
   ============================================================ */
import { Platform } from 'react-native';

export const PREMIUM_SKU = 'muby_premium_lifetime';
export const FALLBACK_PRICE = '79.000đ';

export type BuyResult = 'ok' | 'cancelled' | 'pending' | 'unavailable' | 'error';

type IapModule = typeof import('expo-iap');
let mod: IapModule | null | undefined;
let connected = false;

/** Loads expo-iap lazily so Expo Go (no native module) never crashes. */
function iap(): IapModule | null {
  if (mod !== undefined) return mod;
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    mod = require('expo-iap') as IapModule;
  } catch {
    mod = null;
  }
  return mod;
}

async function connect(): Promise<IapModule | null> {
  const m = iap();
  if (!m || Platform.OS === 'web') return null;
  if (connected) return m;
  try {
    await m.initConnection();
    connected = true;
    return m;
  } catch {
    return null;
  }
}

/** Localized store price ("79.000 ₫"), or null when the store is unreachable. */
export async function loadPrice(): Promise<string | null> {
  const m = await connect();
  if (!m) return null;
  try {
    const list = (await m.fetchProducts({ skus: [PREMIUM_SKU], type: 'in-app' })) as { id: string; displayPrice: string }[] | null;
    const p = list?.find((x) => x.id === PREMIUM_SKU);
    return p?.displayPrice ?? null;
  } catch {
    return null;
  }
}

/** True when this store account already owns Premium (no sign-in prompt). */
export async function ownsPremium(): Promise<boolean> {
  const m = await connect();
  if (!m) return false;
  try {
    const list = (await m.getAvailablePurchases()) as { productId: string }[] | null;
    return !!list?.some((p) => p.productId === PREMIUM_SKU);
  } catch {
    return false;
  }
}

/** Starts the store purchase sheet and resolves when the user finishes or cancels. */
export async function buyPremium(): Promise<BuyResult> {
  const m = await connect();
  if (!m) return 'unavailable';
  return new Promise<BuyResult>((resolve) => {
    let done = false;
    const finish = (r: BuyResult) => {
      if (done) return;
      done = true;
      ok.remove();
      err.remove();
      resolve(r);
    };
    const ok = m.purchaseUpdatedListener(async (p: any) => {
      if (p?.productId !== PREMIUM_SKU) return;
      if (p.purchaseState === 'pending') return finish('pending');
      try {
        await m.finishTransaction({ purchase: p, isConsumable: false });
      } catch {}
      finish('ok');
    });
    const err = m.purchaseErrorListener((e: any) => {
      const code = String(e?.code ?? '');
      if (code === 'user-cancelled') finish('cancelled');
      else if (code === 'already-owned') finish('ok');
      else if (code === 'deferred-payment') finish('pending');
      else finish('error');
    });
    m.requestPurchase({
      request: { apple: { sku: PREMIUM_SKU }, google: { skus: [PREMIUM_SKU] } },
      type: 'in-app',
    } as any).catch(() => finish('error'));
  });
}

/** "Khôi phục giao dịch" - required by the App Store for non-consumables. */
export async function restorePremium(): Promise<'ok' | 'none' | 'unavailable'> {
  const m = await connect();
  if (!m) return 'unavailable';
  try {
    await m.restorePurchases();
  } catch {}
  return (await ownsPremium()) ? 'ok' : 'none';
}
