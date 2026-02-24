import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  PlusCircle, 
  FileText, 
  ShieldCheck, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight,
  ArrowLeft,
  Fish,
  HelpCircle,
  Target,
  BarChart3,
  Download,
  Send,
  Loader2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { RCAProblem, Methodology, ImpactType } from './types';
import { geminiService } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Sidebar = () => (
  <aside className="w-64 bg-hy-blue text-zinc-300 border-r border-white/10 flex flex-col h-screen sticky top-0">
    <div className="p-6 border-b border-white/10">
      <div className="flex items-center gap-2 text-white font-bold text-xl tracking-tight">
        <ShieldCheck className="text-hy-gold" />
        <span>Hy-Plan</span>
      </div>
      <p className="text-[10px] uppercase tracking-widest mt-1 text-hy-gold/70 font-bold">Auditoría & ESG</p>
    </div>
    <nav className="flex-1 p-4 space-y-2">
      <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-white/5 hover:text-white transition-colors">
        <LayoutDashboard size={18} />
        <span>Dashboard</span>
      </Link>
      <Link to="/new" className="flex items-center gap-3 px-4 py-3 rounded-lg bg-hy-gold text-hy-blue font-bold hover:bg-yellow-400 transition-colors">
        <PlusCircle size={18} />
        <span>Nuevo Análisis</span>
      </Link>
      <div className="pt-4 pb-2 px-4 text-[10px] font-bold uppercase tracking-widest opacity-40">Metodologías</div>
      <div className="space-y-1">
        <div className="flex items-center gap-3 px-4 py-2 text-sm opacity-70 cursor-not-allowed">
          <Fish size={16} />
          <span>Ishikawa (Fishbone)</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 text-sm opacity-70 cursor-not-allowed">
          <HelpCircle size={16} />
          <span>5 Porqués</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 text-sm opacity-70 cursor-not-allowed">
          <Target size={16} />
          <span>5W2H (Plan de Acción)</span>
        </div>
      </div>
    </nav>
    <div className="p-6 border-t border-zinc-800 text-[10px] opacity-40">
      v1.0.0 | ISO 9001, 14001, 45001
    </div>
  </aside>
);

// --- Pages ---

const Dashboard = () => {
  const [problems, setProblems] = useState<RCAProblem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/problems')
      .then(res => res.json())
      .then(data => {
        setProblems(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-hy-blue" /></div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <header className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Dashboard de Hallazgos</h1>
          <p className="text-zinc-500 mt-1">Gestión centralizada de no conformidades, PQR y riesgos ESG.</p>
        </div>
        <div className="flex gap-4">
          <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="bg-amber-100 p-2 rounded-lg text-amber-600"><AlertTriangle size={20} /></div>
            <div>
              <div className="text-2xl font-bold">{problems.length}</div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Total Hallazgos</div>
            </div>
          </div>
          <div className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm flex items-center gap-4">
            <div className="bg-hy-gold/20 p-2 rounded-lg text-hy-blue"><CheckCircle2 size={20} /></div>
            <div>
              <div className="text-2xl font-bold">{problems.filter(p => p.planAccion?.length).length}</div>
              <div className="text-[10px] uppercase font-bold text-zinc-400">Con Plan de Acción</div>
            </div>
          </div>
        </div>
      </header>

      <div className="grid gap-4">
        {problems.length === 0 ? (
          <div className="bg-zinc-50 border-2 border-dashed border-zinc-200 rounded-2xl p-12 text-center">
            <div className="bg-zinc-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-zinc-400">
              <FileText size={32} />
            </div>
            <h3 className="text-lg font-medium text-zinc-900">No hay análisis registrados</h3>
            <p className="text-zinc-500 mb-6">Comienza tu primer análisis de causa raíz ahora.</p>
            <Link to="/new" className="inline-flex items-center gap-2 bg-hy-blue text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-900 transition-colors">
              <PlusCircle size={18} />
              <span>Crear Nuevo Análisis</span>
            </Link>
          </div>
        ) : (
          problems.map(p => (
            <Link key={p.id} to={`/analysis/${p.id}`} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                      p.analisis?.criticidad === 'Alta' ? "bg-red-100 text-red-700" :
                      p.analisis?.criticidad === 'Media' ? "bg-amber-100 text-amber-700" :
                      "bg-blue-100 text-blue-700"
                    )}>
                      {p.analisis?.criticidad || 'Pendiente'}
                    </span>
                    <span className="text-zinc-400 text-xs">{p.area}</span>
                    <span className="text-zinc-300">•</span>
                    <span className="text-zinc-400 text-xs">{new Date(p.fechaCreacion).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-zinc-900 group-hover:text-hy-blue transition-colors">{p.problema}</h3>
                  <div className="flex gap-2 mt-3">
                    {p.impactos.map(i => (
                      <span key={i} className="bg-zinc-100 text-zinc-600 px-2 py-1 rounded-md text-[10px] font-medium uppercase">{i}</span>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="text-zinc-400"><ChevronRight /></div>
                  {p.analisis && (
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className={cn(
                          "w-2 h-2 rounded-full",
                          i === 0 ? (p.analisis!.riesgoESG.ambiental > 3 ? "bg-red-500" : "bg-hy-gold") :
                          i === 1 ? (p.analisis!.riesgoESG.social > 3 ? "bg-red-500" : "bg-hy-gold") :
                          i === 2 ? (p.analisis!.riesgoESG.financiero > 3 ? "bg-red-500" : "bg-hy-gold") :
                          (p.analisis!.riesgoESG.gobernanza > 3 ? "bg-red-500" : "bg-hy-gold")
                        )} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

// --- RCA Editors ---

const IshikawaEditor = ({ data, onChange }: { data: any, onChange: (data: any) => void }) => {
  const categories = [
    { id: 'operacion', label: 'Operación' },
    { id: 'metodo', label: 'Método' },
    { id: 'manoDeObra', label: 'Mano de Obra' },
    { id: 'maquinaria', label: 'Maquinaria' },
    { id: 'materiales', label: 'Materiales' },
    { id: 'medioAmbiente', label: 'Medio Ambiente' },
    { id: 'medicion', label: 'Medición' },
    { id: 'gestion', label: 'Gestión' },
    { id: 'documentacion', label: 'Documentación' },
    { id: 'capacitacion', label: 'Capacitación' },
    { id: 'comunicacion', label: 'Comunicación' },
    { id: 'control', label: 'Control' },
    { id: 'proveedores', label: 'Proveedores' },
    { id: 'cultura', label: 'Cultura' },
  ];

  const addCause = (catId: string) => {
    const cause = prompt('Ingrese la causa para ' + catId);
    if (cause) {
      onChange({ ...data, [catId]: [...(data[catId] || []), cause] });
    }
  };

  const editCause = (catId: string, index: number) => {
    const current = data[catId][index];
    const cause = prompt('Editar causa:', current);
    if (cause !== null) {
      const newData = { ...data };
      newData[catId][index] = cause;
      onChange(newData);
    }
  };

  const removeCause = (catId: string, index: number) => {
    const newData = { ...data };
    newData[catId].splice(index, 1);
    onChange(newData);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map(cat => (
        <div key={cat.id} className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500">{cat.label}</h3>
            <button onClick={() => addCause(cat.id)} className="text-hy-blue hover:text-blue-800">
              <PlusCircle size={16} />
            </button>
          </div>
          <ul className="space-y-2">
            {data[cat.id]?.map((cause: string, idx: number) => (
              <li key={idx} className="text-sm text-zinc-700 bg-zinc-50 p-2 rounded flex justify-between items-start group">
                <span className="cursor-pointer flex-1" onClick={() => editCause(cat.id, idx)}>{cause}</span>
                <button onClick={() => removeCause(cat.id, idx)} className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                  <AlertTriangle size={14} />
                </button>
              </li>
            ))}
            {(!data[cat.id] || data[cat.id].length === 0) && (
              <li className="text-xs text-zinc-400 italic">Sin causas registradas</li>
            )}
          </ul>
        </div>
      ))}
    </div>
  );
};

const FiveWhysEditor = ({ data, onChange }: { data: any, onChange: (data: any) => void }) => {
  const updateWhy = (index: number, value: string) => {
    const newWhys = [...data.whys];
    newWhys[index] = value;
    onChange({ whys: newWhys });
  };

  const addWhy = () => {
    onChange({ whys: [...data.whys, ''] });
  };

  const removeWhy = (index: number) => {
    const newWhys = data.whys.filter((_: any, i: number) => i !== index);
    onChange({ whys: newWhys });
  };

  return (
    <div className="space-y-4">
      {data.whys.map((why: string, idx: number) => (
        <div key={idx} className="flex gap-4 items-start">
          <div className="bg-hy-gold/20 text-hy-blue w-8 h-8 rounded-full flex items-center justify-center font-bold shrink-0">
            {idx + 1}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 block">
                {idx === 0 ? '¿Por qué ocurre el problema?' : `¿Por qué ocurre el paso ${idx}?`}
              </label>
              {data.whys.length > 1 && (
                <button onClick={() => removeWhy(idx)} className="text-red-400 hover:text-red-600">
                  <AlertTriangle size={14} />
                </button>
              )}
            </div>
            <textarea
              className="w-full bg-white border border-zinc-200 rounded-xl p-3 outline-none focus:ring-2 focus:ring-hy-blue"
              rows={2}
              value={why}
              onChange={e => updateWhy(idx, e.target.value)}
              placeholder="Escribe la respuesta..."
            />
          </div>
        </div>
      ))}
      <button 
        onClick={addWhy}
        className="flex items-center gap-2 text-sm font-bold text-hy-blue hover:text-blue-800 transition-colors"
      >
        <PlusCircle size={18} />
        <span>Agregar nivel de profundidad</span>
      </button>
    </div>
  );
};

const NewAnalysis = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<{ methodology: Methodology; reason: string; score: number }[]>([]);
  
  const [formData, setFormData] = useState<RCAProblem>({
    problema: '',
    area: '',
    impactos: [],
    frecuencia: 'Primera vez',
    evidencia: '',
    fechaCreacion: new Date().toISOString(),
    ishikawaData: {
      operacion: [], metodo: [], manoDeObra: [], maquinaria: [], materiales: [],
      medioAmbiente: [], medicion: [], gestion: [], documentacion: [],
      capacitacion: [], comunicacion: [], control: [], proveedores: [], cultura: []
    },
    fiveWhysData: { whys: ['', '', '', '', ''] }
  });

  const handleImpactToggle = (impact: ImpactType) => {
    setFormData(prev => ({
      ...prev,
      impactos: prev.impactos?.includes(impact)
        ? prev.impactos.filter(i => i !== impact)
        : [...(prev.impactos || []), impact]
    }));
  };

  const getRecommendations = async () => {
    if (!formData.problema || !formData.area) return;
    setLoading(true);
    try {
      const recs = await geminiService.recommendMethodologies(formData);
      setRecommendations(recs);
      setStep(2);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const selectMethodology = async (methodology: Methodology) => {
    setLoading(true);
    setFormData(prev => ({ ...prev, metodologiaElegida: methodology }));
    try {
      if (methodology === 'Ishikawa') {
        const suggestions = await geminiService.suggestIshikawa(formData);
        setFormData(prev => ({ ...prev, ishikawaData: { ...prev.ishikawaData, ...suggestions } }));
      } else if (methodology === '5 Porqués') {
        const suggestions = await geminiService.suggestFiveWhys(formData);
        setFormData(prev => ({ ...prev, fiveWhysData: { whys: suggestions } }));
      }
      setStep(3);
    } catch (error) {
      console.error(error);
      setStep(3);
    } finally {
      setLoading(false);
    }
  };

  const finalizeAnalysis = async () => {
    setLoading(true);
    try {
      const analysis = await geminiService.analyzeProblem(formData);
      const actions = await geminiService.suggestActions(formData, analysis);
      
      const finalProblem = {
        ...formData,
        id: Math.random().toString(36).substring(7),
        analisis: analysis,
        planAccion: actions
      };

      await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalProblem)
      });

      navigate(`/analysis/${finalProblem.id}`);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Análisis de Hallazgo</h1>
        <div className="flex items-center gap-4 mt-4">
          {[1, 2, 3].map(s => (
            <div key={s} className="flex items-center gap-2">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-all",
                step === s ? "bg-emerald-600 text-white" : step > s ? "bg-emerald-100 text-emerald-600" : "bg-zinc-200 text-zinc-500"
              )}>
                {s}
              </div>
              <div className={cn("text-xs font-bold uppercase tracking-widest", step === s ? "text-zinc-900" : "text-zinc-400")}>
                {s === 1 ? 'Datos' : s === 2 ? 'Método' : 'Análisis'}
              </div>
              {s < 3 && <div className="w-8 h-px bg-zinc-200" />}
            </div>
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div 
            key="step1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-6 max-w-2xl"
          >
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-500">Problema Detectado</label>
              <textarea 
                className="w-full bg-white border border-zinc-200 rounded-xl p-4 focus:ring-2 focus:ring-hy-blue outline-none min-h-[120px]"
                placeholder="Describe el hallazgo o desviación..."
                value={formData.problema}
                onChange={e => setFormData({...formData, problema: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-zinc-500">Área o Proceso</label>
                <input 
                  type="text"
                  className="w-full bg-white border border-zinc-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-hy-blue"
                  value={formData.area}
                  onChange={e => setFormData({...formData, area: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold uppercase tracking-wider text-zinc-500">Frecuencia</label>
                <select 
                  className="w-full bg-white border border-zinc-200 rounded-xl p-4 outline-none focus:ring-2 focus:ring-hy-blue"
                  value={formData.frecuencia}
                  onChange={e => setFormData({...formData, frecuencia: e.target.value})}
                >
                  <option>Primera vez</option>
                  <option>Ocasional</option>
                  <option>Recurrente</option>
                  <option>Sistémico</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-zinc-500">Impacto</label>
              <div className="flex flex-wrap gap-2">
                {['calidad', 'ambiental', 'cliente', 'financiero', 'reputacional'].map(impact => (
                  <button
                    key={impact}
                    onClick={() => handleImpactToggle(impact as ImpactType)}
                    className={cn(
                      "px-4 py-2 rounded-full border text-sm font-medium transition-all",
                      formData.impactos?.includes(impact as ImpactType)
                        ? "bg-hy-blue border-hy-blue text-white shadow-md"
                        : "bg-white border-zinc-200 text-zinc-600 hover:border-zinc-300"
                    )}
                  >
                    {impact.charAt(0).toUpperCase() + impact.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={getRecommendations}
              disabled={loading || !formData.problema || !formData.area}
              className="w-full bg-hy-blue text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" /> : <ChevronRight size={20} />}
              <span>Siguiente: Evaluar Metodologías</span>
            </button>
          </motion.div>
        )}

        {step === 2 && recommendations.length > 0 && (
          <motion.div 
            key="step2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 max-w-2xl"
          >
            <div className="bg-hy-blue/5 border border-hy-blue/20 rounded-2xl p-6">
              <div className="flex items-center gap-3 text-hy-blue font-bold mb-2">
                <ShieldCheck className="text-hy-gold" />
                <span>Análisis de Idoneidad AI</span>
              </div>
              <p className="text-zinc-600 text-sm">Hemos evaluado las metodologías basándonos en la naturaleza del hallazgo. Selecciona la que mejor se adapte a tu necesidad.</p>
            </div>

            <div className="grid gap-4">
              {recommendations.map((rec, idx) => (
                <button
                  key={rec.methodology}
                  onClick={() => selectMethodology(rec.methodology)}
                  className={cn(
                    "flex flex-col p-6 rounded-2xl border-2 transition-all text-left group relative overflow-hidden",
                    idx === 0 ? "border-hy-blue bg-white shadow-lg ring-4 ring-hy-blue/5" : "border-zinc-200 bg-zinc-50 hover:border-zinc-300"
                  )}
                >
                  {idx === 0 && (
                    <div className="absolute top-0 right-0 bg-hy-gold text-hy-blue text-[10px] font-black px-3 py-1 rounded-bl-lg uppercase tracking-widest">
                      Recomendado
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <div className="font-bold text-xl text-zinc-900">{rec.methodology}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={cn("w-1.5 h-1.5 rounded-full mr-0.5", i < Math.round(rec.score/2) ? "bg-hy-gold" : "bg-zinc-200")} />
                          ))}
                        </div>
                        <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-tighter">Score: {rec.score}/10</span>
                      </div>
                    </div>
                    <ChevronRight className={idx === 0 ? "text-hy-blue" : "text-zinc-300"} />
                  </div>
                  <p className="text-sm text-zinc-600 leading-relaxed">{rec.reason}</p>
                </button>
              ))}
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div 
            key="step3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-zinc-900 text-white p-6 rounded-2xl">
              <h2 className="text-xl font-bold mb-2">Análisis Interactivo: {formData.metodologiaElegida}</h2>
              <p className="text-zinc-400 text-sm">Modifica las sugerencias de la IA o agrega tus propios hallazgos.</p>
            </div>

            {formData.metodologiaElegida === 'Ishikawa' && (
              <IshikawaEditor 
                data={formData.ishikawaData} 
                onChange={data => setFormData({...formData, ishikawaData: data})} 
              />
            )}

            {formData.metodologiaElegida === '5 Porqués' && (
              <FiveWhysEditor 
                data={formData.fiveWhysData} 
                onChange={data => setFormData({...formData, fiveWhysData: data})} 
              />
            )}

            {formData.metodologiaElegida === '5W2H' && (
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-2xl text-amber-800">
                <p className="font-medium">La metodología 5W2H se integrará directamente en la generación del plan de acción final.</p>
              </div>
            )}

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(2)}
                className="flex-1 bg-zinc-100 text-zinc-600 py-4 rounded-xl font-bold hover:bg-zinc-200 transition-all"
              >
                Cambiar Método
              </button>
              <button 
                onClick={finalizeAnalysis}
                className="flex-[2] bg-hy-blue text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-blue-900 shadow-lg shadow-hy-blue/20"
              >
                {loading ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={20} />}
                <span>Generar Informe & Plan de Acción</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Loader2 className="animate-spin text-hy-blue w-12 h-12 mb-4" />
          <p className="text-hy-blue font-bold">Procesando con IA...</p>
        </div>
      )}
    </div>
  );
};

const AnalysisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<RCAProblem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/problems/${id}`)
      .then(res => res.json())
      .then(data => {
        setProblem(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-hy-blue" /></div>;
  if (!problem || !problem.analisis) return <div>Error al cargar el análisis</div>;

  const { analisis, planAccion } = problem;

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      <button onClick={() => navigate('/')} className="flex items-center gap-2 text-zinc-500 hover:text-zinc-900 mb-8 transition-colors">
        <ArrowLeft size={18} />
        <span>Volver al Dashboard</span>
      </button>

      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 space-y-8">
          <header>
            <div className="flex items-center gap-3 mb-4">
              <span className={cn(
                "px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest",
                analisis.criticidad === 'Alta' ? "bg-red-100 text-red-700" :
                analisis.criticidad === 'Media' ? "bg-amber-100 text-amber-700" :
                "bg-blue-100 text-blue-700"
              )}>
                Criticidad {analisis.criticidad}
              </span>
              <span className="text-zinc-400 text-sm">{problem.area}</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-zinc-900 leading-tight">{problem.problema}</h1>
          </header>

          <section className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <FileText className="text-hy-blue" />
              Diagnóstico de Auditoría
            </h2>
            <div className="space-y-6">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Definición Técnica</h3>
                <p className="text-zinc-700 leading-relaxed font-medium">{analisis.definicionTecnica}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Impacto en SIG (ISO)</h3>
                <p className="text-zinc-600 leading-relaxed">{analisis.impactoSIG}</p>
              </div>
              <div className="bg-hy-blue text-white rounded-2xl p-6 border border-white/10">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-hy-gold mb-3">Causa Raíz Validada</h3>
                <p className="text-xl font-semibold leading-snug italic">"{analisis.causaRaiz}"</p>
              </div>

              {problem.metodologiaElegida === '5 Porqués' && problem.fiveWhysData && (
                <div className="bg-white border border-zinc-200 rounded-2xl p-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Cadena de 5 Porqués</h3>
                  <div className="space-y-3">
                    {problem.fiveWhysData.whys.map((why, i) => why && (
                      <div key={i} className="flex gap-3 items-center">
                        <div className="w-6 h-6 rounded-full bg-hy-gold/20 flex items-center justify-center text-[10px] font-bold text-hy-blue">{i+1}</div>
                        <p className="text-sm text-zinc-600">{why}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {problem.metodologiaElegida === 'Ishikawa' && problem.ishikawaData && (
                <div className="bg-white border border-zinc-200 rounded-2xl p-6">
                  <h3 className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-4">Análisis Ishikawa (Resumen)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(problem.ishikawaData).map(([key, value]) => (value as string[]).length > 0 && (
                      <div key={key} className="text-xs">
                        <span className="font-bold text-zinc-500 uppercase block mb-1">{key}</span>
                        <ul className="list-disc list-inside text-zinc-600">
                          {(value as string[]).map((v, i) => <li key={i}>{v}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </section>

          <section className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-zinc-900 mb-6 flex items-center gap-2">
              <Target className="text-hy-blue" />
              Plan de Acción Sugerido
            </h2>
            <div className="space-y-4">
              {planAccion?.map((action, idx) => (
                <div key={idx} className="border border-zinc-100 rounded-2xl p-5 hover:bg-zinc-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <span className={cn(
                      "px-2 py-0.5 rounded text-[10px] font-bold uppercase",
                      action.tipo === 'Correctiva' ? "bg-red-50 text-red-600" :
                      action.tipo === 'Preventiva' ? "bg-blue-50 text-blue-600" :
                      "bg-hy-gold/20 text-hy-blue"
                    )}>
                      {action.tipo}
                    </span>
                    <span className="text-xs text-zinc-400 font-medium">{action.fecha}</span>
                  </div>
                  <p className="text-zinc-900 font-medium mb-4">{action.descripcion}</p>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-zinc-400 block mb-1 uppercase tracking-tighter font-bold">Responsable</span>
                      <span className="text-zinc-700">{action.responsable}</span>
                    </div>
                    <div>
                      <span className="text-zinc-400 block mb-1 uppercase tracking-tighter font-bold">Indicador</span>
                      <span className="text-zinc-700">{action.indicador}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="bg-hy-blue text-white rounded-3xl p-8 shadow-xl">
            <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
              <BarChart3 className="text-hy-gold" />
              Riesgo ESG
            </h2>
            <div className="space-y-6">
              {Object.entries(analisis.riesgoESG).map(([key, value]) => (
                <div key={key}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-white/60">{key}</span>
                    <span className={cn(
                      "text-xs font-bold",
                      value > 3 ? "text-red-400" : "text-hy-gold"
                    )}>{value}/5</span>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={cn(
                        "h-full transition-all duration-1000",
                        value > 3 ? "bg-red-500" : "bg-hy-gold"
                      )} 
                      style={{ width: `${(value / 5) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="bg-white border border-zinc-200 rounded-3xl p-8 shadow-sm">
            <h2 className="text-lg font-bold text-zinc-900 mb-4">Resumen Ejecutivo</h2>
            <ul className="space-y-3">
              <li className="flex gap-2 text-sm text-zinc-600">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-hy-gold shrink-0" />
                <span>Hallazgo crítico en el proceso de {problem.area}.</span>
              </li>
              <li className="flex gap-2 text-sm text-zinc-600">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-hy-gold shrink-0" />
                <span>Impacto directo en {problem.impactos.join(", ")}.</span>
              </li>
              <li className="flex gap-2 text-sm text-zinc-600">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-hy-gold shrink-0" />
                <span>Metodología {problem.metodologiaElegida} aplicada exitosamente.</span>
              </li>
              <li className="flex gap-2 text-sm text-zinc-600">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-hy-gold shrink-0" />
                <span>Causa raíz identificada como falla sistémica.</span>
              </li>
              <li className="flex gap-2 text-sm text-zinc-600">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-hy-gold shrink-0" />
                <span>Plan de acción con 3 hitos de control.</span>
              </li>
            </ul>
            <button className="w-full mt-6 bg-zinc-100 text-zinc-900 py-3 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all">
              <Download size={18} />
              <span>Descargar Informe</span>
            </button>
          </section>
        </div>
      </div>

      <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-white border border-zinc-200 px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 z-40">
        <div className="flex items-center gap-2 text-zinc-500 text-sm">
          <Loader2 size={16} className="animate-spin text-hy-blue" />
          <span>Sincronizado con SIG</span>
        </div>
        <div className="w-px h-6 bg-zinc-200" />
        <button className="flex items-center gap-2 text-hy-blue font-bold text-sm hover:text-blue-800">
          <Send size={16} />
          <span>Enviar a Gerencia</span>
        </button>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex min-h-screen bg-zinc-50 font-sans selection:bg-emerald-100 selection:text-emerald-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/new" element={<NewAnalysis />} />
            <Route path="/analysis/:id" element={<AnalysisDetail />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
