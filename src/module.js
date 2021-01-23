import { PanelPlugin } from '@grafana/data';
import { defaults } from './types';
import { SimplePanel } from './SimplePanel';
import { SimpleEditor } from './SimpleEditor';
export var plugin = new PanelPlugin(SimplePanel).setDefaults(defaults).setEditor(SimpleEditor);
//# sourceMappingURL=module.js.map
