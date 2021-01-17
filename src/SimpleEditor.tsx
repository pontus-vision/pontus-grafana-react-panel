import React, { PureComponent } from 'react';
// import { LegacyForms, Switch } from '@grafana/ui';
import { PanelEditorProps } from '@grafana/data';

import { SimpleOptions } from './types';
import PVGridColSelector from './PVGridColSelector';
import PontusComponent from './PontusComponent';
import { PVGridColDef } from './PVGrid';
import { Switch } from '@grafana/ui';
import { LegacyForms } from '@grafana/ui';
const { FormField } = LegacyForms;

// import PVGridColSelector from './PVGridColSelector';

export class SimpleEditor extends PureComponent<PanelEditorProps<SimpleOptions>> {
  onNamespaceChanged = ({ target }: any) => {
    this.props.onOptionsChange({ ...this.props.options, namespace: target.value });
  };
  onNeighbourNamespaceChanged = ({ target }: any) => {
    this.props.onOptionsChange({ ...this.props.options, neighbourNamespace: target.value });
  };
  onURLChanged = ({ target }: any) => {
    this.props.onOptionsChange({ ...this.props.options, url: target.value });
  };

  onFilterChanged = ({ target }: any) => {
    this.props.onOptionsChange({ ...this.props.options, filter: target.value });
  };
  onCustomFilterChanged = ({ target }: any) => {
    this.props.onOptionsChange({ ...this.props.options, customFilter: target.value });
  };
  onIsNeighbour = ({ target }: any) => {
    this.props.onOptionsChange({ ...this.props.options, isNeighbour: target.checked });
  };

  onColSelector = (val: { dataType?: string; colSettings?: PVGridColDef[] }) => {
    this.props.onOptionsChange({ ...this.props.options, colSettings: val.colSettings, dataType: val.dataType });
  };

  render() {
    const { options } = this.props;

    const neighbourNamespace = options.isNeighbour ? (
      <LegacyForms.FormField
        label={PontusComponent.t('Neighbour')!}
        labelWidth={10}
        inputWidth={20}
        type="text"
        onChange={this.onNeighbourNamespaceChanged}
        value={options.neighbourNamespace || ''}
      />
    ) : (
      <div />
    );

    return (
      <div className="section gf-form-group">
        <h5 className="section-heading">{PontusComponent.t('Display')!}</h5>
        <LegacyForms.FormField
          label={PontusComponent.t('Self Namespace')!}
          labelWidth={10}
          inputWidth={20}
          type="text"
          onChange={this.onNamespaceChanged}
          value={options.namespace || ''}
        />
        <LegacyForms.FormField
          label={PontusComponent.t('Base URL')!}
          labelWidth={10}
          inputWidth={20}
          type="text"
          onChange={this.onURLChanged}
          value={options.url || ''}
        />
        <Switch
          css={undefined}
          label={PontusComponent.t('Is Neighbour')!}
          checked={options.isNeighbour || false}
          onChange={this.onIsNeighbour}
        />
        {neighbourNamespace}
        <PVGridColSelector
          namespace={options.namespace}
          dataType={options.dataType}
          colSettings={options.colSettings}
          onChange={this.onColSelector}
        />
        <FormField
          label={PontusComponent.t('Filter')!}
          labelWidth={10}
          inputWidth={20}
          type="text"
          onChange={this.onFilterChanged}
          value={options.filter || ''}
        />

        <LegacyForms.FormField
          label={PontusComponent.t('Custom Filter')!}
          labelWidth={10}
          inputWidth={20}
          type="text"
          onChange={this.onCustomFilterChanged}
          value={options.customFilter || ''}
        />
      </div>
    );
  }
}
