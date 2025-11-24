import React, { useState } from 'react';
import { 
  MessageSquareHeart, 
  Megaphone, 
  BarChart3, 
  ClipboardList, 
  Menu,
  X,
  Bot,
  MessageCircle
} from 'lucide-react';
import { BizMode } from './types';
import { MODES } from './constants';
import ChatInterface from './components/ChatInterface';
import AnalysisView from './components/AnalysisView';

// Icon mapping helper
const IconMap = {
  MessageSquareHeart,
  Megaphone,
  BarChart3,
  ClipboardList
};

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<BizMode>(BizMode.SUPPORT);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const ModeIcon = IconMap[MODES[currentMode].icon as keyof typeof IconMap];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        className={`fixed md:relative z-30 w-72 h-full bg-slate-900 text-slate-300 flex flex-col transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* Logo Area */}
        <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white shadow-lg shadow-indigo-500/30">
                <Bot size={24} />
            </div>
            <div>
                <h1 className="text-xl font-bold text-white tracking-tight">BizG</h1>
                <p className="text-xs text-slate-500 font-medium">Enterprise Assistant</p>
            </div>
            <button 
                onClick={() => setSidebarOpen(false)} 
                className="md:hidden ml-auto text-slate-400 hover:text-white"
            >
                <X size={24} />
            </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {Object.values(MODES).map((mode) => {
            const Icon = IconMap[mode.icon as keyof typeof IconMap];
            const isActive = currentMode === mode.id;
            
            return (
              <button
                key={mode.id}
                onClick={() => {
                  setCurrentMode(mode.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20' 
                    : 'hover:bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <Icon size={20} className={isActive ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'} />
                <div className="text-left">
                    <span className="block font-medium">{mode.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800">
            <a 
              href="https://wa.me/254740312402"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full mb-4 px-4 py-3 bg-[#25D366] hover:bg-[#128C7E] text-white rounded-xl transition-colors font-semibold shadow-lg shadow-green-900/20 group"
            >
                <MessageCircle size={20} className="group-hover:scale-110 transition-transform" />
                <span>Chat on WhatsApp</span>
            </a>
            
            <div className="p-4 rounded-xl bg-slate-800/50 border border-slate-800">
                <p className="text-xs text-slate-400 text-center">Powered by Google Gemini and Built by Pantane</p>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full w-full relative">
        {/* Header (Mobile only really needs this for the menu button) */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-slate-200 md:hidden flex-shrink-0">
          <button 
            onClick={() => setSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Menu size={24} />
          </button>
          <span className="font-semibold text-slate-800">{MODES[currentMode].label}</span>
          <div className="w-8" /> {/* Spacer for centering */}
        </header>

        {/* Dynamic Content */}
        <div className="flex-1 p-4 md:p-6 overflow-hidden">
            <div className="h-full max-w-5xl mx-auto flex flex-col">
                {/* Header for Desktop */}
                <div className="hidden md:flex items-center gap-3 mb-6">
                    <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                        <ModeIcon size={24} />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-900">{MODES[currentMode].label}</h2>
                        <p className="text-sm text-slate-500">{MODES[currentMode].description}</p>
                    </div>
                </div>

                {/* View Switcher */}
                <div className="flex-1 min-h-0 relative">
                    {currentMode === BizMode.DATA ? (
                        <AnalysisView />
                    ) : (
                        <ChatInterface mode={currentMode} />
                    )}
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default App;