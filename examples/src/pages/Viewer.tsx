/*
 * Copyright 2021 Cognite AS
 */

import Stats from 'stats.js';
import { useEffect, useRef } from 'react';
import { CanvasWrapper } from '../components/styled';
import * as THREE from 'three';
import { CogniteClient } from '@cognite/sdk';
import dat from 'dat.gui';
import {
  Cognite3DViewer,
  Cognite3DViewerOptions,
  CogniteCadModel,
  CognitePointCloudModel,
  CameraControlsOptions,
  DefaultCameraManager,
  CogniteModel,
  AnnotationIdPointCloudObjectCollection
} from '@cognite/reveal';
import { DebugCameraTool, Corner, AxisViewTool, Overlay3DTool } from '@cognite/reveal/tools';
import * as reveal from '@cognite/reveal';
import { ClippingUIs } from '../utils/ClippingUIs';
import { NodeStylingUI } from '../utils/NodeStylingUI';
import { BulkHtmlOverlayUI } from '../utils/BulkHtmlOverlayUI';
import { initialCadBudgetUi } from '../utils/CadBudgetUi';
import { InspectNodeUI } from '../utils/InspectNodeUi';
import { CameraUI } from '../utils/CameraUI';
import { PointCloudUi } from '../utils/PointCloudUi';
import { ModelUi } from '../utils/ModelUi';
import { createSDKFromEnvironment, createSDKFromToken } from '../utils/example-helpers';
import { PointCloudClassificationFilterUI } from '../utils/PointCloudClassificationFilterUI';
import { PointCloudObjectStylingUI } from '../utils/PointCloudObjectStylingUI';
import { CustomCameraManager } from '../utils/CustomCameraManager';
import { MeasurementUi } from '../utils/MeasurementUi';
import { Image360UI } from '../utils/Image360UI';
import { Image360StylingUI } from '../utils/Image360StylingUI';
import { LoadGltfUi } from '../utils/LoadGltfUi';
import { createFunnyButton } from '../utils/PageVariationUtils';
import { Vector3 } from 'three';

window.THREE = THREE;
(window as any).reveal = reveal;

type FDMQueryResponse = {
  data: {
    listAPM_Observation: {
      items: {
        description: string;
        position: {
          x: number;
          y: number;
          z: number;
        }
      } []
    }
  }
};

type FDMFilterQueryResponse = {
  data: {
    listAPM_Checklist: {
      items: {
        items: {
          items: {
            observations: {
              items: {
                description: string;
                position: {
                  x: number;
                  y: number;
                  z: number;
                }
              }[]
            }
          }[]
        }
      }[]
    }
  }
};

export function Viewer() {
  const url = new URL(window.location.href);
  const urlParams = url.searchParams;
  const canvasWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Check in order to avoid double initialization of everything, especially dat.gui.
    // See https://reactjs.org/docs/strict-mode.html#detecting-unexpected-side-effects for why its called twice.
    if (!canvasWrapperRef.current) {
      return () => {};
    }

    const gui = new dat.GUI({ width: Math.min(500, 0.8 * window.innerWidth) });
    let viewer: Cognite3DViewer;
    let cameraManager: DefaultCameraManager;
    let cameraManagers: {
      Default: DefaultCameraManager;
      Custom: CustomCameraManager;
    };
    let pointCloudObjectsUi: PointCloudObjectStylingUI;

    async function main() {
      const project = urlParams.get('project');
      const environment = urlParams.get('env');
      const overrideToken = urlParams.get('token');

      const cdfModel = urlParams.get('modelId') && urlParams.get('revisionId');
      let modelUrl = urlParams.get('modelUrl');
      if (!modelUrl && !cdfModel) {
        modelUrl = 'primitives';
        url.searchParams.set('modelUrl', modelUrl);
        window.history.pushState({}, '', url.toString());
      }

      let client: CogniteClient;
      if (project && overrideToken) {
        client = createSDKFromToken('reveal.example.example', project, overrideToken);
      } else if (project && environment) {
        client = await createSDKFromEnvironment('reveal.example.example', project, environment);
      } else {
        client = new CogniteClient({
          appId: 'reveal.example.example',
          project: 'dummy',
          getToken: async () => 'dummy'
        });
      }

      const edlEnabled = (urlParams.get('edl') ?? 'true') === 'true';
      const progress = (itemsLoaded: number, itemsRequested: number, itemsCulled: number) => {
        if (itemsLoaded === 0 || itemsLoaded === itemsRequested) {
          console.log(`loaded ${itemsLoaded}/${itemsRequested} (culled: ${itemsCulled})`);
        }
      };

      let viewerOptions: Cognite3DViewerOptions = {
        sdk: client,
        domElement: canvasWrapperRef.current!,
        onLoading: progress,
        logMetrics: false,
        antiAliasingHint: (urlParams.get('antialias') ?? undefined) as any,
        ssaoQualityHint: (urlParams.get('ssao') ?? undefined) as any,
        pointCloudEffects: {
          pointBlending: urlParams.get('pointBlending') === 'true' ?? undefined,
          edlOptions: edlEnabled
            ? {
                strength: parseFloat(urlParams.get('edlStrength') ?? '0.5'),
                radius: parseFloat(urlParams.get('edlRadius') ?? '2.2')
              }
            : 'disabled'
        }
      };

      if (modelUrl !== null) {
        viewerOptions = {
          ...viewerOptions,
          // @ts-expect-error
          _localModels: true
        };
      } else if (!project) {
        throw new Error(
          'A "project" URL parameter is needed to load models from CDF.' +
            'Optionally, use "modelUrl" to load local models.'
        );
      } else if (!environment && !overrideToken) {
        throw new Error(
          'You must provide either "env" or "token" as URL parameters to load models from CDF.' +
            'Optionally, use "modelUrl" to load local models.'
        );
      }

      // Prepare viewer
      viewer = new Cognite3DViewer(viewerOptions);
      (window as any).viewer = viewer;

      // Add Stats.js overlay with FPS etc
      var stats = new Stats();
      stats.dom.style.position = 'absolute';
      stats.dom.style.top = stats.dom.style.right = '';
      stats.dom.style.bottom = '0px';
      stats.dom.style.left = '0px';
      document.body.appendChild(stats.dom);
      viewer.on('beforeSceneRendered', () => stats.begin());
      viewer.on('sceneRendered', () => stats.end());

      const controlsOptions: CameraControlsOptions = {
        changeCameraTargetOnClick: true,
        mouseWheelAction: 'zoomToCursor'
      };
      cameraManager = viewer.cameraManager as DefaultCameraManager;

      cameraManager.setCameraControlsOptions(controlsOptions);

      cameraManagers = {
        Default: viewer.cameraManager as DefaultCameraManager,
        Custom: new CustomCameraManager(canvasWrapperRef.current!, new THREE.PerspectiveCamera(5, 1, 0.01, 1000))
      };
      cameraManagers.Custom.deactivate();

      // Add GUI for loading models and such
      const guiState = {
        antiAliasing: urlParams.get('antialias'),
        ssaoQuality: urlParams.get('ssao'),
        screenshot: {
          includeUI: true,
          resolution: {
            override: false,
            width: 1920,
            height: 1080
          }
        },
        debug: {
          stats: {
            drawCalls: 0,
            points: 0,
            triangles: 0,
            geometries: 0,
            textures: 0,
            renderTime: 0
          },
          suspendLoading: false,
          ghostAllNodes: false,
          hideAllNodes: false
        },
        viewerSize: 'fullScreen',
        scrollableElements: false,
        showCameraTool: new DebugCameraTool(viewer),
        renderMode: 'Color',
        controls: {
          mouseWheelAction: 'zoomToCursor',
          changeCameraTargetOnClick: true,
          cameraManager: 'Default'
        }
      };
      const guiActions = {
        showCameraHelper: () => {
          guiState.showCameraTool.showCameraHelper();
        },
        takeScreenshot: async () => {
          const width = guiState.screenshot.resolution.override ? guiState.screenshot.resolution.width : undefined;
          const height = guiState.screenshot.resolution.override ? guiState.screenshot.resolution.height : undefined;
          const filename =
            'example_screenshot' + (guiState.screenshot.resolution.override ? '_' + width + 'x' + height : '');

          const url = await viewer.getScreenshot(width, height, guiState.screenshot.includeUI);
          if (url) {
            const link = document.createElement('a');
            link.href = url;
            link.download = filename;
            link.click();
          }
        }
      };
      initialCadBudgetUi(viewer, gui.addFolder('CAD budget'));

      const totalBounds = new THREE.Box3();
      function handleModelAdded(model: CogniteModel) {
        const bounds = model.getModelBoundingBox();
        totalBounds.expandByPoint(bounds.min);
        totalBounds.expandByPoint(bounds.max);
        clippingUi.updateWorldBounds(totalBounds);
        clippingUi.addModel(model);

        viewer.loadCameraFromModel(model);
        if (model instanceof CogniteCadModel) {
          new NodeStylingUI(gui.addFolder(`Node styling #${modelUi.cadModels.length}`), client, viewer, model);
          new BulkHtmlOverlayUI(gui.addFolder(`Node tagging #${modelUi.cadModels.length}`), viewer, model, client);
        } else if (model instanceof CognitePointCloudModel) {
          const modelIndex = modelUi.pointCloudModels.length;
          new PointCloudClassificationFilterUI(gui.addFolder(`Class filter #${modelIndex}`), model);
          pointCloudUi.applyToAllModels();
          pointCloudObjectsUi = new PointCloudObjectStylingUI(
            gui.addFolder(`Point cloud objects #${modelIndex}`),
            model,
            viewer,
            client
          );
        }
      }
      const modelUi = new ModelUi(gui.addFolder('Models'), viewer, handleModelAdded);

      const renderGui = gui.addFolder('Rendering');
      const renderModes = [
        'Color',
        'Normal',
        'TreeIndex',
        'PackColorAndNormal',
        'Depth',
        'Effects',
        'Ghost',
        'LOD',
        'DepthBufferOnly (N/A)',
        'GeometryType'
      ];
      renderGui
        .add(guiState, 'renderMode', renderModes)
        .name('Render mode')
        .onFinishChange(value => {
          const renderMode = renderModes.indexOf(value) + 1;
          (
            viewer as any
          ).revealManager._renderPipeline._cadGeometryRenderPipeline._cadGeometryRenderPasses.back._renderMode =
            renderMode;
          viewer.requestRedraw();
        });
      renderGui
        .add(guiState, 'antiAliasing', [
          'disabled',
          'fxaa',
          'msaa4',
          'msaa8',
          'msaa16',
          'msaa4+fxaa',
          'msaa8+fxaa',
          'msaa16+fxaa'
        ])
        .name('Anti-alias')
        .onFinishChange(v => {
          urlParams.set('antialias', v);
          window.location.href = url.toString();
        });
      renderGui
        .add(guiState, 'ssaoQuality', ['disabled', 'medium', 'high', 'veryhigh'])
        .name('SSAO')
        .onFinishChange(v => {
          urlParams.set('ssao', v);
          window.location.href = url.toString();
        });

      const screenshotGui = gui.addFolder('Screenshot');
      screenshotGui.add(guiActions, 'takeScreenshot').name('Create screenshot');
      screenshotGui.add(guiState.screenshot, 'includeUI').name('Include UI elements in the screenshot');
      const resolutionGui = screenshotGui.addFolder('Resolution');
      resolutionGui.add(guiState.screenshot.resolution, 'override').name('Override Resolution');
      resolutionGui.add(guiState.screenshot.resolution, 'width').name('Width');
      resolutionGui.add(guiState.screenshot.resolution, 'height').name('Height');

      const debugGui = gui.addFolder('Debug');
      const debugStatsGui = debugGui.addFolder('Statistics');
      debugStatsGui.add(guiState.debug.stats, 'drawCalls').name('Draw Calls');
      debugStatsGui.add(guiState.debug.stats, 'points').name('Points');
      debugStatsGui.add(guiState.debug.stats, 'triangles').name('Triangles');
      debugStatsGui.add(guiState.debug.stats, 'geometries').name('Geometries');
      debugStatsGui.add(guiState.debug.stats, 'textures').name('Textures');
      debugStatsGui.add(guiState.debug.stats, 'renderTime').name('Ms/frame');

      const viewerSize = gui.addFolder('Page variation');
      viewerSize
        .add(guiState, 'viewerSize', ['fullScreen', 'halfScreen', 'quarterScreen'])
        .name('Reveal window size')
        .onFinishChange(value => {
          switch (value) {
            case 'fullScreen':
              canvasWrapperRef.current!.style.position = 'relative';
              canvasWrapperRef.current!.style.width = '';
              canvasWrapperRef.current!.style.height = '';
              canvasWrapperRef.current!.style.flexGrow = '';
              canvasWrapperRef.current!.style.left = '';
              canvasWrapperRef.current!.style.top = '';
              break;
            case 'halfScreen':
              canvasWrapperRef.current!.style.position = 'absolute';
              canvasWrapperRef.current!.style.width = '50%';
              canvasWrapperRef.current!.style.height = '100%';
              canvasWrapperRef.current!.style.flexGrow = '1';
              canvasWrapperRef.current!.style.left = '25%';
              canvasWrapperRef.current!.style.top = '0%';
              break;
            case 'quarterScreen':
              canvasWrapperRef.current!.style.position = 'absolute';
              canvasWrapperRef.current!.style.width = '50%';
              canvasWrapperRef.current!.style.height = '50%';
              canvasWrapperRef.current!.style.flexGrow = '0.5';
              canvasWrapperRef.current!.style.left = '25%';
              canvasWrapperRef.current!.style.top = '25%';
              break;
          }
        });

      const funnyButton = createFunnyButton(viewer);

      viewerSize
        .add(guiState, 'scrollableElements')
        .name('Add scrollable elements')
        .onChange((value: boolean) => {
          if (value) {
            document.body.appendChild(funnyButton);
          } else {
            document.body.removeChild(funnyButton);
          }
        });

      viewer.on('sceneRendered', sceneRenderedEventArgs => {
        guiState.debug.stats.drawCalls = sceneRenderedEventArgs.renderer.info.render.calls;
        guiState.debug.stats.points = sceneRenderedEventArgs.renderer.info.render.points;
        guiState.debug.stats.triangles = sceneRenderedEventArgs.renderer.info.render.triangles;
        guiState.debug.stats.geometries = sceneRenderedEventArgs.renderer.info.memory.geometries;
        guiState.debug.stats.textures = sceneRenderedEventArgs.renderer.info.memory.textures;
        guiState.debug.stats.renderTime = sceneRenderedEventArgs.renderTime;
        debugStatsGui.updateDisplay();
      });

      debugGui.add(guiActions, 'showCameraHelper').name('Show camera');
      debugGui
        .add(guiState.debug, 'suspendLoading')
        .name('Suspend loading')
        .onFinishChange(suspend => {
          try {
            // @ts-expect-error
            viewer.revealManager._cadManager._cadModelUpdateHandler.updateLoadingHints({ suspendLoading: suspend });
            // @ts-expect-error
            viewer.revealManager._pointCloudManager._potreeInstance.shouldLoad = false;

            const cameraHelper = new THREE.CameraHelper(viewer.cameraManager.getCamera().clone());
            viewer.addObject3D(cameraHelper);
          } catch (error) {
            alert('Could not toggle suspend loading, check console for error');
            throw error;
          }
        });
      debugGui
        .add(guiState.debug, 'ghostAllNodes')
        .name('Ghost all nodes')
        .onFinishChange(ghost => {
          modelUi.cadModels.forEach(m => m.setDefaultNodeAppearance({ renderGhosted: ghost }));
        });
      debugGui
        .add(guiState.debug, 'hideAllNodes')
        .name('Hide all nodes')
        .onFinishChange(hide => {
          modelUi.cadModels.forEach(m => m.setDefaultNodeAppearance({ visible: !hide }));
        });

      const clippingUi = new ClippingUIs(gui.addFolder('Clipping'), viewer);
      new CameraUI(viewer, gui.addFolder('Camera'));
      const pointCloudUi = new PointCloudUi(viewer, gui.addFolder('Point clouds'));
      await modelUi.restoreModelsFromUrl();
      const image360Ui = new Image360UI(viewer, gui.addFolder('360 Images'));
      new Image360StylingUI(image360Ui, gui.addFolder('360 annotation styling'));

      const controlsGui = gui.addFolder('Camera controls');
      const mouseWheelActionTypes = ['zoomToCursor', 'zoomPastCursor', 'zoomToTarget'];
      const cameraManagerTypes = ['Default', 'Custom'];
      controlsGui
        .add(guiState.controls, 'mouseWheelAction', mouseWheelActionTypes)
        .name('Mouse wheel action type')
        .onFinishChange(value => {
          cameraManager.setCameraControlsOptions({
            ...cameraManager.getCameraControlsOptions(),
            mouseWheelAction: value
          });
        });
      controlsGui
        .add(guiState.controls, 'changeCameraTargetOnClick')
        .name('Change camera target on click')
        .onFinishChange(value => {
          cameraManager.setCameraControlsOptions({
            ...cameraManager.getCameraControlsOptions(),
            changeCameraTargetOnClick: value
          });
        });
      controlsGui
        .add(guiState.controls, 'cameraManager', cameraManagerTypes)
        .name('Camera manager type')
        .onFinishChange((value: 'Default' | 'Custom') => {
          viewer.setCameraManager(cameraManagers[value]);
        });

      const inspectNodeUi = new InspectNodeUI(gui.addFolder('Last clicked node'), client, viewer);

      new MeasurementUi(viewer, gui.addFolder('Measurement'));
      new LoadGltfUi(gui.addFolder('GLTF'), viewer);

      // Points of interest stuff

      const overlayTool = new Overlay3DTool<{text: string, id: number}>(viewer);

      const POIs = await listPOIs(client, project!);

      const labels = POIs.map((poi, index) => {
        const position = new THREE.Vector3(poi.position.x, poi.position.y, poi.position.z);
        return { position, content: { text: poi.description, id: index }, color: new THREE.Color('red')}
      });
      const collection = overlayTool.createOverlayCollection(labels);

      viewer.on('click', async event => {
        const { offsetX, offsetY } = event;
        console.log('2D coordinates', event);
        const start = performance.now();
        const intersection = await viewer.getIntersectionFromPixel(offsetX, offsetY);
        if (intersection !== null) {
          switch (intersection.type) {
            case 'cad':
              {
                const { treeIndex, point } = intersection;
                console.log(
                  `Clicked node with treeIndex ${treeIndex} at`,
                  point,
                  `took ${(performance.now() - start).toFixed(1)} ms`
                );

                const position = point.add(new THREE.Vector3(0, 0.2, 0));

                collection.addOverlays([{ position, content: { text: `Clicked node with treeIndex ${treeIndex}`, id: treeIndex }, color: new THREE.Color('red')}]);
                createPointOfInterest(client, project!, position, `Clicked node with treeIndex ${treeIndex}`);

                inspectNodeUi.inspectNode(intersection.model, treeIndex);
              }
              break;
            case 'pointcloud':
              {
                const { point, model } = intersection;
                console.log(
                  `Clicked point assigned to the object with annotationId: ${intersection.annotationId} and assetId: ${intersection?.assetRef?.id} at`,
                  point
                );
                if (intersection.annotationId !== 0) {
                  pointCloudObjectsUi.updateSelectedAnnotation(intersection.annotationId);
                  model.removeAllStyledObjectCollections();
                  const selected = new AnnotationIdPointCloudObjectCollection([intersection.annotationId]);
                  model.assignStyledObjectCollection(selected, { color: new THREE.Color('red') });
                } else {
                  const sphere = new THREE.Mesh(
                    new THREE.SphereGeometry(0.1),
                    new THREE.MeshBasicMaterial({ color: 'red' })
                  );
                  sphere.position.copy(point);
                  viewer.addObject3D(sphere);
                }
              }
              break;
          }
        }
      });

      new AxisViewTool(
        viewer,
        // Give some space for Stats.js overlay
        {
          position: {
            corner: Corner.BottomRight,
            padding: new THREE.Vector2(60, 0)
          }
        }
      );
    }

    main();

    return () => {
      gui.destroy();
      viewer?.dispose();
    };
  }, []);
  return <CanvasWrapper ref={canvasWrapperRef} />;
}

async function createPointOfInterest(client: CogniteClient, project: string, position: Vector3, description: string): Promise<void> {
  console.log("Trying to create POI");
  const baseUrl = client.getBaseUrl();
  const fdmSpace = 'APM_AppData';

  const vec3DataModelName = 'Vec3f'
  const APMObservationDataModelName = 'APM_Observation';
  const APMChecklistItemDataModelName = 'APM_ChecklistItem';
  const APMChecklistDataModelName = 'APM_Checklist';
  const dataModelVersion = '2';

  const fdmCreateEndpoint = `${baseUrl}/api/v1/projects/${project}/models/instances`;

  const externalId = performance.now().toString();
  const vec3ExternalId = "vec3-" + externalId;
  const observationExternalId = "observation-" + externalId;
  const checklistItemExternalId = "checklistitem-aasta-1";
  const checklistExternalId = "testingChecklist";

  const observationChecklistItemEdgeExternalId = checklistItemExternalId + observationExternalId;
  const checklistChecklistItemEdgeExternalId = checklistExternalId + checklistItemExternalId;

  const createNewChecklistItem = false;
  const createNewChecklist = false;

  const vec3fData = {
    data: {
      "replace": false,
      "items": [
        {
          "instanceType": "node",
          "space": fdmSpace,
          externalId: vec3ExternalId,
          "sources": [
            {
              "source": {
                "type": "view",
                "space": fdmSpace,
                "externalId": vec3DataModelName,
                "version": dataModelVersion
              },
              "properties": {
                x: position.x,
                y: position.y,
                z: position.z
              }
            }
          ]
        }
      ]
    }
  }
  const images = ["kitchen-chalky-mink-DV889lLRsJTJfn4t6Aq3Gw==1677596590897-2048-front", 'spot_enterprice_4th floor 2022 fornebu old stack-gaunt-redbug-TyDlBILo6s5ijsXqEOgz7g==1670438144207-2048-front'];
  const random = Math.random();

  const APMObservationData = {
    data: {
      "replace": false,
      "items": [
        {
          "instanceType": "node",
          "space": fdmSpace,
          externalId: observationExternalId,
          "sources": [
            {
              "source": {
                "type": "view",
                "space": fdmSpace,
                "externalId": APMObservationDataModelName,
                "version": dataModelVersion
              },
              "properties": {
                description: description,
                fileIds: [ random > 0.5 ? (random > 0.8 ? images : images[0]) : (random < 0.1 ? [images[0], images[1], images[0], images[1]] : images[1])].flat(),
                position: {
                  "externalId": vec3ExternalId,
                  space: fdmSpace
                }
              }
            }
          ]
        }
      ]
    }
  };

  const APMChecklistItemData = {
    data: {
      "replace": false,
      "items": [
        {
          "instanceType": "node",
          "space": fdmSpace,
          "externalId": checklistItemExternalId,
          "sources": [
            {
              "source": {
                "type": "view",
                "space": fdmSpace,
                "externalId": APMChecklistItemDataModelName,
                "version": dataModelVersion
              },
              "properties": {
                "title": "Observation",
                "description": "Found an issue in " + checklistExternalId, // checklistexternalid is site name
                "order": 13,
                "status": "Failure"
              }
            }
          ]
        }
      ]
    }
  };

  const APMChecklistData = {
    data: {
      "replace": false,
      "items": [
        {
          "instanceType": "node",
          "space": fdmSpace,
          "externalId": checklistExternalId,
          "sources": [
            {
              "source": {
                "type": "view",
                "space": fdmSpace,
                "externalId": APMChecklistDataModelName,
                "version": dataModelVersion
              },
              "properties": {
                "title": "Ivar Aasen checklist 1",
                "description": "Inspection of Ivar Aasen cellar deck",
                "type": "Routine inspection",
                "status": "Success",
                "rootLocationId": "North sea",
                "assignedTo": ["Geir", "Ronny"],
                "createdBy": "Anders"
              }
            }
          ]
        }
      ]
    }
  };

  const APMChecklistItemObservationEdge = {
    data: {
      "replace": false,
      "items": [
        {
          "instanceType": "edge",
          "space": fdmSpace,
          "externalId": observationChecklistItemEdgeExternalId,
          "type": {
            "space": fdmSpace,
            "externalId": `${APMChecklistItemDataModelName}.observations`
          },
          "startNode": {
            "space": fdmSpace,
            "externalId": checklistItemExternalId
          },
          "endNode": {
            "space": fdmSpace,
            "externalId": observationExternalId
          }
        }
      ]
    }
  };

  const APMChecklistChecklistItemEdge = {
    data: {
      "replace": false,
      "items": [
        {
          "instanceType": "edge",
          "space": fdmSpace,
          "externalId": checklistChecklistItemEdgeExternalId,
          "type": {
            "space": fdmSpace,
            "externalId": `${APMChecklistDataModelName}.items`
          },
          "startNode": {
            "space": fdmSpace,
            "externalId": checklistExternalId
          },
          "endNode": {
            "space": fdmSpace,
            "externalId": checklistItemExternalId
          }
        }
      ]
    }
  };

  // Create new nodes
  const createdVec3 = await client.post(fdmCreateEndpoint, vec3fData);
  const createdAPMObservation = await client.post(fdmCreateEndpoint, APMObservationData);
  if (createNewChecklistItem)
    { const createdAPMChecklistItem = await client.post(fdmCreateEndpoint, APMChecklistItemData); }
  if (createNewChecklist)
    { const createdAPMChecklist = await client.post(fdmCreateEndpoint, APMChecklistData) }

  // Create new edges
  const createChecklistItemObservationEdge = await client.post(fdmCreateEndpoint, APMChecklistItemObservationEdge);
  const createChecklistChecklistItemEdge = await client.post(fdmCreateEndpoint, APMChecklistChecklistItemEdge);
}

async function listPOIs (sdk: CogniteClient, project: string) {
  console.log("Listing POIs");
  const baseUrl = sdk.getBaseUrl();
  const fdmSpace = 'Test_DMSv3';
  const dataModelVersion = '3';

  const fdmQueryEndpoint = `${baseUrl}/api/v1/projects/${project}/userapis/spaces/${fdmSpace}/datamodels/${fdmSpace}/versions/${dataModelVersion}/graphql`;

  // const fdmData = await sdk.post(fdmQueryEndpoint, {
  //   data: {
  //     query: `query MyQuery {
  //       listAPM_Observation(first: 5) {
  //         items {
  //           description
  //           position {
  //             x
  //             y
  //             z
  //           }
  //         }
  //       }
  //     }`
  //   }
  // });

  const checklistFilter = "Aasta";
  const fdmFilteredChecklistData = await sdk.post(fdmQueryEndpoint, {
    data: {
      query: `query MyQuery {
        listAPM_Checklist(filter: {externalId: {eq: "${checklistFilter}"}}) {
          items {
            items {
              items {
                observations {
                  items {
                    description
                    position {
                      x
                      y
                      z
                    }
                  }
                }
              }
            }
          }
        }
      }`
    }
  });

  // console.log(fdmFilteredChecklistData.data);
  // return (fdmData.data as FDMQueryResponse).data.listAPM_Observation.items;
  return (fdmFilteredChecklistData.data as FDMFilterQueryResponse).data.listAPM_Checklist.items.flatMap(
      checklistItem => checklistItem.items.items.flatMap(
        observation => observation.observations.items
      )
    );

  // console.log(apmChecklist);
  // console.log(fdmFilteredChecklistData);
}
