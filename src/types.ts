import {PVGridColDef} from "./PVGrid";

export interface SimpleOptions {
  namespace: string;
  url: string;
  isNeighbour: boolean;
  neighbourNamespace: string;
  dataType?: string;
  colSettings?: PVGridColDef[];
  
}

export const defaults: SimpleOptions = {
  namespace: 'namespace',
  url: 'http://localhost:18443/gateway/sandbox/pvgdpr_server/home/agrecords',
  isNeighbour: false,
  neighbourNamespace: 'neighbour'
  
};
