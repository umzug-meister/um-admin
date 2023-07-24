import { PRIMARY, PRIMARY_LIGHT, WHITE } from './shared';

import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { autoTable } from 'jspdf-autotable';

interface Margin {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

interface Dims {
  h: number;
  w: number;
}

export default class PdfBuilder {
  static readonly dim_x = 210;
  static readonly dim_y = 297;
  static readonly pt_mm_factor = 0.353;
  doc: jsPDF;
  private filename: string;
  private readonly default_fontsize = 10;
  private x: number;
  y: number;
  private maxWidth: number;
  private maxHeight: number;
  private margin: Margin;

  constructor(filename: string, margin: Margin) {
    this.filename = filename;
    this.margin = margin;
    this.doc = new jsPDF('portrait', 'pt', 'a4');

    this.doc.setFontSize(this.default_fontsize);

    this.x = PdfBuilder.mm2pt(margin.left);
    this.y = PdfBuilder.mm2pt(margin.top);

    const widthMM = PdfBuilder.dim_x - margin.right - margin.left;
    this.maxWidth = PdfBuilder.mm2pt(widthMM);

    const heightMM = PdfBuilder.dim_y - margin.bottom - margin.top;
    this.maxHeight = PdfBuilder.mm2pt(heightMM);
  }

  public enumeratePages(text: string[]): void {
    const pageCount = this.doc.getNumberOfPages();

    for (let i = 0; i < pageCount; i++) {
      this.doc.setPage(i);
      this.doc.setFontSize(7);
      this.doc.setTextColor(85, 85, 85);
      const toPrint = [...text];
      toPrint.push(`Seite ${this.doc.getCurrentPageInfo().pageNumber}/${pageCount}`);

      this.doc.text(toPrint.join(' | '), PdfBuilder.mm2pt(205), PdfBuilder.mm2pt(292), { align: 'right' });
    }
    this.resetText();
  }

  public getY(): number {
    return PdfBuilder.pt2mm(this.y);
  }
  public setBold(): void {
    this.doc.setFont('Helvetica', 'normal', '700');
  }

  public setNormal(): void {
    this.doc.setFont('Helvetica', 'normal', 'normal');
  }

  public setMarginLeft(margin: number): void {
    this.maxWidth = this.maxWidth - PdfBuilder.mm2pt(margin);
    this.x = this.x + PdfBuilder.mm2pt(margin);
  }

  public save(): void {
    this.doc.save(this.filename);
  }

  public output(): string {
    return this.doc.output('datauristring', { filename: this.filename });
  }

  public addPage(margin?: Margin): void {
    if (margin) {
      this.margin = margin;
      const widthMM = PdfBuilder.dim_x - margin.right - margin.left;
      this.maxWidth = PdfBuilder.mm2pt(widthMM);

      const heightMM = PdfBuilder.dim_y - margin.bottom - margin.top;
      this.maxHeight = PdfBuilder.mm2pt(heightMM);
    }
    this.doc.addPage('a4', 'p');
    this.x = PdfBuilder.mm2pt(this.margin.left);
    this.y = PdfBuilder.mm2pt(this.margin.top);
  }

  public setColor(r: number, g: number, b: number): void {
    this.doc.setTextColor(r, g, b);
  }

  public addHeader(text: string, fontSize?: number, align?: 'left' | 'center' | 'right' | 'justify'): void {
    const _fontSize = fontSize ? fontSize : 16;
    this.setBold();
    this.doc.setTextColor(216, 63, 3);
    this.addText(text, _fontSize, undefined, align);
    this.resetText();
  }

  public addBlackHeader(text: string): void {
    this.addText(text, 12);
    this.resetText();
  }

  public addSpace(mm?: number): void {
    this.y += PdfBuilder.mm2pt(mm || 8);
  }

  public addPngImage(url: string, x: number, y: number, width: number, height: number): void {
    let img = new Image(width, height);
    img.src = url;
    this.doc.addImage(
      img,
      'PNG',
      PdfBuilder.mm2pt(x),
      PdfBuilder.mm2pt(y),
      PdfBuilder.mm2pt(width),
      PdfBuilder.mm2pt(height),
    );
  }

  public addKnick(): void {
    this.doc.setDrawColor(0, 0, 0);
    this.doc.line(0, PdfBuilder.mm2pt(100), 40, PdfBuilder.mm2pt(100));
    this.resetText();
  }

  public addLine(x?: number): void {
    let maxX = PdfBuilder.mm2pt(PdfBuilder.dim_x - this.margin.right);
    this.doc.setDrawColor(150, 150, 150);
    let _x = x || this.x;
    this.doc.line(_x, this.y, maxX, this.y);
    this.y += 5;
    this.resetText();
  }

  public addTop(left: string[], right: string[]): void {
    this.doc.setTextColor(85, 85, 85);
    this.addLeftRight(left, right, 8);
    this.resetText();
  }

  public addTable(head: any, body: any, columnStyles?: any, headStyles = {} as any, margin = 20): void {
    let bottom = PdfBuilder.mm2pt(10);
    ((this.doc as any).autoTable as autoTable)({
      head: head,
      body: body,
      theme: 'grid',
      columnStyles,
      headStyles: { fillColor: PRIMARY, textColor: WHITE, ...headStyles },
      bodyStyles: { halign: 'left', textColor: [0, 0, 0], lineColor: PRIMARY_LIGHT },
      styles: { fontSize: 9, cellPadding: 2 },
      startY: this.y,
      margin: {
        top: PdfBuilder.mm2pt(10),
        right: PdfBuilder.mm2pt(12),
        bottom,
        left: PdfBuilder.mm2pt(margin),
      },
    });
    this.y = (this.doc as any).lastAutoTable.finalY;
  }

  public addLeftRight(left: string[], right: string[], fontSize?: number): void {
    const fs = fontSize ? fontSize : 10;
    const lastY = this.y;
    const lastX = this.x;

    const lh = fs / 2 + 2;
    left.forEach((line) => {
      this.addText(line, fs, lh);
    });
    this.y = lastY;
    this.x = PdfBuilder.mm2pt(PdfBuilder.dim_x - this.margin.right);
    right.forEach((line) => {
      this.addText(line, fs, lh, 'right');
    });
    this.setMarginLeft(-10);

    this.x = lastX;
  }

  public add2Cols(left: string[], right: string[], fontSize?: number, lh?: number, margin?: number): void {
    const lastY = this.y;
    const lastX = this.x;
    this.setMarginLeft(typeof margin !== 'undefined' ? margin : 10);
    const fs = fontSize ? fontSize : 10;

    const _lh = lh ? lh : fs / 2 + 2;
    left.forEach((line) => {
      this.addText(line, fs, _lh);
    });
    const leftY = this.y;
    this.y = lastY;
    this.x = PdfBuilder.mm2pt(PdfBuilder.dim_x / 2);
    right.forEach((line) => {
      this.addText(line, fs, _lh);
    });
    this.x = lastX;
    this.y = leftY > this.y ? leftY : this.y;
  }

  public addFooter(text: string, text2: string): void {
    let lastY = this.y;
    this.y = PdfBuilder.mm2pt(PdfBuilder.pt2mm(this.maxHeight) - 14);
    this.addLine();
    this.doc.setTextColor(85, 85, 85);
    this.addText(text, 8, 6, 'center');
    this.doc.setTextColor(85, 85, 85);

    this.addText(text2, 8, 6, 'center');
    this.resetText();
    this.y = lastY;
  }

  public addTextNoSpace(text: string, fontSize?: number, lh?: number): void {
    if (fontSize) {
      this.doc.setFontSize(fontSize);
    }
    const dims: Dims = this.doc.getTextDimensions(text);
    lh = lh || this.doc.getLineHeight();
    const nexty =
      Math.ceil(dims.w / (this.maxWidth - PdfBuilder.mm2pt(0))) * (fontSize ? fontSize : this.default_fontsize) +
      this.y +
      (fontSize ? fontSize : this.default_fontsize);
    if (nexty <= this.maxHeight) {
      this.doc.text(text, this.x, this.y, { maxWidth: this.maxWidth });
      this.y = nexty;
    } else {
      this.doc.addPage('a4', 'p');
      this.x = PdfBuilder.mm2pt(this.margin.left);
      this.y = PdfBuilder.mm2pt(this.margin.top);
      this.doc.text(text, this.x, this.y, { maxWidth: this.maxWidth });
      const nexty = Math.ceil(dims.w / this.maxWidth) * lh + this.y + lh / 2;
      this.y = nexty;
    }
  }

  public addTextWithNewLines(param: {
    text: string;
    newLineMarker?: string;
    fontSize?: number;
    lh?: number;
    align?: 'left' | 'center' | 'right' | 'justify';
    calcY?: boolean;
  }): void {
    const { text, align, calcY = true, fontSize, lh, newLineMarker = ';;' } = param;

    text?.split(newLineMarker).forEach((text) => this.addText(text.trimStart(), fontSize, lh, align, calcY));
  }

  public addText(
    text: string,
    fontSize?: number,
    lh?: number,
    align?: 'left' | 'center' | 'right' | 'justify',
    calcY = true,
  ): void {
    let lastX = this.x;
    let _align = align ? align : 'left';
    switch (_align) {
      case 'center':
        this.x = PdfBuilder.mm2pt(PdfBuilder.dim_x / 2);
        break;
      case 'right':
        this.x = PdfBuilder.mm2pt(PdfBuilder.dim_x - this.margin.right);
        break;
      default:
        break;
    }
    if (fontSize) {
      this.doc.setFontSize(fontSize);
    }
    const dims: Dims = this.doc.getTextDimensions(text);

    lh = lh ? lh : this.doc.getLineHeight();
    let nexty = Math.ceil(dims.w / this.maxWidth) * lh + this.y + lh;
    if (nexty <= this.maxHeight) {
      this.doc.text(text, this.x, this.y + lh, { maxWidth: this.maxWidth, align: _align });
    } else {
      this.doc.addPage('a4', 'p');

      this.y = PdfBuilder.mm2pt(this.margin.top);
      this.doc.text(text, this.x, this.y, { maxWidth: this.maxWidth, align: _align });
      lh = this.doc.getLineHeight();
      nexty = Math.ceil(dims.w / this.maxWidth) * lh + this.y + lh / 2;
    }
    if (calcY) {
      this.y = nexty;
    }
    this.x = lastX;
  }

  public resetText(): void {
    this.doc.setFontSize(this.default_fontsize);
    this.doc.setTextColor(0, 0, 0);
    this.setNormal();
  }

  public static pt2mm(pt: number): number {
    return pt * PdfBuilder.pt_mm_factor;
  }

  public static mm2pt(mm: number): number {
    return mm / PdfBuilder.pt_mm_factor;
  }
}
