export type ImpactType = 'calidad' | 'ambiental' | 'cliente' | 'financiero' | 'reputacional';
export type Criticality = 'Alta' | 'Media' | 'Baja';
export type Methodology = 'Ishikawa' | '5 Porqués' | '5W2H';
export type ActionType = 'Correctiva' | 'Preventiva' | 'Mejora';

export interface ESGRisk {
  ambiental: number; // 1-5
  social: number;
  financiero: number;
  gobernanza: number;
}

export interface Action {
  id: string;
  tipo: ActionType;
  descripcion: string;
  responsable: string;
  fecha: string;
  indicador: string;
  evidencia: string;
  costo?: number;
}

export interface AnalysisResult {
  diagnostico: string;
  definicionTecnica: string;
  impactoSIG: string;
  riesgoESG: ESGRisk;
  causasDirectas: string[];
  causasContribuyentes: string[];
  causaRaiz: string;
  criticidad: Criticality;
  metodologiaRecomendada: Methodology;
  motivoRecomendacion: string;
}

export interface IshikawaData {
  operacion: string[];
  metodo: string[];
  manoDeObra: string[];
  maquinaria: string[];
  materiales: string[];
  medioAmbiente: string[];
  medicion: string[];
  gestion: string[];
  documentacion: string[];
  capacitacion: string[];
  comunicacion: string[];
  control: string[];
  proveedores: string[];
  cultura: string[];
}

export interface FiveWhysData {
  whys: string[];
}

export interface RCAProblem {
  id?: string;
  problema: string;
  area: string;
  impactos: ImpactType[];
  frecuencia: string;
  evidencia: string;
  fechaCreacion: string;
  analisis?: AnalysisResult;
  planAccion?: Action[];
  metodologiaElegida?: Methodology;
  ishikawaData?: IshikawaData;
  fiveWhysData?: FiveWhysData;
}
