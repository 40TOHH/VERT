// Скрипт для генерации всех возможных маршрутов для всех поддерживаемых языков и форматов
// Использует точную информацию из предоставленного списка форматов

// Языки, поддерживаемые приложением
const locales = ["en", "es", "fr", "de", "it", "hr", "tr", "ja", "ko", "el", "id", "zh-Hans", "zh-Hant", "ru"];

// Все форматы, поддерживаемые приложением (из предоставленного списка)
const formats = [
  // Image formats
  "png", "jpeg", "jpg", "webp", "gif", "svg", "jxl", "avif", "heic", "heif",
  "ico", "bmp", "cur", "ani", "icns", "nef", "cr2", "hdr", "jpe", "mat", "pbm",
  "pfm", "pgm", "pnm", "ppm", "tiff", "jfif", "eps", "psd", "arw", "tif", "dng",
  "xcf", "rw2", "raf", "orf", "pef", "mos", "raw", "dcr", "crw", "cr3", "3fr",
  "erf", "mrw", "mef", "nrw", "srw", "sr2", "srf", "a", "aai", "ai", "art",
  "avs", "b", "bgr", "bgra", "bgro", "bmp2", "bmp3", "brf", "cal", "cals",
  "cin", "cip", "cmyk", "cmyka", "dcx", "dds", "dpx", "dxt1", "dxt5", "epdf",
  "epi", "eps2", "eps3", "epsf", "epsi", "ept", "ept2", "ept3", "exr",
  "farbfeld", "fax", "ff", "fit", "fits", "fl32", "fts", "ftxt", "g", "g3",
  "g4", "gif87", "gray", "graya", "group4", "hrz", "icb", "icon", "info",
  "ipl", "isobrl", "isobrl6", "j2c", "j2k", "jng", "jp2", "jpc", "jpm", "jps",
  "map", "miff", "mng", "mono", "mtv", "o", "otb", "pal", "palm", "pam",
  "pcd", "pcds", "pcl", "pct", "pcx", "pdb", "pgx", "phm", "picon", "pict",
  "pjpeg", "png00", "png24", "png32", "png48", "png64", "png8", "ps", "ps1",
  "ps2", "ps3", "psb", "ptif", "qoi", "r", "ras", "rgb", "rgba", "rgbo", "rgf",
  "sgi", "six", "sixel", "sparse-color", "strimg", "sun", "svgz", "tga",
  "tiff64", "ubrl", "ubrl6", "uil", "uyvy", "vda", "vicar", "viff", "vips",
  "vst", "wbmp", "wpg", "xbm", "xpm", "xv", "ycbcr", "ycbcra", "yuv",

  // Audio formats
  "mp3", "wav", "flac", "ogg", "mogg", "oga", "opus", "aac", "alac", "m4a",
  "caf", "wma", "amr", "ac3", "aiff", "aifc", "aif", "mp1", "mp2", "mpc",
  "dsd", "dsf", "dff", "mqa", "au", "m4b", "voc", "weba",

  // Video formats
  "mkv", "mp4", "webm", "avi", "wmv", "mov", "ts", "mts", "m2ts", "mpg",
  "mpeg", "flv", "f4v", "vob", "m4v", "3gp", "3g2", "mxf", "ogv", "rm",
  "rmvb", "h264", "divx", "swf", "amv", "asf", "nut",

  // Document formats
  "docx", "doc", "md", "html", "rtf", "csv", "tsv", "json", "rst", "epub",
  "odt", "docbook"
];

// Убираем дубликаты форматов
const uniqueFormats = [...new Set(formats)];

// Generate all possible conversion routes for prerendering
export function generateConversionRoutes() {
  const routes = [];

  // Include base convert page as well
  routes.push('/convert');
  for (const locale of locales) {
    routes.push(`/${locale}/convert`);
  }

  // Generate all possible conversion routes (from -> to where from != to)
  for (const from of uniqueFormats) {
    for (const to of uniqueFormats) {
      if (from !== to) {
        // Add routes for all locales
        for (const locale of locales) {
          routes.push(`/${locale}/convert/${from}/${to}`);
        }
      }
    }
  }

  console.log(`Generated ${routes.length} routes for prerendering`);

  return routes;
}

// Для тестирования в командной строке
if (typeof require !== 'undefined' && require.main === module) {
  generateConversionRoutes();
}