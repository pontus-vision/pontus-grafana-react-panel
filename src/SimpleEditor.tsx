import React, { PureComponent } from 'react';
import { FormField } from '@grafana/ui';
import { PanelEditorProps } from '@grafana/data';

import { SimpleOptions } from './types';
import PVGridColSelector from "./PVGridColSelector";
// import PVGridColSelector from './PVGridColSelector';

export class SimpleEditor extends PureComponent<PanelEditorProps<SimpleOptions>> {
  onNamespaceChanged = ({ target }: any) => {
    this.props.onOptionsChange({ ...this.props.options, namespace: target.value });
  };
  onURLChanged = ({ target }: any) => {
    this.props.onOptionsChange({ ...this.props.options, namespace: target.value });
  };

  render() {
    const { options } = this.props;

    return (
      <div className="section gf-form-group">
        <h5 className="section-heading">Display</h5>
        <FormField label="Namespace" labelWidth={10} inputWidth={20} type="text" onChange={this.onNamespaceChanged} value={options.namespace || ''} />
        <FormField label="Base URL" labelWidth={10} inputWidth={20} type="text" onChange={this.onURLChanged} value={options.url || ''} />
        <PVGridColSelector namespace={options.namespace} />
        
      </div>
    );
  }
}
