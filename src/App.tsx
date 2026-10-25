import { useState, useEffect } from 'react';
import { ColorPalette, ExportHistoryItem, ParametricConstraints, Preset, ThemeMode } from './types';
import { COLOR_PALETTES, PRESETS } from './lib/presets';
import { parseRulesFromText } from './lib/lsystem';
import { Header } from './components/Header';
import { SideRail, StudioSection } from './components/SideRail';
import { Inspector } from './components/Inspector';
import { CanvasViewport } from './components/CanvasViewport';
import { FormulasTab } from './components/FormulasTab';
import { PresetsTab } from './components/PresetsTab';
import { ExportHistoryTab } from './components/ExportHistoryTab';
import { ExportModal } from './components/ExportModal';
import { SyntaxGuideModal } from './components/SyntaxGuideModal';
import { TelemetryModal } from './components/TelemetryModal';
import { PreferencesModal } from './components/PreferencesModal';

export default function App() {
  const [currentTab, setCurrentTab] = useState<'canvas' | 'formulas' | 'presets' | 'history'>('canvas');
  const [theme, setTheme] = useState<ThemeMode>('light');
  const [activeSection, setActiveSection] = useState<StudioSection>('grammar');

  // Active preset & generative parameters
  const [activePreset, setActivePreset] = useState<Preset>(PRESETS[0]);
  const [axiom, setAxiom] = useState<string>(PRESETS[0].axiom);
  const [rulesFileName, setRulesFileName] = useState<string>(PRESETS[0].rulesFileName);

  // Multiline rules editor representation
  const [rulesText, setRulesText] = useState<string>(
    'X -> X+YF++YF-FX--FXFX-YF+\nY -> -FX+YFYF++YF+FX--FX-Y\n// 4-Fold Parang Rusak Recursion'
  );

  const [constraints, setConstraints] = useState<ParametricConstraints>({
    angle: PRESETS[0].angle,
    depth: PRESETS[0].depth,
    stepLength: PRESETS[0].stepLength,
    thickness: PRESETS[0].thickness,
    cantingBleed: true,
    symmetry: PRESETS[0].symmetry,
  });

  const [palette, setPalette] = useState<ColorPalette>(PRESETS[0].palette);

  // Modals & export
  const [exportModalOpen, setExportModalOpen] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<'SVG' | 'PNG' | 'JSON'>('SVG');
  const [syntaxGuideOpen, setSyntaxGuideOpen] = useState<boolean>(false);
  const [telemetryOpen, setTelemetryOpen] = useState<boolean>(false);
  const [preferencesOpen, setPreferencesOpen] = useState<boolean>(false);

  const [exportHistory, setExportHistory] = useState<ExportHistoryItem[]>([
    {
      id: 'init-1',
      timestamp: '05:38 AM',
      presetName: 'Parang Rusak Fractal',
      format: 'SVG',
      depth: 4,
      angle: 60.0,
      symmetry: '4fold',
    },
  ]);

  // Sync theme class on <html>
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.remove('dark');
      root.classList.add('light');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'light' ? 'dark' : 'light';
      if (next === 'dark') {
        // Switch to dark workstation palette
        const darkPal = COLOR_PALETTES.find((p) => p.id === 'dark-workstation') || COLOR_PALETTES[5];
        setPalette(darkPal);
      } else {
        // Switch back to pastel rose palette
        const lightPal = COLOR_PALETTES.find((p) => p.id === 'pastel-rose') || COLOR_PALETTES[0];
        setPalette(lightPal);
      }
      return next;
    });
  };

  const handleSelectPreset = (preset: Preset) => {
    setActivePreset(preset);
    setAxiom(preset.axiom);
    setRulesFileName(preset.rulesFileName);

    // Format rules into text
    const lines = Object.entries(preset.rules).map(([k, v]) => `${k} -> ${v}`);
    lines.push(`// ${preset.name} Recursion`);
    setRulesText(lines.join('\n'));

    setConstraints({
      angle: preset.angle,
      depth: preset.depth,
      stepLength: preset.stepLength,
      thickness: preset.thickness,
      cantingBleed: true,
      symmetry: preset.symmetry,
    });

    if (theme === 'light') {
      setPalette(preset.palette);
    }

    if (currentTab !== 'canvas') {
      setCurrentTab('canvas');
    }
  };

  const handleUpdateConstraints = (updates: Partial<ParametricConstraints>) => {
    setConstraints((prev) => ({ ...prev, ...updates }));
  };

  const handleSynthesize = () => {
    // Triggers micro-recalculation / refresh
    setConstraints((prev) => ({
      ...prev,
      stepLength: parseFloat((prev.stepLength + 0.0001).toFixed(4)),
    }));
  };

  const handleRandomizeSeed = () => {
    // Generate a creative mathematical perturbation
    const seedAngleOffsets = [-5, -2.5, 0, 2.5, 5, 7.5, -7.5];
    const randomOffset = seedAngleOffsets[Math.floor(Math.random() * seedAngleOffsets.length)];
    const newAngle = Math.min(180, Math.max(15, activePreset.angle + randomOffset));

    // Randomize step length slightly
    const randomStep = Math.max(4, Math.min(20, activePreset.stepLength * (0.85 + Math.random() * 0.3)));

    setConstraints((prev) => ({
      ...prev,
      angle: parseFloat(newAngle.toFixed(1)),
      stepLength: parseFloat(randomStep.toFixed(1)),
    }));
  };

  // Parse current rules from editor
  const parsedRules = parseRulesFromText(rulesText);

  return (
    <div className="h-screen w-screen flex flex-col bg-[#fdf9f3] dark:bg-[#0c1322] text-[#2b2d42] dark:text-[#dce2f7] overflow-hidden antialiased select-none font-body-md transition-colors duration-200">
      {/* Top Application Bar */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        activePreset={activePreset}
        presets={PRESETS}
        onSelectPreset={handleSelectPreset}
        onRandomizeSeed={handleRandomizeSeed}
        onGenerate={handleSynthesize}
        onOpenExport={(fmt) => {
          setExportFormat(fmt);
          setExportModalOpen(true);
        }}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenPreferences={() => setPreferencesOpen(true)}
        onOpenHelp={() => setSyntaxGuideOpen(true)}
      />

      {/* Main Studio Viewport */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Compact Studio SideRail (56px) */}
        <SideRail
          activeSection={activeSection}
          onSelectSection={(sec) => {
            setActiveSection(sec);
            if (sec === 'presets') {
              setCurrentTab('presets');
            } else if (sec === 'diagnostics') {
              setTelemetryOpen(true);
            } else {
              if (currentTab !== 'canvas') setCurrentTab('canvas');
            }
          }}
          onOpenPreferences={() => setPreferencesOpen(true)}
        />

        {/* Tab 1: Studio Canvas (Matching the full screen attachment) */}
        {currentTab === 'canvas' && (
          <>
            {/* Left Control Inspector Dock (380px) */}
            <Inspector
              axiom={axiom}
              onAxiomChange={setAxiom}
              rulesText={rulesText}
              onRulesTextChange={setRulesText}
              rulesFileName={rulesFileName}
              constraints={constraints}
              onConstraintsChange={handleUpdateConstraints}
              palette={palette}
              onPaletteChange={setPalette}
              onSynthesize={handleSynthesize}
              onRandomize={handleRandomizeSeed}
              onOpenSyntaxGuide={() => setSyntaxGuideOpen(true)}
              activePreset={activePreset}
            />

            {/* Central Interactive Fractal Canvas Viewport */}
            <CanvasViewport
              axiom={axiom}
              rules={parsedRules}
              constraints={constraints}
              palette={palette}
              activePreset={activePreset}
              onDepthChange={(depth) => handleUpdateConstraints({ depth })}
              onOpenTelemetry={() => setTelemetryOpen(true)}
            />
          </>
        )}

        {/* Tab 2: Mathematical Formulas & History */}
        {currentTab === 'formulas' && <FormulasTab />}

        {/* Tab 3: Presets Catalog */}
        {currentTab === 'presets' && (
          <PresetsTab
            onSelectPreset={handleSelectPreset}
            activePresetId={activePreset.id}
          />
        )}

        {/* Tab 4: Export History */}
        {currentTab === 'history' && (
          <ExportHistoryTab
            history={exportHistory}
            onClearHistory={() => setExportHistory([])}
            onNavigateToStudio={() => setCurrentTab('canvas')}
          />
        )}
      </div>

      {/* Modal Dialogs */}
      <ExportModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        format={exportFormat}
        onFormatChange={setExportFormat}
        axiom={axiom}
        rules={parsedRules}
        constraints={constraints}
        palette={palette}
        activePreset={activePreset}
        onExportSuccess={(item) => setExportHistory((prev) => [item, ...prev])}
      />

      <SyntaxGuideModal
        isOpen={syntaxGuideOpen}
        onClose={() => setSyntaxGuideOpen(false)}
      />

      <TelemetryModal
        isOpen={telemetryOpen}
        onClose={() => setTelemetryOpen(false)}
        activePreset={activePreset}
        constraints={constraints}
      />

      <PreferencesModal
        isOpen={preferencesOpen}
        onClose={() => setPreferencesOpen(false)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />
    </div>
  );
}
