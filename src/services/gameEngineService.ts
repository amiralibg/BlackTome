import { defaultAiConfig, type AiRuntimeConfig } from '../config/aiConfig'
import { getArchetype } from '../data/archetypes'
import type { CharacterDraft, Choice, EngineResult, GameState, PlayerStatsModel, SceneState, Settings } from '../types/game'

const wait = (ms: number) => new Promise((resolve) => window.setTimeout(resolve, ms))

export const openingScene: SceneState = {
  id: 'opening-vault',
  text: `Rain hangs frozen in the air outside the ruined observatory. Each drop looks like black glass. On the lectern in front of you rests the Blacktome, bound in iron and cold to the touch.\n\nWhen you touch the cover, silver words crawl across it. The book does not ask your name. It already knows it. Far below, a bell rings once in a chapel that burned down long ago.`,
  choices: [
    { id: 'open-tome', label: 'Open the tome and read the first living page', tone: 'Brave' },
    { id: 'inspect-room', label: 'Search the observatory for warding marks', tone: 'Careful' },
    { id: 'speak-name', label: 'Speak your true name to the listening dark', tone: 'Forbidden' },
  ],
}

export const initialPlayer: PlayerStatsModel = {
  name: 'Mara Veyr',
  archetypeId: 'builder',
  archetypeName: 'Builder',
  health: 92,
  energy: 68,
  sanity: 74,
  inventory: ['Tarnished key', 'Moon-ash candle', 'Empty reliquary'],
}

const clampStat = (value: number) => Math.max(0, Math.min(100, value))

export function createPlayerFromDraft(draft: CharacterDraft): PlayerStatsModel {
  const archetype = getArchetype(draft.archetypeId)
  const basePlayer = {
    ...initialPlayer,
    name: draft.name.trim() || 'Nameless Reader',
    archetypeId: archetype.id,
    archetypeName: archetype.name,
  }

  return {
    ...basePlayer,
    health: clampStat(basePlayer.health + (archetype.statBonus.health ?? 0)),
    energy: clampStat(basePlayer.energy + (archetype.statBonus.energy ?? 0)),
    sanity: clampStat(basePlayer.sanity + (archetype.statBonus.sanity ?? 0)),
    inventory: [...basePlayer.inventory, archetype.startingItem],
  }
}

const choiceScenes: Record<string, EngineResult> = {
  'open-tome': {
    scene: {
      id: 'page-awakens',
      text: `The cover opens without a sound. Pages turn by themselves, then stop on a drawing of the observatory. A small figure stands at the lectern. It is you. One hand leaks pale light into the page.\n\nNew words appear under the drawing. They show three possible paths. The handwriting looks almost like your own.`,
      choices: [
        { id: 'follow-map', label: 'Follow the ink map toward the sealed planetarium', tone: 'Explore' },
        { id: 'tear-page', label: 'Tear out the page before it finishes drawing you', tone: 'Defy' },
        { id: 'ask-price', label: 'Ask the tome what price it requires', tone: 'Bargain' },
      ],
    },
    playerPatch: { sanity: 68, energy: 62 },
  },
  'inspect-room': {
    scene: {
      id: 'warding-marks',
      text: `You brush away dust and bird bones. Under them, you find a ring of warding marks carved into the floor. Most have gone dark. One still glows violet whenever the Blacktome breathes.\n\nA hidden drawer clicks open in the lectern. Inside is a sharp silver stylus.`,
      choices: [
        { id: 'take-stylus', label: 'Take the silver stylus', tone: 'Claim' },
        { id: 'repair-ward', label: 'Feed the candle flame to the failing ward', tone: 'Protect' },
        { id: 'break-circle', label: 'Scratch through the sigil circle', tone: 'Risk' },
      ],
    },
    playerPatch: { energy: 64, inventory: ['Tarnished key', 'Moon-ash candle', 'Empty reliquary', 'Silver stylus'] },
  },
  'speak-name': {
    scene: {
      id: 'true-name',
      text: `You speak your true name. It leaves your mouth as mist, then comes back as a whisper from every corner of the room. The Blacktome shakes as if it recognizes you.\n\nShadows gather in the rafters and take the shape of silent witnesses. One reaches out. In its palm burns a tiny red door.`,
      choices: [
        { id: 'take-door', label: 'Accept the crimson door', tone: 'Omen' },
        { id: 'deny-witness', label: 'Deny the witnesses and step backward', tone: 'Resist' },
        { id: 'question-witness', label: 'Demand the witness reveal its master', tone: 'Command' },
      ],
    },
    playerPatch: { sanity: 61, health: 88 },
  },
}

type AiAction = {
  type: 'choice' | 'custom'
  text: string
}

const aiStoryEnginePrompt = `You are the story engine for Blacktome, a premium dark-fantasy text RPG with Dungeons & Dragons style narration.

Write in clear, simple English that most players can understand. Use short sentences. Avoid rare words, purple prose, and confusing metaphors. Keep the dark-fantasy mood, but make every action and consequence easy to follow.

Every scene must work like a playable game turn:
- First resolve exactly what the player did. Show the character doing the action, then show the direct result.
- Do not end on passive atmosphere only. The final paragraph must create a clear new problem, threat, clue, bargain, countdown, locked path, wounded ally, monster move, resource shortage, or moral choice.
- The final sentence must push the player to act now. It should make the player feel they must choose a path or write their next action.
- Always provide 2 to 5 concrete choices that continue the story. Each choice must be something the player can do next, not a summary.
- At least one choice should be risky, at least one should be careful or restorative, and at least one should move the main quest forward.

Choices must be synchronized with the scene text:
- Every generated choice must refer only to people, objects, locations, threats, offers, exits, and facts that were clearly shown in the current scene text.
- Do not invent an offer inside a choice unless the scene text explicitly states the offer and what is being offered.
- If a figure says "there is a price" but does not name the bargain, choices may ask the price, refuse to listen, attack, hide, inspect, or read onward. They must not say "accept the bargain" yet.
- If a choice uses words like accept, take, use, open, enter, attack, bargain, trade, drink, unlock, or sacrifice, the scene text must clearly establish the target of that action.
- Choices should feel like natural next actions the player understands from the story text alone.

Run the campaign toward one of five possible endings, chosen naturally from the player's actions and stats:
1. Seal the Blacktome and survive.
2. Master the Blacktome at a terrible cost.
3. Destroy the Blacktome and lose something important.
4. Become trapped, cursed, or transformed by the Blacktome.
5. Die or fall to madness after repeated bad choices or depleted stats.

Use health, energy, and sanity as real survival resources:
- Dangerous physical harm should reduce health.
- Exhausting movement, magic, combat, or forced effort should reduce energy.
- Curses, forbidden knowledge, fear, bargains, and impossible sights should reduce sanity.
- Also create chances to recover resources through rest, food, medicine, wards, rituals, allies, safe rooms, or clever class-based actions.
- If a stat is already low, make consequences more severe and mention the danger clearly in the narration.
- If health reaches 0, narrate death or a near-death failure scene with only grim final choices.
- If sanity reaches 0, narrate madness, possession, or loss of control with severe choices.
- If energy reaches 0, narrate collapse, helplessness, or inability to outrun danger until the player recovers.

Use inventory as a real survival system, not decoration:
- Mention relevant inventory items when they can help, break, unlock, heal, ward, bargain, craft, reveal clues, or create risks.
- Choices should sometimes offer item-based actions such as using a key, candle, weapon, relic, medicine, tool, ward, or class item.
- Items can be gained from exploration, stolen, broken, consumed, cursed, upgraded, traded, or lost because of player choices.
- If an item is consumed, destroyed, traded, or lost, remove it from inventory in playerPatch.inventory.
- If an item is found, crafted, blessed, cursed, or upgraded, add the changed item to playerPatch.inventory.
- Do not preserve inventory blindly when the story clearly uses or changes an item.
- Make inventory important for survival, puzzle solving, endings, and stat recovery.

If the player writes a custom action, treat it as fully valid and narrate the direct result. Never say the action was not offered or unsupported. The action can still fail, partly succeed, cost resources, reveal danger, or create a new complication.

The player character class must influence available solutions, risks, and stat changes. Builders solve with repairs and endurance. Wizards solve with spells and knowledge. Hunters solve with tracking and combat. Occultists solve with bargains and forbidden rites.

Return only JSON with this TypeScript shape: {"scene":{"id":"short-kebab-id","text":"2-3 clear paragraphs separated by \\n\\n","choices":[{"id":"short-kebab-id","label":"player-facing choice","tone":"one word"}]},"playerPatch":{"health":number,"energy":number,"sanity":number,"inventory":["item"]}}.

Rules for JSON:
- Choices must be 2 to 5 items.
- Stats are absolute values from 0 to 100, not deltas.
- Preserve existing inventory unless narratively changed.
- The scene text must not ask the player to choose by number; the UI already shows choices.`

function resolveAiConfig(settings: Settings): AiRuntimeConfig {
  if (settings.useCustomAiConfig) {
    return {
      apiBaseUrl: settings.apiBaseUrl,
      aiModel: settings.aiModel,
      apiKey: settings.apiKey,
    }
  }

  return defaultAiConfig
}

function isAiConfigured(settings: Settings, config: AiRuntimeConfig) {
  return settings.aiModeEnabled && config.apiBaseUrl.trim() && config.apiKey.trim() && config.aiModel.trim()
}

function safeJsonParse(content: string): EngineResult | null {
  try {
    const cleaned = content.replace(/^```(?:json)?/i, '').replace(/```$/i, '').trim()
    const parsed = JSON.parse(cleaned) as EngineResult
    if (!parsed.scene?.text || !Array.isArray(parsed.scene.choices)) return null
    return parsed
  } catch {
    return null
  }
}

async function requestLiaraScene(settings: Settings, gameState: GameState, action: AiAction): Promise<EngineResult | null> {
  const config = resolveAiConfig(settings)
  if (!isAiConfigured(settings, config)) return null

  const recentHistory = gameState.history.slice(-8).map((entry) => `${entry.type}: ${entry.text}`).join('\n---\n')
  const response = await fetch(`${config.apiBaseUrl.replace(/\/$/, '')}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${config.apiKey}`,
    },
    body: JSON.stringify({
      model: config.aiModel,
      temperature: 0.85,
      response_format: { type: 'json_object' },
      messages: [
        {
          role: 'system',
          content: aiStoryEnginePrompt,
        },
        {
          role: 'user',
          content: JSON.stringify({
            currentScene: gameState.scene,
            player: gameState.player,
            characterClass: gameState.player.archetypeName,
            chapter: gameState.session.chapter,
            turn: gameState.session.turn,
            recentHistory,
            playerAction: action,
          }),
        },
      ],
    }),
  })

  if (!response.ok) {
    throw new Error(`Liara AI request failed: ${response.status}`)
  }

  const data = await response.json() as { choices?: Array<{ message?: { content?: string } }> }
  const content = data.choices?.[0]?.message?.content
  return content ? safeJsonParse(content) : null
}

async function mockChoice(choice: Choice): Promise<EngineResult> {
  await wait(950)
  return choiceScenes[choice.id] ?? {
    scene: {
      id: `scene-${choice.id}`,
      text: `You choose to ${choice.label.toLowerCase()}. The Blacktome accepts the decision and the page darkens beneath your hand. Ink rises like smoke, forming a narrow passage of white arches and red lanterns.\n\nThe path ahead splits around a broken ward-stone. One route smells of blood, one hums with old magic, and one offers a moment to recover before the dark catches up. You need to decide how to move before the lanterns go out.`,
      choices: [
        { id: 'take-blood-route', label: 'Take the blood-marked route and move fast', tone: 'Risk' },
        { id: 'restore-ward-stone', label: 'Repair the ward-stone and recover your strength', tone: 'Recover' },
        { id: 'follow-magic-hum', label: 'Follow the humming passage toward the Blacktome', tone: 'Advance' },
      ],
    },
    playerPatch: { energy: Math.max(18, 62 - Math.floor(Math.random() * 9)), sanity: Math.max(20, 70 - Math.floor(Math.random() * 13)) },
  }
}

async function mockCustomAction(input: string): Promise<EngineResult> {
  await wait(1100)
  return {
    scene: {
      id: 'custom-action',
      text: `You act: ${input}. The chamber responds at once. The Blacktome writes around your choice, changing the room to match what you tried to do. Shadows shift, old mechanisms wake, and the result becomes clear.\n\nYour action opens a way forward, but it also draws attention. A bell rings under the floor, and something begins climbing toward the observatory from below. You have only a few breaths to choose your next move.`,
      choices: [
        { id: 'embrace-revision', label: 'Let the revised page guide you deeper into the tome', tone: 'Advance' },
        { id: 'anchor-self', label: 'Grip the reliquary and steady your mind', tone: 'Recover' },
        { id: 'write-back', label: 'Write a command into the margin before it arrives', tone: 'Risk' },
      ],
    },
    playerPatch: { energy: 55, sanity: 66 },
  }
}

export const gameEngineService = {
  async startGame(draft: CharacterDraft): Promise<EngineResult> {
    await wait(850)
    return { scene: openingScene, playerPatch: createPlayerFromDraft(draft) }
  },

  async submitChoice(choice: Choice, gameState: GameState, settings: Settings): Promise<EngineResult> {
    try {
      const aiResult = await requestLiaraScene(settings, gameState, { type: 'choice', text: choice.label })
      return aiResult ?? mockChoice(choice)
    } catch {
      return mockChoice(choice)
    }
  },

  async submitCustomAction(input: string, gameState: GameState, settings: Settings): Promise<EngineResult> {
    try {
      const aiResult = await requestLiaraScene(settings, gameState, { type: 'custom', text: input })
      return aiResult ?? mockCustomAction(input)
    } catch {
      return mockCustomAction(input)
    }
  },
}
