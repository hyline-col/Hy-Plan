import React, { useState, useEffect, useRef } from 'react';
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
import { RCAProblem, Methodology, ImpactType, Action } from './types';
import { geminiService } from './services/geminiService';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Components ---

const Sidebar = () => (
  <aside className="w-64 bg-hy-blue text-zinc-300 border-r border-white/10 flex flex-col h-screen sticky top-0 z-50">
    <div className="p-6 border-b border-white/10">
      <Link to="/" className="flex items-center gap-2 text-white font-bold text-2xl tracking-tighter">
        <div className="bg-hy-gold text-hy-blue p-1 rounded-lg">
          <ShieldCheck size={24} />
        </div>
        <span>Hy-Plan</span>
      </Link>
      <p className="text-[10px] uppercase tracking-[0.2em] mt-2 text-hy-gold font-black opacity-80">Intelligence SIG & ESG</p>
    </div>
    <nav className="flex-1 p-4 space-y-1">
      <Link to="/" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white/5 hover:text-white transition-all group">
        <LayoutDashboard size={18} className="group-hover:text-hy-gold transition-colors" />
        <span className="font-medium">Dashboard</span>
      </Link>
      <Link to="/new" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-hy-gold text-hy-blue font-bold hover:bg-yellow-400 transition-all shadow-lg shadow-hy-gold/10">
        <PlusCircle size={18} />
        <span>Nuevo Análisis</span>
      </Link>
      <div className="pt-6 pb-2 px-4 text-[10px] font-black uppercase tracking-widest text-white/30">Metodologías</div>
      <div className="space-y-1">
        <div className="flex items-center gap-3 px-4 py-2.5 text-sm opacity-50 cursor-not-allowed group">
          <Fish size={16} className="group-hover:text-hy-gold transition-colors" />
          <span>Ishikawa</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 text-sm opacity-50 cursor-not-allowed group">
          <HelpCircle size={16} className="group-hover:text-hy-gold transition-colors" />
          <span>5 Porqués</span>
        </div>
        <div className="flex items-center gap-3 px-4 py-2.5 text-sm opacity-50 cursor-not-allowed group">
          <Target size={16} className="group-hover:text-hy-gold transition-colors" />
          <span>5W2H</span>
        </div>
      </div>
    </nav>
    <div className="p-6 border-t border-white/10 text-[10px] font-bold opacity-30 tracking-widest">
      V1.2.0 | COMPLIANCE AI
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
  const [customCategories, setCustomCategories] = useState<string[]>([]);
  
  const defaultCategories = [
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

  // Initialize custom categories from data keys that are not in defaultCategories
  useEffect(() => {
    const defaultIds = defaultCategories.map(c => c.id);
    const existingCustom = Object.keys(data).filter(key => !defaultIds.includes(key));
    setCustomCategories(existingCustom);
  }, []);

  const addCategory = () => {
    const label = prompt('Nombre de la nueva categoría:');
    if (label) {
      const id = label.toLowerCase().replace(/\s+/g, '');
      if (!data[id]) {
        setCustomCategories([...customCategories, id]);
        onChange({ ...data, [id]: [] });
      }
    }
  };

  const removeCategory = (id: string) => {
    if (confirm(`¿Eliminar la categoría "${id}" y todas sus causas?`)) {
      const newData = { ...data };
      delete newData[id];
      setCustomCategories(customCategories.filter(c => c !== id));
      onChange(newData);
    }
  };

  const addCause = (catId: string) => {
    const cause = prompt('Ingrese la nueva causa para ' + catId);
    if (cause) {
      onChange({ ...data, [catId]: [...(data[catId] || []), cause] });
    }
  };

  const editCause = (catId: string, index: number) => {
    const current = data[catId][index];
    const cause = prompt('Editar causa:', current);
    if (cause !== null && cause.trim() !== '') {
      const newData = { ...data };
      newData[catId][index] = cause;
      onChange(newData);
    }
  };

  const removeCause = (catId: string, index: number) => {
    if (confirm('¿Eliminar esta causa?')) {
      const newData = { ...data };
      newData[catId].splice(index, 1);
      onChange(newData);
    }
  };

  const allCategories = [
    ...defaultCategories,
    ...customCategories.map(id => ({ id, label: id.charAt(0).toUpperCase() + id.slice(1), isCustom: true }))
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="bg-hy-blue/5 border border-hy-blue/10 p-4 rounded-2xl flex-1 mr-4">
          <p className="text-sm text-zinc-600">
            <strong>Análisis de Espina de Pescado:</strong> Identifique causas por categoría. Puede agregar categorías personalizadas si el hallazgo lo requiere.
          </p>
        </div>
        <button 
          onClick={addCategory}
          className="bg-hy-blue text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-blue-900 transition-all shadow-lg shadow-hy-blue/10 shrink-0"
        >
          <PlusCircle size={18} />
          <span>Nueva Categoría</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allCategories.map(cat => (
          <div key={cat.id} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative group/card">
            <div className="flex justify-between items-center mb-4 border-b border-zinc-100 pb-2">
              <h3 className="text-xs font-black uppercase tracking-widest text-hy-blue/60">{cat.label}</h3>
              <div className="flex gap-2">
                {(cat as any).isCustom && (
                  <button 
                    onClick={() => removeCategory(cat.id)}
                    className="text-zinc-300 hover:text-red-500 transition-colors"
                    title="Eliminar categoría"
                  >
                    <AlertTriangle size={14} />
                  </button>
                )}
                <button 
                  onClick={() => addCause(cat.id)} 
                  className="w-6 h-6 rounded-full bg-hy-blue/5 text-hy-blue flex items-center justify-center hover:bg-hy-blue hover:text-white transition-all"
                  title="Agregar causa"
                >
                  <PlusCircle size={14} />
                </button>
              </div>
            </div>
            <ul className="space-y-2">
              {data[cat.id]?.map((cause: string, idx: number) => (
                <li key={idx} className="text-sm text-zinc-700 bg-zinc-50 p-3 rounded-xl flex justify-between items-start group border border-transparent hover:border-hy-blue/20 transition-all">
                  <span className="flex-1 pr-2 leading-tight">{cause}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => editCause(cat.id, idx)} 
                      className="p-1 text-zinc-400 hover:text-hy-blue"
                      title="Editar"
                    >
                      <FileText size={14} />
                    </button>
                    <button 
                      onClick={() => removeCause(cat.id, idx)} 
                      className="p-1 text-zinc-400 hover:text-red-500"
                      title="Eliminar"
                    >
                      <AlertTriangle size={14} />
                    </button>
                  </div>
                </li>
              ))}
              {(!data[cat.id] || data[cat.id].length === 0) && (
                <li className="text-[10px] text-zinc-400 italic text-center py-2">Sin causas registradas</li>
              )}
            </ul>
          </div>
        ))}
      </div>
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
    if (confirm('¿Eliminar este nivel de análisis?')) {
      const newWhys = data.whys.filter((_: any, i: number) => i !== index);
      onChange({ whys: newWhys });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-hy-blue/5 border border-hy-blue/10 p-6 rounded-3xl mb-8">
        <h3 className="text-hy-blue font-bold flex items-center gap-2 mb-2">
          <HelpCircle size={20} />
          Instrucciones del Facilitador
        </h3>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Profundice en la causa raíz preguntando "¿Por qué?" sucesivamente. Edite las sugerencias de la IA o agregue sus propios hallazgos de campo para mayor precisión técnica.
        </p>
      </div>

      <div className="space-y-4">
        {data.whys.map((why: string, idx: number) => (
          <div key={idx} className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm hover:border-hy-blue/30 transition-all flex gap-4 items-start group">
            <div className="bg-hy-gold text-hy-blue w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 shadow-sm">
              {idx + 1}
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-hy-blue/40 block">
                  {idx === 0 ? 'Problema Inicial' : `Causa Nivel ${idx}`}
                </label>
                {data.whys.length > 1 && (
                  <button 
                    onClick={() => removeWhy(idx)} 
                    className="p-1 text-zinc-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                    title="Eliminar nivel"
                  >
                    <AlertTriangle size={16} />
                  </button>
                )}
              </div>
              <textarea
                className="w-full bg-zinc-50 border border-transparent rounded-xl p-4 outline-none focus:bg-white focus:border-hy-blue/20 transition-all text-zinc-800 font-medium leading-tight resize-none"
                rows={2}
                value={why}
                onChange={e => updateWhy(idx, e.target.value)}
                placeholder="Describa la causa técnica aquí..."
              />
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={addWhy}
        className="w-full py-4 border-2 border-dashed border-zinc-200 rounded-2xl flex items-center justify-center gap-3 text-zinc-400 font-bold hover:border-hy-blue hover:text-hy-blue hover:bg-hy-blue/5 transition-all"
      >
        <PlusCircle size={20} />
        <span>Agregar Nivel de Profundidad (6to Porqué)</span>
      </button>
    </div>
  );
};

const ActionPlanEditor = ({ actions, onChange }: { actions: Action[], onChange: (actions: Action[]) => void }) => {
  const addAction = () => {
    const newAction: Action = {
      id: `custom-${Date.now()}`,
      tipo: 'Correctiva',
      descripcion: '',
      responsable: '',
      indicador: '',
      evidencia: '',
      fecha: new Date().toISOString().split('T')[0]
    };
    onChange([...actions, newAction]);
  };

  const updateAction = (id: string, field: keyof Action, value: string) => {
    onChange(actions.map(a => a.id === id ? { ...a, [field]: value } : a));
  };

  const removeAction = (id: string) => {
    if (confirm('¿Eliminar esta acción del plan?')) {
      onChange(actions.filter(a => a.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-hy-blue/5 border border-hy-blue/10 p-6 rounded-3xl mb-8">
        <h3 className="text-hy-blue font-bold flex items-center gap-2 mb-2">
          <Target size={20} />
          Estrategia de Mitigación
        </h3>
        <p className="text-sm text-zinc-600 leading-relaxed">
          Defina las acciones necesarias para eliminar la causa raíz y prevenir la recurrencia. Asegúrese de asignar responsables técnicos y definir indicadores de éxito medibles.
        </p>
      </div>

      <div className="space-y-4">
        {actions.map((action) => (
          <div key={action.id} className="bg-white border border-zinc-200 rounded-2xl p-6 shadow-sm hover:border-hy-blue/30 transition-all group">
            <div className="flex justify-between items-start mb-6">
              <select 
                className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest outline-none",
                  action.tipo === 'Correctiva' ? "bg-red-100 text-red-700" :
                  action.tipo === 'Preventiva' ? "bg-blue-100 text-blue-700" :
                  "bg-hy-gold/20 text-hy-blue"
                )}
                value={action.tipo}
                onChange={e => updateAction(action.id, 'tipo', e.target.value as any)}
              >
                <option value="Correctiva">Correctiva</option>
                <option value="Preventiva">Preventiva</option>
                <option value="Mejora">Mejora</option>
              </select>
              <button 
                onClick={() => removeAction(action.id)}
                className="text-zinc-300 hover:text-red-500 transition-colors"
              >
                <AlertTriangle size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">Descripción de la Acción</label>
                <textarea 
                  className="w-full bg-zinc-50 border border-transparent rounded-xl p-4 outline-none focus:bg-white focus:border-hy-blue/20 transition-all text-sm font-medium"
                  rows={2}
                  value={action.descripcion}
                  onChange={e => updateAction(action.id, 'descripcion', e.target.value)}
                  placeholder="¿Qué se va a hacer?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">Responsable</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-50 border border-transparent rounded-xl p-3 outline-none focus:bg-white focus:border-hy-blue/20 transition-all text-sm"
                    value={action.responsable}
                    onChange={e => updateAction(action.id, 'responsable', e.target.value)}
                    placeholder="Cargo o Nombre"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">Fecha Compromiso</label>
                  <input 
                    type="date"
                    className="w-full bg-zinc-50 border border-transparent rounded-xl p-3 outline-none focus:bg-white focus:border-hy-blue/20 transition-all text-sm"
                    value={action.fecha}
                    onChange={e => updateAction(action.id, 'fecha', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">Indicador de Éxito</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-50 border border-transparent rounded-xl p-3 outline-none focus:bg-white focus:border-hy-blue/20 transition-all text-sm"
                    value={action.indicador}
                    onChange={e => updateAction(action.id, 'indicador', e.target.value)}
                    placeholder="Ej: % de reducción"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400 block mb-2">Evidencia de Cierre</label>
                  <input 
                    type="text"
                    className="w-full bg-zinc-50 border border-transparent rounded-xl p-3 outline-none focus:bg-white focus:border-hy-blue/20 transition-all text-sm"
                    value={action.evidencia}
                    onChange={e => updateAction(action.id, 'evidencia', e.target.value)}
                    placeholder="Ej: Registro fotográfico"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={addAction}
        className="w-full py-4 border-2 border-dashed border-zinc-200 rounded-2xl flex items-center justify-center gap-3 text-zinc-400 font-bold hover:border-hy-blue hover:text-hy-blue hover:bg-hy-blue/5 transition-all"
      >
        <PlusCircle size={20} />
        <span>Agregar Acción Adicional</span>
      </button>
    </div>
  );
};

const ReportPreview = ({ problem }: { problem: RCAProblem }) => {
  const reportRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const { default: jsPDF } = await import('jspdf');
    const { default: html2canvas } = await import('html2canvas');

    const canvas = await html2canvas(reportRef.current, {
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`HyPlan-Reporte-${problem.id}.pdf`);
  };

  return (
    <div className="space-y-8">
      <div className="bg-emerald-50 border border-emerald-200 p-6 rounded-3xl flex items-center gap-4 text-emerald-800">
        <div className="bg-emerald-500 text-white p-2 rounded-full">
          <CheckCircle2 size={24} />
        </div>
        <div>
          <h3 className="font-bold">¡Análisis Completado!</h3>
          <p className="text-sm opacity-80">El reporte ha sido generado con éxito. Revise el resumen ejecutivo antes de exportar.</p>
        </div>
      </div>

      <div ref={reportRef} className="bg-white border border-zinc-200 rounded-3xl p-10 shadow-sm space-y-10">
        <header className="flex justify-between items-start border-b border-zinc-100 pb-8">
          <div>
            <div className="flex items-center gap-2 text-hy-blue font-black text-2xl tracking-tighter mb-1">
              <ShieldCheck className="text-hy-gold" />
              <span>Hy-Plan</span>
            </div>
            <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-400 font-bold">Reporte de Análisis de Causa Raíz</p>
          </div>
          <div className="text-right">
            <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest mb-1">ID de Reporte</div>
            <div className="text-sm font-mono font-bold text-zinc-900">{problem.id}</div>
          </div>
        </header>

        <section className="grid grid-cols-2 gap-12">
          <div className="space-y-6">
            <div>
              <h3 className="text-[10px] font-black uppercase tracking-widest text-hy-blue/40 mb-2">Problema Detectado</h3>
              <p className="text-lg font-bold text-zinc-900 leading-tight">{problem.problema}</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Área</h3>
                <p className="text-sm font-bold text-zinc-700">{problem.area}</p>
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-1">Fecha</h3>
                <p className="text-sm font-bold text-zinc-700">{new Date(problem.fechaCreacion).toLocaleDateString()}</p>
              </div>
            </div>
          </div>
          <div className="bg-zinc-50 rounded-2xl p-6 border border-zinc-100">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-4">Riesgo ESG Estimado</h3>
            <div className="space-y-3">
              {problem.analisis && Object.entries(problem.analisis.riesgoESG).map(([key, val]) => (
                <div key={key} className="flex items-center gap-4">
                  <span className="text-[10px] font-bold uppercase text-zinc-500 w-20">{key}</span>
                  <div className="flex-1 h-1.5 bg-zinc-200 rounded-full overflow-hidden">
                    <div className="h-full bg-hy-blue" style={{ width: `${((val as number) / 5) * 100}%` }} />
                  </div>
                  <span className="text-[10px] font-bold text-hy-blue">{(val as number)}/5</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-hy-blue text-white rounded-3xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Target size={120} />
          </div>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-hy-gold mb-4">Causa Raíz Identificada</h3>
          <p className="text-2xl font-bold italic leading-tight">"{problem.analisis?.causaRaiz}"</p>
          <div className="mt-6 pt-6 border-t border-white/10 flex gap-8">
            <div>
              <span className="text-[10px] font-bold uppercase text-white/40 block mb-1">Metodología</span>
              <span className="text-sm font-bold">{problem.metodologiaElegida}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase text-white/40 block mb-1">Criticidad</span>
              <span className="text-sm font-bold">{problem.analisis?.criticidad}</span>
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-400 mb-6 border-b border-zinc-100 pb-2">Plan de Acción Estratégico</h3>
          <div className="space-y-4">
            {problem.planAccion?.map((action, i) => (
              <div key={i} className="flex gap-6 items-start border-b border-zinc-50 pb-4 last:border-0">
                <div className="w-10 h-10 rounded-xl bg-zinc-100 flex items-center justify-center text-xs font-black text-zinc-400 shrink-0">
                  0{i+1}
                </div>
                <div className="flex-1 grid grid-cols-3 gap-6">
                  <div className="col-span-2">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-black uppercase text-hy-blue">{action.tipo}</span>
                      <span className="text-zinc-300">•</span>
                      <span className="text-[10px] font-bold text-zinc-400">{action.fecha}</span>
                    </div>
                    <p className="text-sm font-bold text-zinc-900">{action.descripcion}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-zinc-400 block mb-1 uppercase">Responsable</span>
                    <p className="text-xs font-bold text-zinc-700">{action.responsable}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="pt-8 border-t border-zinc-100 flex justify-between items-center opacity-50">
          <div className="text-[8px] font-bold uppercase tracking-widest">Generado por Hy-Plan Compliance AI</div>
          <div className="text-[8px] font-bold uppercase tracking-widest">Confidencial - Uso Interno</div>
        </footer>
      </div>

      <div className="flex gap-4">
        <button 
          onClick={() => downloadPDF()}
          className="flex-1 bg-hy-blue text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-blue-900 shadow-xl shadow-hy-blue/20"
        >
          <Download size={20} />
          <span>Descargar Reporte PDF</span>
        </button>
        <button 
          onClick={() => window.location.href = '/'}
          className="px-8 bg-zinc-100 text-zinc-600 py-4 rounded-2xl font-bold hover:bg-zinc-200"
        >
          Finalizar y Salir
        </button>
      </div>
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

  const generateInitialAnalysis = async () => {
    setLoading(true);
    try {
      const analysis = await geminiService.analyzeProblem(formData);
      const actions = await geminiService.suggestActions(formData, analysis);
      
      setFormData(prev => ({
        ...prev,
        analisis: analysis,
        planAccion: actions
      }));
      setStep(4);
    } catch (error: any) {
      console.error(error);
      alert('Error al procesar el análisis: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const saveFinalReport = async () => {
    setLoading(true);
    try {
      const finalProblem = {
        ...formData,
        id: formData.id || `RCA-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      };

      const res = await fetch('/api/problems', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(finalProblem)
      });

      if (!res.ok) throw new Error('Error al guardar en base de datos');
      
      setFormData(finalProblem);
      setStep(5);
    } catch (error: any) {
      console.error(error);
      alert('Error al guardar el reporte: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto pb-24">
      <header className="mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Análisis de Hallazgo</h1>
        <div className="flex items-center gap-4 mt-6 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5].map(s => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center font-black text-xs transition-all",
                step === s ? "bg-hy-blue text-white shadow-lg shadow-hy-blue/20" : 
                step > s ? "bg-hy-gold text-hy-blue" : "bg-zinc-100 text-zinc-400"
              )}>
                {s}
              </div>
              <div className={cn("text-[10px] font-black uppercase tracking-widest", step === s ? "text-hy-blue" : "text-zinc-400")}>
                {s === 1 ? 'Datos' : s === 2 ? 'Método' : s === 3 ? 'Análisis' : s === 4 ? 'Plan' : 'Reporte'}
              </div>
              {s < 5 && <div className="w-6 h-px bg-zinc-200 mx-2" />}
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
            className="space-y-8 max-w-2xl"
          >
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Problema Detectado</label>
              <textarea 
                className="w-full bg-white border border-zinc-200 rounded-2xl p-6 focus:ring-4 focus:ring-hy-blue/5 focus:border-hy-blue outline-none min-h-[160px] text-lg font-medium transition-all"
                placeholder="Describa el hallazgo, PQR o no conformidad detectada..."
                value={formData.problema}
                onChange={e => setFormData({...formData, problema: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Área o Proceso</label>
                <input 
                  type="text"
                  className="w-full bg-white border border-zinc-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-hy-blue/5 focus:border-hy-blue transition-all font-bold"
                  value={formData.area}
                  onChange={e => setFormData({...formData, area: e.target.value})}
                  placeholder="Ej: Producción, Logística..."
                />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Frecuencia</label>
                <select 
                  className="w-full bg-white border border-zinc-200 rounded-2xl p-4 outline-none focus:ring-4 focus:ring-hy-blue/5 focus:border-hy-blue transition-all font-bold appearance-none"
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

            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Impacto en el Negocio</label>
              <div className="flex flex-wrap gap-3">
                {['calidad', 'ambiental', 'cliente', 'financiero', 'reputacional'].map(impact => (
                  <button
                    key={impact}
                    onClick={() => handleImpactToggle(impact as ImpactType)}
                    className={cn(
                      "px-6 py-3 rounded-xl border-2 text-xs font-black uppercase tracking-widest transition-all",
                      formData.impactos?.includes(impact as ImpactType)
                        ? "bg-hy-blue border-hy-blue text-white shadow-xl shadow-hy-blue/20 scale-105"
                        : "bg-white border-zinc-100 text-zinc-400 hover:border-zinc-200"
                    )}
                  >
                    {impact}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={getRecommendations}
              disabled={loading || !formData.problema || !formData.area}
              className="w-full bg-hy-blue text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-900 disabled:opacity-50 shadow-2xl shadow-hy-blue/20 transition-all"
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
            <div className="bg-hy-blue/5 border border-hy-blue/20 rounded-3xl p-8">
              <div className="flex items-center gap-3 text-hy-blue font-black mb-3">
                <ShieldCheck className="text-hy-gold" size={28} />
                <span className="text-xl tracking-tight">Análisis de Idoneidad AI</span>
              </div>
              <p className="text-zinc-600 leading-relaxed">Hemos evaluado las metodologías basándonos en la naturaleza del hallazgo y los impactos SIG seleccionados. Seleccione la ruta de análisis más efectiva.</p>
            </div>

            <div className="grid gap-6">
              {recommendations.map((rec, idx) => (
                <button
                  key={rec.methodology}
                  onClick={() => selectMethodology(rec.methodology)}
                  className={cn(
                    "flex flex-col p-8 rounded-3xl border-2 transition-all text-left group relative overflow-hidden",
                    idx === 0 ? "border-hy-blue bg-white shadow-2xl ring-8 ring-hy-blue/5" : "border-zinc-100 bg-zinc-50 hover:border-zinc-200"
                  )}
                >
                  {idx === 0 && (
                    <div className="absolute top-0 right-0 bg-hy-gold text-hy-blue text-[10px] font-black px-4 py-2 rounded-bl-2xl uppercase tracking-[0.2em]">
                      Recomendado
                    </div>
                  )}
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="font-black text-2xl text-zinc-900 tracking-tight">{rec.methodology}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className={cn("w-2 h-2 rounded-full", i < Math.round(rec.score/2) ? "bg-hy-gold" : "bg-zinc-200")} />
                          ))}
                        </div>
                        <span className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">Score: {rec.score}/10</span>
                      </div>
                    </div>
                    <div className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-all",
                      idx === 0 ? "bg-hy-blue text-white" : "bg-zinc-200 text-zinc-400 group-hover:bg-zinc-300"
                    )}>
                      <ChevronRight size={20} />
                    </div>
                  </div>
                  <p className="text-sm text-zinc-500 leading-relaxed font-medium">{rec.reason}</p>
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
            <div className="bg-hy-blue text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <FileText size={120} />
              </div>
              <h2 className="text-2xl font-black mb-2 tracking-tight">Fase de Análisis: {formData.metodologiaElegida}</h2>
              <p className="text-white/60 text-sm font-medium">Modifique las sugerencias de la IA o agregue sus propios hallazgos técnicos de campo.</p>
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
              <div className="bg-amber-50 border border-amber-200 p-8 rounded-3xl text-amber-800 flex gap-4">
                <AlertTriangle className="shrink-0" />
                <p className="font-bold leading-tight">La metodología 5W2H se integrará directamente en la generación del plan de acción final para maximizar la operatividad.</p>
              </div>
            )}

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(2)}
                className="px-8 bg-zinc-100 text-zinc-600 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
              >
                Volver
              </button>
              <button 
                onClick={generateInitialAnalysis}
                className="flex-1 bg-hy-blue text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-900 shadow-2xl shadow-hy-blue/20"
              >
                {loading ? <Loader2 className="animate-spin" /> : <ChevronRight size={20} />}
                <span>Siguiente: Plan de Acción</span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 4 && formData.planAccion && (
          <motion.div 
            key="step4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <div className="bg-hy-blue text-white p-8 rounded-3xl shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <Target size={120} />
              </div>
              <h2 className="text-2xl font-black mb-2 tracking-tight">Fase 4: Plan de Acción</h2>
              <p className="text-white/60 text-sm font-medium">Defina las contramedidas para la causa raíz: <span className="text-hy-gold italic">"{formData.analisis?.causaRaiz}"</span></p>
            </div>

            <ActionPlanEditor 
              actions={formData.planAccion} 
              onChange={actions => setFormData({...formData, planAccion: actions})} 
            />

            <div className="flex gap-4">
              <button 
                onClick={() => setStep(3)}
                className="px-8 bg-zinc-100 text-zinc-600 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-zinc-200 transition-all"
              >
                Volver
              </button>
              <button 
                onClick={saveFinalReport}
                className="flex-1 bg-hy-blue text-white py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-blue-900 shadow-2xl shadow-hy-blue/20"
              >
                {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck size={20} />}
                <span>Finalizar y Generar Reporte</span>
              </button>
            </div>
          </motion.div>
        )}

        {step === 5 && (
          <motion.div 
            key="step5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ReportPreview problem={formData} />
          </motion.div>
        )}
      </AnimatePresence>

      {loading && (
        <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex flex-col items-center justify-center z-50">
          <Loader2 className="animate-spin text-hy-blue w-12 h-12 mb-4" />
          <p className="text-hy-blue font-black uppercase tracking-widest text-xs">Sincronizando con Compliance AI...</p>
        </div>
      )}
    </div>
  );
};

const AnalysisDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [problem, setProblem] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/api/problems/${id}`);
        if (!res.ok) throw new Error('No se pudo encontrar el análisis');
        const data = await res.json();
        if (data.error) throw new Error(data.error);
        setProblem(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-full">
      <Loader2 className="animate-spin text-hy-blue w-12 h-12 mb-4" />
      <p className="text-zinc-500 font-medium animate-pulse">Cargando reporte Hy-Plan...</p>
    </div>
  );

  if (error || !problem || !problem.analisis) return (
    <div className="flex flex-col items-center justify-center h-full p-12 text-center">
      <div className="bg-red-50 p-6 rounded-full mb-6">
        <AlertTriangle className="text-red-500" size={48} />
      </div>
      <h2 className="text-2xl font-bold text-zinc-900 mb-2">Error al cargar el análisis</h2>
      <p className="text-zinc-500 max-w-md mx-auto mb-8">
        {error || 'No se pudo encontrar el registro solicitado o los datos están incompletos en el sistema.'}
      </p>
      <button 
        onClick={() => navigate('/')} 
        className="bg-hy-blue text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-hy-blue/20 hover:bg-blue-900 transition-all"
      >
        Volver al Dashboard
      </button>
    </div>
  );

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
              {Object.entries(analisis.riesgoESG).map(([key, val]) => {
                const value = val as number;
                return (
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
                );
              })}
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
