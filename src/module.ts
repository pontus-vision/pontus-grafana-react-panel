import { PanelPlugin } from '@grafana/data';
import { defaults, SimpleOptions } from './types';
import { SimplePanel } from './SimplePanel';
import PontusComponent from './PontusComponent';
import PVGridColSelector from './PVGridColSelector';
// import { SimpleEditorFuncComp } from './SimpleEditor';

// export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setDefaults(defaults).setEditor(SimpleEditor);
export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel);
plugin.setPanelOptions(builder => {
  builder.addTextInput({
    path: 'namespace',
    name: PontusComponent.t('Self Namespace')!,
    defaultValue: defaults.namespace,
    // description: 'namespace',
    settings: undefined,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return true;
    },
  });
  builder.addBooleanSwitch({
    path: 'isNeighbour',
    name: PontusComponent.t('Is Neighbour')!,
    defaultValue: defaults.isNeighbour,
    // description: 'isNeighbour',
    settings: undefined,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return true;
    },
  });
  builder.addTextInput({
    path: 'neighbourNamespace',
    name: PontusComponent.t('Neighbour')!,
    defaultValue: defaults.neighbourNamespace,
    // description: 'neighbourNamespace',
    settings: undefined,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return currentConfig.isNeighbour;
    },
  });
  builder.addTextInput({
    path: 'url',
    name: PontusComponent.t('Base URL')!,
    defaultValue: defaults.url,
    // description: 'url',
    settings: undefined,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return true;
    },
  });
  builder.addBooleanSwitch({
    path: 'graphMode',
    name: PontusComponent.t('Graph Mode')!,
    defaultValue: defaults.graphMode,
    // description: 'graphMode',
    settings: undefined,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return currentConfig.isNeighbour;
    },
  });

  builder.addTextInput({
    path: 'filter',
    name: PontusComponent.t('Filter')!,
    defaultValue: defaults.filter,
    // description: 'filter',
    settings: undefined,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return !currentConfig.graphMode;
    },
  });

  builder.addTextInput({
    path: 'customFilter',
    // description: PontusComponent.t('Custom Filter')!,
    defaultValue: defaults.customFilter,
    name: PontusComponent.t('Custom Filter')!,
    settings: undefined,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return !currentConfig.graphMode;
    },
  });

  builder.addCustomEditor({
    id: 'PVGridColSelector',
    name: PontusComponent.t('Data Settings')!,
    path: 'dataSettings',
    // description: '',
    settings: {},
    defaultValue: defaults.dataSettings,
    editor: PVGridColSelector,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return !currentConfig.graphMode;
    },
  });
});
// plugin.setDefaults(defaults);
// plugin.setEditor(SimpleEditor);
