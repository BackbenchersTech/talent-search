import {
  CANDIDATES_DEFAULT_SORT,
  CANDIDATES_SORT_COLUMN,
  CandidateStatus,
  CandidatesSort,
  CandidatesSortColumn,
} from '@/lib/data/candidates/candidateTypes';
import { SORT_ORDER, type SortOrder } from '@/lib/constants/sort';

// first click on a column sorts by its most natural direction
const DEFAULT_ORDER_BY_COLUMN: Record<CandidatesSortColumn, SortOrder> = {
  [CANDIDATES_SORT_COLUMN.NAME]: SORT_ORDER.ASC,
  [CANDIDATES_SORT_COLUMN.CREATED_AT]: SORT_ORDER.DESC,
};

export const toggleCandidatesSort = (
  current: CandidatesSort,
  column: CandidatesSortColumn,
): CandidatesSort =>
  current.column === column
    ? {
        column,
        order: current.order === SORT_ORDER.ASC ? SORT_ORDER.DESC : SORT_ORDER.ASC,
      }
    : { column, order: DEFAULT_ORDER_BY_COLUMN[column] };

export const parseCandidatesSort = ({
  sort,
  order,
}: {
  sort?: string;
  order?: string;
}): CandidatesSort => {
  const column = Object.values(CANDIDATES_SORT_COLUMN).find((value) => value === sort);

  if (!column) {
    return CANDIDATES_DEFAULT_SORT;
  }

  const parsedOrder = Object.values(SORT_ORDER).find((value) => value === order);

  return { column, order: parsedOrder ?? DEFAULT_ORDER_BY_COLUMN[column] };
};

export const parseCandidateStatus = (status?: string): CandidateStatus | undefined => {
  if (!status || !Object.hasOwn(CandidateStatus, status)) return undefined;

  return CandidateStatus[status as keyof typeof CandidateStatus];
};

export const candidatesSortToParams = (sort: CandidatesSort, params: URLSearchParams) => {
  const isDefault =
    sort.column === CANDIDATES_DEFAULT_SORT.column &&
    sort.order === CANDIDATES_DEFAULT_SORT.order;

  if (isDefault) {
    params.delete('sort');
    params.delete('order');
  } else {
    params.set('sort', sort.column);
    params.set('order', sort.order);
  }
};
