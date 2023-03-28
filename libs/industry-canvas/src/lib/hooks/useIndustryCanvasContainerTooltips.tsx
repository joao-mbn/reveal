import { createLink } from '@cognite/cdf-utilities';
import { Button, Link } from '@cognite/cogs.js';
import { TooltipAnchorPosition } from '@cognite/unified-file-viewer';
import dayjs from 'dayjs';
import { useMemo } from 'react';
import DateRangePrompt from '../components/DateRangePrompt';
import { TooltipContainer } from '../TooltipContainer';
import {
  ContainerReference,
  ContainerReferenceType,
  ContainerReferenceWithoutDimensions,
} from '../types';
import { getContainerId } from '../utils/utils';

const useIndustryCanvasContainerTooltips = ({
  clickedContainer,
  updateContainerReference,
  removeContainerReference,
}: {
  clickedContainer: ContainerReference | undefined;
  updateContainerReference: (
    containerReference: ContainerReferenceWithoutDimensions
  ) => void;
  removeContainerReference: (containerReference: ContainerReference) => void;
}) => {
  return useMemo(() => {
    if (clickedContainer === undefined) {
      return [];
    }

    if (clickedContainer.type === ContainerReferenceType.ASSET) {
      return [
        {
          targetId: getContainerId(clickedContainer),
          content: (
            <TooltipContainer>
              <Link
                href={createLink(
                  `/explore/asset/${clickedContainer.resourceId}`
                )}
                target="_blank"
              />
              <Button
                icon="Delete"
                onClick={() => removeContainerReference(clickedContainer)}
                type="ghost"
              />
            </TooltipContainer>
          ),
          anchorTo: TooltipAnchorPosition.TOP_RIGHT,
        },
      ];
    }

    if (clickedContainer.type === ContainerReferenceType.TIMESERIES) {
      return [
        {
          targetId: getContainerId(clickedContainer),
          content: (
            <TooltipContainer>
              <DateRangePrompt
                initialRange={{
                  startDate: clickedContainer.startDate,
                  endDate: clickedContainer.endDate,
                }}
                onComplete={(dateRange) =>
                  updateContainerReference({
                    resourceId: clickedContainer.resourceId,
                    id: clickedContainer.id,
                    type: ContainerReferenceType.TIMESERIES,
                    startDate: dayjs(dateRange.startDate)
                      .startOf('day')
                      .toDate(),
                    endDate: dayjs(dateRange.endDate).endOf('day').toDate(),
                  })
                }
              />
              <Link
                href={createLink(
                  `/explore/timeSeries/${clickedContainer.resourceId}`
                )}
                target="_blank"
              />
              <Button
                icon="Delete"
                onClick={() => removeContainerReference(clickedContainer)}
                type="ghost"
              />
            </TooltipContainer>
          ),
          anchorTo: TooltipAnchorPosition.TOP_RIGHT,
        },
      ];
    }

    if (clickedContainer.type === ContainerReferenceType.THREE_D) {
      return [
        {
          targetId: getContainerId(clickedContainer),
          content: (
            <TooltipContainer>
              <Link
                href={createLink(`/explore/threeD/${clickedContainer.id}`)}
                target="_blank"
              />
              <Button
                icon="Delete"
                onClick={() => removeContainerReference(clickedContainer)}
                type="ghost"
              />
            </TooltipContainer>
          ),
          anchorTo: TooltipAnchorPosition.TOP_RIGHT,
        },
      ];
    }

    if (clickedContainer.type === ContainerReferenceType.FILE) {
      return [
        {
          targetId: getContainerId(clickedContainer),
          content: (
            <TooltipContainer>
              <Link
                href={createLink(
                  `/explore/file/${clickedContainer.resourceId}`
                )}
                target="_blank"
              />
              <Button
                icon="Delete"
                onClick={() => removeContainerReference(clickedContainer)}
                type="ghost"
              />
            </TooltipContainer>
          ),
          anchorTo: TooltipAnchorPosition.TOP_RIGHT,
        },
      ];
    }

    return [];
  }, [clickedContainer, removeContainerReference, updateContainerReference]);
};

export default useIndustryCanvasContainerTooltips;
