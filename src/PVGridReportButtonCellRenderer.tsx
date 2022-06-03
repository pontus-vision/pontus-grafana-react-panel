import React from 'react';
import { Button, Portal, Segment } from 'semantic-ui-react';
import PVReportButton, { PVReportButtonProps } from './PVReportButton';
import PontusComponent from './PontusComponent';
// const html2pdf = require('html2pdf-jspdf2');
// import { jsPDF } from 'jspdf';
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

    this.url = PontusComponent.getRestTemplateRenderURL(props);
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
            <div
              style={{
                display: 'flex',
                flexWrap: 'nowrap',
                flexDirection: 'row',
                flexGrow: 1,
                // todo: check the theme:
                background: this.theme.isLight ? 'rgb(48,48,48)' : 'rgb(187,187,188)',
                width: '100%',
                // overflowX: 'auto',
                // overflowY: 'auto',
              }}
            >
              {/* <button
                onClick={() => {
                  const pdf = new jsPDF();
                  pdf.html(this.state.preview).save('report.pdf');
                  // html2pdf().from(this.state.preview).save();
                  // pdf.create(this.state.preview).toFile();
                  // generatePdf({ content: this.state.preview });
                  // doc.html(this.state.preview, { filename: 'report.pdf' }).save('report.pdf');
                }}
              >
                {'🖫'}
              </button > */}
            </div>
            <div dangerouslySetInnerHTML={{ __html: this.state.preview }} />
          </Segment>
        </Portal>
      </div>
    );
  }
}

export default PVGridReportButtonCellRenderer;
