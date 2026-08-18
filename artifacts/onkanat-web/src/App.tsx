import { type ReactNode, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import {
  ArrowUpRight,
  BookOpen,
  Boxes,
  Check,
  ChevronRight,
  CircleDot,
  Code2,
  Cpu,
  ExternalLink,
  Github,
  Grid2X2,
  Layers3,
  Menu,
  Network,
  Search,
  Share2,
  Sparkles,
  Terminal,
  Wrench,
  X,
  Zap,
} from 'lucide-react';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { Route, Switch, Router as WouterRouter, useLocation } from 'wouter';

const queryClient = new QueryClient();

type ResourceCategory = '3D' | 'Elektronik' | 'Hesaplama' | 'Kod' | 'Tasarım';

type Resource = {
  id: string;
  name: string;
  category: ResourceCategory;
  description: string;
  detail: string;
  accent: string;
  icon: 'freecad' | 'kicad' | 'octave' | 'openscad' | 'jupyter';
  url: string;
  tags: string[];
  level: string;
};

const resources: Resource[] = [
  {
    id: 'freecad',
    name: 'FreeCAD',
    category: '3D',
    description: 'Parametrik 3D tasarımın özgür çalışma tezgâhı.',
    detail: 'Parçaları ölçülendir, geçmişini koru, fikrini üretilebilir hâle getir.',
    accent: 'coral',
    icon: 'freecad',
    url: 'https://www.freecad.org/',
    tags: ['Parametrik', 'CAD', '3D baskı'],
    level: 'Başlangıç → İleri',
  },
  {
    id: 'kicad',
    name: 'KiCad',
    category: 'Elektronik',
    description: 'Şemadan PCB’ye açık kaynak elektronik tasarım.',
    detail: 'Devreni çiz, kartını yerleştir, üretim dosyanı kendi kontrolünde al.',
    accent: 'blue',
    icon: 'kicad',
    url: 'https://www.kicad.org/',
    tags: ['Şema', 'PCB', 'Gerber'],
    level: 'Başlangıç → İleri',
  },
  {
    id: 'octave',
    name: 'GNU Octave',
    category: 'Hesaplama',
    description: 'Sayısal hesaplama ve veri analizi için sade bir laboratuvar.',
    detail: 'Matrislerle düşün, grafikleri oku, MATLAB uyumlu akışları özgürleştir.',
    accent: 'gold',
    icon: 'octave',
    url: 'https://octave.org/',
    tags: ['Matris', 'Analiz', 'Simülasyon'],
    level: 'Orta seviye',
  },
  {
    id: 'openscad',
    name: 'OpenSCAD',
    category: '3D',
    description: 'Kod yazar gibi sağlam ve tekrarlanabilir modeller kur.',
    detail: 'Geometriyi metne çevir; değişkenlerle oynadıkça modelin yeniden oluşsun.',
    accent: 'blue',
    icon: 'openscad',
    url: 'https://openscad.org/',
    tags: ['Kod tabanlı', 'Parametre', 'Üretim'],
    level: 'Orta seviye',
  },
  {
    id: 'jupyter',
    name: 'Jupyter',
    category: 'Kod',
    description: 'Kod, veri ve açıklamayı tek bir yaşayan belgede buluştur.',
    detail: 'Deneyini anlat, sonucu tekrar üret, not defterini ekip arkadaşınla paylaş.',
    accent: 'coral',
    icon: 'jupyter',
    url: 'https://jupyter.org/',
    tags: ['Python', 'Veri', 'Notebook'],
    level: 'Başlangıç → İleri',
  },
  {
    id: 'inkscape',
    name: 'Inkscape',
    category: 'Tasarım',
    description: 'Teknik diyagramlar ve vektör çizimler için özgür bir masa.',
    detail: 'Şemayı, kılavuzu ve sunum görselini aynı titizlikle üret.',
    accent: 'gold',
    icon: 'openscad',
    url: 'https://inkscape.org/',
    tags: ['Vektör', 'Diyagram', 'SVG'],
    level: 'Başlangıç',
  },
];

const categories: Array<'Tümü' | ResourceCategory> = ['Tümü', '3D', 'Elektronik', 'Hesaplama', 'Kod', 'Tasarım'];

const steps = [
  {
    number: '01',
    eyebrow: 'Zemin',
    title: 'Bir fikri ölçülebilir hâle getir',
    copy: 'FreeCAD ile ilk parametrik parçanı kur. Ölçüleri değiştirirken modelin neden bozulmadığını anlamaya başla.',
    meta: 'FreeCAD · 42 dk',
    link: 'https://www.freecad.org/',
  },
  {
    number: '02',
    eyebrow: 'Devre',
    title: 'Sinyali kartın üzerinde gezdir',
    copy: 'KiCad’de bir şema çiz, bileşenleri yerleştir ve üreticiye gidecek dosyaları kendin hazırla.',
    meta: 'KiCad · 1 sa 15 dk',
    link: 'https://www.kicad.org/',
  },
  {
    number: '03',
    eyebrow: 'Model',
    title: 'Verinin dilini öğren',
    copy: 'GNU Octave ile bir ölçüm setini temizle, görselleştir ve kararı sezgi yerine kanıtla ver.',
    meta: 'GNU Octave · 55 dk',
    link: 'https://octave.org/',
  },
  {
    number: '04',
    eyebrow: 'Paylaş',
    title: 'Çalışmanı tekrar üretilebilir bırak',
    copy: 'Jupyter ile kodu, sonucu ve açıklamayı tek akışta topla. Başkasının bilgisayarında da çalışsın.',
    meta: 'Jupyter · 38 dk',
    link: 'https://jupyter.org/',
  },
];

function ToolMark({ icon, accent }: { icon: Resource['icon']; accent: string }) {
  const marks = {
    freecad: <><span className="tool-orbit" /><span className="tool-letter">F</span></>,
    kicad: <><span className="tool-trace trace-one" /><span className="tool-trace trace-two" /><span className="tool-letter">K</span></>,
    octave: <><span className="tool-wave" /><span className="tool-letter">O</span></>,
    openscad: <><span className="tool-cube" /><span className="tool-letter">O</span></>,
    jupyter: <><span className="tool-circles" /><span className="tool-letter">J</span></>,
  };
  return <div className={`tool-mark tool-mark-${accent}`} aria-hidden="true">{marks[icon]}</div>;
}

function ResourceCard({ resource }: { resource: Resource }) {
  return (
    <article className="resource-card reveal" data-testid={`card-resource-${resource.id}`}>
      <div className="resource-card-top">
        <ToolMark icon={resource.icon} accent={resource.accent} />
        <span className="font-mono-ui resource-index">{resource.id === 'freecad' ? '01' : resource.id === 'kicad' ? '02' : resource.id === 'octave' ? '03' : '04'}</span>
      </div>
      <div className="resource-card-copy">
        <div className="resource-label-row">
          <span className="eyebrow">{resource.category}</span>
          <span className="level-label">{resource.level}</span>
        </div>
        <h3>{resource.name}</h3>
        <p className="resource-description">{resource.description}</p>
        <p className="resource-detail">{resource.detail}</p>
      </div>
      <div className="resource-footer">
        <div className="tag-list">
          {resource.tags.map((tag) => <span key={tag}>{tag}</span>)}
        </div>
        <a className="card-action focus-ring" href={resource.url} target="_blank" rel="noreferrer" aria-label={`${resource.name} sitesini aç`} data-testid={`link-resource-${resource.id}`}>
          <ArrowUpRight size={17} strokeWidth={1.8} />
        </a>
      </div>
    </article>
  );
}

function Home() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'Tümü' | ResourceCategory>('Tümü');
  const [activeStep, setActiveStep] = useState(0);

  const visibleResources = useMemo(() => {
    const normalizedQuery = query.toLocaleLowerCase('tr-TR').trim();
    return resources.filter((resource) => {
      const matchesCategory = activeCategory === 'Tümü' || resource.category === activeCategory;
      const searchable = `${resource.name} ${resource.description} ${resource.tags.join(' ')}`.toLocaleLowerCase('tr-TR');
      return matchesCategory && (!normalizedQuery || searchable.includes(normalizedQuery));
    });
  }, [activeCategory, query]);

  const closeMobile = () => setMobileOpen(false);

  return (
    <main className="site-shell">
      <header className="site-header">
        <div className="container-onkanat header-inner">
          <a href="#top" className="brand focus-ring" onClick={closeMobile} data-testid="link-brand">
            <span className="brand-symbol" aria-hidden="true"><span /><span /><span /></span>
            <span className="brand-word">onkanat<span>.org</span></span>
          </a>
          <nav className={`main-nav ${mobileOpen ? 'main-nav-open' : ''}`} aria-label="Ana navigasyon">
            <a href="#koleksiyon" onClick={closeMobile} className="focus-ring" data-testid="link-nav-koleksiyon">Koleksiyon</a>
            <a href="#ogren" onClick={closeMobile} className="focus-ring" data-testid="link-nav-ogren">Öğrenme yolu</a>
            <a href="#neden" onClick={closeMobile} className="focus-ring" data-testid="link-nav-neden">Neden özgür?</a>
            <a href="#paylas" onClick={closeMobile} className="focus-ring nav-share" data-testid="link-nav-paylas"><Share2 size={15} /> Paylaş</a>
          </nav>
          <div className="header-actions">
            <a href="https://github.com/" target="_blank" rel="noreferrer" className="github-link focus-ring" aria-label="GitHub'a git" data-testid="link-github"><Github size={18} /><span>GitHub</span></a>
            <button className="menu-toggle focus-ring" type="button" onClick={() => setMobileOpen((open) => !open)} aria-expanded={mobileOpen} aria-label={mobileOpen ? 'Menüyü kapat' : 'Menüyü aç'} data-testid="button-mobile-menu">
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      <section className="hero-section" id="top">
        <div className="hero-ambient hero-ambient-one" />
        <div className="hero-ambient hero-ambient-two" />
        <div className="container-onkanat hero-grid">
          <div className="hero-copy reveal">
            <div className="status-line"><span className="pulse-dot" /> AÇIK KAYNAK · TÜRKÇE KÜTÜPHANE</div>
            <h1>Özgür araçlarla<br /><em>ciddi şeyler.</em></h1>
            <p className="hero-lede">Lisans duvarlarını kaldır. Mühendislik bilgisini paylaş. Bir fikri, çalışır bir şeye dönüştürmek için gereken araçları birlikte bulalım.</p>
            <div className="hero-actions">
              <a href="#koleksiyon" className="button button-primary focus-ring" data-testid="link-hero-collection">Araçları keşfet <ArrowUpRight size={17} /></a>
              <a href="#ogren" className="button button-quiet focus-ring" data-testid="link-hero-path">Öğrenme yoluna bak <ChevronRight size={17} /></a>
            </div>
            <div className="hero-footnote"><span className="font-mono-ui">01 / 04</span><span>Bilgiyi çoğaltmak için</span><span className="footnote-line" /></div>
          </div>
          <div className="hero-visual reveal reveal-delay-2" aria-label="Özgür mühendislik araçlarını temsil eden çizim">
            <div className="visual-ruler ruler-top"><span>100</span><span>200</span><span>300</span><span>400</span></div>
            <div className="visual-ruler ruler-side"><span>04</span><span>03</span><span>02</span><span>01</span></div>
            <div className="blueprint-sheet blueprint-grid blueprint-crosshair">
              <div className="sheet-stamp font-mono-ui">OPEN / BUILD / SHARE</div>
              <div className="hero-orbit orbit-large" />
              <div className="hero-orbit orbit-small" />
              <div className="hero-node node-a" />
              <div className="hero-node node-b" />
              <div className="hero-node node-c" />
              <div className="hero-link link-a" />
              <div className="hero-link link-b" />
              <div className="hero-cube"><span /><span /><span /></div>
              <div className="hero-coordinate font-mono-ui">x 24.8<br />y 11.2<br />z 06.4</div>
              <div className="visual-label label-freecad"><span>F</span><div><strong>FreeCAD</strong><small>PARAMETRİK MODEL</small></div></div>
              <div className="visual-label label-kicad"><span>K</span><div><strong>KiCad</strong><small>ELEKTRONİK TASARIM</small></div></div>
              <div className="visual-label label-octave"><span>O</span><div><strong>Octave</strong><small>SAYISAL HESAP</small></div></div>
            </div>
            <div className="visual-caption font-mono-ui">ŞEKİL 01 — ÜRETMEK İÇİN BİR HARİTA</div>
          </div>
        </div>
      </section>

      <div className="signal-strip" aria-label="Kütüphane özeti">
        <div className="container-onkanat signal-inner">
          <span className="signal-item"><CircleDot size={14} /> 06 araç seçildi</span>
          <span className="signal-divider" />
          <span className="signal-item"><Zap size={14} /> 03 öğrenme rotası</span>
          <span className="signal-divider" />
          <span className="signal-item"><Network size={14} /> Topluluk katkısıyla</span>
          <span className="signal-spacer" />
          <span className="font-mono-ui signal-date">SÜRÜM 2025.04</span>
        </div>
      </div>

      <section className="collection-section section-space" id="koleksiyon">
        <div className="container-onkanat">
          <div className="section-heading reveal">
            <div>
              <div className="section-kicker"><span className="kicker-number font-mono-ui">02</span> ARAÇ KÜTÜPHANESİ</div>
              <h2>İhtiyacın olanı<br /><em>bul, aç, dene.</em></h2>
            </div>
            <p>İyi araçlar saklanmak için değil, elden ele geçmek için var. Her seçkiyi gerçek bir üretim ihtiyacından yola çıkarak hazırlıyoruz.</p>
          </div>
          <div className="discovery-bar reveal reveal-delay-1">
            <div className="search-wrap">
              <Search size={20} aria-hidden="true" />
              <input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Bir şey ara: PCB, veri, 3D..." aria-label="Araçlarda ara" data-testid="input-resource-search" />
              {query && <button className="clear-search focus-ring" type="button" onClick={() => setQuery('')} aria-label="Aramayı temizle" data-testid="button-clear-search"><X size={16} /></button>}
              <span className="font-mono-ui search-shortcut">⌘ K</span>
            </div>
            <div className="filter-row" aria-label="Kategori filtreleri">
              {categories.map((category) => (
                <button type="button" key={category} onClick={() => setActiveCategory(category)} className={`filter-button focus-ring ${activeCategory === category ? 'filter-active' : ''}`} aria-pressed={activeCategory === category} data-testid={`button-filter-${category.toLocaleLowerCase('tr-TR')}`}>{category}</button>
              ))}
            </div>
          </div>
          <div className="collection-meta">
            <span><strong>{visibleResources.length.toString().padStart(2, '0')}</strong> sonuç gösteriliyor</span>
            {query || activeCategory !== 'Tümü' ? <span className="active-filter-note">Filtre açık <button type="button" onClick={() => { setQuery(''); setActiveCategory('Tümü'); }} className="reset-filter focus-ring" data-testid="button-reset-filters">Temizle</button></span> : <span className="font-mono-ui">ÜCRETSİZ · AÇIK · DENENMİŞ</span>}
          </div>
          {visibleResources.length > 0 ? (
            <div className="resource-grid">
              {visibleResources.map((resource) => <ResourceCard resource={resource} key={resource.id} />)}
            </div>
          ) : (
            <div className="empty-state" data-testid="status-no-resources">
              <Search size={26} />
              <strong>Bu ölçekte bir araç bulamadık.</strong>
              <p>Arama kelimesini değiştirmeyi veya tüm kategorilere dönmeyi dene.</p>
              <button type="button" className="button button-secondary focus-ring" onClick={() => { setQuery(''); setActiveCategory('Tümü'); }} data-testid="button-empty-reset">Tüm araçları göster</button>
            </div>
          )}
        </div>
      </section>

      <section className="path-section section-space" id="ogren">
        <div className="container-onkanat">
          <div className="path-shell">
            <div className="path-intro reveal">
              <div className="section-kicker section-kicker-light"><span className="kicker-number font-mono-ui">03</span> ÖNERİLEN ROTA</div>
              <h2>Fikrin varsa,<br /><em>bir yolun da var.</em></h2>
              <p>İlk dosyayı açmaktan çalışan bir prototipe kadar adım adım ilerleyen, kısa ve pratik bir öğrenme rotası.</p>
              <div className="path-progress"><span style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }} /></div>
              <div className="path-progress-label"><span>BAŞLANGIÇ</span><span>{steps.length} ADIM</span></div>
            </div>
            <div className="path-steps reveal reveal-delay-1">
              {steps.map((step, index) => (
                <button type="button" key={step.number} onClick={() => setActiveStep(index)} className={`path-step focus-ring ${activeStep === index ? 'path-step-active' : ''}`} aria-pressed={activeStep === index} data-testid={`button-path-step-${index + 1}`}>
                  <span className="path-step-number font-mono-ui">{step.number}</span>
                  <span className="path-step-name">{step.eyebrow}</span>
                  {activeStep === index && <Check size={15} />}
                </button>
              ))}
            </div>
            <div className="path-detail reveal reveal-delay-2">
              <div className="path-detail-top"><span className="font-mono-ui">{steps[activeStep].meta}</span><span className="path-live"><span className="pulse-dot" /> ŞİMDİ BAŞLA</span></div>
              <h3>{steps[activeStep].title}</h3>
              <p>{steps[activeStep].copy}</p>
              <a href={steps[activeStep].link} target="_blank" rel="noreferrer" className="path-link focus-ring" data-testid={`link-path-resource-${activeStep + 1}`}>Aracı aç <ArrowUpRight size={16} /></a>
              <div className="detail-grid-lines" />
            </div>
          </div>
        </div>
      </section>

      <section className="why-section section-space" id="neden">
        <div className="container-onkanat">
          <div className="why-heading reveal">
            <div className="section-kicker"><span className="kicker-number font-mono-ui">04</span> BAKIŞ AÇISI</div>
            <h2>Lisans değil,<br /><em>merak sınır koysun.</em></h2>
          </div>
          <div className="why-layout">
            <div className="why-statement reveal reveal-delay-1">
              <div className="quote-mark">“</div>
              <p>Bilgi paylaşıldıkça eksilmez. Daha çok el değdikçe, daha sağlam ve daha kullanışlı bir şeye dönüşür.</p>
              <span className="font-mono-ui">— ONKANAT NOTU / 001</span>
            </div>
            <div className="principles reveal reveal-delay-2">
              <div className="principle"><div className="principle-icon"><Wrench size={19} /></div><div><h3>Pratiğe yakın</h3><p>Dokümantasyonun kenarında değil, tezgâhın başında işe yarayan kaynaklar.</p></div></div>
              <div className="principle"><div className="principle-icon"><Code2 size={19} /></div><div><h3>Özgürce çoğalt</h3><p>Kullandığın aracı incele, değiştir, projenle birlikte başkasına devret.</p></div></div>
              <div className="principle"><div className="principle-icon"><Layers3 size={19} /></div><div><h3>Birbirine bağla</h3><p>3D model, devre, veri ve kod; gerçek projelerde aynı masada buluşur.</p></div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="share-section section-space" id="paylas">
        <div className="container-onkanat">
          <div className="share-shell reveal">
            <div className="share-orbit" />
            <div className="share-copy">
              <div className="section-kicker section-kicker-light"><span className="kicker-number font-mono-ui">05</span> SÖZ SIRA SENDE</div>
              <h2>İyi bir araç<br /><em>tanıyor musun?</em></h2>
              <p>Bir eklenti, bir kılavuz, küçük bir komut satırı sihri… Onu burada görünür kılalım.</p>
              <a href="mailto:merhaba@onkanat.org?subject=onkanat.org%20için%20kaynak%20önerisi" className="button button-cream focus-ring" data-testid="link-share-resource">Kaynak öner <Share2 size={17} /></a>
            </div>
            <div className="share-diagram" aria-hidden="true"><Grid2X2 size={22} /><span /><span /><span /><span /><div className="diagram-center"><Sparkles size={20} /></div></div>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <div className="container-onkanat">
          <div className="footer-top">
            <div className="footer-brand">
              <a href="#top" className="brand focus-ring" data-testid="link-footer-brand"><span className="brand-symbol" aria-hidden="true"><span /><span /><span /></span><span className="brand-word">onkanat<span>.org</span></span></a>
              <p>Bilgiyi çoğaltan<br />özgür araçlar.</p>
            </div>
            <div className="footer-links"><span className="footer-label font-mono-ui">HARİTA</span><a href="#koleksiyon" className="focus-ring" data-testid="link-footer-koleksiyon">Koleksiyon <ArrowUpRight size={14} /></a><a href="#ogren" className="focus-ring" data-testid="link-footer-ogren">Öğrenme yolu <ArrowUpRight size={14} /></a><a href="#paylas" className="focus-ring" data-testid="link-footer-paylas">Kaynak paylaş <ArrowUpRight size={14} /></a></div>
            <div className="footer-links"><span className="footer-label font-mono-ui">DIŞARIDA</span><a href="https://github.com/" target="_blank" rel="noreferrer" className="focus-ring" data-testid="link-footer-github">GitHub <ExternalLink size={14} /></a><a href="mailto:merhaba@onkanat.org" className="focus-ring" data-testid="link-footer-mail">E-posta <ArrowUpRight size={14} /></a></div>
            <div className="footer-note"><Terminal size={18} /><p>Bir gün herkesin<br />özgür araçları olacak.</p></div>
          </div>
          <div className="footer-bottom"><span>© 2025 onkanat.org</span><span className="font-mono-ui">YAPARAK ÖĞREN · PAYLAŞARAK ÇOĞALT</span><span>Türkiye'den, merakla.</span></div>
        </div>
      </footer>
    </main>
  );
}

function Router() {
  return (
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;