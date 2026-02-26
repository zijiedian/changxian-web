const STORAGE_KEY = 'wechat_card_projects_v1';

const safeParse = (raw) => {
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    return [];
  }
};

export const loadProjects = () => {
  if (typeof window === 'undefined') return [];
  return safeParse(window.localStorage.getItem(STORAGE_KEY) || '[]');
};

export const saveProjects = (projects) => {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
};

export const addProject = (project) => {
  const projects = loadProjects();
  const next = [project, ...projects];
  saveProjects(next);
  return next;
};

export const getProject = (id) => {
  const projects = loadProjects();
  return projects.find((item) => item.id === id) || null;
};

export const updateProject = (id, updates) => {
  const projects = loadProjects();
  let nextProject = null;
  const next = projects.map((item) => {
    if (item.id !== id) return item;
    nextProject = { ...item, ...updates };
    return nextProject;
  });
  if (!nextProject) return null;
  saveProjects(next);
  return nextProject;
};

export const deleteProject = (id) => {
  const projects = loadProjects();
  const next = projects.filter((item) => item.id !== id);
  saveProjects(next);
  return next;
};
