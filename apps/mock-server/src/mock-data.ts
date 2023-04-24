import { MockData } from './app/types';
import {
  assetsMockData,
  datasetsMockData,
  eventsMockData,
  timeseriesMockData,
  datapointsMockData,
  templategroupsMockData,
  templatesMockData,
  filesMockData,
  groupsMockData,
  transformationsMockData,
  fdmSpacesMockData,
  fdmContainersMockData,
  fdmViewsMockData,
  fdmInstancesMockData,
  fdmDataModelsMockData,
} from '@fusion/mock-data';

export const mockDataSample = {
  assets: assetsMockData,
  timeseries: timeseriesMockData,
  datapoints: datapointsMockData,
  events: eventsMockData,
  datasets: datasetsMockData,
  templategroups: templategroupsMockData,
  templates: templatesMockData,
  files: filesMockData,
  groups: groupsMockData,
  transformations: transformationsMockData,
  posts: [{ id: 1, title: 'json-server', author: 'typicode' }],
  spaces: [{ id: 'blog', externalId: 'blog' }],
  models: [
    {
      spaceExternalId: 'blog',
      externalId: 'PostTable',
      id: 'PostTable',
      properties: {
        title: {
          type: 'text',
          nullable: false,
        },
        views: {
          type: 'int32',
          nullable: false,
        },
        user: {
          type: 'direct_relation',
          nullable: true,
          targetModelExternalId: 'UserTable',
        },
      },
    },
    {
      spaceExternalId: 'blog',
      externalId: 'UserTable',
      id: 'UserTable',
      properties: {
        name: {
          type: 'text',
          nullable: false,
        },
      },
    },
    {
      spaceExternalId: 'blog',
      id: 'CommentTable',
      externalId: 'CommentTable',
      properties: {
        body: {
          type: 'text',
          nullable: false,
        },
        date: {
          type: 'int32',
          nullable: false,
        },
        post: {
          type: 'direct_relation',
          nullable: true,
          targetModelExternalId: 'PostTable',
        },
      },
    },
    {
      spaceExternalId: 'blog',
      externalId: 'TypeWithoutDataTable',
      id: 'TypeWithoutDataTable',
      properties: {
        name: {
          type: 'text',
          nullable: false,
        },
      },
    },
  ],
  nodes: [
    {
      model: 'UserTable',
      externalId: 'user_1',
      id: 'user_1',
      name: 'John Doe',
    },
    {
      model: 'UserTable',
      externalId: 'user_2',
      id: 'user_2',
      name: 'James Bond',
    },
    {
      model: 'PostTable',
      externalId: 'post_1',
      id: 'post_1',
      title: 'Random post 1',
      views: 10,
      user: 'user_1',
    },
    {
      model: 'PostTable',
      externalId: 'post_2',
      id: 'post_2',
      title: 'Random post 2',
      views: 12,
      user: 'user_2',
    },
    {
      model: 'CommentTable',
      externalId: 'comment_1',
      id: 'comment_1',
      body: 'Random comment 1',
      date: 164744,
      post: 'post_1',
    },
  ],
  edges: [],
  schema: [
    {
      externalId: 'blog',
      id: 'blog',
      name: 'blog',
      description: 'blog',
      metadata: {},
      createdTime: 1625702400000,
      versions: [
        {
          version: 1,
          createdTime: 1651346026630,
          bindings: [
            {
              targetName: 'Post',
              dataModelStorageMappingSource: {
                filter: {
                  and: [
                    {
                      hasData: {
                        models: [['blog', 'Post_1']],
                      },
                    },
                  ],
                },
                properties: [
                  {
                    from: {
                      property: ['blog', 'Post_1', '.*'],
                    },
                  },
                ],
              },
            },
            {
              targetName: 'User',
              dataModelStorageMappingSource: {
                filter: {
                  and: [
                    {
                      hasData: {
                        models: [['blog', 'User_1']],
                      },
                    },
                  ],
                },
                properties: [
                  {
                    from: {
                      property: ['blog', 'User_1', '.*'],
                    },
                  },
                ],
              },
            },
            {
              targetName: 'Comment',
              dataModelStorageMappingSource: {
                filter: {
                  and: [
                    {
                      hasData: {
                        models: [['blog', 'Comment_1']],
                      },
                    },
                  ],
                },
                properties: [
                  {
                    from: {
                      property: ['blog', 'Comment_1', '.*'],
                    },
                  },
                ],
              },
            },
          ],
          dataModel: {
            graphqlRepresentation:
              'type Post {\n  title: String!\n  views: Int!\n  user: User\n tags: [String]\n comments: [Comment]\n}\n\ntype User {\n  name: String!\n}\n\ntype Comment {\n  body: String!\n  date: Timestamp!\n  post: Post\n}\n\ntype TypeWithoutData {\n  name: String!\n}',
            types: [],
          },
        },
      ],
      db: {
        Post_1: [
          {
            id: 1,
            externalId: '1',
            lastUpdatedTime: 1679400529215,
            createdTime: 1679400529215,
            spaceExternalId: 'blog',
            title: 'Lorem Ipsum',
            views: 254,
            user: { externalId: '123', spaceExternalId: 'blog' },
            tags: ['Lorem', 'Ipsum'],
            comments: [
              { externalId: '987' },
              { externalId: '995' },
              { externalId: '996' },
              { externalId: '997' },
            ],
          },
          {
            id: 2,
            externalId: '2',
            lastUpdatedTime: 1679400529215,
            createdTime: 1679400529215,
            spaceExternalId: 'blog',
            title: 'Sic Dolor amet',
            views: 65,
            user: { externalId: '456', spaceExternalId: 'blog' },
            tags: ['Sic', 'Dolor'],
            comments: [],
          },
          {
            id: 3,
            externalId: '3',
            spaceExternalId: 'blog',
            title: 'Lorem Sic Dolor amet',
            views: 100,
            user: { externalId: '456', spaceExternalId: 'blog' },
            tags: ['Dolor', 'Lorem'],
            comments: [],
          },
        ],
        User_1: [
          {
            id: 123,
            externalId: '123',
            lastUpdatedTime: 1679400529215,
            createdTime: 1679400529215,
            spaceExternalId: 'blog',
            name: 'John Doe',
          },
          {
            id: 456,
            externalId: '456',
            lastUpdatedTime: 1679400529215,
            createdTime: 1679400529215,
            spaceExternalId: 'blog',
            name: 'Jane Doe',
          },
        ],
        Comment_1: [
          {
            id: 987,
            externalId: '987',
            lastUpdatedTime: 1679400529215,
            createdTime: 1679400529215,
            spaceExternalId: 'blog',
            post: { externalId: '1', spaceExternalId: 'blog' },
            body: 'Consectetur adipiscing elit',
            date: 1651346026630,
          },
          {
            id: 995,
            externalId: '995',
            lastUpdatedTime: 1679400529215,
            createdTime: 1679400529215,
            spaceExternalId: 'blog',
            post: { externalId: '1', spaceExternalId: 'blog' },
            body: 'Nam molestie pellentesque dui',
            date: 1651346026630,
          },
          {
            id: 996,
            externalId: '996',
            lastUpdatedTime: 1679400529215,
            createdTime: 1679400529215,
            spaceExternalId: 'blog',
            post: { externalId: '1', spaceExternalId: 'blog' },
            body: 'Random comment 996',
            date: 1651346026630,
          },
          {
            id: 997,
            externalId: '997',
            lastUpdatedTime: 1679400529215,
            createdTime: 1679400529215,
            spaceExternalId: 'blog',
            post: { externalId: '1', spaceExternalId: 'blog' },
            body: 'Random comment 997',
            date: 1651346026630,
          },
        ],
      },
    },
  ],

  // dms v3 stuff
  dmsV3Spaces: fdmSpacesMockData,
  dmsV3Views: fdmViewsMockData,
  dmsV3Containers: fdmContainersMockData,
  containers: fdmContainersMockData,
  views: fdmViewsMockData,
  instances: fdmInstancesMockData,
  datamodels: fdmDataModelsMockData,
} as MockData;