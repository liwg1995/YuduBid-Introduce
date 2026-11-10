import { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { AppleLogo } from "@phosphor-icons/react/dist/csr/AppleLogo";
import { ArrowRight } from "@phosphor-icons/react/dist/csr/ArrowRight";
import { BookOpen } from "@phosphor-icons/react/dist/csr/BookOpen";
import { Briefcase } from "@phosphor-icons/react/dist/csr/Briefcase";
import { GithubLogo } from "@phosphor-icons/react/dist/csr/GithubLogo";
import { MagnifyingGlassPlus } from "@phosphor-icons/react/dist/csr/MagnifyingGlassPlus";
import { SquaresFour } from "@phosphor-icons/react/dist/csr/SquaresFour";
import { WindowsLogo } from "@phosphor-icons/react/dist/csr/WindowsLogo";
import { X } from "@phosphor-icons/react/dist/csr/X";
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

const heroTitle = "从资料，到成果。";

const workspaceScreens = [
  {
    key: "presales",
    label: "售前工作台",
    title: "从客户需求到售前方案"
  },
  {
    key: "project",
    label: "项目协作",
    title: "从项目计划到交付复盘"
  },
  {
    key: "thesis",
    label: "论文导师",
    title: "从选题开题到写作答辩"
  },
  {
    key: "topic-application",
    label: "课题申报",
    title: "从课题建档到申报书导出"
  },
  {
    key: "doc",
    label: "公文",
    title: "起草、检查与润色公文"
  },
  {
    key: "copyright",
    label: "软著",
    title: "整理源码，生成软著材料"
  },
  {
    key: "patent",
    label: "专利",
    title: "挖掘专利点，生成交底书"
  },
  {
    key: "settings",
    label: "配置",
    title: "管理模型、解析与技能配置"
  }
];

const workspaceVersions = [
  { key: "new", label: "启象" },
  { key: "old", label: "守矩" }
];

const usagePages = [
  {
    title: "配置使用说明",
    href: "/guide/use-config.html",
    detail: "完成文本模型、生图模型、文本解析、技能管理和版本检测配置。",
    points: ["文本模型是所有生成功能的前提", "生图未配置时可回退 Mermaid", "word-optimization 可优化 Word 导出格式"]
  },
  {
    title: "技术标书使用说明",
    href: "/guide/use-bid.html",
    detail: "覆盖招标文件上传、解析、生成目录、事实设定、正文生成、扩写编辑和 Word 导出。",
    points: ["支持只解析关键项或完整解析", "目录可自由生成或按评分项对齐", "正文生成后可审计、修复、扩写和导出"]
  }
];

function bytesToSize(bytes: number) {
  const mb = bytes / 1024 / 1024;
  return `${mb.toFixed(1)} MB`;
}

function pickAsset(release: Release, matcher: (asset: ReleaseAsset) => boolean) {
  return release.assets.find(matcher);
}

function useRelease() {
  const [release, setRelease] = useState<Release | null>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

  useEffect(() => {
    const controller = new AbortController();
    fetch(`https://api.github.com/repos/liwg1995/YuduBid/releases/latest?ts=${Date.now()}`, {
      signal: controller.signal,
      cache: "no-store",
      headers: { Accept: "application/vnd.github+json" }
    })
      .then((res) => {
        if (!res.ok) throw new Error("release request failed");
        return res.json();
      })
      .then((data: Release) => {
        if (!data.tag_name || !data.published_at || !data.html_url || !Array.isArray(data.assets)) {
          throw new Error("invalid release response");
        }
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

const bidScreens = [
  {
    key: "bid",
    label: "正文工作台",
    title: "标书目录、正文生成和交付检查在同一条链路完成",
    image: "/assets/ui-bid-writing.webp"
  },
  { key: "bid-config", label: "生成设置", title: "配置生成范围、篇幅、配图和导出样式", image: "/assets/ui-bid-config.webp" },
  { key: "knowledge", label: "知识库", title: "从历史方案提取知识条目，随时回看原文", image: "/assets/ui-knowledge.webp" },
  { key: "duplicate", label: "标书查重", title: "从元数据、目录、正文和图片四个维度比对标书", image: "/assets/ui-duplicate.webp" },
  { key: "anonymous", label: "暗标检查", title: "按预设核查页面、正文格式和身份痕迹", image: "/assets/ui-anonymous.webp" },
  { key: "rejection", label: "废标项检查", title: "并排核对招标要求与投标文件", image: "/assets/ui-rejection.webp" },
  { key: "opportunity", label: "投标机会", title: "筛选公告、研判机会并记录跟进进度", image: "/assets/ui-opportunity.webp" }
];

function TypingTitle() {
  const [visibleCount, setVisibleCount] = useState(heroTitle.length);

  useEffect(() => {
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: number;

    function type(count: number) {
      setVisibleCount(count);
      timer = window.setTimeout(
        () => type(count === heroTitle.length ? 0 : count + 1),
        count === heroTitle.length ? 4200 : 125
      );
    }

    function syncMotion() {
      window.clearTimeout(timer);
      if (reducedMotion.matches) setVisibleCount(heroTitle.length);
      else type(0);
    }

    syncMotion();
    reducedMotion.addEventListener("change", syncMotion);
    return () => {
      window.clearTimeout(timer);
      reducedMotion.removeEventListener("change", syncMotion);
    };
  }, []);

  return (
    <h1 className="hero-title" aria-label={heroTitle}>
      {Array.from(heroTitle, (character, index) => (
        <span key={index} aria-hidden="true"
          data-pending={index >= visibleCount}
          data-caret={index === Math.max(0, visibleCount - 1)}
          data-start={visibleCount === 0 && index === 0}
          data-complete={visibleCount === heroTitle.length}>
          {character}
        </span>
      ))}
    </h1>
  );
}

function App() {
  const { release, status } = useRelease();
  const [activeScreen, setActiveScreen] = useState(bidScreens[0]);
  const lightbox = useRef<HTMLDialogElement>(null);
  const [preview, setPreview] = useState<{ image: string; label: string } | null>(null);

  function openPreview(image: string, label: string) {
    setPreview({ image, label });
    lightbox.current?.showModal();
  }

  const downloads = useMemo(() => {
    const windows = release && pickAsset(release, (asset) => asset.name.endsWith(".exe") && asset.name.toLowerCase().includes("win"));
    const macArm = release && pickAsset(release, (asset) => asset.name.endsWith(".dmg") && asset.name.toLowerCase().includes("arm64"));
    const macIntel = release && pickAsset(release, (asset) => asset.name.endsWith(".dmg") && asset.name.toLowerCase().includes("x64"));
    return [
      { label: "Windows", detail: "x64 exe 安装包", icon: WindowsLogo, asset: windows },
      { label: "macOS", detail: "Apple 芯片 dmg", icon: AppleLogo, asset: macArm },
      { label: "macOS", detail: "Intel x86 dmg", icon: AppleLogo, asset: macIntel }
    ];
  }, [release]);

  const releaseDate = release
    ? new Date(release.published_at).toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" })
    : null;

  return (
    <>
      <nav className="nav" aria-label="网站导航">
        <div className="nav-inner">
          <a className="brand" href="#top">
            <img src="/assets/yudubid-icon.png" width="24" height="24" alt="" />
            <span>禹都AI解决方案助手</span>
          </a>
          <div className="nav-links">
            <a href="#showcase"><Briefcase aria-hidden="true" />招投标</a>
            <a href="#features"><SquaresFour aria-hidden="true" />工作空间</a>
            <a href="#usage"><BookOpen aria-hidden="true" />使用指南</a>
            <a href="https://github.com/liwg1995/YuduBid" target="_blank" rel="noreferrer"><GithubLogo aria-hidden="true" />开源</a>
          </div>
          <a className="button primary nav-download" href="#download">下载</a>
        </div>
      </nav>

      <main id="top">
        <section className="hero"
          onPointerMove={(event) => {
            if (event.pointerType !== "mouse" || !matchMedia("(prefers-reduced-motion: no-preference)").matches) return;
            const hero = event.currentTarget;
            const bounds = hero.getBoundingClientRect();
            const x = (event.clientX - bounds.left) / bounds.width - 0.5;
            const y = (event.clientY - bounds.top) / bounds.height - 0.5;
            hero.style.setProperty("--hero-x", `${-x * 56}px`);
            hero.style.setProperty("--hero-y", `${-y * 32}px`);
            hero.style.setProperty("--hero-tilt", `${x * 9}deg`);
          }}
          onPointerLeave={({ currentTarget }) => {
            currentTarget.style.removeProperty("--hero-x");
            currentTarget.style.removeProperty("--hero-y");
            currentTarget.style.removeProperty("--hero-tilt");
          }}>
          <div className="hero-particles" aria-hidden="true" />
          <div className="hero-copy">
            <p className="eyebrow">禹都 AI 解决方案助手</p>
            <TypingTitle />
            <p className="intro">八个业务空间，一个本地 AI 工作台。</p>
            <div className="actions">
              <a className="button primary" href="#download">立即下载</a>
              <a className="button outline" href="#showcase">探索功能</a>
            </div>
          </div>
          <img className="hero-image screenshot" src="/assets/ui-workspace.webp" width="2000" height="1164" fetchPriority="high" alt="禹都工作台首页，展示八个业务空间" />
        </section>

        <section id="showcase" className="bid-section">
          <p className="eyebrow">招投标工作流</p>
          <h2>从找机会，到交标书。</h2>
          <p className="intro">研判机会、生成方案、复用知识，交付前逐项检查。</p>
          <div className="screen-controls" role="group" aria-label="选择招投标界面">
            {bidScreens.map((screen) => (
              <button key={screen.key} type="button" aria-pressed={activeScreen.key === screen.key}
                onClick={() => setActiveScreen(screen)}>
                {screen.label}
              </button>
            ))}
          </div>
          <figure className="bid-figure" key={activeScreen.key}>
            <figcaption aria-live="polite">{activeScreen.title}</figcaption>
            <button className="image-trigger" type="button" onClick={() => openPreview(activeScreen.image, activeScreen.label)}
              aria-label={`放大查看${activeScreen.label}`} aria-haspopup="dialog">
              <img className="screenshot" src={activeScreen.image} loading="lazy" width="1800" height="1047" alt={activeScreen.title} />
            </button>
          </figure>
        </section>

        <section id="features" className="workspaces">
          <header className="section-heading">
            <p className="eyebrow">业务空间</p>
            <h2>每项工作，都有自己的工作台。</h2>
          </header>
          <div className="workspace-grid">
            {workspaceScreens.map((screen) => (
              <article className="workspace" key={screen.key}>
                <h3>{screen.label}</h3>
                <p>{screen.title}</p>
                <div className="workspace-pair">
                  {workspaceVersions.map(({ key, label }) => {
                    const image = `/assets/compare-${screen.key}-${key}.webp`;
                    return (
                      <button key={key} className="image-trigger" type="button"
                        onClick={() => openPreview(image, `${screen.label} · ${label}`)}
                        aria-label={`放大查看${screen.label}的${label}界面`} aria-haspopup="dialog">
                        <span className="workspace-version">{label}<MagnifyingGlassPlus size={15} aria-hidden="true" /></span>
                        <img className="screenshot" src={image} loading="lazy" alt={`${screen.label}${label}界面`} />
                      </button>
                    );
                  })}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="usage" className="usage">
          <h2>开始使用。</h2>
          <div className="guide-grid">
            {usagePages.map((item) => (
              <a className="guide" href={item.href} key={item.href}>
                <h3>{item.title}</h3>
                <p>{item.detail}</p>
                <ul>{item.points.map((point) => <li key={point}>{point}</li>)}</ul>
                <span className="text-link">查看指南 <ArrowRight size={14} /></span>
              </a>
            ))}
          </div>
        </section>

      <section id="download" className="download">
        <div className="download-copy">
          <h2 >获取最新版</h2>
          <p>
            {release ? (
              <>当前最新版本 <strong>{release.tag_name}</strong>，发布于 {releaseDate}。</>
            ) : status === "loading" ? (
              "正在从 GitHub 获取最新版本…"
            ) : (
              "暂时无法获取最新版本，请稍后刷新重试。"
            )}
          </p>
          <a className="repo-link" href="https://github.com/liwg1995/YuduBid" target="_blank" rel="noreferrer">
            <GithubLogo />
            开源链接 liwg1995/YuduBid
          </a>
        </div>
        <div className="download-grid">
          {downloads.map((item) => {
            const Icon = item.icon;
            const disabled = !item.asset;
            return (
              <a
                className="download-card"
                key={`${item.label}-${item.detail}`}
                href={item.asset?.browser_download_url ?? release?.html_url ?? "https://github.com/liwg1995/YuduBid/releases"}
                target="_blank"
                rel="noreferrer"
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
        <a href={release?.html_url ?? "https://github.com/liwg1995/YuduBid/releases"} target="_blank" rel="noreferrer">GitHub Releases</a>
      </footer>
      </main>
      <dialog ref={lightbox} className="lightbox" aria-labelledby="preview-title"
        onClose={() => setPreview(null)}
        onClick={(event) => {
          if (event.target === event.currentTarget) event.currentTarget.close();
        }}>
        <div className="lightbox-content">
          <div className="lightbox-bar">
            <h2 id="preview-title">{preview?.label}</h2>
            <button type="button" aria-label="关闭图片预览" onClick={() => lightbox.current?.close()}>
              <X aria-hidden="true" />
            </button>
          </div>
          {preview && <img src={preview.image} alt={`${preview.label}界面`} />}
        </div>
      </dialog>
    </>
  );
}

createRoot(document.getElementById("root")!).render(<App />);
