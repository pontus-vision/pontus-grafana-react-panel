export interface SimpleOptions {
  namespace: string;
  url: string;
}

export const defaults: SimpleOptions = {
  namespace: 'test',
  url: 'http://localhost:18443/gateway/sandbox/pvgdpr_graph/'
};
