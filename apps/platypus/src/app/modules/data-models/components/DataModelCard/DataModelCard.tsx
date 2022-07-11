import { useState } from 'react';
import {
  Detail,
  Title,
  Dropdown,
  Menu,
  Avatar,
  Label,
  Tooltip,
  Body,
  Icon,
} from '@cognite/cogs.js';

import { useTranslation } from '@platypus-app/hooks/useTranslation';
import { DataModel } from '@platypus/platypus-core';
import { StyledDataModelCard, StyledDeleteMenuItem } from './elements';
import { TOKENS } from '@platypus-app/di';
import { useInjection } from '@platypus-app/hooks/useInjection';

type DataModelCardProps = {
  dataModel: DataModel;
  onOpen: (dataModel: DataModel) => void;
  onEdit: (dataModel: DataModel) => void;
  onDelete: (dataModel: DataModel) => void;
};

export const DataModelCard = ({
  dataModel,
  onDelete,
  onEdit,
  onOpen,
}: DataModelCardProps) => {
  const [visibleDropdown, setVisibleDropdown] = useState<boolean>(false);
  const { t } = useTranslation('data-models');
  const dateUtils = useInjection(TOKENS.dateUtils);

  const renderMenu = () => {
    return (
      <Dropdown
        visible={visibleDropdown}
        onClickOutside={() => setVisibleDropdown(false)}
        content={
          <Menu>
            <Menu.Item
              onClick={(e) => {
                onEdit(dataModel);
                setVisibleDropdown(false);
                e.stopPropagation();
              }}
            >
              {t('open_data_model', 'Open data model')}
            </Menu.Item>
            <div className="cogs-menu-divider" />
            <Menu.Item
              onClick={(e) => {
                onDelete(dataModel);
                setVisibleDropdown(false);
                e.stopPropagation();
              }}
              className="delete"
              data-cy={`delete-data-model-menu-item-${dataModel.name}`}
            >
              <StyledDeleteMenuItem>
                {t('delete_data_model', 'Delete data model')}
              </StyledDeleteMenuItem>
            </Menu.Item>
          </Menu>
        }
      >
        <div className="menuContainer">
          <Icon type="EllipsisHorizontal" size={18} className="menu" />
        </div>
      </Dropdown>
    );
  };

  const renderOwners = () => {
    if (dataModel.owners.length) {
      return dataModel.owners?.map((owner) => {
        return (
          <Tooltip content={owner} placement="bottom" key={owner}>
            <Avatar text={owner} className="avatar" css={{}} />
          </Tooltip>
        );
      });
    }
    return (
      <Body level={2} strong className="owners">
        No owners
      </Body>
    );
  };

  return (
    <StyledDataModelCard
      onClick={() => onOpen(dataModel)}
      key={dataModel.id}
      className="z-4"
      data-testid={`data-model-card`}
      data-cy={`data-model-card`}
    >
      <div className="top">
        <div>
          <Title level={5} className="title" data-cy="data-model-card-title">
            {dataModel.name}
            {dataModel.version && (
              <span
                className="version"
                role="definition"
                title={t('data_model_latest_version', 'Latest version number')}
              >
                <Label size="small" variant="unknown">
                  {dataModel.version}
                </Label>
              </span>
            )}
          </Title>
          <Detail>
            {t('data_model_last_updated', 'Last updated')}{' '}
            {dateUtils.format(dataModel.createdTime)}
          </Detail>
        </div>
        <div
          onClick={(e) => {
            setVisibleDropdown(true);
            e.stopPropagation();
          }}
          role="menu"
          data-cy={`data-model-card-menu-${dataModel.name}`}
        >
          {renderMenu()}
        </div>
      </div>
      <div>{renderOwners()}</div>
    </StyledDataModelCard>
  );
};
