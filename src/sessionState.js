export const ALL_SECTIONS = [
  'hero',
  'message-section',
  'rose-garden',
  'bouquet-photo',
  'closing-message',
  'questions',
  'epilogue',
]

export const TOTAL_QUESTIONS = 6

const VISIT_KEY = 'analytics_visit_count'

const state = {
  authenticatedAt: null,
  sectionsViewed: new Set(),
  questionsOpened: new Set(),
  languageToggles: 0,
  scrollHintClicks: 0,
  maxScrollDepthPct: 0,
  passwordAttempts: 0,
  passwordSuccess: false,
  visitNumber: 1,
  summarySent: false,
  scrollCleanup: null,
}

function updateScrollDepth() {
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
  if (scrollHeight <= 0) {
    state.maxScrollDepthPct = 100
    return
  }
  const pct = Math.round((window.scrollY / scrollHeight) * 100)
  state.maxScrollDepthPct = Math.max(state.maxScrollDepthPct, pct)
}

export function initSessionTracking() {
  if (state.authenticatedAt) return

  state.authenticatedAt = Date.now()
  state.visitNumber = (parseInt(localStorage.getItem(VISIT_KEY) || '0', 10) || 0) + 1
  localStorage.setItem(VISIT_KEY, String(state.visitNumber))

  updateScrollDepth()
  window.addEventListener('scroll', updateScrollDepth, { passive: true })
  state.scrollCleanup = () => window.removeEventListener('scroll', updateScrollDepth)
}

export function recordEvent(event, properties = {}) {
  switch (event) {
    case 'password_attempt':
      state.passwordAttempts += 1
      if (properties.success) state.passwordSuccess = true
      break
    case 'section_viewed':
      if (properties.section_id) state.sectionsViewed.add(properties.section_id)
      break
    case 'question_opened':
      if (properties.question_number) state.questionsOpened.add(properties.question_number)
      break
    case 'language_toggled':
      state.languageToggles += 1
      break
    case 'scroll_hint_clicked':
      state.scrollHintClicks += 1
      break
    default:
      break
  }
}

export function buildSessionSummary() {
  const allQuestionNumbers = Array.from({ length: TOTAL_QUESTIONS }, (_, i) => i + 1)
  const questionsOpened = [...state.questionsOpened].sort((a, b) => a - b)

  updateScrollDepth()

  return {
    visit_number: state.visitNumber,
    is_return_visit: state.visitNumber > 1,
    total_duration_ms: state.authenticatedAt ? Date.now() - state.authenticatedAt : 0,
    sections_viewed: [...state.sectionsViewed],
    sections_missed: ALL_SECTIONS.filter((id) => !state.sectionsViewed.has(id)),
    questions_opened: questionsOpened,
    questions_skipped: allQuestionNumbers.filter((n) => !state.questionsOpened.has(n)),
    questions_opened_count: questionsOpened.length,
    language_toggles: state.languageToggles,
    scroll_hint_clicks: state.scrollHintClicks,
    max_scroll_depth_pct: state.maxScrollDepthPct,
    reached_questions: state.sectionsViewed.has('questions'),
    reached_epilogue: state.sectionsViewed.has('epilogue'),
    reached_end: state.maxScrollDepthPct >= 90 || state.sectionsViewed.has('epilogue'),
    all_questions_opened: questionsOpened.length === TOTAL_QUESTIONS,
    password_attempts: state.passwordAttempts,
    password_unlocked: state.passwordSuccess,
  }
}

export function markSummarySent() {
  if (state.summarySent) return false
  state.summarySent = true
  return true
}
