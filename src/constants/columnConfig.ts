import type { DataField } from '../types/report'

const brandFieldId = 'brand'

export const reportFields: DataField[] = [
  { id: 'timestamp', key: 'Tidst\u00e4mpel', label: 'Tidstämpel', shortLabel: 'Tid', isDate: true },
  {
    id: 'activationDate',
    key: 'Date\nDate of activation (per session or per roundtrip)',
    label: 'Aktiveringsdatum',
    shortLabel: 'Datum',
    isDate: true,
  },
  {
    id: 'location',
    key: 'Location\nRoute and vessel (e.g. Stena Danica \u2013 Gothenburg\u2013Frederikshavn)',
    label: 'Plats och fartyg',
    shortLabel: 'Plats',
  },
  {
    id: 'passengers',
    key: 'Passengers/ visitors (approx.)\nTotal number of passengers on this departure (from official report)',
    label: 'Passagerare',
    shortLabel: 'Passagerare',
    isNumeric: true,
  },
  { id: brandFieldId, key: 'Brand', label: 'Brand', shortLabel: 'Brand' },
  {
    id: 'tastings',
    key: 'Number of tastings (approx.)\nEstimated number of individual customers who engaged in tasting (not number of samples poured)',
    label: 'Antal tastingar',
    shortLabel: 'Tastings',
    isNumeric: true,
  },
  {
    id: 'purchases',
    key: 'Estimated number of purchases \nEstimated number of bottles sold based on your observation',
    label: 'Köp',
    shortLabel: 'Köp',
    isNumeric: true,
  },
  {
    id: 'curiosityProduct',
    key: 'Which product generated the most curiosity ?\nWhich product attracted the most attention or initial interest (not necessarily purchases)',
    label: 'Mest nyfikenhet',
    shortLabel: 'Nyfikenhet',
  },
  {
    id: 'topSeller',
    key: 'Which product do you think sold the most?',
    label: 'Mest säljande produkt',
    shortLabel: 'Toppprodukt',
  },
  {
    id: 'ageGroup',
    key: 'Which age group showed the most purchase interest?',
    label: 'Åldersgrupp med högst köpintresse',
    shortLabel: 'Ålder',
    isNumeric: true,
  },
  {
    id: 'conversionDrivers',
    key: 'Conversion drivers?\nWhat specifically triggered purchase decisions? (storytelling, taste profile, comparisons etc.)',
    label: 'Konverteringsdrivare',
    shortLabel: 'Drivare',
  },
  {
    id: 'customerQuestion',
    key: 'Most common customer question\nWhat did customers most often ask before buying or tasting?',
    label: 'Vanligaste kundfråga',
    shortLabel: 'Kundfråga',
  },
  {
    id: 'sessionScore',
    key: 'How well did the session go?',
    label: 'Sessionsbetyg',
    shortLabel: 'Betyg',
    isNumeric: true,
  },
  {
    id: 'salesInsights',
    key: 'Key Sales Insights (actionable)\nWhat should be repeated or changed next time based on this session?',
    label: 'Säljinsikter',
    shortLabel: 'Insikter',
  },
  {
    id: 'activeSellingTime',
    key: 'Active Selling Time (store)\nTime (in hours) actively spent selling and engaging customers inside the store',
    label: 'Aktiv säljtid i butik',
    shortLabel: 'Säljtid',
    isNumeric: true,
  },
  {
    id: 'engagementLevel',
    key: 'Estimated engagement level\nBased on how long customers stayed and how engaged they were in conversation',
    label: 'Engagemangsnivå',
    shortLabel: 'Engagemang',
  },
  {
    id: 'customerSegments',
    key: 'Primary customer segments observed. \nMain customer types (e.g. whisky drinkers, rum drinkers, curious/unsure, couples etc.) ',
    label: 'Primära kundsegment',
    shortLabel: 'Segment',
  },
  {
    id: 'lowActivityTime',
    key: 'Low activity / non-selling time (store)\nTime (in hours inside the store) with low traffic or limited selling opportunity',
    label: 'Lågaktiv tid',
    shortLabel: 'Lågaktiv',
    isNumeric: true,
  },
  { id: 'promotorName', key: 'Promotor Name', label: 'Promotor', shortLabel: 'Promotor' },
  {
    id: 'adultPassengers',
    key: 'Adult passengers (official)\nNumber of adults from official passenger report (primary purchase-relevant group)',
    label: 'Vuxna passagerare',
    shortLabel: 'Vuxna',
    isNumeric: true,
  },
  {
    id: 'trafficContext',
    key: 'Traffic context (optional)\nAnything affecting the customer flow (e.g. families, youth groups, Danish-heavy crowd, events, time of day)',
    label: 'Trafikkontext',
    shortLabel: 'Trafik',
  },
  {
    id: 'preActivationTime',
    key: 'Pre-Activation Time (external)\nTime spent outside the store to attract customers before opening (e.g. boarding area activation, awareness building) Ex: 45min',
    label: 'Pre-activationstid',
    shortLabel: 'Pre-akt',
  },
  {
    id: 'preActivationDescription',
    key: 'Pre-Activation Description (optional)\nBrief description of how pre-activation was executed (location, approach, effect) Ex:Pre-activation conducted at boarding area',
    label: 'Pre-activationbeskrivning',
    shortLabel: 'Beskrivning',
  },
  {
    id: 'productRoleInsights',
    key: 'Product role insights (optional)\nHow different products functioned in the sales process (e.g. curiosity driver, whisky bridge, closing product)',
    label: 'Produktroller och insikter',
    shortLabel: 'Produktroller',
  },
]

export const defaultSelectedFieldIds = [
  'activationDate',
  'location',
  brandFieldId,
  'tastings',
  'purchases',
  'topSeller',
  'sessionScore',
  'salesInsights',
]

export const brandFieldKey = brandFieldId
