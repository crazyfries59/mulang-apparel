import ExcelJS from "exceljs";
import { toEnglishCountry } from "../crm/country";
import layout from "./layout.json";

/* 按 lib/invoice/layout.json 出一张与本机 make_invoice.py 逐格一致的发票。
   改动版式先改 layout.json；这里只放「怎么排」，不放尺寸和文案。 */

type ItemLike = {
  product?: string | null;
  colorSize?: string | null;
  description?: string | null;
  fabric?: string | null;
  image?: string | null;
  qty?: number | null;
  unitPrice?: number | null;
  rowAmount?: number | null;
  sizes?: Record<string, number | null> | null;
};

export type InvoiceLike = {
  number?: string | null;
  date?: string | null;
  kind?: string | null;
  billToCompany?: string | null;
  billToContact?: string | null;
  billToTel?: string | null;
  billToEmail?: string | null;
  billToAddress?: string | null;
  billToCountry?: string | null;
  items?: ItemLike[] | null;
  shipping?: { label?: string | null; amount?: number | null }[] | null;
  payments?: { date?: string | null; method?: string | null; amount?: number | null }[] | null;
  fx?: { currency?: string | null; quote?: number | null; on?: string | null; amount?: number | null } | null;
  totals?: {
    subtotal?: number | null;
    shipping?: number | null;
    total?: number | null;
    received?: number | null;
    deposit?: number | null;
    balance?: number | null;
  } | null;
  remarks?: string[] | null;
};

export type ResolvedImage = { buffer: Buffer; width: number; height: number };

const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "3XL"];
const SIZE_FIELDS: Record<string, string> = {
  XS: "sizeXs",
  S: "sizeS",
  M: "sizeM",
  L: "sizeL",
  XL: "sizeXl",
  XXL: "sizeXxl",
  "3XL": "size3xl",
};
const PAY_LABEL: Record<string, string> = { tt: "T/T" };

const num = (value: unknown): number => (typeof value === "number" && Number.isFinite(value) ? value : 0);
const r2 = (value: number): number => Math.round(value * 100) / 100;

/** 款号单元格：款号一行，下面按尺码分行，例如「8 S」。 */
const skuText = (item: ItemLike): string => {
  const lines = [item.product ?? ""];
  const sizes = item.sizes ?? {};
  for (const size of SIZES) {
    const qty = num(sizes[SIZE_FIELDS[size]]);
    if (qty > 0) lines.push(`${qty} ${size}`);
  }
  return lines.join("\n");
};

/** 按固定字符宽度估算要几行，用来撑行高（和 Python 的 text_height 一个思路）。 */
const linesFor = (text: string, charsPerLine: number): number =>
  text.split("\n").reduce((sum, line) => sum + Math.max(1, Math.ceil(line.length / charsPerLine)), 0);

export const buildInvoiceWorkbook = (invoice: InvoiceLike, images: (ResolvedImage | null)[] = []): ExcelJS.Workbook => {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet("Invoice");
  const font = layout.fonts;

  const border = { style: "thin" as const, color: { argb: layout.borderColor } };
  const borders = { top: border, left: border, bottom: border, right: border };
  const solid = (argb?: string): ExcelJS.Fill | undefined =>
    argb ? { type: "pattern", pattern: "solid", fgColor: { argb } } : undefined;

  const center: Partial<ExcelJS.Alignment> = { horizontal: "center", vertical: "middle", wrapText: true };
  const left: Partial<ExcelJS.Alignment> = { horizontal: "left", vertical: "middle", wrapText: true };
  const topLeft: Partial<ExcelJS.Alignment> = { horizontal: "left", vertical: "top", wrapText: true };

  ws.columns = layout.columns.map((width) => ({ width }));

  type CellOpts = {
    bold?: boolean;
    size?: number;
    align?: Partial<ExcelJS.Alignment>;
    fill?: string;
    numFmt?: string;
  };

  const styleCell = (row: number, col: number, opts: CellOpts): ExcelJS.Cell => {
    const cell = ws.getCell(row, col);
    cell.font = { name: font.family, size: opts.size ?? font.body, bold: Boolean(opts.bold) };
    cell.alignment = opts.align ?? center;
    cell.border = borders;
    const fill = solid(opts.fill);
    if (fill) cell.fill = fill;
    if (opts.numFmt) cell.numFmt = opts.numFmt;
    return cell;
  };

  let row = 0;

  const merged = (startRow: number, first: number, last: number, value: string | number | null, opts: CellOpts = {}): number => {
    if (last > first) ws.mergeCells(startRow, first, startRow, last);
    for (let col = first; col <= last; col += 1) styleCell(startRow, col, opts);
    const cell = ws.getCell(startRow, first);
    if (value !== null && value !== undefined) cell.value = value;
    return startRow;
  };

  const fullRow = (value: string | number | null, height: number, opts: CellOpts = {}): number => {
    row += 1;
    merged(row, 1, layout.columns.length, value, opts);
    ws.getRow(row).height = height;
    return row;
  };

  /* 抬头：公司名 / 地址 / 网址+WhatsApp */
  const company = layout.company;
  fullRow(company.name, layout.rowHeights.title, { bold: true, size: font.title });
  if (company.address) fullRow(company.address, layout.rowHeights.subtitle);
  const bits = [company.website, company.email, company.whatsapp].filter(Boolean) as string[];
  if (bits.length) fullRow(bits.join("    "), layout.rowHeights.subtitle);
  fullRow(layout.bannerText, layout.rowHeights.banner, { size: font.banner, fill: layout.fills.title });

  /* 客户与票面信息：Company / Date、Contact / Tel、Email */
  const dateValue = invoice.date ? new Date(invoice.date) : new Date();
  const infoRows: [string, string, string | null, string | number | null][] = [
    ["Company:", invoice.billToCompany ?? "", "Date:", ""],
    ["Contact:", invoice.billToContact ?? "", "Tel:", invoice.billToTel ?? ""],
    ["Email:", invoice.billToEmail ?? "", null, null],
  ];
  for (const [leftLabel, leftValue, rightLabel, rightValue] of infoRows) {
    row += 1;
    const current = row;
    styleCell(current, 1, { bold: true });
    ws.getCell(current, 1).value = leftLabel;
    if (rightLabel) {
      merged(current, 2, 4, leftValue);
      styleCell(current, 5, { bold: true });
      ws.getCell(current, 5).value = rightLabel;
      merged(current, 6, 8, null);
      const target = ws.getCell(current, 6);
      if (leftLabel === "Company:") {
        target.value = dateValue;
        target.numFmt = layout.dateFormat;
      } else {
        target.value = (rightValue as string) ?? "";
      }
    } else {
      merged(current, 2, 8, leftValue);
    }
    ws.getRow(current).height = layout.rowHeights.info;
  }

  row += 1;
  styleCell(row, 1, { bold: true });
  ws.getCell(row, 1).value = "Address:";
  const address = invoice.billToAddress ?? "";
  /* 国家跟在地址后面；地址里已经写了就不重复。 */
  const country = toEnglishCountry(invoice.billToCountry);
  const addressText = country && !address.toLowerCase().includes(country.toLowerCase())
    ? [address, country].filter(Boolean).join(", ")
    : address;
  merged(row, 2, 8, addressText);
  ws.getRow(row).height = Math.max(layout.rowHeights.info, linesFor(addressText, 110) * 15);

  /* 表头 */
  row += 1;
  layout.headers.forEach((header, index) => {
    const cell = styleCell(row, index + 1, { bold: true, size: font.head });
    cell.value = header;
  });
  ws.getRow(row).height = layout.rowHeights.head;

  /* 明细 */
  const items = invoice.items ?? [];
  const firstItemRow = row + 1;
  items.forEach((item, index) => {
    row += 1;
    const current = row;
    const qty = num(item.qty);
    const price = num(item.unitPrice);
    const amount = item.rowAmount != null ? num(item.rowAmount) : r2(qty * price);

    styleCell(current, 1, {});
    styleCell(current, 2, {}).value = skuText(item);
    styleCell(current, 3, {}).value = item.description ?? "";
    styleCell(current, 4, {}).value = item.fabric ?? "";
    styleCell(current, 5, {}).value = item.colorSize ?? "";
    styleCell(current, 6, {}).value = qty;
    styleCell(current, 7, { numFmt: layout.currencyFormats.USD }).value = price;
    styleCell(current, 8, { numFmt: layout.currencyFormats.USD }).value = {
      formula: `F${current}*G${current}`,
      result: amount,
    };

    let height = Math.max(
      layout.rowHeights.item,
      linesFor(skuText(item), 15) * 15,
      linesFor(item.description ?? "", 13) * 15,
      linesFor(item.fabric ?? "", 22) * 15,
      linesFor(item.colorSize ?? "", 16) * 15,
    );

    const picture = images[index];
    if (picture) {
      /* 走 base64 而不是 buffer：exceljs 的类型定义和当前 @types/node 的 Buffer 泛型对不上。 */
      const id = wb.addImage({ base64: picture.buffer.toString("base64"), extension: "png" });
      const box = layout.pictureBox;
      const scale = Math.min(box[0] / picture.width, box[1] / picture.height);
      ws.addImage(id, {
        tl: { col: 0, row: current - 1 },
        ext: { width: Math.round(picture.width * scale), height: Math.round(picture.height * scale) },
      });
      height = Math.max(height, 88);
    }
    ws.getRow(current).height = height;
  });

  /* 汇总：运费、TOTAL、已收或定金、尾款、换算 */
  const summary = (label: string, value: number | null, options: { highlight?: boolean; qty?: number | null; numFmt?: string; formula?: string } = {}): number => {
    row += 1;
    const current = row;
    const fill = options.highlight ? layout.fills.summary : undefined;
    merged(current, 1, 5, label, { bold: options.highlight, fill, align: left });
    const qtyCell = styleCell(current, 6, { bold: options.highlight, fill, numFmt: layout.pcsFormat });
    if (options.qty != null) qtyCell.value = options.qty;
    styleCell(current, 7, { fill });
    const amountCell = styleCell(current, 8, {
      bold: options.highlight,
      fill,
      numFmt: options.numFmt ?? layout.currencyFormats.USD,
    });
    if (options.formula) {
      amountCell.value = { formula: options.formula, result: value ?? 0 };
    } else if (value != null) {
      amountCell.value = value;
    }
    ws.getRow(current).height = layout.rowHeights.summary;
    return current;
  };

  const totals = invoice.totals ?? {};
  for (const charge of invoice.shipping ?? []) {
    const amount = charge.amount;
    summary(charge.label || "Shipping by express delivery (5-7 days)", amount == null ? null : num(amount));
  }

  const totalRow = summary("TOTAL (USD):", num(totals.total), {
    highlight: true,
    qty: num(totals.total ? items.reduce((sum, item) => sum + num(item.qty), 0) : 0),
    formula: `SUM(H${firstItemRow}:H${row})`,
  });

  const payments = invoice.payments ?? [];
  let dueRow = totalRow;
  if (payments.length) {
    const receivedRows = payments.map((payment) => {
      const when = payment.date ? new Date(payment.date) : null;
      const stamp = when ? `${when.getFullYear()}/${when.getMonth() + 1}/${when.getDate()}` : "";
      const method = payment.method ? PAY_LABEL[payment.method] ?? payment.method : "";
      const extra = [stamp, method].filter(Boolean).join(" ");
      return summary(extra ? `RECEIVED (${extra}):` : "RECEIVED:", num(payment.amount), { highlight: true });
    });
    const plus = receivedRows.map((line) => `H${line}`).join("+");
    dueRow = summary("BALANCE (USD):", num(totals.balance), {
      highlight: true,
      formula: `H${totalRow}-(${plus})`,
    });
  } else if (invoice.kind !== "sample") {
    const depositRow = summary("50% DEPOSIT (USD):", num(totals.deposit), {
      highlight: true,
      formula: `ROUND(H${totalRow}*0.5,2)`,
    });
    dueRow = summary("BALANCE (USD):", num(totals.balance), {
      highlight: true,
      formula: `H${totalRow}-H${depositRow}`,
    });
  }

  /* 换算金额：只印数字，不印汇率。 */
  const fx = invoice.fx;
  if (fx?.currency && num(fx.quote) > 0 && fx.amount != null) {
    const base = fx.on === "balance" ? dueRow : totalRow;
    const what = fx.on === "balance" ? "BALANCE" : "TOTAL";
    summary(`${what} IN ${fx.currency}:`, num(fx.amount), {
      highlight: true,
      formula: `ROUND(H${base}/${num(fx.quote)},2)`,
      numFmt: layout.currencyFormats[fx.currency as keyof typeof layout.currencyFormats] ?? `#,##0.00" ${fx.currency}"`,
    });
  }

  /* 备注与条款 */
  row += 1;
  merged(row, 1, layout.columns.length, "Remark:", {
    bold: true,
    align: left,
    fill: layout.fills.remark,
  });
  ws.getRow(row).height = layout.rowHeights.remark;

  const kind = invoice.kind === "sample" ? "sample" : "bulk";
  const terms = [...layout.terms[kind], ...(invoice.remarks ?? [])];
  const text = terms.map((term, index) => `${index + 1}. ${term}`).join("\n");
  row += 1;
  merged(row, 1, layout.columns.length, text, { align: topLeft });
  ws.getRow(row).height = Math.max(layout.rowHeights.remark, linesFor(text, 140) * 14);

  /* 打印：A4 竖版，一页宽 */
  ws.pageSetup = {
    paperSize: 9,
    orientation: "portrait",
    fitToPage: true,
    fitToWidth: 1,
    fitToHeight: 0,
    printArea: `A1:H${row}`,
    margins: { left: 0.4, right: 0.4, top: 0.75, bottom: 0.75, header: 0.3, footer: 0.3 },
  };

  return wb;
};

export const invoiceFileName = (invoice: InvoiceLike): string => {
  const who = invoice.billToContact || invoice.billToCompany || "客户";
  const kind = invoice.kind === "sample" ? "样品" : "大货";
  return `${invoice.number ?? "发票"} ${who} ${kind}.xlsx`;
};
