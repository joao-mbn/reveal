import { useState } from 'react';

import { useParams } from 'react-router-dom';

import { useTranslation } from 'common';
import { DetailsHeader } from 'components/DetailsHeader';
import { Layout } from 'components/Layout';
import { useExtractorsList } from 'hooks/useExtractorsList';
import {
  Button,
  Chip,
  Flex,
  Icon,
  Loader,
  Title,
  formatDate,
} from '@cognite/cogs.js';
import { ContentContainer } from 'components/ContentContainer';
import {
  StyledDivider,
  StyledLayoutGrid,
  StyledLink,
  StyledTagsContainer,
} from 'components/ExtractorDetails/ExtractorDetails';
import Markdown from 'components/markdown';
import { DocsLinkGrid, DocsLinkGridItem } from 'components/DocsLinkGrid';
import { trackUsage } from 'utils';
import { ConnectToHostedExtractorModal } from 'components/connect-to-hosted-extractor-modal/ConnectToHostedExtractorModal';

export const HostedExtractorDetails = (): JSX.Element => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { hostedExtractorExternalId = '' } = useParams<{
    hostedExtractorExternalId?: string;
  }>();
  const { data, status } = useExtractorsList();

  const extractor = data?.find(
    (extractor) => extractor.externalId === hostedExtractorExternalId
  );

  const latestRelease = extractor?.releases?.at(0);
  const createdAt =
    latestRelease?.createdTime && formatDate(latestRelease?.createdTime);

  const tags = extractor?.tags ?? [];

  const externalLinks =
    extractor?.links?.filter(
      (link) => link?.type === 'externalDocumentation'
    ) ?? [];

  const genericLinks =
    extractor?.links?.filter((link) => link?.type === 'generic') ?? [];

  if (status === 'loading') {
    return <Loader />;
  }

  if (!extractor) {
    // TODO: add not found page
    return <>not found</>;
  }

  return (
    <Layout>
      <DetailsHeader
        imageUrl={extractor?.imageUrl}
        title={String(extractor?.name)}
        version={latestRelease?.version || ''}
        createdAt={createdAt || ''}
      />
      <ContentContainer>
        <Layout.Container>
          <StyledLayoutGrid>
            <Flex direction="column" gap={32}>
              <Markdown
                content={extractor?.documentation || extractor?.description}
              />
              {externalLinks?.length > 0 && (
                <Flex direction="column" gap={16}>
                  <Title level={5}>{t('user-guide-from-cognite-docs')}</Title>
                  <DocsLinkGrid>
                    {externalLinks?.map((link) => (
                      <DocsLinkGridItem
                        key={link?.name}
                        href={link?.url}
                        onClick={() => {
                          trackUsage({
                            e: 'Documentation.Click',
                            name: extractor?.name,
                            document: link?.name,
                            url: link?.url,
                          });
                        }}
                      >
                        {link?.name}
                      </DocsLinkGridItem>
                    ))}
                  </DocsLinkGrid>
                </Flex>
              )}
            </Flex>
            <aside>
              <Flex direction="column" gap={24}>
                <Flex direction="column" gap={16}>
                  <Title level="5">{t('set-up-hosted-extractor')}</Title>
                  <Button
                    key={extractor.externalId}
                    type={'primary'}
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                  >
                    {t('connect-to-hosted-extractor', {
                      extractor: extractor?.name,
                    })}
                  </Button>
                </Flex>
                {genericLinks?.length > 0 && (
                  <>
                    <StyledDivider />
                    <Title level="5">{t('links')}</Title>
                    <Flex direction="column" gap={12}>
                      {genericLinks?.map((link) => (
                        <StyledLink
                          className="cogs-anchor"
                          href={link?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          key={link?.url}
                        >
                          <Flex gap={9} alignItems="center">
                            <span>{link?.name}</span>
                            <Icon type="ExternalLink" />
                          </Flex>
                        </StyledLink>
                      ))}
                    </Flex>
                  </>
                )}
                {tags?.length > 0 && (
                  <>
                    <StyledDivider />
                    <Title level="5">{t('tags')}</Title>
                    <StyledTagsContainer>
                      {tags?.map((tag) => (
                        <Chip selectable size="x-small" label={tag} key={tag} />
                      ))}
                    </StyledTagsContainer>
                  </>
                )}
              </Flex>
            </aside>
          </StyledLayoutGrid>
        </Layout.Container>
      </ContentContainer>
      <ConnectToHostedExtractorModal
        onCancel={() => setIsModalOpen(false)}
        visible={isModalOpen}
      />
    </Layout>
  );
};
