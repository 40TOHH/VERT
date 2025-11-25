import type { ExtendedFormatInfo, ConversionInfo } from '$lib/conversion-data';
import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
import { m } from '$lib/paraglide/messages';

/**
 * Safe message retrieval that falls back to English if a message doesn't exist
 */
function getSafeMessage(getter: () => string, fallback: string): string {
  try {
    // Check if the function exists and return the result
    const result = getter();
    // If result is undefined or doesn't look like a valid message, return the fallback
    if (result === undefined || result === null || typeof result !== 'string') {
      return fallback;
    }
    return result;
  } catch (e) {
    // If the message doesn't exist in the current locale, return the fallback
    return fallback;
  }
}

/**
 * Content generation system for file conversion pages
 */

// Conversion-specific content templates
interface ConversionContent {
  title: string;
  description: string;
  intro: string;
  whyConvert: string[];
  howToConvert: string[];
  tips: string[];
  useCases: string[];
  qualityNotes: string[];
}

/**
 * Generate unique content for a specific conversion
 */
export function generateConversionContent(conversionInfo: ConversionInfo, languageTag?: AvailableLanguageTag): ConversionContent {
  const { from, to, fromFormat, toFormat } = conversionInfo;

  // Use the provided language tag or default to English
  const locale = languageTag || 'en';

  // Get conversion-specific content based on from/to formats
  const conversionSpecificContent = getConversionSpecificContent(from, to, fromFormat, toFormat, locale);

  // Format the format names for display (remove the leading dot and convert to uppercase)
  const fromName = from.substring(1).toUpperCase();
  const toName = to.substring(1).toUpperCase();

  return {
    title: getSafeMessage(() => m.conversion.title({ from: fromName, to: toName }), `${fromName} to ${toName} Converter - Fast & Free Online Tool`),
    description: getSafeMessage(() => m.conversion.description({ from: fromName, to: toName }), `Convert ${fromName} files to ${toName} format online. Fast, secure, and completely free file conversion using client-side processing. No file size limits.`),
    intro: conversionSpecificContent.intro || getSafeMessage(() => m.conversion.intro.generic({ from: fromName, to: toName }), `Converting from ${fromName} to ${toName} is a common requirement for many users. This conversion might be necessary for compatibility with specific software, reducing file size, improving quality, or meeting platform requirements. Our online converter makes this process simple and efficient.`),
    whyConvert: conversionSpecificContent.whyConvert || [
      getSafeMessage(() => m.conversion.reason.software_compatibility({ format: toName }), `Compatibility with software that only supports ${toName}`),
      getSafeMessage(() => m.conversion.reason.compression(), `Different compression algorithms that may reduce file size`),
      getSafeMessage(() => m.conversion.reason.quality(), `Different quality characteristics that may be preferable`),
      getSafeMessage(() => m.conversion.reason.platform(), `Platform requirements (web, mobile, or desktop applications)`)
    ],
    howToConvert: [
      getSafeMessage(() => m.conversion.step.upload({ format: fromName }), `Upload your ${fromName} file using the converter above`),
      getSafeMessage(() => m.conversion.step.verify({ format: toName }), `Verify that the output format is set to ${toName}`),
      getSafeMessage(() => m.conversion.step.convert(), `Click the "Convert" button to start the conversion`),
      getSafeMessage(() => m.conversion.step.download({ format: toName }), `Download your converted ${toName} file when complete`)
    ],
    tips: conversionSpecificContent.tips || [
      getSafeMessage(() => m.conversion.tip.check_file({ format: fromName }), `Ensure your ${fromName} file is not corrupted before conversion`),
      getSafeMessage(() => m.conversion.tip.use_original(), `For best results, use original high-quality files when possible`),
      getSafeMessage(() => m.conversion.tip.check_size(), `Check the file size limitations if converting large files`)
    ],
    useCases: conversionSpecificContent.useCases || [
      getSafeMessage(() => m.conversion.use_case.compatibility(), `Software compatibility`),
      getSafeMessage(() => m.conversion.use_case.size(), `File size reduction`),
      getSafeMessage(() => m.conversion.use_case.quality(), `Quality optimization`),
      getSafeMessage(() => m.conversion.use_case.platform(), `Platform adaptation`)
    ],
    qualityNotes: conversionSpecificContent.qualityNotes || [
      getSafeMessage(() => m.conversion.quality_note.lossy_to_lossy(), `Converting from a lossy format to another lossy format may reduce quality`),
      getSafeMessage(() => m.conversion.quality_note.backup(), `Always keep original files as backup`)
    ]
  };
}

/**
 * Get conversion-specific content based on format pair
 */
function getConversionSpecificContent(
  from: string,
  to: string,
  fromFormat: ExtendedFormatInfo | null,
  toFormat: ExtendedFormatInfo | null,
  languageTag: AvailableLanguageTag
): Partial<ConversionContent> {
  // Create a key in the format "from-to" (e.g., ".jpg-to-.png")
  const key = `${from}-to-${to}`;

  // For specific format pairs, use locale-specific messages
  switch(key) {
    // Image conversions
    case '.jpg-to-.png':
      return {
        intro: getSafeMessage(() => m.conversion.intro.jpg_to_png(), 'Converting JPG to PNG preserves image quality by using lossless compression, making it ideal for images requiring transparency or high fidelity.'),
        whyConvert: [
          getSafeMessage(() => m.conversion.reason.jpg_to_png.quality(), 'To preserve image quality with lossless compression'),
          getSafeMessage(() => m.conversion.reason.jpg_to_png.transparency(), 'To use transparency/alpha channel'),
          getSafeMessage(() => m.conversion.reason.jpg_to_png.text_art(), 'For images with text or line art'),
          getSafeMessage(() => m.conversion.reason.jpg_to_png.archiving(), 'When archiving important photos')
        ],
        tips: [
          getSafeMessage(() => m.conversion.tip.png_larger_than_jpg(), 'PNG files are typically larger than JPEGs'),
          getSafeMessage(() => m.conversion.tip.png_for_few_colors({ format: "PNG" }), 'Use PNG for images with few colors or text'),
          getSafeMessage(() => m.conversion.tip.jpg_sufficient({ format: "JPEG" }), 'For photographs, consider if JPEG is sufficient')
        ],
        useCases: [
          getSafeMessage(() => m.conversion.use_case.web_graphics(), 'Web graphics with transparency'),
          getSafeMessage(() => m.conversion.use_case.logos(), 'Logos and icons'),
          getSafeMessage(() => m.conversion.use_case.text_art(), 'Images with text or line art'),
          getSafeMessage(() => m.conversion.use_case.archiving(), 'Archiving important photos')
        ],
        qualityNotes: [
          getSafeMessage(() => m.conversion.quality_note.png_lossless(), 'PNG files are lossless and preserve all image data'),
          getSafeMessage(() => m.conversion.quality_note.png_larger_files({ format1: "PNG", format2: "JPEG" }), 'File sizes will be larger than JPEG equivalents')
        ]
      };
    case '.png-to-.jpg':
      return {
        intro: getSafeMessage(() => m.conversion.intro.png_to_jpg(), 'Converting PNG to JPEG significantly reduces file size using lossy compression, suitable for photographs and complex images.'),
        whyConvert: [
          getSafeMessage(() => m.conversion.reason.png_to_jpg.reduce_size(), 'To significantly reduce file size'),
          getSafeMessage(() => m.conversion.reason.png_to_jpg.web_use(), 'For web use where smaller files are preferred'),
          getSafeMessage(() => m.conversion.reason.png_to_jpg.no_transparency(), 'When transparency is not needed'),
          getSafeMessage(() => m.conversion.reason.png_to_jpg.email(), 'For email attachments with size limits')
        ],
        tips: [
          getSafeMessage(() => m.conversion.tip.jpg_quality_setting(), 'Choose a high JPEG quality setting for better results'),
          getSafeMessage(() => m.conversion.tip.remove_transparency(), 'Remove transparency before conversion'),
          getSafeMessage(() => m.conversion.tip.lossy_acceptable(), 'Consider whether lossy compression is acceptable')
        ],
        useCases: [
          getSafeMessage(() => m.conversion.use_case.web_photography(), 'Web photography'),
          getSafeMessage(() => m.conversion.use_case.email_attachments(), 'Email attachments'),
          getSafeMessage(() => m.conversion.use_case.social_media(), 'Social media sharing'),
          getSafeMessage(() => m.conversion.use_case.size_limits(), 'Situations with file size limits')
        ],
        qualityNotes: [
          getSafeMessage(() => m.conversion.quality_note.jpg_lossy(), 'JPEG is lossy and will reduce image quality'),
          getSafeMessage(() => m.conversion.quality_note.jpg_transparency_lost(), 'Transparency will be lost in conversion'),
          getSafeMessage(() => m.conversion.quality_note.jpg_repeat_degrade(), 'Repeated conversions will further degrade quality')
        ]
      };

    // Audio conversions
    case '.mp3-to-.wav':
      return {
        intro: m.conversion_intro_mp3_to_wav(),
        whyConvert: [
          m.conversion_reason_uncompressed_quality(),
          m.conversion_reason_audio_editing(),
          m.conversion_reason_archiving_audio(),
          m.conversion_reason_professional_software()
        ],
        tips: [
          m.conversion_tip_wav_larger_than_mp3({ format1: "WAV", format2: "MP3" }),
          m.conversion_tip_quality_over_size({ format: "WAV" }),
          m.conversion_tip_other_lossless({ format: "FLAC" })
        ],
        useCases: [
          m.conversion_use_case_audio_editing(),
          m.conversion_use_case_professional_recording(),
          m.conversion_use_case_archiving_audio(),
          m.conversion_use_case_cd_burning()
        ],
        qualityNotes: [
          m.conversion_quality_note_mp3_to_wav_no_restore(),
          m.conversion_quality_note_mp3_artifacts_remain()
        ]
      };
    case '.wav-to-.mp3':
      return {
        intro: m.conversion_intro_wav_to_mp3(),
        whyConvert: [
          m.conversion_reason_wav_to_mp3_reduce_size(),
          m.conversion_reason_wav_to_mp3_portable_players(),
          m.conversion_reason_wav_to_mp3_streaming(),
          m.conversion_reason_quality_over_size()
        ],
        tips: [
          m.conversion_tip_appropriate_bitrate(),
          m.conversion_tip_specific_use_case(),
          m.conversion_tip_keep_original_wav()
        ],
        useCases: [
          m.conversion_use_case_portable_players(),
          m.conversion_use_case_streaming_services(),
          m.conversion_use_case_email_attachments(),
          m.conversion_use_case_general_music()
        ],
        qualityNotes: [
          m.conversion_quality_note_mp3_lossy(),
          m.conversion_quality_note_mp3_no_restore(),
          m.conversion_quality_note_mp3_preserve_info()
        ]
      };

    // Video conversions
    case '.mp4-to-.avi':
      return {
        intro: m.conversion_intro_mp4_to_avi(),
        whyConvert: [
          m.conversion_reason_compatibility_old_software(),
          m.conversion_reason_video_editing(),
          m.conversion_reason_platform_requirements(),
          m.conversion_reason_legacy_systems()
        ],
        tips: [
          m.conversion_tip_avi_larger_than_mp4({ format1: "AVI", format2: "MP4" }),
          m.conversion_tip_check_codec_compatibility(),
          m.conversion_tip_keep_mp4_web()
        ],
        useCases: [
          m.conversion_use_case_legacy_editing(),
          m.conversion_use_case_older_players(),
          m.conversion_use_case_platform_requirements(),
          m.conversion_use_case_broad_compatibility()
        ],
        qualityNotes: [
          m.conversion_quality_note_conversion_change_compression(),
          m.conversion_quality_note_file_size_increase(),
          m.conversion_quality_note_quality_vary_codec()
        ]
      };
    case '.avi-to-.mp4':
      return {
        intro: m.conversion_intro_avi_to_mp4(),
        whyConvert: [
          m.conversion_reason_better_compression({ format1: "MP4", format2: "AVI" }),
          m.conversion_reason_modern_device_compatibility(),
          m.conversion_reason_web_streaming(),
          m.conversion_reason_reduce_storage()
        ],
        tips: [
          m.conversion_tip_mp4_better_compression({ format1: "MP4", format2: "AVI" }),
          m.conversion_tip_verify_quality_settings(),
          m.conversion_tip_h264_h265_best()
        ],
        useCases: [
          m.conversion_use_case_web_video_hosting(),
          m.conversion_use_case_mobile_compatibility(),
          m.conversion_use_case_social_media(),
          m.conversion_use_case_reduce_storage()
        ],
        qualityNotes: [
          m.conversion_quality_note_mp4_compression_efficiency(),
          m.conversion_quality_note_quality_maintained_settings(),
          m.conversion_quality_note_h264_h265_best()
        ]
      };

    // Document conversions
    case '.pdf-to-.doc':
      return {
        intro: m.conversion_intro_pdf_to_doc(),
        whyConvert: [
          m.conversion_reason_make_documents_editable(),
          m.conversion_reason_collaboration_revision(),
          m.conversion_reason_extract_text(),
          m.conversion_reason_word_processing()
        ],
        tips: [
          m.conversion_tip_complex_layouts_not_perfect(),
          m.conversion_tip_review_formatting(),
          m.conversion_tip_text_extraction_alternative()
        ],
        useCases: [
          m.conversion_use_case_document_editing(),
          m.conversion_use_case_content_revision(),
          m.conversion_use_case_text_extraction(),
          m.conversion_use_case_academic_business()
        ],
        qualityNotes: [
          m.conversion_quality_note_complex_formatting_lost(),
          m.conversion_quality_note_images_separate(),
          m.conversion_quality_note_tables_layout_adjust()
        ]
      };
    case '.doc-to-.pdf':
      return {
        intro: m.conversion_intro_doc_to_pdf(),
        whyConvert: [
          m.conversion_reason_preserve_formatting(),
          m.conversion_reason_universal_compatibility(),
          m.conversion_reason_secure_distribution(),
          m.conversion_reason_printing()
        ],
        tips: [
          m.conversion_tip_pdfs_not_editable(),
          m.conversion_tip_check_formatting_before_finalizing(),
          m.conversion_tip_consider_accessibility()
        ],
        useCases: [
          m.conversion_use_case_document_distribution(),
          m.conversion_use_case_academic_submissions(),
          m.conversion_use_case_professional_presentations(),
          m.conversion_use_case_print_ready()
        ],
        qualityNotes: [
          m.conversion_quality_note_pdfs_formatting_reliable(),
          m.conversion_quality_note_file_size_varies(),
          m.conversion_quality_note_pdfs_more_secure()
        ]
      };

    default:
      return {};
  }
}

/**
 * Generate FAQ content for a specific conversion
 */
export function generateFAQContent(conversionInfo: ConversionInfo, languageTag?: AvailableLanguageTag): Array<{ question: string; answer: string }> {
  const { from, to } = conversionInfo;

  // Use the provided language tag or default to English
  const locale = languageTag || 'en';

  // Format the format names for display (remove the leading dot and convert to uppercase)
  const fromName = from.substring(1).toUpperCase();
  const toName = to.substring(1).toUpperCase();

  // Common questions with format-specific variations
  const commonQuestions = [
    {
      question: getSafeMessage(() => m.faq.question.difference({ from: fromName, to: toName }), `What is the difference between ${fromName} and ${toName}?`),
      answer: getSafeMessage(() => m.faq.answer.difference({ from: fromName, to: toName, from_description: getFormatDescription(fromName, locale), to_description: getFormatDescription(toName, locale), comparison_detail: getFormatComparisonDetail(from, to, locale) }), `The ${fromName} format is ${getFormatDescription(fromName, locale)}, while the ${toName} format is ${getFormatDescription(toName, locale)}. ${getFormatComparisonDetail(from, to, locale)}.`)
    },
    {
      question: getSafeMessage(() => m.faq.question.how_long({ from: fromName, to: toName }), `How long does it take to convert ${fromName} to ${toName}?`),
      answer: getSafeMessage(() => m.faq.answer.how_long({ from: fromName, to: toName }), `Conversion time varies based on file size and your device's processing power. Small files typically convert in seconds, while larger files may take several minutes. The conversion happens directly in your browser for privacy and security.`)
    },
    {
      question: getSafeMessage(() => m.faq.question.quality_loss({ from: fromName, to: toName }), `Will converting ${fromName} to ${toName} reduce quality?`),
      answer: getQualityImpact(from, to, locale)
    },
    {
      question: getSafeMessage(() => m.faq.question.max_size({ from: fromName, to: toName }), `What is the maximum file size I can convert from ${fromName} to ${toName}?`),
      answer: getSafeMessage(() => m.faq.answer.max_size({ from: fromName, to: toName }), `Our converter can handle large files as the processing happens directly in your browser. The only limit is your device's available memory, which can be several gigabytes on modern systems.`)
    },
    {
      question: getSafeMessage(() => m.faq.question.safety({ from: fromName, to: toName }), `Is it safe to convert ${fromName} files to ${toName} on your website?`),
      answer: getSafeMessage(() => m.faq.answer.safety({ from: fromName, to: toName }), `Yes, our converter is completely safe. Files are processed directly in your browser using WebAssembly technology, meaning they never leave your device. No file uploads to our servers occur, ensuring complete privacy and security.`)
    }
  ];

  // Add format-specific questions
  const formatSpecificQuestions = getFormatSpecificFAQs(from, to, locale);

  return [...commonQuestions, ...formatSpecificQuestions];
}

/**
 * Helper functions for content generation
 */
function getFormatDescription(format: string, languageTag: AvailableLanguageTag): string {
  switch(format) {
    case 'JPG':
      return getSafeMessage(() => m.format.description.jpg(), 'a lossy compressed image format ideal for photographs');
    case 'PNG':
      return getSafeMessage(() => m.format.description.png(), 'a lossless compressed image format supporting transparency');
    case 'GIF':
      return getSafeMessage(() => m.format.description.gif(), 'a format supporting animated images and simple graphics');
    case 'MP3':
      return getSafeMessage(() => m.format.description.mp3(), 'a lossy compressed audio format with small file sizes');
    case 'WAV':
      return getSafeMessage(() => m.format.description.wav(), 'an uncompressed audio format preserving all audio data');
    case 'MP4':
      return getSafeMessage(() => m.format.description.mp4(), 'a compressed multimedia container format widely compatible');
    case 'AVI':
      return getSafeMessage(() => m.format.description.avi(), 'a multimedia container format developed by Microsoft');
    case 'PDF':
      return getSafeMessage(() => m.format.description.pdf(), 'a document format preserving layout across platforms');
    case 'DOC':
      return getSafeMessage(() => m.format.description.doc(), 'a proprietary document format for Microsoft Word');
    case 'DOCX':
      return getSafeMessage(() => m.format.description.docx(), 'a modern XML-based document format for Microsoft Word');
    default:
      return getSafeMessage(() => m.format.description.common(), 'a common file format');
  }
}

function getFormatComparisonDetail(from: string, to: string, languageTag: AvailableLanguageTag): string {
  const key = `${from}-${to}`;

  switch(key) {
    case '.jpg-.png':
      return getSafeMessage(() => m.format.comparison.jpg_png(), 'JPG uses lossy compression while PNG uses lossless compression');
    case '.png-.jpg':
      return getSafeMessage(() => m.format.comparison.png_jpg(), 'PNG preserves quality but creates larger files compared to JPG');
    case '.mp3-.wav':
      return getSafeMessage(() => m.format.comparison.mp3_wav(), 'MP3 uses lossy compression while WAV is uncompressed');
    case '.wav-.mp3':
      return getSafeMessage(() => m.format.comparison.wav_mp3(), 'WAV preserves all audio data while MP3 reduces file size');
    case '.mp4-.avi':
      return getSafeMessage(() => m.format.comparison.mp4_avi(), 'MP4 offers better compression and cross-platform compatibility');
    case '.avi-.mp4':
      return getSafeMessage(() => m.format.comparison.avi_mp4(), 'MP4 provides more efficient compression than AVI');
    case '.pdf-.doc':
      return getSafeMessage(() => m.format.comparison.pdf_doc(), 'PDF preserves formatting while DOC allows editing');
    case '.doc-.pdf':
      return getSafeMessage(() => m.format.comparison.doc_pdf(), 'DOC allows editing while PDF preserves formatting across platforms');
    default:
      const fromName = from.substring(1).toUpperCase();
      const toName = to.substring(1).toUpperCase();
      return getSafeMessage(() => m.format.comparison.default({ from: fromName, to: toName }), `The ${fromName} format has different characteristics than ${toName}`);
  }
}

function getQualityImpact(from: string, to: string, languageTag: AvailableLanguageTag): string {
  // Define quality impact based on format pair
  if (from === '.jpg' && to === '.png') {
    return getSafeMessage(() => m.quality_impact.jpg_to_png(), 'Converting from JPG to PNG will not restore quality lost during the original JPG compression, but it will preserve the current quality using lossless compression.');
  } else if (from === '.png' && to === '.jpg') {
    return getSafeMessage(() => m.quality_impact.png_to_jpg(), 'Converting from PNG to JPG will reduce quality due to JPG\'s lossy compression algorithm. The extent of quality loss depends on the JPG quality setting used during conversion.');
  } else if (from === '.mp3' && to === '.wav') {
    return getSafeMessage(() => m.quality_impact.mp3_to_wav(), 'Converting from MP3 to WAV will not restore audio quality that was lost during the original MP3 compression. WAV will preserve the current quality level but in an uncompressed format.');
  } else if (from === '.wav' && to === '.mp3') {
    return getSafeMessage(() => m.quality_impact.wav_to_mp3(), 'Converting from WAV to MP3 will reduce audio quality due to MP3\'s lossy compression. However, using higher bitrates (192kbps or above) can maintain good audio quality.');
  } else if (from === '.mp4' && to === '.avi') {
    return getSafeMessage(() => m.quality_impact.mp4_to_avi(), 'Converting from MP4 to AVI typically preserves video quality but may result in larger file sizes depending on the codec used.');
  } else if (from === '.avi' && to === '.mp4') {
    return getSafeMessage(() => m.quality_impact.avi_to_mp4(), 'Converting from AVI to MP4 typically maintains video quality while reducing file size due to MP4\'s more efficient compression.');
  }

  // Default response
  return getSafeMessage(() => m.quality_impact.default(), 'The impact on quality depends on the specific formats involved. Converting from a lossy format to another lossy format typically results in some quality loss, while converting to a lossless format preserves existing quality.');
}

function getFormatSpecificFAQs(from: string, to: string, languageTag: AvailableLanguageTag): Array<{ question: string; answer: string }> {
  const key = `${from}-${to}`;

  switch(key) {
    case '.jpg-.png':
      return [
        {
          question: getSafeMessage(() => m.faq.question.jpg_to_png.when(), 'When should I convert JPG to PNG?'),
          answer: getSafeMessage(() => m.faq.answer.jpg_to_png.when(), 'Convert JPG to PNG when you need to preserve image quality without compression artifacts, require transparency in your image, or are working with images that have sharp edges and text.')
        },
        {
          question: getSafeMessage(() => m.faq.question.jpg_to_png.larger(), 'Will converting JPG to PNG make my file larger?'),
          answer: getSafeMessage(() => m.faq.answer.jpg_to_png.larger(), 'Yes, PNG files are typically much larger than JPG equivalents because PNG uses lossless compression while JPG uses lossy compression. This means more data is preserved in the PNG file.')
        }
      ];
    case '.png-.jpg':
      return [
        {
          question: getSafeMessage(() => m.faq.question.png_to_jpg.transparency(), 'Why does my PNG with transparency look wrong when converted to JPG?'),
          answer: getSafeMessage(() => m.faq.answer.png_to_jpg.transparency(), 'JPG does not support transparency. When converting a PNG with transparency to JPG, the transparent areas will typically become white or another solid color.')
        },
        {
          question: getSafeMessage(() => m.faq.question.png_to_jpg.quality(), 'What quality setting should I use when converting PNG to JPG?'),
          answer: getSafeMessage(() => m.faq.answer.png_to_jpg.quality(), 'For web use, 80-90% quality is typically sufficient. For higher quality, use 90-95%. Setting above 95% results in significantly larger files with minimal quality improvement.')
        }
      ];
    case '.mp3-.wav':
      return [
        {
          question: getSafeMessage(() => m.faq.question.mp3_to_wav.restore(), 'Can I convert MP3 to WAV to restore lost audio quality?'),
          answer: getSafeMessage(() => m.faq.answer.mp3_to_wav.restore(), 'No, converting MP3 to WAV will not restore the quality that was lost during the original MP3 compression. WAV will preserve the current quality level of your MP3 file, but it cannot recover data that was discarded during compression.')
        }
      ];
    case '.wav-.mp3':
      return [
        {
          question: getSafeMessage(() => m.faq.question.wav_to_mp3.bitrate(), 'What bitrate should I use when converting WAV to MP3?'),
          answer: getSafeMessage(() => m.faq.answer.wav_to_mp3.bitrate(), 'For standard quality, 128 kbps is the minimum acceptable. For good quality, use 192-256 kbps. For near-CD quality, 320 kbps is optimal, though it results in larger file sizes.')
        }
      ];
    default:
      return [];
  };
}