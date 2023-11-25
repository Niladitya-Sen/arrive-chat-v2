/* import 'server-only'; */

const dictionaries: { [key: string]: () => Promise<{ [key: string]: { [key: string]: string } }> } = {
    en: () => import('../../dictionaries/en.json').then((module) => module.default),
    ar: () => import('../../dictionaries/ar.json').then((module) => module.default),
    ru: () => import('../../dictionaries/ru.json').then((module) => module.default),
    fr: () => import('../../dictionaries/fr.json').then((module) => module.default),
    de: () => import('../../dictionaries/de.json').then((module) => module.default),
    it: () => import('../../dictionaries/it.json').then((module) => module.default),
    es: () => import('../../dictionaries/es.json').then((module) => module.default),
}

export const getDictionary = async (locale: string) => dictionaries[locale]();