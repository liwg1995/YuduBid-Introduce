import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, useReducedMotion } from "motion/react";
import {
  AppleLogo,
  ArrowRight,
  BracketsCurly,
  CheckCircle,
  CloudArrowDown,
  Code,
  DownloadSimple,
  FileDoc,
  Files,
  GithubLogo,
  Images,
  Lightbulb,
  MagicWand,
  PenNib,
  ShieldCheck,
  Sparkle,
  SquaresFour,
  WindowsLogo
} from "@phosphor-icons/react";
import "./styles.css";

type ReleaseAsset = {
  name: string;
  browser_download_url: string;
  size: number;
};

type Release = {
  tag_name: string;
  published_at: string;
  html_url: string;
  assets: ReleaseAsset[];
};

const fallbackRelease: Release = {
  tag_name: "v0.4.4",
  published_at: "2026-06-25T07:57:13Z",
  html_url: "https://github.com/liwg1995/YuduBid/releases/tag/v0.4.4",
  assets: [
    {
      name: "YuDuBid-0.4.4-win-x64.exe",
      browser_download_url: "https://github.com/liwg1995/YuduBid/releases/download/v0.4.4/YuDuBid-0.4.4-win-x64.exe",
      size: 170836088
    },
    {
      name: "YuDuBid-0.4.4-mac-arm64.dmg",
      browser_download_url: "https://github.com/liwg1995/YuduBid/releases/download/v0.4.4/YuDuBid-0.4.4-mac-arm64.dmg",
      size: 209271723
    },
    {
      name: "YuDuBid-0.4.4-mac-x64.dmg",
      browser_download_url: "https://github.com/liwg1995/YuduBid/releases/download/v0.4.4/YuDuBid-0.4.4-mac-x64.dmg",
      size: 214749514
    }
  ]
};

const heroSlides = [
  {
    title: "技术标书智能编写",
    copy: "解析招标资料，生成目录正文，复用历史方案并检查废标风险。",
    image: "/assets/bid-tech.png",
    icon: Files
  },
  {
    title: "公文写作更高效",
    copy: "覆盖通知、请示、报告、函和方案，支持起草、检查、润色与导出。",
    image: "/assets/document-writing.png",
    icon: PenNib
  },
  {
    title: "软著材料一键整理",
    copy: "从代码和说明材料生成申请表、用户手册、交付清单和归档包。",
    image: "/assets/software-copyright.png",
    icon: BracketsCurly
  },
  {
    title: "国家专利挖掘",
    copy: "从项目资料、代码和技术说明里提取可保护技术点，生成交底书。",
    image: "/assets/patent.png",
    icon: Lightbulb
  }
];

const heroDeck = [
  { label: "概览", title: "一站式本地 AI 工作台", image: "/assets/overview.png" },
  { label: "总结", title: "本地工作台与知识复用闭环", image: "/assets/summary.png" }
];

const navItems = [
  { href: "#features", label: "功能", icon: Sparkle },
  { href: "#showcase", label: "界面", icon: Images },
  { href: "#download", label: "下载", icon: DownloadSimple },
  { href: "https://github.com/liwg1995/YuduBid", label: "开源", icon: Code, external: true }
];

const screens = [
  {
    key: "bid",
    label: "招投标",
    title: "标书目录、正文生成和交付检查在同一条链路完成",
    image: "/assets/screen-bid.png"
  },
  {
    key: "doc",
    label: "公文",
    title: "把文种规则、事实要素和降 AI 味检查收拢到起草台",
    image: "/assets/screen-doc.png"
  },
  {
    key: "copyright",
    label: "软著",
    title: "扫描项目源码，确认材料范围，生成可复用软著素材",
    image: "/assets/screen-copyright.png"
  },
  {
    key: "patent",
    label: "专利",
    title: "筛出真正值得保护的技术点，沉淀交底书结构",
    image: "/assets/screen-patent.png"
  },
  {
    key: "settings",
    label: "配置",
    title: "本地保存模型配置，文本、生图、解析和技能独立管理",
    image: "/assets/screen-settings.png"
  }
];

const capabilities = [
  { title: "本地工作区", copy: "资料、草稿、模板和知识库集中管理，交付过程可回看。", icon: SquaresFour },
  { title: "智能生成", copy: "从资料解析到正文扩写，多任务后台执行，减少重复复制。", icon: MagicWand },
  { title: "闭环交付", copy: "格式检查、润色修订、Word 导出和版本留痕形成稳定流程。", icon: CheckCircle },
  { title: "知识复用", copy: "把历史方案、模板、代码和经验沉淀为可持续复用资产。", icon: ShieldCheck }
];

function bytesToSize(bytes: number) {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(1)} MB`;
}

function pickAsset(release: Release, matcher: (asset: ReleaseAsset) => boolean) {
  return release.assets.find(matcher);
}

function useRelease() {
  const [release, setRelease] = useState<Release>(fallbackRelease);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch("https://api.github.com/repos/liwg1995/YuduBid/releases/latest", {
      signal: controller.signal,
      headers: { Accept: "application/vnd.github+json" }
    })
      .then((res) => {
        if (!res.ok) throw new Error("release request failed");
        return res.json();
      })
      .then((data: Release) => {
        setRelease(data);
        setStatus("ready");
      })
      .catch((error) => {
        if (error.name !== "AbortError") setStatus("error");
      });
    return () => controller.abort();
  }, []);

  return { release, status };
}

function ParticleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let raf = 0;
    const pointer = { x: 0.5, y: 0.5, active: false };
    const points = Array.from({ length: 138 }, (_, index) => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.001,
      vy: (Math.random() - 0.5) * 0.001,
      r: 0.8 + (index % 5) * 0.35
    }));

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(canvas.clientWidth * ratio);
      canvas.height = Math.floor(canvas.clientHeight * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    };

    const draw = () => {
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      ctx.clearRect(0, 0, width, height);
      ctx.strokeStyle = "rgba(37, 211, 255, 0.13)";
      ctx.lineWidth = 1;
      points.forEach((p, i) => {
        if (!reduced) {
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > 1) p.vx *= -1;
          if (p.y < 0 || p.y > 1) p.vy *= -1;
        }
        const px = p.x * width;
        const py = p.y * height;
        if (!reduced && pointer.active) {
          const dx = px - pointer.x * width;
          const dy = py - pointer.y * height;
          const distance = Math.hypot(dx, dy);
          if (distance < 180 && distance > 0) {
            const force = (180 - distance) / 180;
            p.x += (dx / distance) * force * 0.0013;
            p.y += (dy / distance) * force * 0.0013;
          }
        }
        ctx.beginPath();
        ctx.arc(px, py, p.r, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0 ? "rgba(106, 92, 255, 0.65)" : "rgba(34, 211, 238, 0.75)";
        ctx.fill();
        for (let j = i + 1; j < points.length; j += 1) {
          const next = points[j];
          const nx = next.x * width;
          const ny = next.y * height;
          const distance = Math.hypot(px - nx, py - ny);
          if (distance < 140) {
            ctx.globalAlpha = 1 - distance / 140;
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(nx, ny);
            ctx.stroke();
            ctx.globalAlpha = 1;
          }
        }
      });
      frame += 1;
      if (!reduced || frame < 2) raf = requestAnimationFrame(draw);
    };

    const move = (event: PointerEvent) => {
      pointer.x = event.clientX / window.innerWidth;
      pointer.y = event.clientY / window.innerHeight;
      pointer.active = true;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
    };
  }, []);

  return <canvas className="particle-field" ref={canvasRef} aria-hidden="true" />;
}

function RippleLayer() {
  const [ripples, setRipples] = useState<Array<{ id: number; x: number; y: number }>>([]);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;
    let last = 0;
    let id = 0;
    const handleMove = (event: PointerEvent) => {
      const now = performance.now();
      if (now - last < 130) return;
      last = now;
      id += 1;
      const ripple = { id, x: event.clientX, y: event.clientY };
      setRipples((items) => [...items.slice(-7), ripple]);
      window.setTimeout(() => {
        setRipples((items) => items.filter((item) => item.id !== ripple.id));
      }, 900);
    };
    window.addEventListener("pointermove", handleMove, { passive: true });
    return () => window.removeEventListener("pointermove", handleMove);
  }, []);

  return (
    <div className="ripple-layer" aria-hidden="true">
      {ripples.map((ripple) => (
        <span key={ripple.id} style={{ left: ripple.x, top: ripple.y }} />
      ))}
    </div>
  );
}

function App() {
  const { release, status } = useRelease();
  const [activeHero, setActiveHero] = useState(0);
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeScreen, setActiveScreen] = useState(screens[0].key);
  const [activeNav, setActiveNav] = useState(navItems[0].label);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setActiveHero((index) => (index + 1) % heroDeck.length);
    }, 4200);
    return () => window.clearInterval(timer);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setActiveSlide((index) => (index + 1) % heroSlides.length);
    }, 5200);
    return () => window.clearInterval(timer);
  }, [reduce]);

  useEffect(() => {
    if (reduce) return;
    const timer = window.setInterval(() => {
      setActiveScreen((key) => {
        const index = screens.findIndex((screen) => screen.key === key);
        return screens[(index + 1) % screens.length].key;
      });
    }, 5600);
    return () => window.clearInterval(timer);
  }, [reduce]);

  const downloads = useMemo(() => {
    const windows = pickAsset(release, (asset) => asset.name.endsWith(".exe") && asset.name.toLowerCase().includes("win"));
    const macArm = pickAsset(release, (asset) => asset.name.endsWith(".dmg") && asset.name.toLowerCase().includes("arm64"));
    const macIntel = pickAsset(release, (asset) => asset.name.endsWith(".dmg") && asset.name.toLowerCase().includes("x64"));
    return [
      { label: "Windows", detail: "x64 exe 安装包", icon: WindowsLogo, asset: windows },
      { label: "macOS", detail: "Apple 芯片 dmg", icon: AppleLogo, asset: macArm },
      { label: "macOS", detail: "Intel x86 dmg", icon: AppleLogo, asset: macIntel }
    ];
  }, [release]);

  const currentScreen = screens.find((item) => item.key === activeScreen) ?? screens[0];
  const currentSlide = heroSlides[activeSlide];

  return (
    <main>
      <ParticleField />
      <RippleLayer />
      <nav className="nav">
        <a className="brand" href="#top" aria-label="禹都AI解决方案助手">
          <img src="/assets/yudubid-icon.png" alt="" />
          <span>禹都AI解决方案助手</span>
        </a>
        <div className="nav-links">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.label}
                href={item.href}
                className={activeNav === item.label ? "active" : ""}
                target={item.external ? "_blank" : undefined}
                rel={item.external ? "noreferrer" : undefined}
                onClick={() => setActiveNav(item.label)}
              >
                {activeNav === item.label && <motion.span className="nav-glider" layoutId="nav-glider" transition={{ duration: 0.34, ease: [0.16, 1, 0.3, 1] }} />}
                <Icon weight="duotone" />
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </nav>

      <section id="top" className="hero">
        <div className="hero-copy">
          <motion.p className="section-kicker" initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
            本地 AI 工作台
          </motion.p>
          <motion.h1 className="breath-title" initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }}>
            沉淀资料与经验，交付成果
          </motion.h1>
          <motion.p className="hero-sub" initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}>
            面向技术标书、公文写作、软著和专利的一站式本地 AI 工作台。
          </motion.p>
          <motion.div className="hero-actions" initial={reduce ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.24 }}>
            <a className="button primary" href="#download">
              <CloudArrowDown weight="duotone" />
              立即下载
            </a>
            <a className="button ghost" href="https://github.com/liwg1995/YuduBid" target="_blank" rel="noreferrer">
              <GithubLogo />
              liwg1995/YuduBid
            </a>
          </motion.div>
        </div>

        <motion.div
          className="hero-stage"
          initial={reduce ? false : { opacity: 0, rotateY: -10, y: 26 }}
          animate={{ opacity: 1, rotateY: 0, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="hero-deck" aria-label="软件宣传图幻灯片">
            {heroDeck.map((slide, index) => {
              const active = index === activeHero;
              return (
                <motion.button
                  type="button"
                  className="deck-card"
                  key={slide.label}
                  aria-label={`查看${slide.label}`}
                  aria-hidden={!active}
                  tabIndex={active ? 0 : -1}
                  onClick={() => setActiveHero(index)}
                  animate={{
                    opacity: active ? 1 : 0,
                    x: active ? 0 : 24,
                    y: active ? 0 : 10,
                    rotateY: active ? -2 : 7,
                    rotateX: active ? 1.5 : 0,
                    scale: active ? 1 : 0.97,
                    zIndex: active ? 3 : 1
                  }}
                  transition={{ duration: 0.62, ease: [0.16, 1, 0.3, 1] }}
                >
                  <img src={slide.image} alt={slide.title} />
                </motion.button>
              );
            })}
            <div className="deck-dots" role="tablist" aria-label="宣传图切换">
              {heroDeck.map((slide, index) => (
                <button
                  key={slide.label}
                  type="button"
                  className={index === activeHero ? "active" : ""}
                  onClick={() => setActiveHero(index)}
                  aria-selected={index === activeHero}
                />
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      <section id="features" className="mission">
        <div className="mission-panel">
          <Sparkle className="mission-icon" weight="duotone" />
          <h2 className="breath-title">
            <span>资料进来</span>
            <span>成果出去</span>
          </h2>
          <p>软件把分散的文档、代码、方案和经验沉淀为可复用、可交付的组织资产。</p>
          <div className="mission-flow">
            <span>导入</span>
            <span>解析</span>
            <span>生成</span>
            <span>导出</span>
          </div>
        </div>
        <div className="capability-grid">
          {capabilities.map((item, index) => {
            const Icon = item.icon;
            return (
              <motion.article
                className="capability-card"
                key={item.title}
                initial={false}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ delay: index * 0.06 }}
              >
                <Icon weight="duotone" />
                <h3>{item.title}</h3>
                <p>{item.copy}</p>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section className="interactive-suite">
        <div className="suite-copy">
          <h2 className="breath-title">点击模块，查看它能完成什么。</h2>
          <p>四个核心场景围绕同一套资料、模板、知识和模型配置运转，减少重复整理。</p>
          <div className="slide-tabs" role="tablist" aria-label="核心功能">
            {heroSlides.map((slide, index) => {
              const Icon = slide.icon;
              return (
                <button
                  key={slide.title}
                  className={index === activeSlide ? "active" : ""}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-selected={index === activeSlide}
                >
                  <Icon weight="duotone" />
                  <span>{slide.title}</span>
                </button>
              );
            })}
          </div>
        </div>
        <motion.div
          className="feature-orbit"
          key={currentSlide.title}
          initial={reduce ? false : { opacity: 0, scale: 0.96, rotateX: 5 }}
          animate={{ opacity: 1, scale: 1, rotateX: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img src={currentSlide.image} alt={`${currentSlide.title}宣传图`} />
          <div className="orbit-copy">
            <h3>{currentSlide.title}</h3>
            <p>{currentSlide.copy}</p>
          </div>
        </motion.div>
      </section>

      <section id="showcase" className="showcase">
        <div className="showcase-head">
          <h2 className="breath-title">真实功能界面展示</h2>
          <p>招投标、公文、软著、专利和配置界面都来自当前软件截图。</p>
        </div>
        <div className="showcase-tabs" role="tablist" aria-label="界面展示">
          {screens.map((screen) => (
            <button
              key={screen.key}
              type="button"
              className={screen.key === activeScreen ? "active" : ""}
              onClick={() => setActiveScreen(screen.key)}
              aria-selected={screen.key === activeScreen}
            >
              {screen.label}
            </button>
          ))}
        </div>
        <motion.div
          className="showcase-stage"
          key={currentScreen.key}
          initial={reduce ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
        >
          <div className="showcase-caption">
            <h3>{currentScreen.title}</h3>
            <span>{currentScreen.label}</span>
          </div>
          <img src={currentScreen.image} alt={`禹都AI解决方案助手${currentScreen.label}界面`} />
        </motion.div>
      </section>

      <section id="download" className="download">
        <div className="download-copy">
          <h2 className="breath-title">获取最新版</h2>
          <p>
            当前最新版本 <strong>{release.tag_name}</strong>，发布于{" "}
            {new Date(release.published_at).toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" })}。
          </p>
          <a className="repo-link" href="https://github.com/liwg1995/YuduBid" target="_blank" rel="noreferrer">
            <GithubLogo />
            开源链接 liwg1995/YuduBid
          </a>
          <p className="star-note">若您喜欢这个项目，记得在Github上对本项目点一个Star🌟！并欢迎提issue～</p>
        </div>
        <div className="download-grid">
          {downloads.map((item) => {
            const Icon = item.icon;
            const disabled = !item.asset;
            return (
              <a
                className={`download-card ${disabled ? "disabled" : ""}`}
                key={`${item.label}-${item.detail}`}
                href={item.asset?.browser_download_url ?? release.html_url}
                target="_blank"
                rel="noreferrer"
                aria-disabled={disabled}
              >
                <Icon weight="duotone" />
                <span className="download-title">{item.label}</span>
                <span>{item.detail}</span>
                <small>{item.asset ? bytesToSize(item.asset.size) : status === "loading" ? "正在获取下载地址" : "前往 Release 页面"}</small>
                <ArrowRight className="arrow" />
              </a>
            );
          })}
        </div>
      </section>

      <footer>
        <span>Copyright © 2026 禹都一只猫</span>
        <a href={release.html_url} target="_blank" rel="noreferrer">GitHub Releases</a>
      </footer>
    </main>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
