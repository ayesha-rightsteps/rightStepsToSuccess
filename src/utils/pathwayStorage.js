const KEY = 'rsts_pathways'

export const getSavedPathways = () => {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') }
  catch { return [] }
}

export const savePathway = (pathway) => {
  const list = getSavedPathways()
  const idx = list.findIndex(p => p.question === pathway.question && p.routeType === pathway.routeType)
  if (idx >= 0) {
    list[idx] = { ...list[idx], ...pathway, updatedAt: new Date().toISOString() }
  } else {
    list.unshift({ ...pathway, id: Date.now(), savedAt: new Date().toISOString() })
  }
  localStorage.setItem(KEY, JSON.stringify(list.slice(0, 20)))
  window.dispatchEvent(new Event('pathwaySaved'))
}

export const deletePathway = (id) => {
  const list = getSavedPathways().filter(p => p.id !== id)
  localStorage.setItem(KEY, JSON.stringify(list))
  window.dispatchEvent(new Event('pathwaySaved'))
}

export const checkIsSaved = (question, routeType) =>
  getSavedPathways().some(p => p.question === question && p.routeType === routeType)
