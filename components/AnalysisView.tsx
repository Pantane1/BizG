import React, { useState } from 'react';
import { analyzeBusinessData } from '../services/geminiService';
import { DataAnalysisResult } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Loader2, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

const AnalysisView: React.FC = () => {
  const [inputData, setInputData] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DataAnalysisResult | null>(null);

  const handleAnalyze = async () => {
    if (!inputData.trim()) return;
    setIsAnalyzing(true);
    const data = await analyzeBusinessData(inputData);
    setResult(data);
    setIsAnalyzing(false);
  };

  return (
    <div className="flex flex-col h-full space-y-6 overflow-y-auto pr-2">
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <h2 className="text-lg font-semibold mb-4 text-slate-800 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-600" />
            Data Input
        </h2>
        <textarea
          className="w-full h-32 p-4 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none font-mono text-sm bg-slate-50"
          placeholder="Paste your CSV data, JSON, or just a list of numbers with categories here..."
          value={inputData}
          onChange={(e) => setInputData(e.target.value)}
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !inputData}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? <Loader2 className="animate-spin w-4 h-4" /> : 'Analyze Data'}
          </button>
        </div>
      </div>

      {result && (
        <div className="space-y-6 pb-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Executive Summary</h3>
                    <p className="text-slate-700 leading-relaxed">{result.summary}</p>
                </div>
                 <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 border-l-4 border-l-green-500">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2">Strategic Recommendation</h3>
                    <p className="text-slate-700 leading-relaxed font-medium">{result.recommendation}</p>
                </div>
            </div>

            {/* Chart */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-6">Visual Breakdown</h3>
                <div className="h-80 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={result.chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                            <XAxis dataKey="label" tick={{fill: '#64748b'}} axisLine={{stroke: '#cbd5e1'}} />
                            <YAxis tick={{fill: '#64748b'}} axisLine={{stroke: '#cbd5e1'}} />
                            <Tooltip 
                                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                cursor={{fill: '#f1f5f9'}}
                            />
                            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                                {result.chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Insights List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">Key Findings</h3>
                <ul className="space-y-3">
                    {result.insights.map((insight, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <span className="text-slate-700">{insight}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisView;