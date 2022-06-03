import { PVGridColDef } from './PVGrid';
import PontusComponent, { PVComponentProps } from './PontusComponent';

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
  'PVReportPanel',
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
  useAws: boolean;
  awsAccessKeyId?: string;
  awsSecretKeyId?: string;
  dataSettings?: {
    dataType?: string;
    colSettings?: PVGridColDef[];
  };
  templateText?: string;
}

export const urlPrefix = `${PontusComponent.getUrlPrefix()}/`;
export const defaults: SimpleOptions = {
  namespace: 'namespace',
  gridUrl: `${urlPrefix}home/agrecords`,
  directUrl: `${urlPrefix}home/gremlin`,
  serviceUrl: urlPrefix,
  isNeighbour: false,
  neighbourNamespace: 'neighbour',
  widgetType: 'PVGrid',
  useAws: false,
  awsAccessKeyId: '',
  awsSecretKeyId: '',
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
  templateText: '',
};

export interface PVNamespaceProps extends PVComponentProps {
  url?: string;
  isNeighbour?: boolean;
  neighbourNamespace?: string;
  namespace?: string;
  subNamespace?: string;
}
