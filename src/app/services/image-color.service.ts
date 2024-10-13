import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
/**
 * https://dev.to/benjaminadk/make-color-math-great-again--45of
 */
export class ImageColorService {

  constructor() { }
  
  public getTextColor(backColor: string) : string {
    return this.getComplementary(backColor);
  }

  public getBackGradient(backColor: string) : string {
    const rgbColors = this.getAnalogous(backColor);
    return `linear-gradient(${rgbColors[3]} 0%, ${rgbColors[2]} 10%, ${rgbColors[1]} 30%, ${backColor} 100%)`;
  }

  private getComplementary(color : string) : string {
    return this.harmonize(color, 180, 180, 1, 'light')[1];
  }

  private getAnalogous(color: string) {
    return this.harmonize(color, 10, 30, 10, 'dark');
  }

  private getSplit(color: string) {
    return this.harmonize(color, 150, 210, 60);
  }

  private getTriad(color: string) {
    return this.harmonize(color, 120, 240, 120);
  }

  private getTetrad(color: string) {
    return this.harmonize(color, 90, 270, 90);
  }

  private harmonize(color : string, start : number, end : number, interval : number, mode : string = 'normal') {
    const colors = [color]
    const [h, s, l] = this.hexToHSL(color)
    for(let i = start; i <= end; i += interval) {
      const h1 = (h! + i) % 360
      const c1 = `hsl(${h1}, ${ mode === 'light' ? 70 : mode === 'dark' ? 17 : s }%, ${ mode === 'light' ? 70 : mode === 'dark' ? 30 : l}%)`
      colors.push(c1)
    }
    return colors
  }


  private hexToHSL(hex: string): number[] {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

    if (!result) {
      throw new Error("Could not parse Hex Color");
    }
    const rHex = parseInt(result[1], 16);
    const gHex = parseInt(result[2], 16);
    const bHex = parseInt(result[3], 16);
    const r = rHex / 255;
    const g = gHex / 255;
    const b = bHex / 255;
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = (max + min) / 2;
    let s = h;
    let l = h;
    if (max === min) {
      // Achromatic
      return [ 0, 0 , l ];
    }
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
    s = s * 100;
    s = Math.round(s);
    l = l * 100;
    l = Math.round(l);
    h = Math.round(360 * h);
    return [ h, s, l ];
  }

  private parseHSL(str : string) {
    let hsl, h, s, l
    hsl = str.replace(/[^\d,]/g, '').split(',')   // strip non digits ('%')
    h = Number(hsl[0])                            // convert to number
    s = Number(hsl[1])
    l = Number(hsl[2])
    return [h, s, l]                              // return parts
  }

  private hslToRgb(str : string) {
    let [h, s, l] = this.parseHSL(str);
    let r, g, b;

    if (s === 0) {
      r = g = b = l; // achromatic
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = this.hueToRgb(p, q, h + 1/3);
      g = this.hueToRgb(p, q, h);
      b = this.hueToRgb(p, q, h - 1/3);
    }

    return `rgba(${Math.round(r * 255)},${Math.round(g * 255)},${Math.round(b * 255)}, 1)`
  }

  private hueToRgb(p : number, q : number, t : number) {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  }

}
