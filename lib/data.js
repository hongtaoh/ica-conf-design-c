import fs from "node:fs";
import path from "node:path";

const dataDir = path.join(process.cwd(), "public", "data");
const cache = new Map();

function readJson(name) {
  if (!cache.has(name)) {
    const filePath = path.join(dataDir, `${name}.json`);
    cache.set(name, JSON.parse(fs.readFileSync(filePath, "utf8")));
  }

  return cache.get(name);
}

function textIncludes(value, query) {
  if (!query) return true;
  return String(value || "").toLowerCase().includes(query.toLowerCase());
}

function paginate(items, page = 1, limit = 25) {
  const cleanPage = Math.max(Number(page) || 1, 1);
  const cleanLimit = Math.min(Math.max(Number(limit) || 25, 1), 100);
  const start = (cleanPage - 1) * cleanLimit;

  return {
    page: cleanPage,
    limit: cleanLimit,
    total: items.length,
    totalPages: Math.ceil(items.length / cleanLimit),
    items: items.slice(start, start + cleanLimit),
  };
}

export function getAllPapers() {
  return readJson("papers");
}

export function getIndexedPapers() {
  return readJson("indexed_papers");
}

export function getPaper(id) {
  return getIndexedPapers()[id] || null;
}

export function getAllAuthors() {
  return readJson("authors");
}

export function getAllSessions() {
  return readJson("sessions");
}

export function getAuthorPaperIds() {
  return readJson("author_paper_ids");
}

export function getSessionPapersById() {
  return readJson("sessionid_papers");
}

export function getPapersForAuthor(authorName) {
  const ids = getAuthorPaperIds()[authorName] || [];
  const indexed = getIndexedPapers();
  return ids.map((id) => indexed[id]).filter(Boolean);
}

export function getPapersForSession(sessionId) {
  return getSessionPapersById()[sessionId] || [];
}

export function filterPapers(params = {}) {
  const papers = getAllPapers();

  return papers.filter((paper) => {
    const authorNames = paper.author_names || [];
    const firstAuthor = authorNames[0] || "";
    const lastAuthor = authorNames[authorNames.length - 1] || "";

    return (
      textIncludes(paper.paper_id, params.paper_id) &&
      textIncludes(paper.title, params.title_contains) &&
      textIncludes(paper.abstract, params.abstract_contains) &&
      textIncludes(paper.session, params.session_contains) &&
      textIncludes(paper.session, params.session) &&
      textIncludes(paper.division, params.division) &&
      textIncludes(authorNames.join(" "), params.has_author) &&
      textIncludes(firstAuthor, params.first_author) &&
      textIncludes(lastAuthor, params.last_author) &&
      textIncludes(paper.session_info?.session_id, params.session_id) &&
      (!params.paper_type || paper.paper_type === params.paper_type) &&
      (!params.year || Number(paper.year) === Number(params.year)) &&
      (!params.number_of_authors ||
        Number(paper.number_of_authors) === Number(params.number_of_authors))
    );
  });
}

export function filterAuthors(params = {}) {
  return getAllAuthors().filter((author) => {
    return (
      textIncludes(author.author_name, params.author_name) &&
      textIncludes(author.affiliations?.join(" "), params.affiliation_contains) &&
      (!params.min_attend_count ||
        Number(author.attend_count) >= Number(params.min_attend_count)) &&
      (!params.min_paper_count ||
        Number(author.paper_count) >= Number(params.min_paper_count)) &&
      (!params.year_attended ||
        (author.years_attended || []).includes(Number(params.year_attended)))
    );
  });
}

export function filterSessions(params = {}) {
  return getAllSessions().filter((session) => {
    return (
      textIncludes(session.session, params.session) &&
      textIncludes(session.session_type, params.session_type) &&
      textIncludes(session.chair_name, params.chair_name) &&
      textIncludes(session.chair_affiliation, params.chair_affiliation) &&
      textIncludes(session.division, params.division) &&
      (!params.year || (session.years || []).includes(Number(params.year))) &&
      (!params.paper_count ||
        Number(session.paper_count) === Number(params.paper_count))
    );
  });
}

export function getPaginated(items, searchParams) {
  return paginate(items, searchParams?.page, searchParams?.limit);
}

export function enrichMatches(matches) {
  const indexed = getIndexedPapers();

  return matches.map((match) => {
    const paper = indexed[match.id] || {};
    return {
      ...paper,
      paper_id: paper.paper_id || match.id,
      score: match.score,
      title: paper.title || match.title || "",
      abstract: paper.abstract || match.abstract || "",
    };
  });
}
