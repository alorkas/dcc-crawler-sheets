import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { damageDice, resolveNum } from '../../shared/formula.js';
import { api, type NpcData } from '../lib/api';
import { useI18n, type MsgKey } from '../lib/i18n';
import { useLive } from '../lib/live';
import { NPC_KINDS, NPC_STATS, emptyAttack, loadNpc, slotPercents } from '../lib/npc';
import { LockIcon, UnlockIcon } from '../components/icons';
import { NpcInFight } from '../components/CombatTracker';
import { AddToCombat } from './NpcsPage';

type Save = 'idle' | 'dirty' | 'saving' | 'saved' | 'error';

/** Stat block editor in the Core Rulebook's Mob/Boss layout. */
export default function NpcPage() {
  const { id } = useParams();
  const npcId = Number(id);
  const { t, err } = useI18n();
  const navigate = useNavigate();
  const [data, setData] = useState<NpcData | null>(null);
  const [state, setState] = useState<Save>('idle');
  const [error, setError] = useState<unknown>(null);
  const dataRef = useRef<NpcData | null>(null);
  dataRef.current = data;

  useEffect(() => {
    api
      .npc(npcId)
      .then((n) => setData(loadNpc(n.data)))
      .catch((e) => setError(e ?? new Error()));
  }, [npcId]);

  const save = useCallback(async () => {
    const d = dataRef.current;
    if (!d) return;
    setState('saving');
    try {
      await api.saveNpc(npcId, d);
      setState((s) => (s === 'saving' ? 'saved' : s));
    } catch {
      setState('error');
    }
  }, [npcId]);

  useEffect(() => {
    if (state !== 'dirty') return;
    const timer = setTimeout(save, 700);
    return () => clearTimeout(timer);
  }, [data, state, save]);

  const patch = (p: Partial<NpcData>) => {
    setData((d) => (d ? { ...d, ...p } : d));
    setState('dirty');
  };

  if (error) {
    return (
      <div className="center-page">
        <p className="error">{err(error)}</p>
        <Link to="/admin/npcs" className="btn">
          {t('npc.back')}
        </Link>
      </div>
    );
  }
  if (!data) return <div className="center-page dim">{t('common.loading')}</div>;

  const slots = Number(data.slots) || 1;
  const locked = data.locked;
  const remove = async () => {
    if (!confirm(t('npc.deleteConfirm', { name: data.name || t('npc.unnamed') }))) return;
    await api.deleteNpc(npcId).catch(() => {});
    navigate('/admin/npcs');
  };

  const txt = (key: keyof NpcData, label: string, extra: { ph?: string; center?: boolean; big?: boolean } = {}) => (
    <label className="field">
      <span className="lbl">{label}</span>
      <input
        className={`in ${extra.center ? 'center' : ''} ${extra.big ? 'big' : ''}`}
        value={data[key] as string}
        placeholder={extra.ph}
        onChange={(e) => patch({ [key]: e.target.value } as Partial<NpcData>)}
      />
    </label>
  );

  return (
    <div className="page npc-page">
      <div className="sheet-bar">
        <div className="sheet-title">
          <Link to="/admin/npcs" className="back" aria-label={t('npc.back')}>
            ←
          </Link>
          <div>
            <h1>{data.name || t('npc.unnamed')}</h1>
            <div className="dim small">
              {[t(`npc.kind.${data.kind}` as MsgKey), data.chapter, data.source].filter(Boolean).join(' · ')}
            </div>
          </div>
        </div>
        <div className="sheet-actions">
          <span className={`save-badge s-${state}`}>
            {t(
              state === 'dirty'
                ? 'save.dirty'
                : state === 'saving'
                  ? 'save.saving'
                  : state === 'error'
                    ? 'save.error'
                    : 'save.saved',
            )}
          </span>
          <AddToCombat npcId={npcId} />
          <button
            type="button"
            className={`btn lock-btn ${locked ? 'locked' : ''}`}
            onClick={() => patch({ locked: !locked })}
            title={t(locked ? 'sheet.unlockTitle' : 'sheet.lockTitle')}
          >
            {locked ? <LockIcon /> : <UnlockIcon />}
            {t(locked ? 'sheet.unlock' : 'sheet.lock')}
          </button>
          <button
            type="button"
            className="btn ghost danger-text"
            onClick={remove}
            disabled={locked}
            title={locked ? t('sheet.unlockToDelete') : undefined}
          >
            {t('npc.delete')}
          </button>
        </div>
      </div>

      <NpcInFight npcId={npcId} />

      <div className="card stat-block">
        <div className="card-body">
          <fieldset className="plain-fieldset" disabled={locked}>
            <div className="sb-top">
              {txt('name', t('core.name'), { big: true })}
              <label className="field">
                <span className="lbl">{t('npc.kind')}</span>
                <select
                  className="in sel"
                  value={data.kind}
                  onChange={(e) => patch({ kind: e.target.value as NpcData['kind'] })}
                >
                  {NPC_KINDS.map((k) => (
                    <option key={k} value={k}>
                      {t(`npc.kind.${k}` as MsgKey)}
                    </option>
                  ))}
                </select>
              </label>
              {txt('size', t('core.size'), { ph: t('npc.sizePh') })}
              {txt('tags', t('npc.tags'), { ph: t('npc.tagsPh') })}
              <label className="field">
                <span className="lbl">{t('npc.floor')}</span>
                <input
                  className="in center"
                  inputMode="numeric"
                  value={data.floor || ''}
                  placeholder={t('npc.anyFloor')}
                  onChange={(e) => patch({ floor: Math.max(0, parseInt(e.target.value, 10) || 0) })}
                />
              </label>
            </div>

            <div className="sb-hb">
              <div className="sb-hb-inputs">
                <label className="field">
                  <span className="lbl">{t('npc.slots')}</span>
                  <input
                    className="in center"
                    inputMode="numeric"
                    value={data.slots}
                    onChange={(e) => patch({ slots: e.target.value })}
                  />
                </label>
                <label className="field">
                  <span className="lbl">{t('npc.slotValue')}</span>
                  <input
                    className="in center"
                    inputMode="numeric"
                    value={data.slotValue}
                    onChange={(e) => patch({ slotValue: e.target.value })}
                  />
                </label>
              </div>
              <div className="sb-hb-bar" aria-hidden>
                {slotPercents(slots).map((p, i) => (
                  <div key={i} className="sb-slot">
                    <span>{data.slotValue || '—'}</span>
                    <small>{p}%</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="sb-mid">
              {txt('level', t('npc.level'), { center: true })}
              {txt('surprise', t('npc.surprise'), { center: true, ph: '11+F' })}
              {txt('evade', t('core.evade'), { center: true, ph: '13+F' })}
              {txt('move', t('core.move'), { center: true, ph: '20+S' })}
              {txt('dr', t('npc.dr'), { center: true })}
            </div>
            <p className="dim tiny">{t('npc.floorHint')}</p>

            <div className="sb-stats">
              {NPC_STATS.map((k) => (
                <div key={k} className="sb-stat">
                  <span className="lbl">{t(`stat.${k}.short` as MsgKey)}</span>
                  <input
                    className="in center"
                    value={data.stats[k].score}
                    aria-label={t(`stat.${k}` as MsgKey)}
                    onChange={(e) =>
                      patch({ stats: { ...data.stats, [k]: { ...data.stats[k], score: e.target.value } } })
                    }
                  />
                  <input
                    className="in center mod"
                    value={data.stats[k].mod}
                    placeholder="+0"
                    aria-label={t('core.statMod', { stat: t(`stat.${k}.short` as MsgKey) })}
                    onChange={(e) =>
                      patch({ stats: { ...data.stats, [k]: { ...data.stats[k], mod: e.target.value } } })
                    }
                  />
                </div>
              ))}
            </div>
          </fieldset>

          <div className="sub-lbl">{t('npc.attacks')}</div>
          {locked ? (
            <NpcAttackList data={data} />
          ) : (
            <div className="sb-attacks">
              {data.attacks.map((a, i) => {
                const setA = (p: Partial<NpcData['attacks'][number]>) =>
                  patch({ attacks: data.attacks.map((x, j) => (j === i ? { ...x, ...p } : x)) });
                return (
                  <div key={i} className="sb-attack">
                    <input
                      className="in"
                      value={a.name}
                      placeholder={t('npc.atkName')}
                      onChange={(e) => setA({ name: e.target.value })}
                    />
                    <input
                      className="in center"
                      value={a.toHit}
                      placeholder={t('npc.toHitPh')}
                      aria-label={t('npc.toHit')}
                      onChange={(e) => setA({ toHit: e.target.value })}
                    />
                    <input
                      className="in"
                      value={a.damage}
                      placeholder={t('npc.damagePh')}
                      aria-label={t('npc.damage')}
                      onChange={(e) => setA({ damage: e.target.value })}
                    />
                    <input
                      className="in"
                      value={a.range}
                      placeholder={t('npc.rangePh')}
                      aria-label={t('skill.range')}
                      onChange={(e) => setA({ range: e.target.value })}
                    />
                    <button
                      type="button"
                      className="row-del"
                      aria-label={t('list.remove')}
                      onClick={() => patch({ attacks: data.attacks.filter((_, j) => j !== i) })}
                    >
                      ×
                    </button>
                    <textarea
                      className="in sb-effect"
                      rows={1}
                      value={a.effect}
                      placeholder={t('npc.effectPh')}
                      onChange={(e) => setA({ effect: e.target.value })}
                    />
                  </div>
                );
              })}
              <button
                type="button"
                className="btn ghost add-row"
                onClick={() => patch({ attacks: [...data.attacks, emptyAttack()] })}
              >
                + {t('npc.addAttack')}
              </button>
            </div>
          )}

          <fieldset className="plain-fieldset" disabled={locked}>
            <label className="field">
              <span className="lbl">{t('npc.notes')}</span>
              <textarea
                className="in"
                rows={4}
                value={data.notes}
                placeholder={t('npc.notesPh')}
                onChange={(e) => patch({ notes: e.target.value })}
              />
            </label>
          </fieldset>
        </div>
      </div>
    </div>
  );
}

/** A locked stat block's attacks: declare one against the party (in combat) or roll its damage. */
function NpcAttackList({ data }: { data: NpcData }) {
  const { t } = useI18n();
  const { encounter } = useLive();
  const [flash, setFlash] = useState<{ i: number; total: number } | null>(null);
  const floor = encounter?.active ? encounter.floor : data.floor || 1;
  const mods = Object.fromEntries(NPC_STATS.map((k) => [k, data.stats[k].mod]));
  const attacks = data.attacks.filter((a) => a.name.trim() || a.damage.trim());
  if (!attacks.length) return <p className="dim small">{t('npc.noAttacks')}</p>;
  const rollDamage = async (i: number, expr: string) => {
    const a = attacks[i];
    try {
      const m = await api.npcRoll({ name: data.name || t('npc.unnamed'), expr, label: `${a.name} · ${a.damage}` });
      setFlash({ i, total: m.roll?.total ?? 0 });
      setTimeout(() => setFlash((f) => (f?.i === i ? null : f)), 2500);
    } catch {
      /* ignore */
    }
  };
  return (
    <div className="sb-attack-list">
      {attacks.map((a, i) => {
        const dc = resolveNum(a.toHit, floor);
        const expr = damageDice(a.damage, floor, mods);
        return (
          <div key={i} className="sb-attack-view">
            <div className="sb-attack-line">
              <strong className="grow">{a.name || '—'}</strong>
              {a.range && <span className="dim small">{a.range}</span>}
              {a.toHit && (
                <span className="pill" title={a.toHit}>
                  {t('decl.dc', { n: dc ?? a.toHit })}
                </span>
              )}
              <button
                type="button"
                className="btn small"
                disabled={!expr}
                title={expr ? t('npc.rollDamageHint', { expr }) : t('npc.noDice')}
                onClick={() => expr && rollDamage(i, expr)}
              >
                🎲 {a.damage || t('npc.damage')}
                {flash?.i === i && <strong className="roll-flash"> = {flash.total}</strong>}
              </button>
            </div>
            {a.effect && <p className="dim small sb-effect-text">{a.effect}</p>}
          </div>
        );
      })}
      <p className="dim tiny">{t('npc.floorUsed', { n: floor })}</p>
    </div>
  );
}
