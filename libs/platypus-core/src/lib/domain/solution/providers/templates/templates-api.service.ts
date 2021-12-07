import {
  CogniteClient,
  TemplateGroup,
  TemplateGroupVersion,
} from '@cognite/sdk';
import { PlatypusError } from '@platypus-core/boundaries/types';
import { ExternalId } from '@cognite/sdk-core';

import {
  CreateSchemaDTO,
  CreateSolutionDTO,
  DeleteSolutionDTO,
  FetchSolutionDTO,
  FetchVersionDTO,
  ListVersionsDTO,
} from '../../dto';

export class TemplatesApiService {
  constructor(private cdfClient: CogniteClient) {}

  createTemplateGroup(dto: CreateSolutionDTO): Promise<TemplateGroup> {
    const payload = [
      {
        externalId: dto.name,
        description: dto.description || '',
        owners: dto.owner ? [dto.owner] : [],
      },
    ];
    return this.cdfClient.templates.groups
      .create(payload)
      .then((templateGroups) => {
        const [createdTemplateGroup] = templateGroups;
        return createdTemplateGroup;
      })
      .catch((err) => Promise.reject(PlatypusError.fromSdkError(err)));
  }

  deleteTemplateGroup(dto: DeleteSolutionDTO): Promise<unknown> {
    return this.cdfClient.templates.groups
      .delete([{ externalId: dto.id }], {
        ignoreUnknownIds: false,
      })
      .catch((err) => Promise.reject(PlatypusError.fromSdkError(err)));
  }

  listTemplateGroups(): Promise<TemplateGroup[]> {
    return this.cdfClient.templates.groups
      .list()
      .then((templateGroups) => templateGroups.items)
      .catch((err) => Promise.reject(PlatypusError.fromSdkError(err)));
  }

  fetchTemplateGroup(dto: FetchSolutionDTO): Promise<TemplateGroup> {
    const externalIds: ExternalId[] = [
      {
        externalId: dto.solutionId,
      },
    ];
    return this.cdfClient.templates.groups
      .retrieve(externalIds)
      .then((templateGroup) => templateGroup[0])
      .catch((err) => Promise.reject(PlatypusError.fromSdkError(err)));
  }

  fetchSchemaVersion(dto: FetchVersionDTO): Promise<TemplateGroupVersion> {
    return this.listSchemaVersions(dto).then((versions) => {
      if (!versions || !versions.length) {
        return Promise.reject(
          new PlatypusError(
            `Specified version ${dto.version} does not exist!`,
            'NOT_FOUND'
          )
        );
      }

      //since we have filter applied, we will always have only one version
      return versions[0];
    });
  }

  listSchemaVersions(dto: ListVersionsDTO): Promise<TemplateGroupVersion[]> {
    const filter = dto.version
      ? {
          filter: {
            minVersion: +dto.version,
            maxVersion: +dto.version,
          },
        }
      : {};
    return this.cdfClient.templates
      .group(dto.solutionId)
      .versions.list(filter)
      .then((response) => response.items)
      .catch((err) => Promise.reject(PlatypusError.fromSdkError(err)));
  }
  createSchema(dto: CreateSchemaDTO): Promise<TemplateGroupVersion> {
    return this.createOrUpdate(dto, 'Update');
  }
  updateSchema(dto: CreateSchemaDTO): Promise<TemplateGroupVersion> {
    return this.createOrUpdate(dto, 'Patch');
  }

  private createOrUpdate(
    dto: CreateSchemaDTO,
    mode: string
  ): Promise<TemplateGroupVersion> {
    return this.cdfClient.templates
      .group(dto.solutionId)
      .versions.upsert({
        schema: dto.schema,
        conflictMode: mode as any,
      })
      .catch((err) => Promise.reject(PlatypusError.fromSdkError(err)));
  }
}
