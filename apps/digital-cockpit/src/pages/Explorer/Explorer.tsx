import AssetSearch from 'components/explorer/AssetSearch';
import { useParams, useHistory } from 'react-router-dom';
import AssetHierarchy from 'components/explorer/AssetHierarchy';
import { Asset } from '@cognite/sdk';
import AssetTabs, { AssetTabKey } from 'components/explorer/AssetTabs';

import { ExplorerWrapper } from './elements';

const Explorer = () => {
  const history = useHistory();
  const { assetId, tab: activeTab } =
    useParams<{ assetId: string; tab: string }>();

  const onAssetSelect = (asset: Asset) => {
    history.push(`/explore/${asset.id}/${activeTab || 'detail'}`);
  };
  const onTabChange = (nextTab: AssetTabKey) => {
    history.push(`/explore/${assetId}/${nextTab}`);

    // Tabs don't get rerendered on change. The elements are only hidden.
    // This confuses `useElementSize`, used for sizing the time series preview.
    // Send an event to it so it knows to update the size.
    document.dispatchEvent(new Event('CSP:TabChange'));
  };

  const renderMain = () => {
    if (!assetId) {
      return <div />;
    }
    return (
      <AssetTabs
        assetId={{ id: Number(assetId) }}
        activeTabKey={activeTab as AssetTabKey}
        onTabChange={onTabChange}
      />
    );
  };
  return (
    <ExplorerWrapper>
      <aside>
        <h3>Asset Hierarchy</h3>
        <AssetSearch
          onSelect={onAssetSelect}
          cleanStateComponent={<AssetHierarchy onSelect={onAssetSelect} />}
        />
      </aside>
      <main>{renderMain()}</main>
    </ExplorerWrapper>
  );
};

export default Explorer;
