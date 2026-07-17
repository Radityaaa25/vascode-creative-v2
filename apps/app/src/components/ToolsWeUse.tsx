import { lazy, Suspense } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useMobileDevice } from '@/hooks/use-mobile';
import { InfiniteSlider } from '@/components/ui/infinite-slider';
import { ProgressiveBlur } from '@/components/ui/progressive-blur';

const Sparkles = lazy(() => import('./Sparkles').then(m => ({ default: m.Sparkles })));

const DEFAULT_TOOLS = [
  { id: '1', name: 'Canva', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg' },
  { id: '2', name: 'CapCut', logo_url: 'https://uxwing.com/wp-content/themes/uxwing/download/brands-and-social-media/capcut-icon.svg' },
  { id: '3', name: 'VSCode', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
  { id: '4', name: 'Antigravity', logo_url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/1024px-Google_%22G%22_logo.svg.png' },
  { id: '5', name: 'Adobe Illustrator', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg' },
  { id: '6', name: 'After Effects', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/aftereffects/aftereffects-original.svg' },
  { id: '7', name: 'Adobe Premiere', logo_url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/premierepro/premierepro-original.svg' },
];

const ToolsWeUse = () => {
  const { language, content } = useLanguage();
  const { theme } = useTheme();
  const isMobile = useMobileDevice();
  const isID = language === 'id';

  const tools = content.tools && content.tools.length > 0 ? content.tools : DEFAULT_TOOLS;
  
  const subtitleId = content.settings?.tools_subtitle_id || "TOOLS";
  const subtitleEn = content.settings?.tools_subtitle_en || "TOOLS";
  const titleId = content.settings?.tools_title_id || "Alat andalan <br>para ahli kreatif.";
  const titleEn = content.settings?.tools_title_en || "Trusted by experts. <br>Used by the leaders.";

  const renderTitle = (title: string) => {
    if (title.includes('<span')) {
      return <h2 className="mb-4 font-bold text-3xl text-snow md:text-4xl lg:text-5xl" dangerouslySetInnerHTML={{ __html: title }} />;
    }
    const parts = title.split(/<br\s*\/?>/i);
    if (parts.length > 1) {
      return (
        <h2 className="mb-4 font-bold text-3xl text-snow md:text-4xl lg:text-5xl">
          <span className="text-[#8350e8]/80 dark:text-[#8350e8]/90">{parts[0]}</span>
          <br className="hidden md:block"/>
          {parts.slice(1).join(' ')}
        </h2>
      );
    }
    return <h2 className="mb-4 font-bold text-3xl text-snow md:text-4xl lg:text-5xl">{title}</h2>;
  };

  return (
    <section id="tools" className="relative w-full overflow-hidden py-24 md:py-32">
      <div className="mx-auto w-full max-w-4xl relative z-10">
        <div className="text-center">
          <span className="mb-4 inline-block rounded-full bg-[#8350e8]/10 px-4 py-1.5 font-medium text-xs text-[#8350e8] tracking-widest">
            {isID ? subtitleId : subtitleEn}
          </span>
          {renderTitle(isID ? titleId : titleEn)}
        </div>

        <div className="relative mx-auto mt-14 h-[100px] w-full max-w-3xl">
          <InfiniteSlider 
            className="flex h-full w-full items-center" 
            duration={isMobile ? 45 : 25}
            gap={64}
          >
            {tools.map((tool) => (
              <div 
                key={tool.id} 
                className="flex items-center justify-center w-20 h-14 shrink-0 grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
              >
                <img 
                  src={tool.logo_url} 
                  alt={tool.name} 
                  className="max-h-full max-w-full object-contain"
                  loading="lazy"
                  width={80}
                  height={56}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    const parent = (e.target as HTMLImageElement).parentElement;
                    if (parent && !parent.querySelector('span')) {
                      const span = document.createElement('span');
                      span.className = "text-xl font-bold text-snow/50 text-center uppercase tracking-wider";
                      span.innerText = tool.name;
                      parent.appendChild(span);
                    }
                  }}
                />
              </div>
            ))}
          </InfiniteSlider>
          
          {isMobile ? (
            <div className="pointer-events-none absolute top-0 left-0 h-full w-[60px] md:w-[100px]"
              style={{
                background: 'linear-gradient(to right, hsl(var(--background)), transparent)',
              }}
            />
          ) : (
            <ProgressiveBlur
              className="pointer-events-none absolute top-0 left-0 h-full w-[120px] md:w-[200px]"
              direction="left"
              blurIntensity={1.5}
            />
          )}
          {isMobile ? (
            <div className="pointer-events-none absolute top-0 right-0 h-full w-[60px] md:w-[100px]"
              style={{
                background: 'linear-gradient(to left, hsl(var(--background)), transparent)',
              }}
            />
          ) : (
            <ProgressiveBlur
              className="pointer-events-none absolute top-0 right-0 h-full w-[120px] md:w-[200px]"
              direction="right"
              blurIntensity={1.5}
            />
          )}
        </div>
      </div>

      <div className="relative -mt-24 md:-mt-32 h-96 w-full overflow-hidden [mask-image:radial-gradient(50%_50%,white,transparent)] z-0 pointer-events-none">
        <div className="absolute inset-0 before:absolute before:inset-0 before:bg-[radial-gradient(circle_at_bottom_center,#8350e8,transparent_70%)] before:opacity-30 md:before:opacity-40" />
        <div className="absolute -left-1/2 top-1/2 z-10 aspect-[1/0.7] w-[200%] rounded-[100%] border-t border-snow/10 bg-void" />
        <Suspense fallback={null}>
          <Sparkles
            density={1200}
            className="absolute inset-x-0 bottom-0 h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)]"
            color={theme === 'dark' ? '#ffffff' : '#000000'}
          />
        </Suspense>
      </div>
    </section>
  );
};

export default ToolsWeUse;
