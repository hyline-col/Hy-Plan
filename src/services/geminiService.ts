import { GoogleGenAI, Type } from "@google/genai";
import { RCAProblem, AnalysisResult, Methodology, Action } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const geminiService = {
  async recommendMethodologies(problem: Partial<RCAProblem>): Promise<{ methodology: Methodology; reason: string; score: number }[]> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analiza este problema de gestión organizacional y evalúa la idoneidad de tres metodologías: Ishikawa, 5 Porqués y 5W2H.
      
      Problema: ${problem.problema}
      Área: ${problem.area}
      Impactos: ${problem.impactos?.join(", ")}
      Frecuencia: ${problem.frecuencia}
      
      Para cada metodología, proporciona:
      1. "methodology": El nombre exacto.
      2. "reason": Por qué es adecuada o no para este caso específico.
      3. "score": Un puntaje de 1 a 10 de recomendación.
      
      Responde en un array JSON de objetos con estos campos.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              methodology: { type: Type.STRING },
              reason: { type: Type.STRING },
              score: { type: Type.NUMBER }
            },
            required: ["methodology", "reason", "score"]
          }
        }
      }
    });

    const results = JSON.parse(response.text || "[]");
    return results.sort((a: any, b: any) => b.score - a.score);
  },

  async analyzeProblem(problem: RCAProblem): Promise<AnalysisResult> {
    const interactiveContext = problem.metodologiaElegida === 'Ishikawa' 
      ? `Datos de Ishikawa: ${JSON.stringify(problem.ishikawaData)}`
      : `Datos de 5 Porqués: ${JSON.stringify(problem.fiveWhysData)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Eres un Auditor Líder SIG y Experto ESG. Sintetiza este análisis interactivo realizado por el usuario:
      
      Problema: ${problem.problema}
      Área: ${problem.area}
      Metodología: ${problem.metodologiaElegida}
      ${interactiveContext}
      
      Genera un análisis técnico profesional que incluya:
      1. Diagnóstico situacional.
      2. Definición técnica del problema.
      3. Impacto en el Sistema Integrado de Gestión.
      4. Evaluación de Riesgo ESG (1-5).
      5. Causas directas y contribuyentes basadas en los datos proporcionados.
      6. Causa raíz puntual (una sola frase clara).
      7. Nivel de criticidad.
      
      Responde estrictamente en JSON.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            diagnostico: { type: Type.STRING },
            definicionTecnica: { type: Type.STRING },
            impactoSIG: { type: Type.STRING },
            riesgoESG: {
              type: Type.OBJECT,
              properties: {
                ambiental: { type: Type.NUMBER },
                social: { type: Type.NUMBER },
                financiero: { type: Type.NUMBER },
                gobernanza: { type: Type.NUMBER }
              }
            },
            causasDirectas: { type: Type.ARRAY, items: { type: Type.STRING } },
            causasContribuyentes: { type: Type.ARRAY, items: { type: Type.STRING } },
            causaRaiz: { type: Type.STRING },
            criticidad: { type: Type.STRING }
          }
        }
      }
    });

    return JSON.parse(response.text || "{}") as AnalysisResult;
  },

  async suggestActions(problem: RCAProblem, analysis: AnalysisResult): Promise<Action[]> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Basado en el análisis de causa raíz, sugiere 3 acciones (Correctiva, Preventiva y de Mejora).
      
      Problema: ${problem.problema}
      Causa Raíz: ${analysis.causaRaiz}
      Criticidad: ${analysis.criticidad}
      
      Para cada acción define: Descripción, Tipo, Responsable (rol sugerido), Indicador de cumplimiento y Evidencia de cierre.
      
      Responde en JSON como un array de objetos Action.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              tipo: { type: Type.STRING },
              descripcion: { type: Type.STRING },
              responsable: { type: Type.STRING },
              indicador: { type: Type.STRING },
              evidencia: { type: Type.STRING }
            }
          }
        }
      }
    });

    const actions = JSON.parse(response.text || "[]");
    return actions.map((a: any, i: number) => ({ ...a, id: `suggested-${i}`, fecha: new Date().toISOString().split('T')[0] }));
  },

  async suggestIshikawa(problem: Partial<RCAProblem>): Promise<any> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Eres un experto en SIG. Sugiere causas potenciales para este problema usando las categorías de Ishikawa:
      Problema: ${problem.problema}
      
      Categorías: Operación, Método, Mano de Obra, Maquinaria, Materiales, Medio Ambiente, Medición, Gestión, Documentación, Capacitación, Comunicación, Control, Proveedores, Cultura.
      
      Devuelve un objeto JSON donde cada llave es la categoría (en minúsculas, ej: "manoDeObra") y el valor es un array de strings con 1-2 sugerencias por categoría.`,
      config: {
        responseMimeType: "application/json"
      }
    });
    return JSON.parse(response.text || "{}");
  },

  async suggestFiveWhys(problem: Partial<RCAProblem>): Promise<string[]> {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Eres un experto en RCA. Genera una cadena lógica inicial de "5 Porqués" para este problema:
      Problema: ${problem.problema}
      
      Devuelve un array de 5 strings que representen la cadena de causalidad sugerida.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });
    return JSON.parse(response.text || "[]");
  },
};
