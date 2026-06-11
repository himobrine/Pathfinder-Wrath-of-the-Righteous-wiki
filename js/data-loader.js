const DATA_CACHE = {};

async function loadData(name) {
  if (DATA_CACHE[name]) return DATA_CACHE[name];
  try {
    const res = await fetch(`/data/${name}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    DATA_CACHE[name] = data;
    return data;
  } catch (err) {
    console.error(`Failed to load data/${name}.json:`, err);
    return [];
  }
}

async function loadAll(names) {
  return Promise.all(names.map(n => loadData(n)));
}

function getData(name) {
  return DATA_CACHE[name] || [];
}
