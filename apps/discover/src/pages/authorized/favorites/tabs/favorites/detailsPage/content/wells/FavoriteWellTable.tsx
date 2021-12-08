import React, { useMemo, useState, useCallback, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { batch, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';

import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

import { Menu, Dropdown } from '@cognite/cogs.js';

import { MoreOptionsButton, ViewButton } from 'components/buttons';
import EmptyState from 'components/emptyState';
import { LOADING_TEXT } from 'components/emptyState/constants';
import { Options, Table, RowProps } from 'components/tablev3';
import navigation from 'constants/navigation';
import { FavoriteContentWells } from 'modules/favorite/types';
import { SelectedMap } from 'modules/filterData/types';
import { wellSearchActions } from 'modules/wellSearch/actions';
import {
  useMutateFavoriteWellPatchWellbores,
  useMutateFavoriteWellUpdate,
} from 'modules/wellSearch/hooks/useWellsFavoritesQuery';
import { useFavoriteWellResults } from 'modules/wellSearch/selectors';
import {
  InspectWellboreContext,
  Well,
  WellboreId,
  WellId,
} from 'modules/wellSearch/types';
import { wellColumns, WellResultTableOptions } from 'pages/authorized/constant';
import {
  FAVORITE_SET_NO_WELLS,
  REMOVE_FROM_SET_TEXT,
} from 'pages/authorized/favorites/constants';
import { DeleteWellFromSetModal } from 'pages/authorized/favorites/modals';
import { FlexRow } from 'styles/layout';

import { FavoriteWellWrapper, RemoveFavoriteLabel } from './elements';
import { FavoriteWellboreTable } from './FavoriteWellBoreTable';
import { FavoriteWellsBulkActions } from './FavoriteWellsBulkActions';

export interface Props {
  removeWell: (wellId: number) => void;
  wells: FavoriteContentWells | undefined;
  favoriteId: string;
}

export const FavoriteWellsTable: React.FC<Props> = ({
  wells,
  removeWell,
  favoriteId,
}) => {
  const { t } = useTranslation('Favorites');
  const history = useHistory();
  const dispatch = useDispatch();
  const [wellIds, setWellIds] = useState<WellId[]>([]);
  const { data, isLoading } = useFavoriteWellResults(wellIds);
  const { mutate } = useMutateFavoriteWellPatchWellbores();
  const { mutate: mutateWells } = useMutateFavoriteWellUpdate();

  const [tableOptions] = useState<Options>(WellResultTableOptions);
  const [expandedIds, setExpandedIds] = useState<SelectedMap>({});
  const [selectedWellIds, setSelectedWellIds] = useState<SelectedMap>({});
  const [isDeleteWellModalOpen, setIsDeleteWellModalOpen] = useState(false);
  const [hoveredWell, setHoveredWell] = useState<Well>();
  const [wellsData, setWellsData] = useState<Well[]>(data || []);

  const [selectedWellboreIdsWithWellId, setSelectedWellboreIdsWithWellId] =
    useState<FavoriteContentWells>({});

  useEffect(() => {
    setWellIds(wells ? Object.keys(wells) : []);
  }, [JSON.stringify(wells)]);

  useEffect(() => {
    setWellsData(data || []);
  }, [JSON.stringify(data)]);

  const columns = useMemo(
    () => Object.values(wellColumns || []),
    [JSON.stringify(wellColumns)]
  );

  useEffect(() => {
    mutateWells(wellIds);
  }, [JSON.stringify(wellIds)]);

  const handleRowClick = useCallback(
    (row: RowProps<Well> & { isSelected: boolean }) => {
      const wellRow: Well = row.original;
      setExpandedIds((state) => ({
        ...state,
        [wellRow.id]: !state[wellRow.id],
      }));
    },
    []
  );

  const handleRowSelect = useCallback((row: RowProps<Well>) => {
    setExpandedIds((state) => ({
      ...state,
      [row.original.id]: true,
    }));
    setSelectedWellIds((state) => {
      setWellbores(row, state[row.original.id]);
      return {
        ...state,
        [row.original.id]: !state[row.original.id],
      };
    });
  }, []);

  const setWellbores = (row: RowProps<Well>, isContain: boolean): void => {
    const wellbores = getContainWellbores(row.original);
    setSelectedWellboreIdsWithWellId((prevState) =>
      isContain
        ? { ...prevState, [row.original.id]: [] }
        : {
            ...prevState,
            [row.original.id]: wellbores
              ? wellbores.flatMap((wellbore) => [wellbore])
              : [],
          }
    );
  };

  const getContainWellbores = (well: Well) => {
    if (!wells) return [];
    return isEmpty(wells[well.id])
      ? well.wellbores?.flatMap((item) => item.id)
      : wells[well.id];
  };

  const handleRowsSelect = useCallback(
    (value: boolean) => {
      const selectedWellIdsList: SelectedMap = wellsData.reduce(
        (result, item) => {
          const selectedWellMap: SelectedMap = { [item.id]: value };
          return { ...result, ...selectedWellMap };
        },
        {}
      );

      setSelectedWellIds(selectedWellIdsList);
      setSelectedWellboreIdsWithWellId({});
    },
    [wellsData]
  );

  const setWellboreIds = (wellId: WellId, wellboreId: WellboreId) => {
    setSelectedWellboreIdsWithWellId((preState) =>
      assignWellsWithWellbores(preState, wellId, wellboreId)
    );
  };

  const assignWellsWithWellbores = (
    preState: FavoriteContentWells,
    wellId: WellId,
    wellboreId: WellboreId
  ): FavoriteContentWells => {
    if (preState[wellId] && preState[wellId].includes(wellboreId)) {
      const newState: FavoriteContentWells = {
        ...preState,
        [wellId]: preState[wellId].filter((item) => !isEqual(item, wellboreId)),
      };
      if (isEmpty(newState[wellId])) {
        setSelectedWellIds((state) => ({ ...state, [wellId]: false }));
      }
      return newState;
    }
    setSelectedWellIds((state) => ({ ...state, [wellId]: true }));

    return {
      ...preState,
      [wellId]: preState[wellId]
        ? preState[wellId].concat([wellboreId])
        : [wellboreId],
    };
  };

  const renderRowSubComponent = useCallback(
    ({ row }) => {
      const wellbores: WellboreId[] = wells
        ? wells[
            Object.keys(wells).filter((well) => well === row.original.id)[0]
          ]
        : [];
      return (
        <FavoriteWellboreTable
          well={row.original}
          wellboreIds={wellbores}
          favoriteContentWells={wells || {}}
          favoriteId={favoriteId}
          removeWell={removeWell}
          selectedWellbores={
            selectedWellboreIdsWithWellId[row.original.id] || []
          }
          setWellboreIds={setWellboreIds}
        />
      );
    },
    [JSON.stringify(wells), JSON.stringify(selectedWellboreIdsWithWellId)]
  );

  const handleOpenDeleteModal = () => setIsDeleteWellModalOpen(true);
  const handleCloseDeleteModal = () => setIsDeleteWellModalOpen(false);

  const handleRemoveWell = () => {
    if (hoveredWell) {
      removeWell(hoveredWell.id);
      handleCloseDeleteModal();
    }
  };

  const handleHoverViewBtnClick = async (row: RowProps<Well>) => {
    const currentWell: Well = row.original;
    const isWellboresLoadedForWell = wellsData.some(
      (well) => well.id === currentWell.id && well.wellbores
    );

    await updateFavoriteStateInStore(currentWell.id, isWellboresLoadedForWell);
  };

  const updateFavoriteStateInStore = async (
    wellId: number,
    isWellboresLoadedForWell: boolean
  ) => {
    handleUpdatingFavoriteWellState(
      [wellId],
      InspectWellboreContext.FAVORITE_HOVERED_WELL
    );

    if (!isWellboresLoadedForWell) {
      await loadWellboresAndUpdateQueryCache(wellId);
      return;
    }
    navigateToInspectPanel();
  };

  const handleUpdatingFavoriteWellState = (
    wellIds: number[],
    inspectWellboreContext: InspectWellboreContext
  ) => {
    batch(() => {
      dispatch(wellSearchActions.setFavoriteHoveredOrCheckedWells(wellIds));
      dispatch(
        wellSearchActions.setWellboreInspectContext(inspectWellboreContext)
      );
      dispatch(wellSearchActions.setSelectedFavoriteId(favoriteId));
    });
  };

  const loadWellboresAndUpdateQueryCache = async (wellId: number) => {
    await mutate({
      updatingWellIds: [wellId],
      successCallback: () => {
        navigateToInspectPanel();
      },
    });
  };

  const navigateToInspectPanel = () => {
    history.push(navigation.SEARCH_WELLS_INSPECT);
  };

  const getEmptyStateTitle = () => {
    if (isLoading) return t(LOADING_TEXT);
    if (wellIdsNotEmpty) return t(LOADING_TEXT);
    return t(FAVORITE_SET_NO_WELLS);
  };

  const wellIdsNotEmpty = wellIds && wellIds?.length > 0;

  const renderRowHoverComponent: React.FC<{
    row: RowProps<Well>;
  }> = ({ row }) => {
    const wellRow = row.original;
    return (
      <FlexRow>
        <ViewButton
          data-testid="button-view-document"
          onClick={() => handleHoverViewBtnClick(row)}
          hideIcon
        />
        <Dropdown
          openOnHover
          content={
            <Menu>
              <Menu.Item
                onClick={() => {
                  handleOpenDeleteModal();
                  setHoveredWell(wellRow);
                }}
              >
                <RemoveFavoriteLabel data-testid="remove-from-set">
                  {t(REMOVE_FROM_SET_TEXT)}
                </RemoveFavoriteLabel>
              </Menu.Item>
            </Menu>
          }
        >
          <MoreOptionsButton data-testid="menu-button" />
        </Dropdown>
      </FlexRow>
    );
  };

  const isWellsLoading = isLoading || !wellsData.length;

  if (isWellsLoading) {
    return <EmptyState emptyTitle={getEmptyStateTitle()} />;
  }
  return (
    <FavoriteWellWrapper>
      <Table<Well>
        id="well-result-table"
        data={wellsData}
        columns={columns}
        renderRowSubComponent={renderRowSubComponent}
        handleRowClick={handleRowClick}
        handleRowSelect={handleRowSelect}
        handleRowsSelect={handleRowsSelect}
        expandedIds={expandedIds}
        options={tableOptions}
        selectedIds={selectedWellIds}
        renderRowHoverComponent={renderRowHoverComponent}
      />
      <FavoriteWellsBulkActions
        allWellIds={wellIds}
        selectedWellIdsList={selectedWellIds}
        selectedWellboresList={selectedWellboreIdsWithWellId}
        deselectAll={() => handleRowsSelect(false)}
        favoriteId={favoriteId}
        favoriteWells={wells}
        handleUpdatingFavoriteWellState={handleUpdatingFavoriteWellState}
      />

      <DeleteWellFromSetModal
        title={hoveredWell?.name}
        onConfirm={handleRemoveWell}
        onClose={handleCloseDeleteModal}
        isOpen={isDeleteWellModalOpen}
      />
    </FavoriteWellWrapper>
  );
};
