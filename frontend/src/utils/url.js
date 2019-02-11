const schemas = {
  Agent: [
    { name: 'login', regexp: /^\/login$/ },
    { name: 'index', regexp: /^\/$/ },
    { name: 'club', regexp: /^\/club\/.{24}$/ },
    { name: 'clubs', regexp: /^\/clubs\/.{24}$/ },
    { name: 'clubsRemoved', regexp: /^\/clubs\/.{24}\/removed$/ },
    { name: 'clubsAll', regexp: /^\/clubs\/all$/ },
    { name: 'clubsAllRemoved', regexp: /^\/clubs\/removed$/ },
    { name: 'clients', regexp: /^\/club\/.{24}\/clients$/ },
    { name: 'client', regexp: /^\/club\/.{24}\/clients\/.{24}$/ },
    { name: 'promotion', regexp: /^\/club\/.{24}\/promotion\/.{24}$/ },
    { name: 'operators', regexp: /^\/club\/.{24}\/operators$/ },
  ]
}

const titles = {
  index: 'SlotAdmin',
  login: 'SlotAdmin | Вход',
  club: 'SlotAdmin | Клуб',
  clubs: 'SlotAdmin | Клубы',
  clubRemoved: 'SlotAdmin | Удаленные клубы',
  clubsAll: 'SlotAdmin | Клубы',
  clubAllRemoved: 'SlotAdmin | Удаленные клубы',
  clients: 'SlotAdmin | Клиенты',
  client: 'SlotAdmin | Клиент',
  promotion: 'SlotAdmin | Акция',
  operators: 'SlotAdmin | Операторы',
}

export const parseURL = (url) => {
  let clubId = null;
  if (/^\/club\//.test(url)) {
    clubId = url.substr(6, 24);
  }
  const page = schemas.Agent.find(page => page.regexp.test(url)) || {};
  return { page: page.name, clubId, url };
}

export const setPageTitle = (url = document.location.pathname) => {
  const { page } = parseURL(url);
  const title = titles[page] || titles.index;
  document.title = title
}