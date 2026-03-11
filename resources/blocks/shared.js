export const currentEditorLang = () => (document.documentElement.lang || '').toLowerCase().startsWith('pl') ? 'pl' : 'en';

export const getLegacyLocalized = (attributes, key, fallback = '') => {
  const lang = currentEditorLang();
  const primaryLegacy = attributes?.[`${key}${lang === 'pl' ? 'Pl' : 'En'}`];
  const secondaryLegacy = attributes?.[`${key}${lang === 'pl' ? 'En' : 'Pl'}`];

  return attributes?.[key] || primaryLegacy || secondaryLegacy || fallback;
};

export const getItemLegacyLocalized = (item, key, fallback = '') => {
  const lang = currentEditorLang();
  const primaryLegacy = item?.[`${key}${lang === 'pl' ? 'Pl' : 'En'}`];
  const secondaryLegacy = item?.[`${key}${lang === 'pl' ? 'En' : 'Pl'}`];

  return item?.[key] || primaryLegacy || secondaryLegacy || fallback;
};
