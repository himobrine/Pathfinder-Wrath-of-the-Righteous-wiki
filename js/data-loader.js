const DATA_BASE = (() => {
  const scripts = document.getElementsByTagName("script");
  for (const s of scripts) {
    if (s.src && s.src.includes("data-loader.js")) {
      return s.src.replace(/\/js\/data-loader\.js.*$/, "/data/");
    }
  }
  return "data/";
})();

const DATA_CACHE = {};

async function loadData(name) {
  if (DATA_CACHE[name]) return DATA_CACHE[name];
  try {
    const res = await fetch(`${DATA_BASE}${name}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    DATA_CACHE[name] = data;
    return data;
  } catch (err) {
    console.error(`Failed to load ${DATA_BASE}${name}.json:`, err);
    return [];
  }
}

async function loadAll(names) {
  return Promise.all(names.map(n => loadData(n)));
}

function getData(name) {
  return DATA_CACHE[name] || [];
}
