import React, { PureComponent } from 'react';
import { FormField } from '@grafana/ui';
import { PanelEditorProps } from '@grafana/data';

import { SimpleOptions } from './types';
import PVGridColSelector from "./PVGridColSelector";
// import PVGridColSelector from './PVGridColSelector';

export class SimpleEditor extends PureComponent<PanelEditorProps<SimpleOptions>> {
  onTextChanged = ({ target }: any) => {
    this.props.onOptionsChange({ ...this.props.options, text: target.value });
  };

  render() {
    const { options } = this.props;

    return (
      <div className="section gf-form-group">
        <h5 className="section-heading">Display</h5>
        <FormField label="Text" labelWidth={5} inputWidth={20} type="text" onChange={this.onTextChanged} value={options.text || ''} />
        <PVGridColSelector namespace={"test"} />
        
      </div>
    );
  }
}
