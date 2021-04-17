import { PVGridColDef } from './PVGrid';

export const scTypes = ['au', 'br', 'de'] as const;
export type Market = typeof scTypes[number];

export const ScoreTypeValues = [
  'Awareness',
  'Children',
  'Consent',
  'DataBreach',
  'DataProtnOfficer',
  'IndividualsRights',
  'InformationYouHold',
  'International',
  'LawfulBasis',
  'PrivacyImpactAssessment',
  'PrivacyNotices',
  'SubjectAccessRequest',
] as const;

export type ScoreType = typeof ScoreTypeValues[number];

export const WidgetTypeValues = [
  'PVGDPRScore',
  'PVGrid',
  'PVDataGraph',
  'PVInfraGraph',
  'GremlinQueryEditor',
  'GremlinQueryResults',
  'AwarenessPieChart',
] as const;

export type WidgetType = typeof WidgetTypeValues[number];

export interface SimpleOptions {
  namespace: string;
  directUrl?: string;
  serviceUrl?: string;
  gridUrl?: string;
  isNeighbour: boolean;
  neighbourNamespace: string;
  scoreType?: ScoreType;
  showIcon?: boolean;
  showText?: boolean;
  showExplanation?: boolean;
  showGauge?: boolean;
  widgetType: WidgetType;
  dataType?: string;
  colSettings?: PVGridColDef[];
  customFilter?: string;
  filter?: string;
  dataSettings?: {
    dataType?: string;
    colSettings?: PVGridColDef[];
  };
}

export const defaults: SimpleOptions = {
  namespace: 'namespace',
  gridUrl: 'http://localhost:18443/gateway/sandbox/pvgdpr_server/home/agrecords',
  directUrl: 'http://localhost:18443/gateway/sandbox/pvgdpr_graph',
  serviceUrl: 'http://localhost:18443/gateway/sandbox/pvgdpr_server',
  isNeighbour: false,
  neighbourNamespace: 'neighbour',
  widgetType: 'PVGrid',
  dataSettings: {
    dataType: 'Person.Organisation',
    colSettings: [
      {
        field: '#Person.Organisation.Name',
        id: '#Person.Organisation.Name',
        name: 'Name',
        sortable: true,
      },
      {
        field: '#Person.Organisation.Type',
        id: '#Person.Organisation.Type',
        name: 'Type',
        sortable: true,
      },
    ],
  },
};

export interface PVNamespaceProps {
  url?: string;
  isNeighbour?: boolean;
  neighbourNamespace?: string;
  namespace?: string;
  subNamespace?: string;
}
