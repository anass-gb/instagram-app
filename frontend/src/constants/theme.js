// ─────────────────────────────────────────────────────────────────────────────
//  DESIGN SYSTEM — VerdApp
//  Dark Green Dominant  |  Audacieux · Unique · Premium
//  Inspiré de : terminaux hacker, nature digitale, bioluminescence
// ─────────────────────────────────────────────────────────────────────────────

export const COLORS = {
  // ── Arrière-plans ──────────────────────────────────────────────────────────
  bg:            '#050F09',   // vert très sombre, presque noir
  surface:       '#0A1A0F',   // cartes / containers
  surfaceAlt:    '#0F2318',   // éléments secondaires, inputs
  surfaceHover:  '#142B1E',   // hover state
  border:        '#1A3826',   // séparateurs fins
  borderLight:   '#204530',   // bordures légères

  // ── Accent — Vert Émeraude vif ─────────────────────────────────────────────
  primary:       '#00FF87',   // vert néon signature
  primaryDim:    '#00CC6A',   // version moins intense
  primaryDark:   '#008F4A',   // deep green, pressed
  primaryFaint:  '#00FF8710', // fond très léger (glow)
  primaryGlow:   '#00FF8730', // glow fort pour effets

  // ── Vert secondaire ────────────────────────────────────────────────────────
  secondary:     '#1DB954',   // vert Spotify — boutons outline
  secondaryDark: '#169C45',

  // ── Textes ─────────────────────────────────────────────────────────────────
  text:          '#E8F5EE',   // blanc verdâtre doux
  textSub:       '#7BA891',   // secondaire vert-gris
  textMuted:     '#3D6450',   // fantôme

  // ── États ──────────────────────────────────────────────────────────────────
  error:         '#FF4545',
  warning:       '#FFC107',
  success:       '#00FF87',

  // ── Spéciaux ───────────────────────────────────────────────────────────────
  like:          '#FF3B5C',
  online:        '#00FF87',
  storyActive:   '#00FF87',
  storyViewed:   '#1A3826',
  white:         '#FFFFFF',
  black:         '#000000',
  transparent:   'transparent',
  overlay:       'rgba(5,15,9,0.85)',

  // ── Gradients helpers (pour LinearGradient) ─────────────────────────────
  gradientStory:  ['#00FF87', '#00CC6A', '#008F4A'],
  gradientCard:   ['rgba(0,255,135,0.12)', 'rgba(5,15,9,0)'],
  gradientHeader: ['rgba(5,15,9,0.98)', 'rgba(5,15,9,0)'],
};

export const FONTS = {
  sizes: {
    xs:   10,
    sm:   12,
    md:   13,
    base: 15,
    lg:   17,
    xl:   20,
    xxl:  24,
    xxxl: 28,
    huge: 34,
  },
  weight: {
    regular:  '400',
    medium:   '500',
    semibold: '600',
    bold:     '700',
    black:    '800',
  },
  // À activer si vous intégrez expo-font avec une police custom
  family: {
    mono: 'monospace',  // pour les usernames style "terminal"
  },
};

export const SPACING = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  24,
  xxxl: 32,
};

export const RADIUS = {
  xs:   4,
  sm:   8,
  md:   10,
  lg:   16,
  xl:   22,
  full: 9999,
};

export const SIZES = {
  avatarXs:  24,
  avatarSm:  32,
  avatarMd:  44,
  avatarLg:  80,
  avatarXl:  110,
  storyRing: 68,
  tabBar:    62,
  header:    56,
};

// ── Ombres / élévation ──────────────────────────────────────────────────────
export const SHADOWS = {
  card: {
    shadowColor:   '#00FF87',
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0.08,
    shadowRadius:  12,
    elevation:     4,
  },
  glow: {
    shadowColor:   '#00FF87',
    shadowOffset:  { width: 0, height: 0 },
    shadowOpacity: 0.35,
    shadowRadius:  16,
    elevation:     8,
  },
};
