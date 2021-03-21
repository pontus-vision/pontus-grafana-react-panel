import { PanelPlugin, SelectableValue } from '@grafana/data';
import { defaults, ScoreType, ScoreTypeValues, SimpleOptions, WidgetType, WidgetTypeValues } from './types';
import { SimplePanel } from './SimplePanel';
import PontusComponent from './PontusComponent';
import PVGridColSelector from './PVGridColSelector';
// import { SimpleEditorFuncComp } from './SimpleEditor';

// export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setDefaults(defaults).setEditor(SimpleEditor);
export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel);

export const getScoreTypeOptions = (): Array<SelectableValue<ScoreType>> => {
  const retVal: Array<SelectableValue<ScoreType>> = [];
  ScoreTypeValues.forEach((value) => {
    retVal.push({ value: value, label: PontusComponent.t(`NavPanel${value}Popup_title`) });
  });
  return retVal;
};
export const getWidgetTypeOptions = (): Array<SelectableValue<WidgetType>> => {
  const retVal: Array<SelectableValue<WidgetType>> = [];
  WidgetTypeValues.forEach((value) => {
    retVal.push({ value: value, label: PontusComponent.t(value) });
  });
  return retVal;
};

plugin.setPanelOptions((builder) => {
  builder.addSelect({
    path: 'widgetType',
    name: PontusComponent.t('Type')!,
    settings: {
      allowCustomValue: false,
      options: getWidgetTypeOptions(),
    },
    defaultValue: 'PVGrid',
    showIf: (currentOptions: SimpleOptions, data) => {
      return true;
    },
  });
  builder.addSelect({
    path: 'scoreType',
    name: PontusComponent.t('Score Type')!,
    settings: {
      allowCustomValue: false,
      options: getScoreTypeOptions(),
    },
    defaultValue: 'Awareness',
    showIf: (currentOptions: SimpleOptions, data) => {
      return currentOptions.widgetType === 'PVGDPRScore';
    },
  });
  builder.addBooleanSwitch({
    path: 'showIcon',
    name: PontusComponent.t('Show Score Icon')!,
    settings: undefined,
    defaultValue: true,
    showIf: (currentOptions: SimpleOptions, data) => {
      return currentOptions.widgetType === 'PVGDPRScore';
    },
  });
  builder.addBooleanSwitch({
    path: 'showText',
    name: PontusComponent.t('Show Score Text')!,
    settings: undefined,
    defaultValue: true,
    showIf: (currentOptions: SimpleOptions, data) => {
      return currentOptions.widgetType === 'PVGDPRScore';
    },
  });
  builder.addBooleanSwitch({
    path: 'showExplanation',
    name: PontusComponent.t('Show Score Explanation')!,
    settings: undefined,
    defaultValue: true,
    showIf: (currentOptions: SimpleOptions, data) => {
      return currentOptions.widgetType === 'PVGDPRScore';
    },
  });
  builder.addBooleanSwitch({
    path: 'showGauge',
    name: PontusComponent.t('Show Score Gauge')!,
    settings: undefined,
    defaultValue: true,
    showIf: (currentOptions: SimpleOptions, data) => {
      return currentOptions.widgetType === 'PVGDPRScore';
    },
  });
  builder.addTextInput({
    path: 'namespace',
    name: PontusComponent.t('Self Namespace')!,
    defaultValue: defaults.namespace,
    // description: 'namespace',
    settings: undefined,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return currentConfig.widgetType !== 'PVGDPRScore';
    },
  });
  builder.addBooleanSwitch({
    path: 'isNeighbour',
    name: PontusComponent.t('Is Neighbour')!,
    defaultValue: defaults.isNeighbour,
    // description: 'isNeighbour',
    settings: undefined,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return currentConfig.widgetType !== 'PVGDPRScore';
    },
  });
  builder.addTextInput({
    path: 'neighbourNamespace',
    name: PontusComponent.t('Neighbour')!,
    defaultValue: defaults.neighbourNamespace,
    // description: 'neighbourNamespace',
    settings: undefined,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return currentConfig.widgetType !== 'PVGDPRScore' && currentConfig.isNeighbour;
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

  // builder.addBooleanSwitch({
  //   path: 'graphMode',
  //   name: PontusComponent.t('Graph Mode')!,
  //   defaultValue: defaults.graphMode,
  //   // description: 'graphMode',
  //   settings: undefined,
  //   showIf: (currentConfig: SimpleOptions): boolean | undefined => {
  //     return currentConfig.isNeighbour;
  //   },
  // });

  builder.addTextInput({
    path: 'filter',
    name: PontusComponent.t('Filter')!,
    defaultValue: defaults.filter,
    // description: 'filter',
    settings: undefined,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return currentConfig.widgetType === 'PVGrid';
    },
  });

  builder.addTextInput({
    path: 'customFilter',
    // description: PontusComponent.t('Custom Filter')!,
    defaultValue: defaults.customFilter,
    name: PontusComponent.t('Custom Filter')!,
    settings: undefined,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return currentConfig.widgetType === 'PVGrid';
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
      return currentConfig.widgetType === 'PVGrid';
    },
  });
});
// plugin.setDefaults(defaults);
// plugin.setEditor(SimpleEditor);
