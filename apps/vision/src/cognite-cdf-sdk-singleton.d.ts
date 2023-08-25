declare module '@cognite/cdf-sdk-singleton' {
  import { CogniteClient } from '@cognite/sdk';

  export declare type Flow =
    | 'COGNITE_AUTH'
    | 'AZURE_AD'
    | 'ADFS'
    | 'OAUTH_GENERIC'
    | 'FAKE_IDP'
    | 'UNKNOWN';

  export declare function logout(): void;

  export declare function loginAndAuthIfNeeded(): Promise<void>;
  export declare function getToken(): Promise<string>;
  export declare function getFlow(): { flow: Flow };
  export declare function getUserInformation(): Promise<any>;
  export declare function createSdkClient(
    clientOptions: ClientOptions,
    tokenProvider?: SdkClientTokenProvider
  ): CogniteClient;

  declare const sdk: CogniteClient;
  export default sdk;
}