import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { Tooltip, Graphic, Title, Badge } from '@cognite/cogs.js';
import { doSearch } from 'modules/search';
import { trackUsage, PNID_METRICS } from 'utils/Metrics';
import { dateSorter, stringCompare } from 'modules/contextualization/utils';
import { PageTitle, Table, Loader, Flex, IconButton } from 'components/Common';
import { searchItemSelector } from 'containers/SearchPage/selectors';
import { createNewWorkflow } from 'modules/workflows';
import { diagramSelection } from 'routes/paths';
import FilterBar from './FilterBar';

const Wrapper = styled.div`
  width: 100%;
  height: 50vh;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const columns = (
  onFileEdit: (event: any) => any,
  onFileView: (event: any) => any
) => [
  {
    title: 'Preview',
    dataIndex: '',
    key: 'preview',
    width: 80,
    align: 'center' as 'center',
    render: () => (
      <Flex row align justify>
        <Tooltip content="File previews are temporarily unavailable.">
          <Graphic type="Image" />
        </Tooltip>
      </Flex>
    ),
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (name: string) => <div>{name}</div>,
    sorter: (a: any, b: any) => stringCompare(a?.name, b?.name),
  },
  {
    title: 'Detected tags',
    dataIndex: 'assetIds',
    key: 'assetIds',
    render: (assetIds: number[]) => (
      <div>
        <Badge text={String(assetIds.length)} /> assets
      </div>
    ),
    sorter: (a: any, b: any) => a?.assetIds.length - b?.assetIds.length,
  },
  {
    title: 'Source',
    dataIndex: 'source',
    key: 'source',
    render: (source: string) => <div>{source}</div>,
    sorter: (a: any, b: any) => stringCompare(a?.source, b?.source),
  },
  {
    title: 'Date of contextualization',
    dataIndex: 'lastUpdatedTime',
    key: 'lastUpdatedTime',
    render: (date: string) => {
      return <div>{new Date(date).toLocaleDateString()}</div>;
    },
    sorter: dateSorter((x: any) => x?.lastUpdatedTime!),
    defaultSortOrder: 'descend',
  },
  {
    title: 'Settings',
    dataIndex: '',
    key: 'settings',
    width: '100px',
    align: 'center' as 'center',
    render: () => (
      <Flex row align style={{ justifyContent: 'space-between' }}>
        <Tooltip content="Editing files is currently disabled.">
          <IconButton square icon="Edit" onClick={onFileEdit} disabled />
        </Tooltip>
        <Tooltip content="Viewing files is currently disabled.">
          <IconButton square icon="Eye" onClick={onFileView} disabled />
        </Tooltip>
      </Flex>
    ),
  },
];

export default function LandingPage() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState<string>('');

  const filter = {
    filter: {
      mimeType: 'application/pdf',
      metadata: { __COGNITE_PNID: true },
    },
  };

  const onFileEdit = (event: any) => {
    event.stopPropagation();
    // eslint-disable-next-line
    // TODO (CDF-11153)
  };
  const onFileView = (event: any) => {
    event.stopPropagation();
    // eslint-disable-next-line
    // TODO (CDF-11152)
  };

  const { items, fetching } = useSelector(searchItemSelector)('files', filter);
  const interactiveFilesList = Object.values(items);
  const noFiles = !fetching && Object.keys(items).length === 0;

  useEffect(() => {
    dispatch(doSearch('files', filter));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const interactiveColumns = columns(onFileEdit, onFileView);
  const showFilesList = noFiles ? (
    <EmptyFilesList />
  ) : (
    <>
      <FilterBar query={query} setQuery={setQuery} />
      <Table
        pagination={{ pageSize: 10, hideOnSinglePage: true }}
        dataSource={interactiveFilesList}
        // @ts-ignore
        columns={interactiveColumns}
        size="middle"
        rowKey="id"
        // onRow={(record: any) => ({
        //   onClick: () => alert(record),
        // })}
      />
    </>
  );

  return (
    <div>
      <PageTitle>Interactive Engineering Diagrams</PageTitle>
      {fetching ? (
        <Flex style={{ height: '50vh' }}>
          <Loader />
        </Flex>
      ) : (
        showFilesList
      )}
    </div>
  );
}

function EmptyFilesList() {
  const { tenant } = useParams<{ tenant: string }>();
  const history = useHistory();
  const dispatch = useDispatch();

  const onContextualizeNew = () => {
    trackUsage(PNID_METRICS.contextualization.start);
    const newWorkflowId = Number(new Date());
    dispatch(createNewWorkflow(newWorkflowId));
    history.push(diagramSelection.path(tenant, String(newWorkflowId)));
  };

  return (
    <Wrapper>
      <Graphic type="Documents" />
      <Title level={5} style={{ margin: '24px 0' }}>
        {' '}
        No files have been contextualized yet!
      </Title>
      <IconButton type="primary" icon="Document" onClick={onContextualizeNew}>
        Contextualize a new file
      </IconButton>
    </Wrapper>
  );
}
