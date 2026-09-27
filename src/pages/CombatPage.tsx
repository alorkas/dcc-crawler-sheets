import { useAuth } from '../lib/auth';
import { useI18n } from '../lib/i18n';
import { useLive } from '../lib/live';
import { CombatHeader, Declarations, Opponents } from '../components/CombatTracker';
import { MemberCard } from '../components/LivePanels';

/** Full-size combat: round and phases on top, the party on one side and the opponents on the other. */
export default function CombatPage() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { encounter, party } = useLive();
  const active = !!encounter?.active;
  const members = party ?? [];
  return (
    <div className="page combat-page">
      <div className="page-head">
        <div>
          <h1>{t('combatPage.title')}</h1>
          {!active && <p className="dim">{t(user?.isAdmin ? 'combatPage.idleGm' : 'combatPage.idle')}</p>}
        </div>
      </div>
      <div className="combat-page-head">
        <CombatHeader />
      </div>
      {active && (
        <div className="combat-cols">
          <section className="combat-col">
            <h2 className="side-sub">
              {t('combat.crawlers')} <span className="count-badge">{members.length}</span>
            </h2>
            {members.length === 0 && <p className="dim small">{t('party.empty')}</p>}
            <div className="combat-grid">
              {members.map((m) => (
                <MemberCard key={m.id} m={m} wide />
              ))}
            </div>
          </section>
          <section className="combat-col">
            <Declarations />
            <Opponents wide />
          </section>
        </div>
      )}
    </div>
  );
}
