import { __assign, __extends } from "tslib";
import React from 'react';
import Axios from 'axios';
import { Button, Segment, Portal } from 'semantic-ui-react';
import { Base64 } from 'js-base64';
import PontusComponent from './PontusComponent';
var PVReportButton = /** @class */ (function (_super) {
    __extends(PVReportButton, _super);
    function PVReportButton(props) {
        var _this = _super.call(this, props) || this;
        _this.onClick = function () {
            _this.ensureData(_this.props.contextId, _this.props.templateText);
        };
        _this.getQuery = function (contextId, templateText) {
            return {
                gremlin: 'renderReportInBase64(pg_id,pg_templateText)',
                bindings: {
                    pg_id: contextId,
                    pg_templateText: templateText,
                },
            };
        };
        _this.ensureData = function (contextId, templateText) {
            if (!contextId || !templateText) {
                return;
            }
            if (_this.req) {
                _this.req.cancel();
            }
            var url = _this.url;
            if (_this.hRequest) {
                clearTimeout(_this.hRequest);
            }
            var self = _this;
            _this.hRequest = setTimeout(function () {
                var CancelToken = Axios.CancelToken;
                self.req = CancelToken.source();
                Axios.post(url, self.getQuery(contextId, templateText), {
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json',
                    },
                    cancelToken: self.req.token,
                })
                    .then(_this.onSuccess)
                    .catch(function (thrown) {
                    if (Axios.isCancel(thrown)) {
                        console.log('Request canceled', thrown.message);
                    }
                    else {
                        _this.onError(thrown);
                    }
                });
            }, 50);
        };
        _this.onError = function (err) {
            if (_this.errorCounter > 5) {
                console.error('error loading data:' + err);
            }
            else {
                _this.ensureData(_this.props.contextId, _this.props.templateText);
            }
            _this.errorCounter++;
        };
        _this.onSuccess = function (resp) {
            _this.errorCounter = 0;
            try {
                if (resp.status === 200) {
                    // let items = resp.data.result.data['@value'][0]['@value'];
                    var items = resp.data.result.data['@value'][0];
                    _this.setState({
                        open: !_this.state.open,
                        preview: Base64.decode(items),
                    });
                }
            }
            catch (e) {
                // e;
            }
            /*
             var data = {
             labels: ['Red', 'Green', 'Yellow'],
             datasets: [{
             data: [300, 50, 100],
             backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'],
             hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56']
             }]
             };
             */
            // this.onDataLoaded.notify({from: from, to: to});
        };
        _this.handleClose = function () { return _this.setState({ open: false }); };
        // this.columns = [
        //   {key: 'name', name: 'Name'},
        //   {key: 'street', name: 'Street'}
        // ];
        _this.errorCounter = 0;
        _this.url = PontusComponent.getGraphURL(_this.props);
        // this.url = "/gateway/sandbox/pvgdpr_graph";
        _this.state = __assign(__assign({}, props), { open: false, preview: '' });
        return _this;
    }
    PVReportButton.prototype.componentDidMount = function () {
        // super.componentDidMount();
        // this.props.glEventHub.on('NavPanelAwarenessPVGrid-pvgrid-on-click-row', this.onClickedPVGridAwarenessCampaign);
        this.setState({ open: false });
    };
    PVReportButton.prototype.componentWillUnmount = function () {
        // this.props.glEventHub.off('NavPanelAwarenessPVGrid-pvgrid-on-click-row', this.onClickedPVGridAwarenessCampaign);
        // super.componentWillUnmount();
    };
    PVReportButton.prototype.render = function () {
        return (React.createElement("div", null,
            React.createElement(Button, { className: 'compact', style: { border: 0, background: 'rgb(69,69,69)', marginRight: '3px' }, size: 'small', onClick: this.onClick }, this.props.buttonLabel),
            React.createElement(Portal, { onClose: this.handleClose, open: this.state.open },
                React.createElement(Segment, { style: {
                        height: '50%',
                        width: '50%',
                        overflowX: 'auto',
                        overflowY: 'auto',
                        left: '30%',
                        position: 'fixed',
                        top: '20%',
                        zIndex: 100000,
                        backgroundColor: '#696969',
                        padding: '10px',
                    } },
                    React.createElement("div", { dangerouslySetInnerHTML: { __html: this.state.preview } })))));
    };
    return PVReportButton;
}(PontusComponent));
export default PVReportButton;
//# sourceMappingURL=PVReportButton.js.map