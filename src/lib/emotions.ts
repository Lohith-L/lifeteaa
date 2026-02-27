export const EMOTIONS = [
  { value: 'Happy', emoji: '😊', color: 'tea-green' },
  { value: 'Sad', emoji: '😢', color: 'tea-blue' },
  { value: 'Frustrated', emoji: '😤', color: 'tea-orange' },
  { value: 'Excited', emoji: '🎉', color: 'tea-yellow' },
  { value: 'Anxious', emoji: '😰', color: 'tea-purple' },
  { value: 'Angry', emoji: '😡', color: 'tea-red' },
  { value: 'Hopeless', emoji: '😞', color: 'tea-pink' },
  { value: 'Stressed', emoji: '😫', color: 'tea-orange' },
  { value: 'Hopeful', emoji: '🌟', color: 'tea-green' },
  { value: 'Confused', emoji: '🤔', color: 'tea-yellow' },
  { value: 'Reflective', emoji: '🪞', color: 'tea-purple' },
  { value: 'Neutral', emoji: '😐', color: 'muted' },
  { value: 'Overwhelmed', emoji: '🤯', color: 'tea-pink' },
  { value: 'Insecure', emoji: '🫣', color: 'tea-blue' },
] as const;

export const CATEGORIES = [
  'College', 'Work', 'Family', 'Relationships', 'Personal',
] as const;

export const ANONYMOUS_NAMES: Record<string, string[]> = {
  Sad: ['CryingIn4K', 'SadButHD', 'EmotionalDamage.exe', 'TearDropCoder', 'MelancholyMuse'],
  Anxious: ['OverthinkingCEO', 'PanicAtTheEverything', 'AnxietyArchitect', 'WorriedWanderer'],
  Overwhelmed: ['78OpenTabs', 'Human404', 'SystemOverload', 'BrainBuffering'],
  Frustrated: ['InternallyScreaming', 'RageButPolite', 'FrustratedPixel', 'BugInMyCode'],
  Angry: ['VillainOriginStory', 'RageQuitCore', 'FuryInProgress', 'StormBrewing'],
  Hopeless: ['LowBatteryHuman', 'PlotArmorMissing', 'HopeOnVacation', 'GlitchedOptimist'],
  Stressed: ['DeadlineDinosaur', 'GPAOnLifeSupport', 'CaffeineAndChaos', 'StressedButDressed'],
  Insecure: ['SelfDoubtProMax', 'MirrorAvoider', 'UncertainUnicorn', 'ShadowSelf'],
  Happy: ['SerotoninDealer', 'MainCharacterUnlocked', 'JoyOverflow', 'SunshineInABottle'],
  Hopeful: ['GlowUpPending', 'RedemptionArc', 'HopeEngine', 'RisingPhoenix'],
  Confused: ['Brain404Error', 'LostInTheSauce', 'ConfusedCactus', 'WhatIsHappening'],
  Reflective: ['MidnightThoughts.exe', 'EmotionalArchivist', 'DeepDiver', 'SoulSearcher'],
  Neutral: ['DefaultSettings', 'ExistingRespectfully', 'JustVibing', 'ChillPill'],
  Excited: ['HypeTrainDriver', 'SparklingEnergy', 'BubblyBot', 'EuphoriaCoder'],
};

export function getRandomAnonymousName(emotion: string): string {
  const names = ANONYMOUS_NAMES[emotion] || ANONYMOUS_NAMES['Neutral'];
  return names[Math.floor(Math.random() * names.length)];
}

export function getEmotionConfig(emotion: string) {
  return EMOTIONS.find(e => e.value === emotion) || EMOTIONS[EMOTIONS.length - 1];
}

export function formatTimeAgo(date: string): string {
  const now = new Date();
  const d = new Date(date);
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return 'Just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
}
