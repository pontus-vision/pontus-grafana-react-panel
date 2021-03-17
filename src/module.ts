import { PanelPlugin } from '@grafana/data';
import { defaults, SimpleOptions } from './types';
import { SimplePanel } from './SimplePanel';
import PontusComponent from './PontusComponent';
import PVGridColSelector from './PVGridColSelector';
// import { SimpleEditorFuncComp } from './SimpleEditor';

// export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setDefaults(defaults).setEditor(SimpleEditor);
export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel);
plugin.setPanelOptions((builder) => {
  builder.addRadio({
    path: 'widgetType',
    name: PontusComponent.t('Type')!,
    settings: {
      allowCustomValue: false,
      options: [
        { value: 'Network', label: PontusComponent.t('Network') },
        { value: 'Grid', label: PontusComponent.t('Grid') },
        { value: 'Score', label: PontusComponent.t('Score') },
      ],
    },
    defaultValue: 'Grid',
    showIf: (currentOptions: SimpleOptions, data) => {
      return true;
    },
  });
  builder.addRadio({
    path: 'scoreType',
    name: PontusComponent.t('Score Type')!,
    settings: {
      allowCustomValue: false,
      options: [
        { value: 'Awareness', label: PontusComponent.t('NavPanelAwarenessPopup_title') },
        { value: 'Children', label: PontusComponent.t('NavPanelChildrenPopup_title') },
        { value: 'Consent', label: PontusComponent.t('NavPanelConsentPopup_title') },
        { value: 'DataBreach', label: PontusComponent.t('NavPanelDataBreachPopup_title') },
        { value: 'DataProtnOfficer', label: PontusComponent.t('NavPanelDataProtnOfficerPopup_title') },
        { value: 'IndividualsRights', label: PontusComponent.t('NavPanelIndividualsRightsPopup_title') },
        { value: 'InformationYouHold', label: PontusComponent.t('NavPanelInformationYouHoldPopup_title') },
        { value: 'International', label: PontusComponent.t('NavPanelInternationalPopup_title') },
        { value: 'LawfulBasis', label: PontusComponent.t('NavPanelLawfulBasisPopup_title') },
        { value: 'PrivacyImpactAssessment', label: PontusComponent.t('NavPanelPrivacyImpactAssessmentPopup_title') },
        { value: 'PrivacyNotices', label: PontusComponent.t('NavPanelPrivacyNoticesPopup_title') },
        { value: 'SubjectAccessRequest', label: PontusComponent.t('NavPanelSubjectAccessRequestPopup_title') },
      ],
    },
    defaultValue: 'Awareness',
    showIf: (currentOptions: SimpleOptions, data) => {
      return currentOptions.widgetType === 'Score';
    },
  });

  builder.addTextInput({
    path: 'namespace',
    name: PontusComponent.t('Self Namespace')!,
    defaultValue: defaults.namespace,
    // description: 'namespace',
    settings: undefined,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return currentConfig.widgetType !== 'Score';
    },
  });
  builder.addBooleanSwitch({
    path: 'isNeighbour',
    name: PontusComponent.t('Is Neighbour')!,
    defaultValue: defaults.isNeighbour,
    // description: 'isNeighbour',
    settings: undefined,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return currentConfig.widgetType !== 'Score';
    },
  });
  builder.addTextInput({
    path: 'neighbourNamespace',
    name: PontusComponent.t('Neighbour')!,
    defaultValue: defaults.neighbourNamespace,
    // description: 'neighbourNamespace',
    settings: undefined,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return currentConfig.widgetType !== 'Score' && currentConfig.isNeighbour;
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
      return currentConfig.widgetType === 'Grid';
    },
  });

  builder.addTextInput({
    path: 'customFilter',
    // description: PontusComponent.t('Custom Filter')!,
    defaultValue: defaults.customFilter,
    name: PontusComponent.t('Custom Filter')!,
    settings: undefined,
    showIf: (currentConfig: SimpleOptions): boolean | undefined => {
      return currentConfig.widgetType === 'Grid';
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
      return currentConfig.widgetType === 'Grid';
    },
  });
});
// plugin.setDefaults(defaults);
// plugin.setEditor(SimpleEditor);
