"use client";

import { useFormFields } from "@payloadcms/ui";
import React, { useEffect, useMemo, useState } from "react";
import { CRAFT_GROUPS, CRAFT_POSITIONS, craftLine } from "../../lib/crm/crafts";
import { useFormUpdater } from "./useFormUpdater";

/* 商品行顶部的小工具：
   1) 从产品库选款 → 自动填款号、面料、主图（填过的格子不会被覆盖）
   2) 选部位 + 工艺 → 往「工艺 / 描述」里加一行，例如 Front: DTF Printing
   两项都可以不用，直接手填下面的字段。 */

type ProductLite = {
  id: number;
  name?: string | null;
  productCode?: string | null;
  fabric?: string | null;
  gsm?: string | null;
  coverImage?: string | null;
};

/* 产品库 241 条，一次拉完缓存在内存里，切发票不用重新拉。 */
let productsPromise: Promise<ProductLite[]> | null = null;
const loadProducts = (): Promise<ProductLite[]> => {
  if (!productsPromise) {
    const query = [
      "limit=300",
      "depth=0",
      "sort=name",
      "select[name]=true",
      "select[productCode]=true",
      "select[fabric]=true",
      "select[gsm]=true",
      "select[coverImage]=true",
    ].join("&");
    productsPromise = fetch(`/api/products?${query}`, { credentials: "include" })
      .then((res) => (res.ok ? res.json() : { docs: [] }))
      .then((data: { docs?: ProductLite[] }) => data.docs ?? [])
      .catch(() => []);
  }
  return productsPromise;
};

const fabricText = (product: ProductLite): string => {
  const fabric = product.fabric?.trim() ?? "";
  const gsm = product.gsm?.trim() ?? "";
  if (!fabric) return gsm;
  if (!gsm) return fabric;
  return /\d/.test(gsm) && !/gsm/i.test(gsm) ? `${fabric} ${gsm}gsm` : `${fabric} ${gsm}`;
};

/* 「工艺 / 描述」里手写的其他说明要留着，所以只把符合「部位: 工艺」的行当成工艺条目。 */
const POSITION_VALUES = new Set<string>(CRAFT_POSITIONS.map((item) => item.value));
const PROCESS_VALUES = new Set<string>(CRAFT_GROUPS.flatMap((group) => group.items.map((item) => item.value)));

const isCraftLine = (line: string): boolean => {
  const match = /^(.*?):\s*(.*)$/.exec(line.trim());
  if (!match) return false;
  return POSITION_VALUES.has(match[1].trim()) && PROCESS_VALUES.has(match[2].trim());
};

const boxStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 8,
  padding: "10px 12px",
  marginBottom: 12,
  border: "1px solid var(--theme-elevation-150)",
  borderRadius: 4,
  background: "var(--theme-elevation-50)",
};

const controlStyle: React.CSSProperties = {
  height: 32,
  padding: "0 8px",
  border: "1px solid var(--theme-elevation-200)",
  borderRadius: 4,
  background: "var(--theme-input-bg, #fff)",
  color: "var(--theme-text)",
  fontSize: 13,
  maxWidth: 220,
};

const buttonStyle: React.CSSProperties = {
  ...controlStyle,
  cursor: "pointer",
  padding: "0 12px",
  fontWeight: 600,
};

const hintStyle: React.CSSProperties = {
  color: "var(--theme-elevation-600)",
  fontSize: 12,
};

const chipRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  alignItems: "center",
  gap: 6,
  width: "100%",
  marginTop: 2,
};

const chipStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 4,
  padding: "3px 4px 3px 10px",
  border: "1px solid var(--theme-elevation-200)",
  borderRadius: 999,
  background: "var(--theme-elevation-50)",
  color: "var(--theme-text)",
  fontSize: 12,
};

const chipButtonStyle: React.CSSProperties = {
  border: "none",
  background: "transparent",
  color: "var(--theme-elevation-600)",
  cursor: "pointer",
  fontSize: 14,
  lineHeight: 1,
  padding: "0 4px",
};

export const ItemPicker: React.FC<{ path?: string }> = ({ path }) => {
  const update = useFormUpdater();
  const fields = useFormFields(([all]) => all);

  const base = useMemo(() => (path ? path.replace(/\.itemPicker$/, "") : ""), [path]);
  const value = (name: string): string => {
    const field = fields?.[`${base}.${name}`];
    const v = field?.value;
    return typeof v === "string" ? v : "";
  };

  const [products, setProducts] = useState<ProductLite[]>([]);
  const [keyword, setKeyword] = useState("");
  const [pickedId, setPickedId] = useState("");
  const [position, setPosition] = useState<string>(CRAFT_POSITIONS[0].value);
  const [process, setProcess] = useState<string>(CRAFT_GROUPS[0].items[0].value);
  const [flash, setFlash] = useState("");

  useEffect(() => {
    let alive = true;
    loadProducts().then((list) => {
      if (alive) setProducts(list);
    });
    return () => {
      alive = false;
    };
  }, []);

  const applyProduct = (id: string) => {
    setPickedId(id);
    const product = products.find((p) => String(p.id) === id);
    if (!product) return;

    /* 明着换款就覆盖款号/面料/主图；产品这条没填的字段保留原值。 */
    const filled: string[] = [];
    const code = product.productCode?.trim() ?? "";
    if (code) {
      update(`${base}.product`, code);
      filled.push("款号");
    }
    const fabric = fabricText(product);
    if (fabric) {
      update(`${base}.fabric`, fabric);
      filled.push("面料");
    }
    const cover = product.coverImage?.trim() ?? "";
    if (cover) {
      update(`${base}.image`, cover);
      filled.push("主图");
    }
    setFlash(filled.length ? `已带出：${filled.join("、")}` : "这条产品没有款号/面料/主图，请手填");
  };

  const visibleProducts = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return products;
    return products.filter((p) =>
      `${p.productCode ?? ""} ${p.name ?? ""}`.toLowerCase().includes(q),
    );
  }, [keyword, products]);

  const addCraft = () => {
    const line = craftLine(position, process);
    const current = value("description").trim();
    if (current.split("\n").map((s) => s.trim()).includes(line)) {
      setFlash("这条工艺已经在描述里了");
      return;
    }
    update(`${base}.description`, current ? `${current}\n${line}` : line);
    setFlash(`已加入：${line}（可以继续加别的部位）`);
  };

  const removeCraft = (line: string) => {
    const rest = value("description")
      .split("\n")
      .filter((row) => row.trim() !== line)
      .join("\n")
      .trim();
    update(`${base}.description`, rest);
    setFlash(`已删除：${line}`);
  };

  const clearCraft = () => {
    update(`${base}.description`, "");
    setFlash("描述已清空");
  };

  /* 已经写进描述里的工艺条目，一件衣服可以有好几条（前幅 + 后幅 + 袖子…）。 */
  const craftLines = value("description")
    .split("\n")
    .map((line) => line.trim())
    .filter(isCraftLine);

  /* 只在真实存在商品行的页面渲染；新建空行时也照常显示，方便先选款。 */
  if (!base) return null;

  return (
    <div style={boxStyle}>
      <span style={{ fontSize: 13, fontWeight: 600 }}>快速填写</span>

      <input
        style={{ ...controlStyle, width: 130 }}
        placeholder="搜款号/品名"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <select style={{ ...controlStyle, maxWidth: 260 }} value={pickedId} onChange={(e) => applyProduct(e.target.value)}>
        <option value="">— 从产品库选款 —</option>
        {visibleProducts.map((p) => (
          <option key={p.id} value={String(p.id)}>
            {p.productCode ? `${p.productCode} · ${p.name ?? ""}` : p.name ?? `#${p.id}`}
          </option>
        ))}
      </select>

      <span style={{ ...hintStyle, marginLeft: 4 }}>工艺</span>
      <select data-testid="craft-position" style={controlStyle} value={position} onChange={(e) => setPosition(e.target.value)}>
        {CRAFT_POSITIONS.map((p) => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>
      <select data-testid="craft-process" style={{ ...controlStyle, maxWidth: 200 }} value={process} onChange={(e) => setProcess(e.target.value)}>
        {CRAFT_GROUPS.map((group) => (
          <optgroup key={group.name} label={group.name}>
            {group.items.map((item) => (
              <option key={item.value} value={item.value}>{item.label} · {item.value}</option>
            ))}
          </optgroup>
        ))}
      </select>
      <button type="button" data-testid="craft-add" style={buttonStyle} onClick={addCraft}>+ 添加工艺</button>
      <button type="button" style={buttonStyle} onClick={clearCraft}>清空描述</button>

      {craftLines.length > 0 && (
        <div data-testid="craft-chips" style={chipRowStyle}>
          <span style={hintStyle}>已加工艺（{craftLines.length} 条）：</span>
          {craftLines.map((line) => (
            <span key={line} style={chipStyle}>
              {line}
              <button type="button" style={chipButtonStyle} title="删掉这条工艺" onClick={() => removeCraft(line)}>
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div style={{ ...hintStyle, width: "100%" }}>
        {flash || "前幅、后幅、袖子可以分开加多条；点工艺右边的 × 删掉一条，手写的其他说明不受影响。"}
      </div>
    </div>
  );
};
