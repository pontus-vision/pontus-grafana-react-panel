import React from 'react';
import { Button, Portal, Segment } from 'semantic-ui-react';
import PVReportButton, { PVReportButtonProps } from './PVReportButton';

// import PVDatamaps from './PVDatamaps';

class PVGridReportButtonCellRenderer extends PVReportButton {
  constructor(props: PVReportButtonProps) {
    super(props);

    const parsedStaticData = props.colDef.id.split('@');

    this.state = {
      // colDef: undefined,
      // node: undefined,
      open: false,
      preview: '',
      ...props,
      buttonLabel: parsedStaticData[1].substring(1, parsedStaticData[1].length - 1),
      contextId: props.node && props.node.data ? props.node.data.id : undefined,
      templateText: parsedStaticData[2].substring(1, parsedStaticData[2].length - 1),
    };

    // this.state.context
  }

  onClick = () => {
    this.ensureData(this.state.contextId, this.state.templateText);
  };

  render() {
    return (
      <div>
        <Button
          className={'compact'}
          style={{
            border: 0,
            background: 'dodgerblue',
            marginRight: '3px',
            borderRadius: '5px',
            height: '24px',
          }}
          size={'small'}
          onClick={this.onClick}
        >
          {this.state.buttonLabel}
        </Button>

        <Portal onClose={this.handleClose} open={this.state.open}>
          <Segment
            style={{
              height: '50%',
              width: '50%',
              overflowX: 'auto',
              overflowY: 'auto',
              left: '30%',
              position: 'fixed',
              top: '20%',
              zIndex: 100000,
              backgroundColor: 'rgba(250,250,250,0.95)',
              padding: '10px',
            }}
          >
            <div dangerouslySetInnerHTML={{ __html: this.state.preview }} />
          </Segment>
        </Portal>
      </div>
    );
  }
}

export default PVGridReportButtonCellRenderer;
