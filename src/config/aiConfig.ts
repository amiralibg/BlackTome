export type AiRuntimeConfig = {
  apiBaseUrl: string
  aiModel: string
  apiKey: string
}

export const defaultAiConfig: AiRuntimeConfig = {
  apiBaseUrl: import.meta.env.VITE_BLACKTOME_AI_BASE_URL ,
  aiModel: import.meta.env.VITE_BLACKTOME_AI_MODEL,
  apiKey: import.meta.env.VITE_BLACKTOME_AI_API_KEY,
}

export function isDefaultAiConfigured() {
  return Boolean(defaultAiConfig.apiBaseUrl.trim() && defaultAiConfig.aiModel.trim() && defaultAiConfig.apiKey.trim())
}
