"use client";

const dataCache = new Map();
const promiseCache = new Map();

export async function loadJson(name) {
  if (dataCache.has(name)) return dataCache.get(name);
  if (promiseCache.has(name)) return promiseCache.get(name);

  const promise = fetch(`/data/${name}.json`)
    .then((response) => {
      if (!response.ok) throw new Error(`Failed to load ${name}`);
      return response.json();
    })
    .then((data) => {
      dataCache.set(name, data);
      return data;
    })
    .finally(() => {
      promiseCache.delete(name);
    });

  promiseCache.set(name, promise);
  return promise;
}

export function getCachedJson(name) {
  return dataCache.get(name);
}

export async function loadPapers() {
  return loadJson("papers");
}

export async function loadAuthors() {
  return loadJson("authors");
}

export async function loadSessions() {
  return loadJson("sessions");
}

export async function loadPaperById(paperId) {
  const cachedPapers = getCachedJson("papers");
  const paperFromList = cachedPapers?.find((paper) => paper.paper_id === paperId);
  if (paperFromList) return paperFromList;

  // Fetch just this one paper from the API instead of loading the full 51 MB indexed_papers.json
  const response = await fetch(`/api/papers/${encodeURIComponent(paperId)}`);
  if (!response.ok) return null;
  return response.json();
}

export async function loadAuthorByName(authorName) {
  const authors = await loadAuthors();
  return authors.find((author) => author.author_name === authorName) || null;
}

export async function loadPapersForAuthor(authorName) {
  const cachedPapers = getCachedJson("papers");
  if (cachedPapers) {
    return cachedPapers.filter((paper) =>
      (paper.author_names || []).includes(authorName),
    );
  }

  const [paperIds, indexed] = await Promise.all([
    loadJson("author_paper_ids"),
    loadJson("indexed_papers"),
  ]);

  return (paperIds[authorName] || []).map((paperId) => indexed[paperId]).filter(Boolean);
}

export async function loadSessionById(sessionId) {
  const sessions = await loadSessions();
  return sessions.find((session) => session.session_id === sessionId) || null;
}

export async function loadPapersForSession(sessionId) {
  const sessionPapers = await loadJson("sessionid_papers");
  return sessionPapers[sessionId] || [];
}
