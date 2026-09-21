import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import BuilderMaintainerSection from './components/BuilderMaintainerSection';
import ProjectsSection from './components/ProjectsSection';
import SkillsBento from './components/SkillsBento';
import ProcessSection from './components/ProcessSection';
import ContactSection from './components/ContactSection';
import SpeedDuel from './components/SpeedDuel';
import CodeUiSlider from './components/CodeUiSlider';
import ScopeBuilder from './components/ScopeBuilder';
import Footer from './components/Footer';
import CommandPalette from './components/CommandPalette';
import CvModal from './components/CvModal';
import BackgroundAnimation from './components/BackgroundAnimation';

export default function App() {
  const [isCmdOpen, setIsCmdOpen] = useState(false);
  const [isCvOpen, setIsCvOpen] = useState(false);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-[#090A10] text-slate-100 flex flex-col bg-grid-pattern relative selection:bg-blue-500/30 selection:text-blue-200">
        
        {/* Subtle AI Neural Constellation & Code Node Background Animation */}
        <BackgroundAnimation />

        {/* Header & Navigation */}
        <div className="relative z-20">
          <Navbar 
            onOpenCmd={() => setIsCmdOpen(true)}
          />
        </div>

        {/* Main Content Sections */}
        <main className="flex-grow relative z-10">
          <Hero 
            onOpenCv={() => setIsCvOpen(true)}
          />
          <BuilderMaintainerSection />
          <SpeedDuel />
          <ProjectsSection />
          <CodeUiSlider />
          <SkillsBento />
          <ProcessSection />
          <ScopeBuilder />
          <ContactSection />
        </main>

        {/* Footer */}
        <div className="relative z-10">
          <Footer 
            onOpenCmd={() => setIsCmdOpen(true)}
          />
        </div>

        {/* Modals & Dialogs (Highest Z-Index) */}
        <div className="relative z-50">
          <CommandPalette 
            isOpen={isCmdOpen}
            onClose={() => setIsCmdOpen(false)}
          />

          <CvModal 
            isOpen={isCvOpen}
            onClose={() => setIsCvOpen(false)}
          />
        </div>

      </div>
    </LanguageProvider>
  );
}
