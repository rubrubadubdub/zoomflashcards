const createCardColors = (cardnum) => {
    setCardColors([]);
    const generateRandomColor = (inputColor) => {
      const threshold = 1;
      const hue = Math.floor(Math.random() * 360);
      const saturation = 50 + Math.floor(Math.random() * 50);
      const luminance = 50 + Math.floor(Math.random() * 30);
      const randomColor = `hsl(${hue}, ${saturation}%, ${luminance}%)`;
      const distance = colorDistance(inputColor, randomColor);
      if (distance < threshold) {
        return generateRandomColor(inputColor);
      }
      return randomColor;
    };

    const colorDistance = (color1, color2) => {
      // Convert colors to RGB format for distance calculation
      const rgbColor1 = hexToRgb(color1);
      const rgbColor2 = hslToRgb(color2);
      // Calculate Euclidean distance between RGB values
      const distance = Math.sqrt(
        (rgbColor1.r - rgbColor2.r) ** 2 +
          (rgbColor1.g - rgbColor2.g) ** 2 +
          (rgbColor1.b - rgbColor2.b) ** 2
      );
      return distance;
    };

    for (let i = 0; i < cardnum; i++) {
      const randColor = generateRandomColor("#ADD8E6");
      setCardColors((cardColors) => [...cardColors, randColor]);
    }
    setTintState("tinted");
  };

  const hexToRgb = (hexColor) => {
    const r = parseInt(hexColor.substring(1, 3), 16);
    const g = parseInt(hexColor.substring(3, 5), 16);
    const b = parseInt(hexColor.substring(5, 7), 16);
    return { r, g, b };
  };

  const hslToRgb = (hslColor) => {
    const [hue, saturation, luminance] = hslColor
      .match(/\d+/g)
      .map((value) => parseInt(value));
    const c = (1 - Math.abs(2 * luminance - 1)) * saturation;
    const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
    const m = luminance - c / 2;
    let [r, g, b] = [0, 0, 0];
    if (hue < 60) {
      [r, g, b] = [c, x, 0];
    } else if (hue < 120) {
      [r, g, b] = [x, c, 0];
    } else if (hue < 180) {
      [r, g, b] = [0, c, x];
    } else if (hue < 240) {
      [r, g, b] = [0, x, c];
    } else if (hue < 300) {
      [r, g, b] = [x, 0, c];
    } else {
      [r, g, b] = [c, 0, x];
    }
    r = Math.round((r + m) * 255);
    g = Math.round((g + m) * 255);
    b = Math.round((b + m) * 255);
    return { r, g, b };
  };