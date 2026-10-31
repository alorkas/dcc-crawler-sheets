import { useEffect, useState } from 'react';
import { useI18n, type MsgKey } from '../lib/i18n';
import { lookup } from '../lib/catalog';
import type { CatalogHit } from '../lib/api';
import { checkRoll, learnsUntrained, num } from '../lib/rules';
import { useLiveOptional } from '../lib/live';
import { STATS, type SheetData, type StatKey } from '../lib/sheet';
import { useNamesEs } from '../lib/namesEs';
import { CheckButton } from './RollButton';
import { useSheet } from './fields';

const norm = (s: string) => s.trim().toLowerCase();
const isStat = (s: unknown): s is StatKey => STATS.some((x) => x.key === s);

/**
 * A Check with a Skill the crawler doesn't have (Core Rulebook "Checks without Skill Ranks"): Disadvantage, the
 * Stat Mod and no Ranks. The book's Stat is picked for the Skills it knows; any other one needs a Stat. Once rolled,
 * the Skill goes on the "attempted untrained this session" list (Skills tab → Advancement). Spells and Passive
 * Skills can't be attempted untrained.
 */
export function UntrainedCheck() {
  const { t } = useI18n();
  const es = useNamesEs();
  const { data, der } = useSheet();
  const live = useLiveOptional();
  // only the Tutorial Floors teach Skills tried untrained
  const learns = learnsUntrained(live?.world?.floor ?? num(data.floor));
  const [name, setName] = useState('');
  const [picked, setPicked] = useState<StatKey | ''>('');
  const [hit, setHit] = useState<CatalogHit | null | undefined>(undefined);

  // look the Skill up in the book (a moment after typing stops)
  useEffect(() => {
    setHit(undefined);
    if (!name.trim()) return;
    let live = true;
    const timer = setTimeout(() => {
      lookup(name)
        .then((h) => live && setHit(h && h.kind !== 'item' ? h : null))
        .catch(() => live && setHit(null));
    }, 350);
    return () => {
      live = false;
      clearTimeout(timer);
    };
  }, [name]);

  const bookStat = hit && isStat(hit.entry.stat) ? hit.entry.stat : '';
  const stat = picked || bookStat;
  const label = hit?.entry.name ?? name.trim();
  // already on the sheet with Ranks (gear included): then it's a normal Check
  const own = der.skills.find((s) => norm(s.name) === norm(label) || norm(es(s.name) ?? '') === norm(label));
  const trained = !!own && (num(own.rank) ?? 0) > 0;
  const blocked =
    hit?.kind === 'spell'
      ? 'untr.noSpell'
      : hit?.entry.subtype === 'passive' || hit?.entry.subtype === 'damageEffect'
        ? 'untr.noPassive'
        : '';
  const roll =
    name.trim() && stat && !blocked
      ? checkRoll(
          data,
          der,
          {
            category: hit?.kind === 'weapon' ? 'combat' : 'utility',
            subtype: '',
            stat,
            rank: trained ? (own?.rank ?? '0') : '0',
          },
          der.mods[stat],
          hit?.kind === 'weapon' ? 'attack' : 'check',
        )
      : null;
  // after the roll: on the list for the end of the session (once), unless the crawler has it trained
  const remember = (d: SheetData): SheetData =>
    trained || !learns || d.untrained.some((s) => norm(s) === norm(label))
      ? d
      : { ...d, untrained: [...d.untrained.filter((s) => s.trim()), label] };

  return (
    <div className="untrained-check">
      <div className="untrained-check-row">
        <label className="field grow">
          <span className="lbl">{t('untr.skill')}</span>
          <input
            className="in"
            list="skill-names-all"
            value={name}
            placeholder={t('untr.skillPh')}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="field">
          <span className="lbl">{t('untr.stat')}</span>
          <select className="in sel" value={picked} onChange={(e) => setPicked(e.target.value as StatKey | '')}>
            <option value="">
              {bookStat ? t('untr.bookStat', { stat: t(`stat.${bookStat}.short` as MsgKey) }) : t('untr.pickStat')}
            </option>
            {STATS.map((s) => (
              <option key={s.key} value={s.key}>
                {t(`stat.${s.key}` as MsgKey)} (
                {der.mods[s.key] === null ? '—' : der.mods[s.key]! >= 0 ? `+${der.mods[s.key]}` : der.mods[s.key]})
              </option>
            ))}
          </select>
        </label>
        <div className="field untrained-check-roll">
          <span className="lbl">{t('untr.roll')}</span>
          {roll ? (
            <CheckButton roll={roll} label={trained ? label : t('untr.label', { name: label })} onRolled={remember} />
          ) : (
            <output className="roll-total">—</output>
          )}
        </div>
      </div>
      <p className="dim tiny">
        {blocked
          ? t(blocked as MsgKey)
          : trained
            ? t('untr.trained', { name: own?.name ?? label, rank: own?.rank ?? '' })
            : !name.trim()
              ? t('untr.hint')
              : hit === undefined
                ? t('untr.looking')
                : hit === null && !stat
                  ? t('untr.notInBook')
                  : t(learns ? 'untr.ready' : 'untr.readyNoLearn')}
      </p>
    </div>
  );
}
