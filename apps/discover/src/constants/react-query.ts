// the idea of co-locating all these keys
// is that it will make it easier to keep the
// format in sync

import { WellLegendType } from 'services/well/legend/types';

import { FeedbackType } from '../services/feedback/types';
import { SAVED_SEARCHES_CURRENT_KEY } from '../services/savedSearches/constants';

export const DOCUMENT_LABELS_QUERY_KEY = 'labels';

export const DOCUMENT_CATEGORIES_QUERY_KEY = ['documents', 'categories'];
export const DOCUMENT_TYPES_QUERY_KEY = ['documents', 'types'];
export const DOCUMENTS_BY_IDS_QUERY_KEY = ['documents'];

export const RELATED_DOCUMENT_KEY = 'relatedDocuments';

const USER = 'user';
export const USER_KEY = {
  SYNC_QUERY: [USER, 'userSync'],
  ALL_USERS: [USER, 'getAll'],
  USER: [USER],
  ROLES: [USER, 'roles'],
  USER_FAVORITES: [USER, 'favorites'],
};

export const FAVORITE_KEY = {
  ALL_FAVORITES: ['favorites', 'getAll'],
  FAVORITES: ['favorites'],
};

export const SURVEYS_QUERY_KEY = ['surveys'];

// start: Should be an object (just like STATS)
export const SAVED_SEARCHES_QUERY_KEY = 'savedSearches';

export const SAVED_SEARCHES_QUERY_KEY_CURRENT = [
  SAVED_SEARCHES_QUERY_KEY,
  SAVED_SEARCHES_CURRENT_KEY,
];
export const SAVED_SEARCHES_QUERY_KEY_SHARED = [
  SAVED_SEARCHES_QUERY_KEY,
  'shared',
];
// end

const FEEDBACK = 'feedback';
export const FEEDBACK_QUERY_KEY = {
  ALL: (type: FeedbackType) => [FEEDBACK, type, 'getAll'],
  ONE: (type: FeedbackType, id: string) => [FEEDBACK, type, id],
  OBJECT_ALL: [FEEDBACK, 'object', 'getAll'],
};

const STATS = 'stats';
export const STATS_QUERY_KEY = {
  FIND: [STATS, 'find'],
  GET: [STATS, 'get'],
  UPDATE: [STATS, 'update'],
};

export const ONLY_FETCH_ONCE = {
  refetchOnWindowFocus: false,
  refetchOnmount: false,
  refetchOnReconnect: false,
  staleTime: Infinity,
  cacheTime: Infinity,
};

const WELLS_DISCOVER = 'wellsFromDiscoverApi';
export const WELLS_DISCOVER_QUERY_KEY = {
  GEOMETRY: [WELLS_DISCOVER, 'geometry'],
  GROUPS: [WELLS_DISCOVER, 'groups'],
};

const WELLS = 'wells';
export const WELL_QUERY_KEY = {
  SEARCH: (filter: unknown) => [WELLS, 'search', filter],
  WELLBORES: [WELLS, 'wellbores'],
  FAVORITE: [WELLS, 'favoriteWells'],
  FILTER_OPTIONS: [WELLS, 'filterOptions'],
  ALL: [WELLS, 'allWells'],
  WELLS_ONE: [WELLS, 'wells'],
  WELLS_CACHE: [WELLS, 'wells', 'cache'],
  CASINGS: [WELLS, 'casings'],
  CASINGS_CACHE: [WELLS, 'casings', 'cache'],
  TRAJECTORIES: [WELLS, 'trajectories'],
  TRAJECTORIES_LIST: [WELLS, 'trajectories', 'list'],
  TRAJECTORIES_CACHE: [WELLS, 'trajectories', 'cache'],
  NDS_EVENTS: [WELLS, 'nds', 'old'],
  NDS_EVENTS_CACHE: [WELLS, 'nds', 'cache'],
  NPT_EVENTS: [WELLS, 'npt', 'old'],
  NPT_EVENTS_CACHE: [WELLS, 'npt', 'cache'],
  MEASUREMENTS: [WELLS, 'measurements'],
  LOGS: [WELLS, 'logs'],
  LOGS_ROW_DATA: [WELLS, 'logsRowData'],
  WELL_TOPS: [WELLS, 'wellTops'],
  FORMATION_TOPS: [WELLS, 'logsFrmTops'],
  LOGS_PPFGS: ['logsPPFGs'],
  RELATED_DOCUMENTS: [WELLS, 'relatedDocuments'],
  RELATED_DOCUMENT_FACETS: [WELLS, 'relatedDocuments', 'facets'],
};

const SEARCH_HISTORY = 'searchHistory';
export const SEARCH_HISTORY_KEY = {
  LIST: [SEARCH_HISTORY, 'list'],
};

const USER_MANAGEMENT_SYSTEM = 'userManagementSystem';
export const USER_MANAGEMENT_SYSTEM_KEY = {
  ME: [USER_MANAGEMENT_SYSTEM, 'me'],
  SEARCH: [USER_MANAGEMENT_SYSTEM, 'search'],
  ADMIN_USERS: [USER_MANAGEMENT_SYSTEM, 'adminUsers'],
} as const;

const DOCUMENTS = 'documents';
export const DOCUMENTS_QUERY_KEY = {
  SEARCH: [DOCUMENTS, 'search'],
  SEARCH_ONE: [DOCUMENTS, 'one'],
  LABELS: [DOCUMENTS, 'labels'],
};

export const DOCUMENTS_AGGREGATES = {
  labels: 'DOCUMENTS_LABELS_AGGREGATE',
  fileCategory: 'DOCUMENTS_FILE_TYPE_AGGREGATE',
  location: 'DOCUMENTS_LOCATION_AGGREGATE',
  lastcreated: 'DOCUMENTS_LASTCREATED_AGGREGATE',
  total: 'DOCUMENTS_TOTAL_AGGREGATE',
  pageCount: 'DOCUMENTS_PAGE_COUNT_AGGREGATE',
};

const PROJECT_CONFIG = 'projectConfig';
export const PROJECT_CONFIG_QUERY_KEY = {
  CONFIG: [PROJECT_CONFIG, 'config'],
  METADATA: [PROJECT_CONFIG, 'metadata'],
};

const LAYERS = 'layers';
export const LAYERS_QUERY_KEY = {
  ALL: [LAYERS, 'get'],
};

export const TOKEN_INSPECT_QUERY_KEY = {
  all: ['token-inspect'],
  lists: () => [...TOKEN_INSPECT_QUERY_KEY.all, 'list'],
};

export const DOCUMENT_FEEDBACK_QUERY_KEY = {
  all: ['document-feedback'],
  lists: () => [...DOCUMENT_FEEDBACK_QUERY_KEY.all, 'list'],
};

export const NPT_LEGEND_KEY = {
  all: ['nptLegend'],
  lists: (type: WellLegendType) => [...NPT_LEGEND_KEY.all, type],
};
