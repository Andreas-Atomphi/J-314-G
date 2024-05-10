class Color {
  constructor(r, g, b, a = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }

  // Retorna a representação RGB da cor
  rgb() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }

  // Retorna a representação RGBA da cor
  rgba() {
    return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
  }

  // Retorna a representação hexadecimal da cor
  hex() {
    const toHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(this.r)}${toHex(this.g)}${toHex(this.b)}`;
  }

  // Satura a cor
  saturate(amount) {
    this.r += amount;
    this.g += amount;
    this.b += amount;
    this.clamp();
  }

  // Aplica um fator de escurecimento à cor
  darken(amount) {
    this.r -= amount;
    this.g -= amount;
    this.b -= amount;
    this.clamp();
  }

  // Garante que os valores RGB estejam no intervalo correto (0-255)
  clamp() {
    this.r = Math.max(0, Math.min(255, this.r));
    this.g = Math.max(0, Math.min(255, this.g));
    this.b = Math.max(0, Math.min(255, this.b));
  }
}

