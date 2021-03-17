import { PVGridColDef } from './PVGrid';

export interface SimpleOptions {
  namespace: string;
  url: string;
  isNeighbour: boolean;
  neighbourNamespace: string;
  scoreType?:
    | 'Awareness'
    | 'Children'
    | 'Consent'
    | 'DataBreach'
    | 'DataProtnOfficer'
    | 'IndividualsRights'
    | 'InformationYouHold'
    | 'International'
    | 'LawfulBasis'
    | 'PrivacyImpactAssessment'
    | 'PrivacyNotices'
    | 'SubjectAccessRequest';
  widgetType: 'Grid' | 'Network' | 'Score';
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
  url: 'http://localhost:18443/gateway/sandbox/pvgdpr_server/home/agrecords',
  isNeighbour: false,
  neighbourNamespace: 'neighbour',
  widgetType: 'Grid',
};
