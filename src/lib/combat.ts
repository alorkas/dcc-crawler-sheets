import { ApiError, api } from './api';
import { HB_SLOTS, applyHbLoss, derive, effectiveDamage, loadSheet, slotsLost } from './rules';

/**
 * Mob Attack Resolution: apply a declared attack's damage to a crawler's Health Bar
 * (the crawler's DR first, then whole slots of their Con Mod), logged with the attack as the source.
 * Resistances and immunities are left to the sheet's own damage tools.
 */
export async function applyAttackDamage(
  characterId: number,
  amount: number,
  source: string,
): Promise<{ damage: number; slots: number }> {
  for (let attempt = 0; ; attempt++) {
    const c = await api.getCharacter(characterId);
    const sheet = loadSheet(c.data);
    const der = derive(sheet);
    const damage = effectiveDamage({ amount, dr: der.drTotal ?? 0 });
    const slots = der.slotValue ? slotsLost(damage, der.slotValue, HB_SLOTS - der.hbLost) : 0;
    if (!slots) return { damage, slots: 0 };
    try {
      await api.saveCharacter(characterId, applyHbLoss(sheet, slots, der.mods.con), c.version, { hp: [source] });
      return { damage, slots };
    } catch (e) {
      // the player saved at the same moment: read the sheet again and retry once
      if (e instanceof ApiError && e.status === 409 && attempt === 0) continue;
      throw e;
    }
  }
}
