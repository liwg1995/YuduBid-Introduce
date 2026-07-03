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
    title: "项目管理全流程协作",
    copy: "贯穿项目创建、需求 PRD、排期推进、风险沟通、交付上线、汇报回款和复盘合规。",
    image: "/assets/project-management.jpg",
    icon: SquaresFour
  },
  {
    title: "论文导师全流程辅助",
    copy: "围绕选题、开题、文献综述、研究设计、逐章写作、答辩准备和格式查重形成路径。",
    image: "/assets/thesis-tutor.png",
    icon: FileDoc
  },
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
  { label: "项目", title: "项目管理工作台", image: "/assets/project-management.jpg" },
  { label: "论文", title: "论文导师工作台", image: "/assets/thesis-tutor.png" },
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
    key: "project",
    label: "项目管理",
    title: "把项目从计划、推进、交付、复盘到合规收拢成一个工作台",
    image: "/assets/screen-project-management.jpg"
  },
  {
    key: "thesis",
    label: "论文导师",
    title: "先定位论文阶段，再生成能走下去的诊断路线和写作档案",
    image: "/assets/screen-thesis.png"
  },
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
  { title: "本地工作区", copy: "项目档案、资料、草稿、模板、论文档案和知识库集中管理，交付过程可回看。", icon: SquaresFour },
  { title: "智能生成", copy: "从资料解析到正文扩写，多任务后台执行，减少重复复制。", icon: MagicWand },
  { title: "闭环交付", copy: "格式检查、润色修订、Word 导出、备份和版本留痕形成稳定流程。", icon: CheckCircle },
  { title: "知识复用", copy: "把项目复盘、历史方案、论文材料、模板、代码和经验沉淀为可持续复用资产。", icon: ShieldCheck }
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
    let raf = 0;
    let frame = 0;
    let width = 0;
    let height = 0;
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5, active: false };
    const scroll = { current: 0, target: 0 };
    const seed = 42;
    const random = (index: number) => {
      const value = Math.sin(index * 999 + seed) * 10000;
      return value - Math.floor(value);
    };
    const clamp = (value: number, min = 0, max = 1) => Math.min(max, Math.max(min, value));
    const mix = (from: number, to: number, amount: number) => from + (to - from) * amount;
    const rgba = (r: number, g: number, b: number, a: number) => `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
    const mixColor = (from: [number, number, number], to: [number, number, number], amount: number, alpha: number) =>
      rgba(mix(from[0], to[0], amount), mix(from[1], to[1], amount), mix(from[2], to[2], amount), alpha);
    type Point = {
      x: number;
      y: number;
      baseX: number;
      baseY: number;
      vx: number;
      vy: number;
      layer: number;
      phase: number;
      radius: number;
      tone: number;
    };
    type Orb = {
      x: number;
      y: number;
      radius: number;
      drift: number;
      phase: number;
      palette: Array<[number, string]>;
      ring: string;
      speed: number;
    };
    type Dust = {
      angle: number;
      distance: number;
      spread: number;
      size: number;
      phase: number;
      tone: number;
      speed: number;
      alpha: number;
      tail: number;
    };
    let points: Point[] = [];
    let orbs: Orb[] = [];
    let innerDust: Dust[] = [];
    let haloDust: Dust[] = [];

    const makePoints = () => {
      const count = width < 720 ? 58 : width < 1100 ? 82 : 112;
      points = Array.from({ length: count }, (_, index) => {
        const layer = 0.55 + random(index + 11) * 1.45;
        const baseX = random(index + 21);
        const baseY = random(index + 31);
        return {
          x: baseX,
          y: baseY,
          baseX,
          baseY,
          vx: (random(index + 41) - 0.5) * 0.0007,
          vy: (random(index + 51) - 0.5) * 0.0007,
          layer,
          phase: random(index + 61) * Math.PI * 2,
          radius: 0.65 + random(index + 71) * 1.9,
          tone: random(index + 81)
        };
      });
    };

    const makeOrbs = () => {
      const scale = Math.min(width, 1280) / 1280;
      orbs = [
        {
          x: 0.75,
          y: 0.82,
          radius: 430 + 190 * scale,
          drift: 0.028,
          phase: 0.2,
          palette: [
            [0, "rgba(232, 252, 255, 0.46)"],
            [0.16, "rgba(95, 239, 255, 0.34)"],
            [0.42, "rgba(88, 111, 255, 0.24)"],
            [0.72, "rgba(18, 45, 112, 0.16)"],
            [1, "rgba(7, 20, 50, 0)"]
          ],
          ring: "rgba(188, 250, 255, 0.25)",
          speed: 0.0034
        },
        {
          x: 0.17,
          y: 0.7,
          radius: 92 + 48 * scale,
          drift: 0.022,
          phase: 2.4,
          palette: [
            [0, "rgba(112, 97, 255, 0.32)"],
            [0.32, "rgba(38, 218, 255, 0.26)"],
            [0.72, "rgba(25, 55, 118, 0.18)"],
            [1, "rgba(6, 18, 46, 0)"]
          ],
          ring: "rgba(116, 128, 255, 0.22)",
          speed: 0.0028
        },
        {
          x: 0.54,
          y: 0.48,
          radius: 70 + 32 * scale,
          drift: 0.018,
          phase: 4.1,
          palette: [
            [0, "rgba(241, 252, 255, 0.48)"],
            [0.22, "rgba(89, 232, 255, 0.26)"],
            [0.64, "rgba(28, 94, 190, 0.16)"],
            [1, "rgba(6, 18, 46, 0)"]
          ],
          ring: "rgba(220, 252, 255, 0.2)",
          speed: 0.0038
        }
      ];
    };

    const makeDust = () => {
      const innerCount = width < 720 ? 420 : width < 1100 ? 760 : 1120;
      const haloCount = width < 720 ? 360 : width < 1100 ? 680 : 980;
      innerDust = Array.from({ length: innerCount }, (_, index) => ({
        angle: -Math.PI * 0.96 + random(index + 101) * Math.PI * 1.06,
        distance: 0.11 + random(index + 111) ** 0.78 * 0.68,
        spread: (random(index + 121) - 0.5) * 0.28,
        size: 0.55 + random(index + 131) * 2.35,
        phase: random(index + 141) * Math.PI * 2,
        tone: random(index + 151),
        speed: 0.003 + random(index + 161) * 0.008,
        alpha: 0.14 + random(index + 171) * 0.7,
        tail: 2 + random(index + 181) * 12
      }));
      haloDust = Array.from({ length: haloCount }, (_, index) => ({
        angle: -Math.PI * 1.04 + random(index + 201) * Math.PI * 1.16,
        distance: 0.82 + random(index + 211) ** 0.48 * 0.48,
        spread: (random(index + 221) - 0.5) * 0.56,
        size: 0.45 + random(index + 231) * 2.15,
        phase: random(index + 241) * Math.PI * 2,
        tone: random(index + 251),
        speed: 0.0022 + random(index + 261) * 0.006,
        alpha: 0.16 + random(index + 271) * 0.66,
        tail: 8 + random(index + 281) * 34
      }));
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      makePoints();
      makeOrbs();
      makeDust();
    };

    const getScrollProgress = () => {
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      return clamp(window.scrollY / maxScroll);
    };

    const drawSceneWash = (progress: number) => {
      const violet = clamp((progress - 0.18) / 0.42);
      const warm = clamp((progress - 0.58) / 0.32);
      const wash = ctx.createLinearGradient(0, 0, width, height);
      wash.addColorStop(0, mixColor([5, 16, 42], [30, 18, 78], violet, 0.12 + progress * 0.08));
      wash.addColorStop(0.55, mixColor([6, 36, 84], [43, 76, 156], violet, 0.13 + warm * 0.05));
      wash.addColorStop(1, mixColor([3, 40, 84], [255, 130, 76], warm, 0.08 + warm * 0.1));
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, width, height);
    };

    const drawGlow = (progress: number) => {
      const warm = clamp((progress - 0.55) / 0.35);
      const gradient = ctx.createRadialGradient(pointer.x * width, pointer.y * height, 0, pointer.x * width, pointer.y * height, Math.min(width, height) * 0.42);
      gradient.addColorStop(0, pointer.active ? mixColor([36, 215, 255], [255, 140, 94], warm, 0.18) : mixColor([36, 215, 255], [255, 140, 94], warm, 0.08));
      gradient.addColorStop(0.34, mixColor([65, 90, 255], [255, 178, 94], warm, 0.08));
      gradient.addColorStop(1, "rgba(36, 215, 255, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);
    };

    const drawOrbs = (progress: number) => {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      orbs.forEach((orb, index) => {
        if (index === 0) return;
        const time = frame * orb.speed + orb.phase;
        const pointerPull = pointer.active ? 0.036 : 0.014;
        const orbit = progress * Math.PI * 1.7 + index;
        const cx = (orb.x + Math.sin(time + orbit) * (orb.drift + progress * 0.05) + (pointer.x - 0.5) * pointerPull * (index % 2 === 0 ? 1 : -0.72)) * width;
        const cy = (orb.y + Math.cos(time * 0.86 + orbit) * (orb.drift + progress * 0.035) + (pointer.y - 0.5) * pointerPull * (index % 2 === 0 ? 0.62 : -1)) * height;
        const radius = orb.radius * (0.84 + Math.min(width, height) / 1300) * (1 + Math.sin(progress * Math.PI + index) * 0.12);
        const core = ctx.createRadialGradient(cx - radius * 0.28, cy - radius * 0.32, radius * 0.04, cx, cy, radius);
        orb.palette.forEach(([stop, color]) => core.addColorStop(stop, color));
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();

        const rimRadius = radius * (0.44 + Math.sin(time * 1.4) * 0.035);
        const rim = ctx.createRadialGradient(cx + radius * 0.12, cy + radius * 0.08, rimRadius * 0.58, cx + radius * 0.12, cy + radius * 0.08, rimRadius);
        rim.addColorStop(0, "rgba(255, 255, 255, 0)");
        rim.addColorStop(0.72, "rgba(255, 255, 255, 0.018)");
        rim.addColorStop(0.86, orb.ring);
        rim.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = rim;
        ctx.beginPath();
        ctx.arc(cx + radius * 0.12, cy + radius * 0.08, rimRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = orb.ring;
        ctx.lineWidth = Math.max(0.8, radius * 0.006);
        ctx.globalAlpha = 0.42;
        ctx.beginPath();
        ctx.ellipse(cx, cy, radius * 0.54, radius * 0.2, time * 0.42, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
      });
      ctx.restore();
    };

    const drawHeroSphere = (progress: number) => {
      const orb = orbs[0];
      if (!orb) return;
      const stage = clamp(progress * 1.25);
      const violet = clamp((progress - 0.15) / 0.45);
      const warm = clamp((progress - 0.58) / 0.34);
      const particleBloom = 0.78 + Math.sin(progress * Math.PI) * 0.42 + warm * 0.28;
      const time = frame * orb.speed + orb.phase;
      const pointerPull = pointer.active ? 0.032 : 0.01;
      const cx = (mix(0.75, 0.42, stage) + Math.sin(time + progress * Math.PI * 2) * (0.018 + progress * 0.028) + (pointer.x - 0.5) * pointerPull) * width;
      const cy = (mix(0.82, 0.54, stage) + Math.cos(time * 0.74 + progress * Math.PI) * (0.018 + progress * 0.02) + (pointer.y - 0.5) * pointerPull * 0.5) * height;
      const radius = Math.max(width, height) * mix(0.38, 0.28, stage) * (1 + Math.sin(progress * Math.PI * 2) * 0.035);

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      const atmosphere = ctx.createRadialGradient(cx - radius * 0.1, cy - radius * 0.45, radius * 0.12, cx, cy, radius * 1.25);
      atmosphere.addColorStop(0, mixColor([206, 252, 255], [255, 201, 154], warm, 0.28));
      atmosphere.addColorStop(0.36, mixColor([34, 219, 255], [154, 97, 255], violet, 0.13 + progress * 0.05));
      atmosphere.addColorStop(0.72, mixColor([96, 110, 255], [255, 113, 87], warm, 0.09 + warm * 0.04));
      atmosphere.addColorStop(1, "rgba(6, 18, 46, 0)");
      ctx.fillStyle = atmosphere;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.25, 0, Math.PI * 2);
      ctx.fill();

      const body = ctx.createRadialGradient(cx - radius * 0.32, cy - radius * 0.48, radius * 0.05, cx + radius * 0.08, cy + radius * 0.04, radius);
      body.addColorStop(0, mixColor([245, 255, 255], [255, 235, 206], warm, 0.64));
      body.addColorStop(0.2, mixColor([122, 241, 255], [255, 152, 112], warm, 0.42));
      body.addColorStop(0.42, mixColor([104, 132, 255], [152, 100, 255], violet, 0.28 + progress * 0.04));
      body.addColorStop(0.68, mixColor([33, 82, 178], [199, 72, 132], warm, 0.2));
      body.addColorStop(1, "rgba(7, 20, 50, 0.02)");
      ctx.fillStyle = body;
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();

      const rim = ctx.createRadialGradient(cx, cy, radius * 0.72, cx, cy, radius * 1.02);
      rim.addColorStop(0, "rgba(255, 255, 255, 0)");
      rim.addColorStop(0.84, mixColor([187, 250, 255], [255, 183, 133], warm, 0.12 + progress * 0.04));
      rim.addColorStop(0.92, mixColor([255, 255, 255], [255, 218, 184], warm, 0.32 + progress * 0.08));
      rim.addColorStop(1, "rgba(255, 255, 255, 0)");
      ctx.fillStyle = rim;
      ctx.beginPath();
      ctx.arc(cx, cy, radius * 1.02, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = mixColor([194, 251, 255], [255, 185, 143], warm, 0.16 + progress * 0.1);
      ctx.lineWidth = Math.max(1, radius * 0.006);
      ctx.globalAlpha = 0.54;
      ctx.beginPath();
      ctx.ellipse(cx, cy, radius * (0.68 + progress * 0.12), radius * (0.22 + progress * 0.05), time * 0.34 + progress * 1.4, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;

      innerDust.forEach((dust) => {
        const pulse = Math.sin(frame * dust.speed + dust.phase);
        const swirl = frame * dust.speed * 0.22 + progress * 1.65;
        const angle = dust.angle + pulse * 0.11 + swirl;
        const distance = radius * (dust.distance + dust.spread * 0.1 + progress * 0.12 + Math.sin(swirl + dust.phase) * 0.018);
        const px = cx + Math.cos(angle) * distance * (1.12 + progress * 0.2) + (pointer.x - 0.5) * 18;
        const py = cy + Math.sin(angle) * distance * (0.7 + progress * 0.12) + (pointer.y - 0.5) * 12;
        const glow = dust.tone > 0.78;
        const alpha = dust.alpha * particleBloom * (0.68 + pulse * 0.22);
        if (dust.tone > 0.84) {
          const tailLength = dust.tail * (0.7 + progress * 0.9);
          ctx.beginPath();
          ctx.moveTo(px - Math.cos(angle) * tailLength, py - Math.sin(angle) * tailLength * 0.68);
          ctx.lineTo(px, py);
          ctx.strokeStyle = `rgba(255, 246, 221, ${alpha * 0.22})`;
          ctx.lineWidth = Math.max(0.35, dust.size * 0.32);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(px, py, dust.size * (glow ? 1.55 : 1) * (1 + progress * 0.18), 0, Math.PI * 2);
        ctx.fillStyle =
          dust.tone > 0.62 || warm > 0.45
            ? mixColor([255, 118, 86], [255, 174, 92], warm, alpha)
            : dust.tone > 0.34
              ? mixColor([250, 186, 95], [170, 104, 255], violet, alpha * 0.72)
              : mixColor([118, 238, 255], [141, 116, 255], violet, alpha * 0.54);
        ctx.fill();
      });

      haloDust.forEach((dust) => {
        const pulse = Math.sin(frame * dust.speed + dust.phase);
        const plume = frame * dust.speed * 0.18 + progress * 2.05;
        const angle = dust.angle + pulse * 0.16 + plume;
        const distance = radius * (dust.distance + dust.spread * 0.2 + progress * 0.28 + Math.sin(plume + dust.phase) * 0.03);
        const px = cx + Math.cos(angle) * distance * (1.2 + progress * 0.34) + (pointer.x - 0.5) * 26;
        const py = cy + Math.sin(angle) * distance * (0.7 + progress * 0.18) + (pointer.y - 0.5) * 18;
        const alpha = dust.alpha * (0.62 + pulse * 0.24) * (0.9 + progress * 0.55);
        const tailLength = dust.tail * (0.82 + progress * 1.1);
        ctx.beginPath();
        ctx.moveTo(px - Math.cos(angle) * tailLength, py - Math.sin(angle) * tailLength * 0.62);
        ctx.lineTo(px, py);
        ctx.strokeStyle = dust.tone > 0.72 ? mixColor([255, 255, 255], [255, 225, 190], warm, alpha * 0.26) : mixColor([169, 249, 255], [176, 130, 255], violet, alpha * 0.16);
        ctx.lineWidth = Math.max(0.35, dust.size * 0.4);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(px, py, dust.size * (1 + progress * 0.28), 0, Math.PI * 2);
        ctx.fillStyle = dust.tone > 0.72 ? mixColor([255, 255, 255], [255, 225, 190], warm, alpha) : mixColor([169, 249, 255], [176, 130, 255], violet, alpha * 0.66);
        ctx.fill();
      });

      ctx.restore();
    };

    const drawConnections = () => {
      for (let i = 0; i < points.length; i += 1) {
        const a = points[i];
        const ax = a.x * width;
        const ay = a.y * height;
        for (let j = i + 1; j < points.length; j += 1) {
          const b = points[j];
          const bx = b.x * width;
          const by = b.y * height;
          const distance = Math.hypot(ax - bx, ay - by);
          const limit = 112 + (a.layer + b.layer) * 14;
          if (distance > limit) continue;
          const midX = (ax + bx) * 0.5;
          const midY = (ay + by) * 0.5;
          const pointerDistance = Math.hypot(midX - pointer.x * width, midY - pointer.y * height);
          const pointerBoost = pointer.active ? Math.max(0, 1 - pointerDistance / 320) : 0.16;
          const alpha = Math.max(0, 1 - distance / limit) * (0.09 + pointerBoost * 0.28);
          if (alpha < 0.012) continue;
          ctx.beginPath();
          ctx.moveTo(ax, ay);
          ctx.lineTo(bx, by);
          ctx.strokeStyle = `rgba(102, 231, 255, ${alpha})`;
          ctx.lineWidth = 0.5 + pointerBoost * 0.7;
          ctx.stroke();
        }
      }
    };

    const draw = () => {
      scroll.target = getScrollProgress();
      scroll.current += (scroll.target - scroll.current) * 0.075;
      ctx.clearRect(0, 0, width, height);
      pointer.x += (pointer.tx - pointer.x) * 0.06;
      pointer.y += (pointer.ty - pointer.y) * 0.06;
      drawSceneWash(scroll.current);
      drawOrbs(scroll.current);
      drawHeroSphere(scroll.current);
      drawGlow(scroll.current);
      points.forEach((p) => {
        if (!reduced) {
          const waveX = Math.sin(frame * 0.006 + p.phase) * 0.00075 * p.layer;
          const waveY = Math.cos(frame * 0.004 + p.phase * 0.7) * 0.00062 * p.layer;
          p.x += p.vx + waveX;
          p.y += p.vy + waveY;
          p.baseX += p.vx * 0.24;
          p.baseY += p.vy * 0.24;
          if (p.x < -0.05) p.x = 1.05;
          if (p.x > 1.05) p.x = -0.05;
          if (p.y < -0.05) p.y = 1.05;
          if (p.y > 1.05) p.y = -0.05;
        }
        const px = p.x * width;
        const py = p.y * height;
        if (!reduced && pointer.active) {
          const dx = px - pointer.x * width;
          const dy = py - pointer.y * height;
          const distance = Math.hypot(dx, dy);
          if (distance < 260 && distance > 0) {
            const force = (1 - distance / 260) ** 2;
            p.x += (dx / distance) * force * 0.0022 * p.layer;
            p.y += (dy / distance) * force * 0.0022 * p.layer;
          }
        }
      });
      drawConnections();
      points.forEach((p) => {
        const px = p.x * width;
        const py = p.y * height;
        const pointerDistance = Math.hypot(px - pointer.x * width, py - pointer.y * height);
        const boost = pointer.active ? Math.max(0, 1 - pointerDistance / 220) : 0;
        const radius = p.radius + boost * 2.4;
        const alpha = 0.34 + p.layer * 0.16 + boost * 0.4;
        ctx.beginPath();
        ctx.arc(px, py, radius, 0, Math.PI * 2);
        ctx.fillStyle = p.tone > 0.68 ? `rgba(130, 119, 255, ${alpha})` : `rgba(52, 224, 255, ${alpha})`;
        ctx.fill();
        if (boost > 0.08) {
          ctx.beginPath();
          ctx.arc(px, py, radius * 4.8, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(36, 215, 255, ${boost * 0.035})`;
          ctx.fill();
        }
      });
      frame += 1;
      if (!reduced || frame < 3) raf = requestAnimationFrame(draw);
    };

    const move = (event: PointerEvent) => {
      pointer.tx = event.clientX / window.innerWidth;
      pointer.ty = event.clientY / window.innerHeight;
      pointer.active = true;
    };

    const leave = () => {
      pointer.active = false;
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerleave", leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerleave", leave);
    };
  }, []);

  return <canvas className="particle-field" ref={canvasRef} aria-hidden="true" />;
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
            面向项目管理、技术标书、公文写作、论文导师、软著和专利的一站式本地 AI 工作台。
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
          <p>六个核心场景围绕同一套资料、模板、知识和模型配置运转，减少重复整理。</p>
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
          <p>项目管理、论文导师、招投标、公文、软著、专利和配置界面都来自当前软件截图。</p>
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
