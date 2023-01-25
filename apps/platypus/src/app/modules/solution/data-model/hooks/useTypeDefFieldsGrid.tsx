import { BoolCellRenderer, GridConfig } from '@cognite/cog-data-grid';
import { Tooltip } from '@cognite/cogs.js';
import { useTranslation } from '@platypus-app/hooks/useTranslation';
import { BuiltInType, DataModelTypeDefsField } from '@platypus/platypus-core';
import { EditableCallbackParams } from 'ag-grid-community';
import { FieldNameCellEditor } from '../components/TypeDefFields/cellEditors/FieldNameCellEditor';
import { FieldTypeCellEditor } from '../components/TypeDefFields/cellEditors/FieldTypeCellEditor';
import { FieldActionsCellRenderer } from '../components/TypeDefFields/cellRenderers/FieldActionsCellRenderer';
import { FieldNameCellRenderer } from '../components/TypeDefFields/cellRenderers/FieldNameCellRenderer';

export interface getGridConfigProps {
  builtInTypes: BuiltInType[];
  customTypesNames: string[];
  disabled: boolean;
  isRequiredDisabled: (field: DataModelTypeDefsField) => boolean;
  onDelete: (field: DataModelTypeDefsField) => void;
}

export const useTypeDefFieldsGrid = () => {
  const { t } = useTranslation('TypeDefFields');

  function getGridConfig(props: getGridConfigProps): GridConfig {
    const tableConfig = {
      columns: [
        {
          property: 'name',
          label: t('field_name_label', 'Field name'),
          optional: false,
          dataType: 'TEXT',
          defaultValue: '',
          execOrder: 1,
          metadata: {},
          rules: [],
          displayOrder: 1,
          colDef: {
            width: 261,
            //// Don't allow user to select type while adding a new row before name is filled out
            editable: (params: EditableCallbackParams) => {
              if (
                params.context.isCreatingNewField &&
                params.data.name !== ''
              ) {
                return false;
              }
              return !props.disabled;
            },
            sortable: false,
            suppressMovable: true,
            cellRenderer: FieldNameCellRenderer,
            cellRendererParams: {
              disabled: props.disabled,
            },
            cellEditor: FieldNameCellEditor,
          },
        },
        {
          property: 'type',
          label: t('field_type_label', 'Type'),
          optional: false,
          dataType: 'TEXT',
          isList: false,
          defaultValue: [],
          execOrder: 1,
          metadata: {},
          rules: [],
          displayOrder: 1,
          colDef: {
            width: 261,
            editable: (params: EditableCallbackParams) => {
              if (params.context.isCreatingNewField) {
                return false;
              }
              return !props.disabled;
            },
            sortable: false,
            suppressMovable: true,
            suppressNavigable: false,
            suppressKeyboardEvent: (params) =>
              params.event.key === 'Enter' && params.editing,
            cellEditor: FieldTypeCellEditor,
            cellEditorParams: {
              builtInTypes: props.builtInTypes,
              customTypesNames: props.customTypesNames,
            },
            // show this editor in a popup
            cellEditorPopup: true,
            // position the popup under the cell
            cellEditorPopupPosition: 'over',
            valueGetter: (params) => params.data.type.name,
            cellRenderer: FieldNameCellRenderer,
            cellRendererParams: {
              disabled: props.disabled,
              showDropDownArrow: true,
            },
          },
        },
        {
          property: 'nonNull',
          label: (
            <div
              style={{ width: 'inherit' }}
              title={t('field_label_req_tooltip', 'Required')}
            >
              <Tooltip
                content={t('field_label_req_tooltip', 'Required')}
                appendTo={document.querySelector('[data-cy="editor_panel"]')!}
              >
                <span
                  style={{
                    width: 'inherit',
                    display: 'flex',
                    justifyContent: 'center',
                  }}
                >
                  {t('field_label_req', '!')}
                </span>
              </Tooltip>
            </div>
          ),
          optional: false,
          dataType: 'BOOLEAN',
          defaultValue: '',
          colDef: {
            width: 50,
            editable: false,
            resizable: false,
            sortable: false,
            suppressMovable: true,
            suppressSizeToFit: true,
            headerClass: 'col-txt-center',
            cellRenderer: BoolCellRenderer,
            cellRendererParams: {
              disabled: props.isRequiredDisabled,
              // if the whole UI is disabled, no need to show the tooltip
              disabledTooltip: props.disabled
                ? ''
                : t(
                    'direct_relations_nullable_only_text',
                    'Custom type fields can not have `required` attribute'
                  ),
              displayControl: 'checkbox',
            },
          },
        },
        {
          property: 'actions',
          label: '',
          defaultValue: '',
          optional: false,
          dataType: 'FIELD_ACTIONS',
          colDef: {
            width: 36,
            editable: false,
            resizable: false,
            sortable: false,
            suppressMovable: true,
            suppressSizeToFit: true,
            cellStyle: { padding: '0' },
            cellRenderer: FieldActionsCellRenderer,
            cellRendererParams: {
              disabled: props.disabled,
              onClick: props.onDelete,
            },
          },
        },
      ],
      customFunctions: [],
      dataSources: [],
    } as GridConfig;

    return tableConfig;
  }

  return {
    getGridConfig,
  };
};
