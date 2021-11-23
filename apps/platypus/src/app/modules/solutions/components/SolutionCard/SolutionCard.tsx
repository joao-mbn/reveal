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
import { useHistory } from 'react-router-dom';

import { DateUtilsImpl } from '@platypus/platypus-infrastructure';

import { useTranslation } from '@platypus-app/hooks/useTranslation';
import { Solution } from '@platypus/platypus-core';
import { StyledSolutionCard } from './elements';

type SoluionCardProps = {
  solution: Solution;
  onDelete: (solution: Solution) => void;
};

export const SolutionCard = ({ solution, onDelete }: SoluionCardProps) => {
  const history = useHistory();
  const [visibleDropdown, setVisibleDropdown] = useState<boolean>(false);
  const { t } = useTranslation('solutions');

  const dataUtils = new DateUtilsImpl();

  const onDuplicate = () => {
    return false;
  };

  const onEdit = () => {
    return false;
  };

  const renderMenu = () => {
    return (
      <Dropdown
        visible={visibleDropdown}
        onClickOutside={() => setVisibleDropdown(false)}
        content={
          <Menu>
            <Menu.Item
              onClick={(e) => {
                onDuplicate();
                setVisibleDropdown(false);
                e.stopPropagation();
              }}
            >
              {t('duplicate', 'Duplicate')}
            </Menu.Item>
            <Menu.Item
              onClick={(e) => {
                onEdit();
                setVisibleDropdown(false);
                e.stopPropagation();
              }}
            >
              {t('edit', 'Edit')}
            </Menu.Item>
            <div className="cogs-menu-divider" />
            <Menu.Header>{t('danger_zone', 'Danger zone')}</Menu.Header>
            <Menu.Item
              onClick={(e) => {
                onDelete(solution);
                setVisibleDropdown(false);
                e.stopPropagation();
              }}
              className="delete"
            >
              {t('delete', 'Delete')}
            </Menu.Item>
          </Menu>
        }
      >
        <div className="menuContainer">
          <Icon
            type="MoreOverflowEllipsisHorizontal"
            size={18}
            className="menu"
          />
        </div>
      </Dropdown>
    );
  };

  const renderOwners = () => {
    if (solution.owners.length) {
      return solution.owners?.map((owner) => {
        return (
          <Tooltip content={owner} placement="bottom" key={owner}>
            <Avatar text={owner} className="avatar" />
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
    <StyledSolutionCard
      onClick={() => history.push(`solutions/${solution.id}`)}
      key={solution.id}
      className="z-4"
    >
      <div className="top">
        <div>
          <Title level={5} className="title">
            {solution.name}
            <span className="version" role="definition">
              <Label size="small" variant="unknown">
                {solution.version || '1.0'}
              </Label>
            </span>
          </Title>
          <Detail>
            {t('solution_last_updated', 'Last updated')}{' '}
            {dataUtils.parseTimestamp(solution.createdTime)}
          </Detail>
        </div>
        <div
          onClick={(e) => {
            setVisibleDropdown(true);
            e.stopPropagation();
          }}
          role="menu"
        >
          {renderMenu()}
        </div>
      </div>
      <div>{renderOwners()}</div>
    </StyledSolutionCard>
  );
};
