import puppeteer from "puppeteer";

export const obtenerNombrePorDni = async (dni) => {
  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  const page = await browser.newPage();

  try {
    await page.goto("https://eldni.com/pe/buscar-datos-por-dni", {
      waitUntil: "networkidle2",
      timeout: 60000
    });

    await page.waitForSelector("#dni");
    await page.type("#dni", dni);
    await page.click("button[type='submit']");

    // ⏳ Esperar que aparezca la tabla de resultados
    await page.waitForSelector("table tbody tr", { timeout: 20000 });

    const nombreCompleto = await page.evaluate(() => {
      const fila = document.querySelector("table tbody tr");
      if (!fila) return null;

      const columnas = fila.querySelectorAll("td");
      const nombres = columnas[1]?.innerText.trim();
      const apP = columnas[2]?.innerText.trim();
      const apM = columnas[3]?.innerText.trim();

      return [nombres, apP, apM].filter(Boolean).join(" ");
    });

    return nombreCompleto;

  } catch (e) {
    console.error("❌ Error scraping:", e.message);
    return null;
  } finally {
    await browser.close();
  }
};
