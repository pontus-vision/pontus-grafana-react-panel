import React, { PureComponent } from 'react';
// import { LegacyForms, Switch } from '@grafana/ui';
import { PanelOptionsEditorProps } from '@grafana/data';

import { SimpleOptions } from './types';
import PontusComponent from './PontusComponent';
import { LegacyForms, Switch } from '@grafana/ui';

const { FormField } = LegacyForms;

// import PVGridColSelector from './PVGridColSelector';

export class SimpleEditor extends PureComponent<PanelOptionsEditorProps<SimpleOptions>> {
  onNamespaceChanged = ({ target }: any) => {
    this.props.onChange({ ...this.props.value, namespace: target.value });
  };
  onNeighbourNamespaceChanged = ({ target }: any) => {
    this.props.onChange({ ...this.props.value, neighbourNamespace: target.value });
  };
  onURLChanged = ({ target }: any) => {
    this.props.onChange({ ...this.props.value, url: target.value });
  };

  onFilterChanged = ({ target }: any) => {
    this.props.onChange({ ...this.props.value, filter: target.value });
  };
  onCustomFilterChanged = ({ target }: any) => {
    this.props.onChange({ ...this.props.value, customFilter: target.value });
  };
  onIsNeighbour = ({ target }: any) => {
    this.props.onChange({ ...this.props.value, isNeighbour: target.checked });
  };

  onColSelector = (val: any) => {
    this.props.onChange({ ...this.props.value, colSettings: val.colSettings, dataType: val.dataType });
  };

  onGraphMode = ({ target }: any) => {
    this.props.onChange({ ...this.props.value, graphMode: target.checked });
  };

  render() {
    const { value } = this.props;

    const neighbourNamespace = value.isNeighbour ? (
      <LegacyForms.FormField
        label={PontusComponent.t('Neighbour')!}
        labelWidth={10}
        inputWidth={20}
        type="text"
        onChange={this.onNeighbourNamespaceChanged}
        value={value.neighbourNamespace || ''}
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
          value={value.namespace || ''}
        />
        <LegacyForms.FormField
          label={PontusComponent.t('Base URL')!}
          labelWidth={10}
          inputWidth={20}
          type="text"
          onChange={this.onURLChanged}
          value={value.url || ''}
        />
        <Switch
          css={undefined}
          label={PontusComponent.t('Is Neighbour')!}
          checked={value.isNeighbour || false}
          onChange={this.onIsNeighbour}
        />
        <Switch
          css={undefined}
          label={PontusComponent.t('Graph Mode')!}
          checked={value.graphMode || false}
          onChange={this.onGraphMode}
        />
        {neighbourNamespace}
        {/*<PVGridColSelector*/}
        {/*  // namespace={value.namespace!}*/}
        {/*  // dataType={value.dataType}*/}
        {/*  // colSettings={value.colSettings}*/}
        {/*  onChange={this.onColSelector}*/}
        {/*  value={value}*/}
        {/*  context={value:''}*/}
        {/*/>*/}
        <FormField
          label={PontusComponent.t('Filter')!}
          labelWidth={10}
          inputWidth={20}
          type="text"
          onChange={this.onFilterChanged}
          value={value.filter || ''}
        />

        <LegacyForms.FormField
          label={PontusComponent.t('Custom Filter')!}
          labelWidth={10}
          inputWidth={20}
          type="text"
          onChange={this.onCustomFilterChanged}
          value={value.customFilter || ''}
        />
      </div>
    );
  }
}

// export const SimpleEditorFuncComp: FunctionComponent<PanelOptionsEditorProps<SimpleOptions>> = (
//   cprops: PanelOptionsEditorProps<SimpleOptions>,
//   context?: any
// ): ReactElement<any, any> | null => {
//   return <SimpleEditor value={cprops.value} onChange={()=>{}}  context={context} item={cprops.value}/>;
// };
