/* eslint-disable no-param-reassign */

import {
  CognitePid,
  DiagramConnection,
  DiagramEquipmentTagInstance,
  DiagramLineInstance,
  DiagramSymbol,
  DocumentType,
  EventType,
  PidDocumentWithDom,
  AddSymbolData,
  ToolType,
  saveGraphAsJson,
  getFileNameWithoutExtension,
} from '@cognite/pid-tools';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Loader } from '@cognite/cogs.js';

import SvgContainer, { CONTAINER_ID } from './components/viewport/SvgContainer';
import { ReactPidWrapper, ReactPidLayout, LoaderOverlay } from './elements';
import { SidePanel } from './components';
import useSymbolState from './components/side-panel/useSymbolState';
import { Toolbar } from './components/toolbar/Toolbar';
import { enableExitWarning, disableExitWarning } from './utils/exitWarning';
import { Viewport } from './components/viewport/Viewport';
import useDiagramFile from './utils/useDiagramFile';

interface ReactPidProps {
  diagramExternalId?: string;
}

export const ReactPid = ({ diagramExternalId }: ReactPidProps) => {
  const [hasDocumentLoaded, setHasDocumentLoaded] = useState(false);
  const pidViewer = useRef<CognitePid>();

  const getPidDocument = (): PidDocumentWithDom | undefined => {
    return pidViewer.current?.pidDocument;
  };

  const [activeTool, setActiveTool] = useState<ToolType>('selectDocumentType');

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  const {
    file,
    handleFileUpload,
    loadFileIfProvided,
    isLoading,
    documentMetadata,
    setDocumentType,
  } = useDiagramFile(hasDocumentLoaded, diagramExternalId);

  const { symbols, setSymbols, symbolInstances, setSymbolInstances } =
    useSymbolState(pidViewer.current, documentMetadata.type, hasDocumentLoaded);
  const [lines, setLines] = useState<DiagramLineInstance[]>([]);
  const [connections, setConnections] = useState<DiagramConnection[]>([]);
  const [equipmentTags, setEquipmentTags] = useState<
    DiagramEquipmentTagInstance[]
  >([]);
  const [symbolSelection, setSymbolSelection] = useState<string[]>([]);
  const [hideSelection, setHideSelection] = useState<boolean>(false);
  const [lineNumbers, setLineNumbers] = useState<string[]>([]);
  const [activeLineNumber, setActiveLineNumber] = useState<string | null>(null);
  const [activeTagId, setActiveTagId] = useState<string | null>(null);

  useEffect(() => {
    setShowLoader(isAnalyzing || isLoading);
  }, [isAnalyzing, isLoading]);

  const [uploadSvgInput, setUploadSvgInput] = useState<HTMLInputElement | null>(
    null
  );
  const svgInputRef = useCallback((node: HTMLInputElement | null) => {
    setUploadSvgInput(node);
  }, []);

  const [uploadJsonInput, setUploadJsonInput] =
    useState<HTMLInputElement | null>(null);
  const jsonInputRef = useCallback((node: HTMLInputElement | null) => {
    setUploadJsonInput(node);
  }, []);
  const onUploadJsonClick = () => {
    if (uploadJsonInput) {
      uploadJsonInput.click();
    }
  };

  useEffect(() => {
    if (pidViewer.current) return;

    initPid(
      new CognitePid({
        container: `#${CONTAINER_ID}`,
      })
    );
    loadFileIfProvided();
  }, []);

  const initPid = (instance: CognitePid) => {
    pidViewer.current = instance;
    instance.addEventListener(EventType.LOAD, () => setHasDocumentLoaded(true));
  };

  useEffect(() => {
    if (pidViewer.current) {
      pidViewer.current.onChangeActiveTool(setActiveTool);
    }
  }, [setActiveTool]);

  useEffect(() => {
    if (pidViewer.current) {
      pidViewer.current.onChangeSymbolSelection(setSymbolSelection);
    }
  }, [setSymbolSelection]);

  useEffect(() => {
    if (pidViewer.current) {
      pidViewer.current.onChangeHideSelection(setHideSelection);
    }
  }, [setHideSelection]);

  useEffect(() => {
    if (pidViewer.current) {
      pidViewer.current.onChangeSymbols(setSymbols);
    }
  }, [setSymbols]);

  useEffect(() => {
    if (pidViewer.current) {
      pidViewer.current.onChangeSymbolInstances(setSymbolInstances);
    }
  }, [setSymbolInstances]);

  useEffect(() => {
    if (pidViewer.current) {
      pidViewer.current.onChangeLines(setLines);
    }
  }, [setLines]);

  useEffect(() => {
    if (pidViewer.current) {
      pidViewer.current.onChangeConnections(setConnections);
    }
  }, [setConnections]);

  useEffect(() => {
    if (pidViewer.current) {
      pidViewer.current.onChangeActiveLineNumber(setActiveLineNumber);
    }
  }, [setActiveLineNumber]);

  useEffect(() => {
    if (pidViewer.current) {
      pidViewer.current.onChangeActiveTagId(setActiveTagId);
    }
  }, [setActiveTagId]);

  useEffect(() => {
    if (pidViewer.current) {
      pidViewer.current.onChangeEquipmentTags(setEquipmentTags);
    }
  }, [setEquipmentTags]);

  useEffect(() => {
    if (pidViewer.current) {
      pidViewer.current.onChangeLineNumbers(setLineNumbers);
    }
  }, [lineNumbers]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.metaKey) {
        switch (e.code) {
          case 'KeyA': {
            autoAnalysis();
            return;
          }
          case 'KeyF': {
            onUploadJsonClick();
            return;
          }
          case 'KeyS': {
            toggleHideSelection();
            return;
          }
        }
      }

      switch (e.code) {
        case 'Space': {
          if (uploadSvgInput) {
            uploadSvgInput.click();
          }
        }
      }
    };

    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  });

  useEffect(() => {
    if (
      documentMetadata.type !== DocumentType.unknown &&
      activeTool === 'selectDocumentType'
    ) {
      setActiveToolWrapper('addSymbol');
      if (documentMetadata.type === DocumentType.isometric) {
        setLineNumbers([documentMetadata.lineNumber]);
      }
    }
  }, [documentMetadata]);

  useEffect(() => {
    if (activeTool !== 'addEquipmentTag' && activeTagId !== null) {
      pidViewer.current?.setActiveTagId(null);
    }
  }, [activeTool]);

  const setActiveToolWrapper = (tool: ToolType) => {
    if (!pidViewer.current) return;
    pidViewer.current.setActiveTool(tool);
  };

  const clearSymbolSelection = () => {
    if (!pidViewer.current) return;
    pidViewer.current.clearSymbolSelection();
  };

  const toggleHideSelection = () => {
    if (!pidViewer.current) return;
    pidViewer.current.setHideSelection(!hideSelection);
  };

  const setActiveLineNumberWrapper = (lineNumber: string | null) => {
    if (!pidViewer.current) return;
    pidViewer.current.setActiveLineNumber(lineNumber);
  };

  const setActiveTagIdWrapper = (activeTagId: string | null) => {
    if (!pidViewer.current) return;
    pidViewer.current.setActiveTagId(activeTagId);
  };

  const setLineNumbersWrapper = (lineNumbers: string[]) => {
    if (!pidViewer.current) return;
    pidViewer.current.setLineNumbers(lineNumbers);
  };

  const loadJson = (json: Record<string, unknown>) => {
    if (!pidViewer.current) return;
    pidViewer.current.loadJson(json);
  };

  const saveGraphAsJsonWrapper = () => {
    if (!pidViewer.current) return;

    const pidDocument = getPidDocument();
    if (pidDocument === undefined) return;

    saveGraphAsJson(
      pidDocument,
      symbols,
      lines,
      symbolInstances,
      connections,
      pidViewer.current.pathReplacements,
      documentMetadata,
      lineNumbers,
      equipmentTags,
      documentMetadata.name
        ? `${getFileNameWithoutExtension(documentMetadata.name)}.json`
        : 'graph.json'
    );
    disableExitWarning();
  };

  useEffect(() => {
    // any changes in save graph dependencies should trigger warning, but assume we can skip warning if there are no symbol instances
    if (symbolInstances.length) {
      enableExitWarning();
    }
  }, [
    symbols,
    lines,
    symbolInstances,
    connections,
    pidViewer,
    documentMetadata,
    lineNumbers,
    equipmentTags,
  ]);

  const autoAnalysis = () => {
    if (!pidViewer.current) return;
    setIsAnalyzing(true);
    setTimeout(() => {
      pidViewer.current!.autoAnalysis(documentMetadata);
      setIsAnalyzing(false);
    }, 0);
  };

  const deleteSymbol = (diagramSymbol: DiagramSymbol) => {
    if (!pidViewer.current) return;
    pidViewer.current.deleteSymbol(diagramSymbol);
  };

  const deleteConnection = (connection: DiagramConnection) => {
    if (!pidViewer.current) return;
    pidViewer.current.deleteConnection(connection);
  };

  const addSymbolFromSymbolSelection = (symbolData: AddSymbolData) => {
    if (!pidViewer.current) return;
    pidViewer.current.addSymbolFromSymbolSelection(symbolData);
  };

  useEffect(() => {
    if (file) {
      if (pidViewer.current && pidViewer.current.document === undefined) {
        pidViewer.current.addSvgDocument(file);
      } else {
        throw new Error('Failed to add SVG document to pidViewer');
      }
    }
  }, [file]);

  return (
    <ReactPidWrapper>
      <ReactPidLayout>
        <SidePanel
          activeTool={activeTool}
          setActiveTool={setActiveToolWrapper}
          symbols={symbols}
          lines={lines}
          symbolInstances={symbolInstances}
          symbolSelection={symbolSelection}
          loadJson={loadJson}
          addSymbolFromSymbolSelection={addSymbolFromSymbolSelection}
          connections={connections}
          deleteSymbol={deleteSymbol}
          deleteConnection={deleteConnection}
          file={file}
          autoAnalysis={autoAnalysis}
          saveGraphAsJson={saveGraphAsJsonWrapper}
          documentMetadata={documentMetadata}
          setDocumentType={setDocumentType}
          lineNumbers={lineNumbers}
          setLineNumbers={setLineNumbersWrapper}
          activeLineNumber={activeLineNumber}
          setActiveLineNumber={setActiveLineNumberWrapper}
          equipmentTags={equipmentTags}
          setEquipmentTags={setEquipmentTags}
          activeTagId={activeTagId}
          setActiveTagId={setActiveTagIdWrapper}
          hideSelection={hideSelection}
          toggleHideSelection={toggleHideSelection}
          clearSymbolSelection={clearSymbolSelection}
          jsonInputRef={jsonInputRef}
          onUploadJsonClick={onUploadJsonClick}
        />
        <Viewport>
          <SvgContainer
            hasDocumentLoaded={hasDocumentLoaded}
            documentWidth={pidViewer.current?.getDocumentWidth() ?? 0}
            documentHeight={pidViewer.current?.getDocumentHeight() ?? 0}
          />
          {file === null && (
            <input
              ref={svgInputRef}
              type="file"
              accept=".svg"
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
              }}
              onChange={handleFileUpload}
            />
          )}
          <Toolbar
            activeTool={activeTool}
            setActiveTool={setActiveToolWrapper}
            documentType={documentMetadata.type}
          />
        </Viewport>
      </ReactPidLayout>
      {showLoader && (
        <LoaderOverlay>
          <Loader infoTitle={isLoading ? 'Loading' : 'Analyzing'} />
        </LoaderOverlay>
      )}
    </ReactPidWrapper>
  );
};
