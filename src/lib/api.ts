import type { Item, LevelEntry, SheetData } from './sheet';
import type { Degree } from '../../shared/combat.js';

export type User = {
  id: number;
  username: string;
  isAdmin: boolean;
  /** A GM viewing the app as a player (read-only): `realUser` is the GM. */
  viewAs?: boolean;
  realUser?: { id: number; username: string; isAdmin: boolean };
};
export type AdminUser = User & { createdAt: string; characters: number };

export type CharacterSummary = {
  id: number;
  ownerId: number;
  ownerName: string;
  locked: boolean;
  inParty: boolean;
  version: number;
  createdAt: string;
  updatedAt: string;
  summary: {
    name: string;
    race: string;
    class: string;
    level: string;
    floor: string;
    crawlerNumber: string;
    portrait: string;
  };
};
export type Character = CharacterSummary & { data: Partial<SheetData> };

/** A book entry from the server-side catalog (see server/catalog). All fields are optional strings. */
export type CatalogEntry = {
  name: string;
  subtype?: string;
  attackType?: '' | 'melee' | 'ranged';
  stat?: string;
  tags?: string;
  manaCost?: string;
  range?: string;
  duration?: string;
  aiFavor?: string;
  limitations?: string;
  cooldown?: string;
  baseDamage?: string;
  effect?: string;
  upgrades?: string;
  type?: string;
  slot?: string;
  interrupt?: boolean;
  page?: number;
};
export type CatalogHit = { kind: 'weapon' | 'spell' | 'utility' | 'item'; entry: CatalogEntry };
export type FullCatalog = {
  weapons: CatalogEntry[];
  utility: CatalogEntry[];
  spells: CatalogEntry[];
  items: CatalogEntry[];
  /** The campaign's own loot (server/catalog/homebrew.js). */
  homebrew: HomebrewItem[];
};
export type HomebrewItem = {
  name: string;
  type: Item['type'];
  rarity: Item['rarity'];
  floor: number;
  fits?: Item['fits'];
  ranged?: boolean;
  ammo?: string;
  bonus: Item['bonus'];
  notes: string;
};

/** What the party panel gets for each member (a small slice of the sheet; mana only for owner and GM). */
export type PartyMember = {
  id: number;
  ownerId: number;
  ownerName: string;
  mine: boolean;
  view: Partial<SheetData> & { portraitTag?: string };
};

export type RollPart = {
  sign: number;
  value: number;
  dice?: string;
  sides?: number;
  rolls?: number[];
  kept?: boolean[];
};
export type RollResult = {
  expr: string;
  total: number;
  parts: RollPart[];
  natural: number | null;
  label: string;
  /** An Evade roll against a declared attack (or an attack/Taunt): its difficulty and whether it succeeded. */
  vs?: {
    dc: number | null;
    success: boolean | null;
    area?: boolean;
    kind?: 'attack' | 'evade' | 'taunt';
    degree?: Degree | null;
  };
  /** Intervene: 1d6 added by other crawlers. */
  intervene?: { id: number; name: string; value: number }[];
  /** A Stat Check (can't be Intervened). */
  stat?: boolean;
  /** Rerolled with AI Favor (this roll no longer counts) / this roll is the reroll of message `rerollOf`. */
  rerolled?: boolean;
  rerollOf?: number;
};
export type Message = {
  id: number;
  kind: 'chat' | 'roll' | 'event';
  text: string;
  roll: RollResult | null;
  gmOnly: boolean;
  userId: number;
  userName: string;
  isAdmin: boolean;
  characterId: number | null;
  characterName: string;
  event: LogEvent | null;
  createdAt: string;
};
/** Automatic log entries (the "Log" tab). */
export type LogEvent =
  | { type: 'hp'; from: number; to: number; source: string }
  | { type: 'mana'; from: string; to: string; source: string }
  | ({ type: 'level' } & LevelEntry)
  | { type: 'grind'; hours: number; total: number; level: number }
  | {
      type: 'stats';
      changes: Partial<Record<'str' | 'int' | 'con' | 'dex' | 'cha', number>>;
      spent: number;
      left: number;
    }
  | {
      type: 'advance';
      mode: 'session' | 'floor';
      results: { name: string; from: number; roll: number; gained: boolean }[];
    }
  | { type: 'combat'; action: 'start' | 'round' | 'end'; round: number }
  | { type: 'opponent'; name: string; from: number; to: number; defeated: boolean; source: string }
  | { type: 'favor'; use: 'reroll' | 'action'; from: number; to: number }
  | { type: 'achievement'; title: string }
  | { type: 'expired'; names: string[] }
  | { type: 'injury'; debuff: string; source: string }
  | {
      type: 'item';
      item: string;
      target: string;
      left: number;
      applied: { type: 'heal'; slots: number } | { type: 'mana'; amount?: number } | null;
      /** Equipment / Accessory / Special: its ability was used, the item stays. */
      kept?: boolean;
      ability?: string;
      /** Charges left on the current one. */
      charges?: number;
    }
  | {
      type: 'hotlist';
      slot: number;
      item: string;
      prev: string;
      before: string[];
      after: string[];
      round: number;
      undone: boolean;
    }
  | { type: 'interrupt'; kind: 'catch'; ally: string; attack: string }
  | { type: 'reward'; title: string; boxes: Pick<LootBox, 'tier' | 'kind' | 'label'>[] }
  | { type: 'world'; action: 'floor'; from: number; to: number; name: string; nameEs: string }
  | {
      type: 'declare';
      round: number;
      items: {
        opponent: string;
        attack: string;
        range: string;
        dc: number | null;
        area?: boolean;
        targets: { id: number; name: string; splash?: boolean }[];
      }[];
    };

/** World Stats (everyone reads them, the GM changes them). */
export type World = {
  floor: number;
  name: string;
  nameEs: string;
  /** Default days to Level Collapse for this Floor (0 = not set). */
  collapseDays: number;
  /** In-game hours left before the Floor collapses. */
  collapseHours: number;
  crawlersAlive: number | null;
  ambience: string;
  ambienceEs: string;
  /** The GM has changed this Floor's name or texts. */
  customized: boolean;
  maxFloor: number;
  /** "2 hours passed" also takes 2 hours off the Level Collapse clock. */
  autoClock: boolean;
};
export type WorldPatch = Partial<{
  floor: number;
  syncParty: boolean;
  crawlersAlive: number | string | null;
  collapseHours: number;
  addHours: number;
  autoClock: boolean;
  name: string;
  nameEs: string;
  ambience: string;
  ambienceEs: string;
  reset: boolean;
}>;

export type OpponentKind = 'mob' | 'elite' | 'boss' | 'npc' | 'crawler';
export type Opponent = {
  id: number;
  name: string;
  kind: OpponentKind;
  pct: number;
  defeated: boolean;
  // GM only
  slots?: number;
  slotValue?: number;
  lost?: number;
  dr?: string;
  evade?: string;
  notes?: string;
  hidden?: boolean;
  npcId?: number | null;
  attacks?: NpcAttack[];
  /** From its stat block (GM only): rules notes and the System AI description. */
  npcNotes?: string;
  npcNotesEs?: string;
  npcDescription?: string;
  npcDescriptionEs?: string;
  mods?: Partial<Record<'str' | 'int' | 'con' | 'dex' | 'cha', string>>;
};
export type NpcAttack = { name: string; toHit: string; damage: string; range: string; effect: string };
/** A Mob's declared attack for this round (Mob Action Declaration). Players see it from Crawler Reaction on. */
export type Declaration = {
  id: number;
  round: number;
  opponentId: number;
  opponentName: string;
  /** Players get only the name and range. */
  attack: Partial<NpcAttack> & { name: string };
  dc: number | null;
  /** Area Attack: a successful Evade halves the damage instead of avoiding it. */
  area?: boolean;
  targets: {
    id: number;
    name: string;
    /** In the Splash zone of an Area Attack: half damage (¼ when Evaded). */
    splash?: boolean;
    evade: {
      total: number;
      natural: number | null;
      success: boolean | null;
      /** Rerolled with AI Favor (once per check); `first` is the original total. */
      rerolled?: boolean;
      first?: number;
      degree?: Degree | null;
      /** Major Fail: + Floor damage. Critical Fail: double damage. */
      extra?: number;
      double?: boolean;
      messageId?: number | null;
    } | null;
    applied: { damage: number; slots: number } | null;
    /** Catcher: took the hit for this ally (and can't Evade it). */
    caughtFor?: string;
    noEvade?: boolean;
  }[];
  damage: { total: number; expr: string } | null;
  /** Taunt (Interrupt) against this attack: who tried, and whether it worked. */
  taunt?: { id: number; name: string; won: boolean; total?: number; mob?: number } | null;
  tauntedFrom?: string[];
};
export type LinkKind = 'grab' | 'taunt' | 'protect' | 'custom';
export type LinkSide = { type: 'crawler' | 'opponent'; id: number; name: string };
/** "Grabbing: Alvaro" / "Grabbed by: Bad Llama 2": cleared when either side leaves the fight. */
export type Link = { id: number; kind: LinkKind; label: string; a: LinkSide; b: LinkSide };
export type Encounter = {
  active: boolean;
  round: number;
  phase: number;
  floor: number;
  opponents: Opponent[];
  declarations: Declaration[];
  /** Crawler Actions used this round, by character id (missing = none used yet). */
  actions: Record<string, CrawlerActions>;
  /** Crawler attacks this round (step 4 / surprise round). */
  attacks: CrawlerAttack[];
  links: Link[];
};
/** A crawler's attack on an opponent: hit or miss against the Mob's Evade (`dc`, GM only). */
export type CrawlerAttack = {
  id: number;
  round: number;
  characterId: number;
  charName: string;
  opponentId: number;
  opponentName: string;
  label: string;
  total: number;
  natural: number | null;
  dc?: number | null;
  /** null when the Mob has no Evade on file: the GM calls it. */
  hit: boolean | null;
  degree?: Degree | null;
  /** Area Attack: the records of one roll share a group. */
  group?: number | null;
  damageExpr: string | null;
  /** `crit`: Natural 20, the damage dice were doubled; `amazing`: + Floor for an Amazing Success. */
  damage: { total: number; expr: string; crit?: boolean; amazing?: number } | null;
  applied: { slots: number; damage: number } | null;
};
/** 'evade' / 'interrupt' are Crawler Reaction Interrupts, 'action' is a Crawler Action (step 4). */
export type ActionKind = 'evade' | 'interrupt' | 'heal' | 'action' | 'attack';
export type CrawlerActions = { used: ActionKind[]; extra: boolean; max: number };
export type NpcData = {
  name: string;
  kind: OpponentKind;
  size: string;
  tags: string;
  slots: string;
  slotValue: string;
  level: string;
  surprise: string;
  evade: string;
  move: string;
  dr: string;
  stats: Record<'str' | 'int' | 'con' | 'dex' | 'cha', { score: string; mod: string }>;
  attacks: NpcAttack[];
  notes: string;
  /** Flavor text in the System AI's voice (and its Spanish version). */
  description: string;
  descriptionEs: string;
  /** Spanish version of the rules notes. */
  notesEs: string;
  /** Locked stat blocks can't be edited by accident (the default for book entries). */
  locked: boolean;
  /** Where a book stat block came from ("Core Rulebook p. 333") and its chapter/Floor. */
  source: string;
  chapter: string;
  /** Floor the stat block belongs to (0 = any / not set). */
  floor: number;
};
export type Npc = { id: number; data: Partial<NpcData>; updatedAt: string };
export type ProgressAction =
  | { type: 'twoHours' }
  | { type: 'quest'; levels: number }
  | { type: 'boss'; tier: string }
  | { type: 'kill'; victimLevel: number }
  | { type: 'grind'; hours: number }
  | { type: 'levels'; levels: number };
export type HpManaSources = { hp?: string[]; mana?: string[] };
export type NewMessage = {
  text?: string;
  roll?: { expr: string; label?: string; stat?: boolean };
  characterId?: number | null;
  gmOnly?: boolean;
};

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body: Record<string, unknown> = {},
  ) {
    super(message);
  }
  /** Stable machine-readable error code from the server, used for translation. */
  get code(): string | undefined {
    return typeof this.body.code === 'string' ? this.body.code : undefined;
  }
}

async function request<T>(method: string, url: string, body?: unknown): Promise<T> {
  const res = await fetch(url, {
    method,
    credentials: 'same-origin',
    headers: body !== undefined ? { 'content-type': 'application/json' } : undefined,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(res.status, json.error || res.statusText, json);
  return json as T;
}

/* ---------- achievements and rewards ---------- */
export type BoxTier = 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary' | 'celestial';
export type BoxKind = 'adventurer' | 'boss' | 'crafter' | 'assassin' | 'fan' | 'benefactor' | 'achievement' | 'custom';
export const BOX_TIERS: BoxTier[] = ['bronze', 'silver', 'gold', 'platinum', 'legendary', 'celestial'];
export const BOX_KINDS: BoxKind[] = [
  'adventurer',
  'boss',
  'crafter',
  'assassin',
  'fan',
  'benefactor',
  'achievement',
  'custom',
];
/** An item inside a loot box (`special` gets the spotlight when it's opened). */
export type RewardItem = Pick<Item, 'item' | 'qty' | 'notes' | 'type' | 'rarity' | 'unique' | 'skill' | 'upgrades'> &
  Partial<Pick<Item, 'fits' | 'twoHanded' | 'ranged' | 'ammo' | 'ammoType' | 'charges' | 'maxCharges' | 'ability'>> & {
    bonus: Item['bonus'];
    special: boolean;
  };
export type LootBox = { tier: BoxTier; kind: BoxKind; label: string; items: RewardItem[] };
export type Reward = { boxes: LootBox[]; note: string };
export type Achievement = {
  id: number;
  title: string;
  description: string;
  reward: Reward;
  createdAt: string;
  awards: {
    id: number;
    characterId: number;
    name: string;
    awardedAt: string;
    claimedAt: string | null;
    reward: Reward;
  }[];
};
export type Award = {
  id: number;
  achievementId: number;
  title: string;
  description: string;
  awardedAt: string;
  claimedAt: string | null;
  hasReward: boolean;
  /** For players, the boxes' items are empty until claimed. */
  reward: Reward;
  opened: Reward | null;
};
/* ---------- maps (fog of war) ---------- */
export type PoiKind = 'poi' | 'stairs' | 'saferoom' | 'boss' | 'danger' | 'loot' | 'npc' | 'note';
export const POI_KINDS: PoiKind[] = ['poi', 'stairs', 'saferoom', 'boss', 'danger', 'loot', 'npc', 'note'];
export type Poi = { id: string; x: number; y: number; name: string; note: string; kind: PoiKind; hidden?: boolean };
export type GameMap = {
  id: number;
  name: string;
  floor: number;
  cols: number;
  rows: number;
  /** Revealed grid cells, "col,row". */
  revealed: string[];
  pois: Poi[];
  /** Party token (fractions of the image size), or null. */
  party: { x: number; y: number } | null;
  shared: boolean;
  showGrid: boolean;
  updatedAt: string;
  /** Changes when the image the viewer gets changes (cache buster). */
  imageTag: string;
  hasImage: boolean;
  /** GM only: tag of the fogged copy players get. */
  playerTag?: string;
};
export type MapPatch = Partial<
  Pick<GameMap, 'name' | 'floor' | 'cols' | 'rows' | 'revealed' | 'pois' | 'shared' | 'showGrid'>
> & {
  party?: { x: number; y: number } | null;
  image?: string;
  playerImage?: string;
};
export const mapImageUrl = (m: Pick<GameMap, 'id' | 'imageTag'>, asPlayer = false) =>
  `/api/maps/${m.id}/image?v=${m.imageTag}${asPlayer ? '&as=player' : ''}`;

export type AchievementInput = { title: string; description: string; reward: Reward; characterIds?: number[] };

export const api = {
  config: () => request<{ allowRegistration: boolean }>('GET', '/api/config'),
  me: () => request<User>('GET', '/api/auth/me'),
  login: (username: string, password: string) => request<User>('POST', '/api/auth/login', { username, password }),
  register: (username: string, password: string) => request<User>('POST', '/api/auth/register', { username, password }),
  logout: () => request('POST', '/api/auth/logout'),
  viewAs: (userId: number | 'self' | null) => request<User>('POST', '/api/auth/view-as', { userId }),
  changePassword: (currentPassword: string, newPassword: string) =>
    request('POST', '/api/auth/password', { currentPassword, newPassword }),

  listCharacters: (all = false) => request<CharacterSummary[]>('GET', `/api/characters${all ? '?scope=all' : ''}`),
  createCharacter: (data: Partial<SheetData> = {}, ownerId?: number) =>
    request<Character>('POST', '/api/characters', { data, ownerId }),
  getCharacter: (id: number) => request<Character>('GET', `/api/characters/${id}`),
  saveCharacter: (id: number, data: SheetData, version: number, sources?: HpManaSources) =>
    request<CharacterSummary>('PUT', `/api/characters/${id}`, { data, version, sources }),
  setLocked: (id: number, locked: boolean) =>
    request<CharacterSummary>('POST', `/api/characters/${id}/lock`, { locked }),
  deleteCharacter: (id: number) => request('DELETE', `/api/characters/${id}`),
  setOwner: (id: number, ownerId: number) =>
    request<CharacterSummary>('PATCH', `/api/characters/${id}/owner`, { ownerId }),

  setInParty: (id: number, inParty: boolean) =>
    request<{ id: number; inParty: boolean }>('PATCH', `/api/characters/${id}/party`, { inParty }),
  party: () => request<PartyMember[]>('GET', '/api/party'),
  messages: () => request<Message[]>('GET', '/api/messages'),
  postMessage: (m: NewMessage) => request<Message>('POST', '/api/messages', m),
  clearMessages: () => request('DELETE', '/api/messages'),
  rerollMessage: (id: number) => request<Message>('POST', `/api/messages/${id}/reroll`, {}),

  encounter: () => request<Encounter>('GET', '/api/encounter'),
  encounterAction: (action: 'start' | 'next' | 'prev' | 'end' | 'floor', extra: Record<string, unknown> = {}) =>
    request<Encounter>('POST', '/api/encounter', { action, ...extra }),
  addOpponents: (o: Record<string, unknown>) => request<Encounter>('POST', '/api/encounter/opponents', o),
  updateOpponent: (id: number, patch: Record<string, unknown>) =>
    request<Encounter>('PATCH', `/api/encounter/opponents/${id}`, patch),
  removeOpponent: (id: number) => request<Encounter>('DELETE', `/api/encounter/opponents/${id}`),
  declare: (d: {
    opponentId: number;
    attack: number | Partial<NpcAttack>;
    targets: number[];
    area?: boolean;
    splash?: number[];
  }) => request<Encounter>('POST', '/api/encounter/declarations', d),
  removeDeclaration: (id: number) => request<Encounter>('DELETE', `/api/encounter/declarations/${id}`),
  clearDeclarations: (opponentId: number) =>
    request<Encounter>('DELETE', `/api/encounter/opponents/${opponentId}/declarations`),
  removeAttack: (id: number) => request<Encounter>('DELETE', `/api/encounter/attacks/${id}`),
  rollEvade: (id: number, characterId: number, expr: string, reroll = false) =>
    request<Encounter>('POST', `/api/encounter/declarations/${id}/evade`, { characterId, expr, reroll }),
  crawlerAction: (
    characterId: number,
    op: 'use' | 'free' | 'extra',
    extra: { kind?: ActionKind; index?: number } = {},
  ) => request<Encounter>('POST', '/api/encounter/actions', { characterId, op, ...extra }),
  rollDeclDamage: (id: number) => request<Encounter>('POST', `/api/encounter/declarations/${id}/damage`, {}),
  markTarget: (
    id: number,
    characterId: number,
    patch: { applied?: { damage: number; slots: number } | null; evade?: null },
  ) => request<Encounter>('PATCH', `/api/encounter/declarations/${id}/targets/${characterId}`, patch),
  crawlerAttack: (a: {
    characterId: number;
    opponentId?: number;
    /** Area Attack: one roll against several opponents. */
    opponentIds?: number[];
    expr: string;
    damage?: string | null;
    label: string;
    /** A ranged weapon's Ammunition (inventory item id, on the Hotlist): one is spent. */
    ammoItemId?: string;
  }) => request<Encounter>('POST', '/api/encounter/attacks', a),
  setHotSlot: (characterId: number, slot: number, itemId: string) =>
    request<{ version: number; messageId: number | null }>('POST', `/api/characters/${characterId}/hotlist`, {
      slot,
      itemId,
    }),
  undoEvent: (messageId: number) => request<{ ok: boolean }>('POST', `/api/messages/${messageId}/undo`, {}),
  intervene: (messageId: number, characterId: number) =>
    request<Encounter>('POST', `/api/messages/${messageId}/intervene`, { characterId }),
  taunt: (declId: number, characterId: number, expr: string) =>
    request<Encounter>('POST', `/api/encounter/declarations/${declId}/taunt`, { characterId, expr }),
  catchAttack: (declId: number, characterId: number, allyId: number) =>
    request<Encounter>('POST', `/api/encounter/declarations/${declId}/catch`, { characterId, allyId }),
  addLink: (l: { kind: LinkKind; a: Omit<LinkSide, 'name'>; b: Omit<LinkSide, 'name'>; label?: string }) =>
    request<Encounter>('POST', '/api/encounter/links', l),
  removeLink: (id: number) => request<Encounter>('DELETE', `/api/encounter/links/${id}`),
  useItem: (characterId: number, itemId: string, targetId?: number, manaMax?: number | null) =>
    request<{ left: number; applied: unknown; version: number }>('POST', `/api/characters/${characterId}/use-item`, {
      itemId,
      targetId,
      manaMax,
    }),
  attackDamage: (id: number, expr?: string) =>
    request<Encounter>('POST', `/api/encounter/attacks/${id}/damage`, expr ? { expr } : {}),
  applyAttack: (id: number, body: { hit?: boolean } = {}) =>
    request<Encounter>('POST', `/api/encounter/attacks/${id}/apply`, body),
  npcRoll: (r: { name: string; expr: string; label?: string; gmOnly?: boolean }) =>
    request<Message>('POST', '/api/npc-roll', r),

  world: () => request<World>('GET', '/api/world'),
  updateWorld: (p: WorldPatch) => request<World>('PATCH', '/api/world', p),

  npcs: () => request<Npc[]>('GET', '/api/npcs'),
  npc: (id: number) => request<Npc>('GET', `/api/npcs/${id}`),
  createNpc: (data: Partial<NpcData> = {}) => request<Npc>('POST', '/api/npcs', { data }),
  saveNpc: (id: number, data: NpcData) => request<Npc>('PUT', `/api/npcs/${id}`, { data }),
  deleteNpc: (id: number) => request('DELETE', `/api/npcs/${id}`),
  importBookNpcs: () => request<{ added: number; updated: number; total: number }>('POST', '/api/npcs/import-book', {}),

  progress: (id: number, action: ProgressAction) =>
    request<{ data: SheetData; version: number }>('POST', `/api/characters/${id}/progress`, action),
  advance: (id: number, mode: 'session' | 'floor') =>
    request<{
      data: SheetData;
      version: number;
      results: { name: string; from: number; roll: number; gained: boolean }[];
    }>('POST', `/api/characters/${id}/advance`, { mode }),
  partyTwoHours: () => request<{ members: { id: number }[] }>('POST', '/api/party/two-hours', {}),

  pregens: () => request<import('./creation').Pregen[]>('GET', '/api/pregens'),
  maps: () => request<GameMap[]>('GET', '/api/maps'),
  map: (id: number) => request<GameMap>('GET', `/api/maps/${id}`),
  createMap: (m: MapPatch) => request<GameMap>('POST', '/api/maps', m),
  updateMap: (id: number, m: MapPatch) => request<GameMap>('PATCH', `/api/maps/${id}`, m),
  deleteMap: (id: number) => request('DELETE', `/api/maps/${id}`),
  rewardSettings: () => request<{ claimLocked: boolean }>('GET', '/api/rewards/settings'),
  setClaimLocked: (claimLocked: boolean) =>
    request<{ claimLocked: boolean }>('PUT', '/api/rewards/settings', { claimLocked }),
  achievements: () => request<Achievement[]>('GET', '/api/achievements'),
  createAchievement: (a: AchievementInput) => request<Achievement>('POST', '/api/achievements', a),
  updateAchievement: (id: number, a: AchievementInput) => request<Achievement>('PUT', `/api/achievements/${id}`, a),
  deleteAchievement: (id: number) => request('DELETE', `/api/achievements/${id}`),
  giveAchievement: (id: number, characterIds: number[]) =>
    request<Achievement>('POST', `/api/achievements/${id}/awards`, { characterIds }),
  revokeAward: (id: number) => request('DELETE', `/api/awards/${id}`),
  setAwardReward: (id: number, reward: Reward) => request('PUT', `/api/awards/${id}/reward`, { reward }),
  awards: (characterId: number) =>
    request<{ claimLocked: boolean; awards: Award[] }>('GET', `/api/characters/${characterId}/awards`),
  claimAward: (id: number) => request<{ id: number; opened: Reward }>('POST', `/api/awards/${id}/claim`, {}),
  listUsers: () => request<AdminUser[]>('GET', '/api/users'),
  backups: () =>
    request<{ enabled: boolean; dir: string | null; keep: number; files: { name: string; size: number }[] }>(
      'GET',
      '/api/admin/backups',
    ),
  backupNow: () => request<{ name: string; files: { name: string; size: number }[] }>('POST', '/api/admin/backups', {}),
  updateUser: (id: number, patch: { isAdmin?: boolean; password?: string }) =>
    request<User>('PATCH', `/api/users/${id}`, patch),
  deleteUser: (id: number) => request('DELETE', `/api/users/${id}`),

  lookupCatalog: (name: string, scope: 'skill' | 'item' = 'skill') =>
    request<CatalogHit>('GET', `/api/catalog/lookup?scope=${scope}&name=${encodeURIComponent(name)}`),
  publicSkills: () => request<{ name: string; category: string; subtype: string }[]>('GET', '/api/catalog/skills'),
  fullCatalog: () => request<FullCatalog>('GET', '/api/catalog/all'),
};
