/* 工艺选项：部位 + 工艺，来自本机开票页面的 options.json（2026-11-04 从 hongyuapparel 工艺页整理）。
   发票「工艺 / 描述」列按「部位: 工艺」一行一条输出，例如 Front: DTF Printing。 */

export const CRAFT_POSITIONS = [
  { value: "Front", label: "前幅 Front" },
  { value: "Back", label: "后幅 Back" },
  { value: "Left chest", label: "左胸 Left chest" },
  { value: "Right chest", label: "右胸 Right chest" },
  { value: "Sleeve", label: "袖子 Sleeve" },
  { value: "Back neck", label: "后领 Back neck" },
] as const;

export const CRAFT_GROUPS = [
  {
    name: "印花",
    items: [
      { value: "DTF Printing", label: "DTF 烫画" },
      { value: "DTG Printing", label: "DTG 直喷" },
      { value: "Puff Printing", label: "发泡印" },
      { value: "Screen Printing", label: "丝网印" },
      { value: "Rubber Printing", label: "胶浆印" },
      { value: "Reflective Printing", label: "反光印" },
      { value: "Foil Printing", label: "烫金" },
      { value: "Metallic Print", label: "金属色印" },
      { value: "Glitter", label: "闪粉" },
      { value: "Flocking", label: "植绒" },
    ],
  },
  {
    name: "刺绣",
    items: [
      { value: "Flat Embroidery", label: "平绣" },
      { value: "3D Embroidery", label: "立体绣" },
      { value: "Terry Embroidery", label: "毛巾绣" },
      { value: "Applique Embroidery", label: "贴布绣" },
      { value: "Embroidery Patch", label: "刺绣贴标" },
    ],
  },
  {
    name: "其他",
    items: [
      { value: "Rhinestone", label: "烫钻" },
      { value: "Embossing", label: "压花" },
      { value: "Laser", label: "激光" },
    ],
  },
  {
    name: "旧发票里用过",
    items: [
      { value: "Blank", label: "空白（不加工）" },
      { value: "Silicone Printing", label: "硅胶印" },
      { value: "Reverse Applique", label: "反向贴布" },
      { value: "Cold Transfer Printing", label: "冷转印" },
      { value: "Vintage Wash", label: "复古水洗" },
    ],
  },
] as const;

/** 一条工艺在发票上印成什么样。 */
export const craftLine = (position: string, process: string): string => `${position}: ${process}`;
