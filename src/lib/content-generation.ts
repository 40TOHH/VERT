import type { ExtendedFormatInfo, ConversionInfo } from '$lib/conversion-data';

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
export function generateConversionContent(conversionInfo: ConversionInfo): ConversionContent {
  const { from, to, fromFormat, toFormat } = conversionInfo;
  
  // Get conversion-specific content based on from/to formats
  const conversionSpecificContent = getConversionSpecificContent(from, to, fromFormat, toFormat);
  
  return {
    title: `${from.substring(1).toUpperCase()} to ${to.substring(1).toUpperCase()} Converter - Fast & Free Online Tool`,
    description: `Convert ${from.substring(1).toUpperCase()} files to ${to.substring(1).toUpperCase()} format online. Fast, secure, and completely free file conversion using client-side processing. No file size limits.`,
    intro: conversionSpecificContent.intro || `Converting from ${from.substring(1).toUpperCase()} to ${to.substring(1).toUpperCase()} is a common requirement for many users. This conversion might be necessary for compatibility with specific software, reducing file size, improving quality, or meeting platform requirements. Our online converter makes this process simple and efficient.`,
    whyConvert: conversionSpecificContent.whyConvert || [
      `Compatibility with software that only supports ${to.substring(1).toUpperCase()}`,
      `Different compression algorithms that may reduce file size`,
      `Different quality characteristics that may be preferable`,
      `Platform requirements (web, mobile, or desktop applications)`
    ],
    howToConvert: [
      `Upload your ${from.substring(1).toUpperCase()} file using the converter above`,
      `Verify that the output format is set to ${to.substring(1).toUpperCase()}`,
      `Click the "Convert" button to start the conversion`,
      `Download your converted ${to.substring(1).toUpperCase()} file when complete`
    ],
    tips: conversionSpecificContent.tips || [
      `Ensure your ${from.substring(1).toUpperCase()} file is not corrupted before conversion`,
      `For best results, use original high-quality files when possible`,
      `Check the file size limitations if converting large files`
    ],
    useCases: conversionSpecificContent.useCases || [
      `Software compatibility`,
      `File size reduction`,
      `Quality optimization`,
      `Platform adaptation`
    ],
    qualityNotes: conversionSpecificContent.qualityNotes || [
      `Converting from a lossy format to another lossy format may reduce quality`,
      `Always keep original files as backup`
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
  toFormat: ExtendedFormatInfo | null
): Partial<ConversionContent> {
  // Define specific content for common conversions
  const contentMap: Record<string, Partial<ConversionContent>> = {
    // Image conversions
    '.jpg-to-.png': {
      intro: 'Converting JPG to PNG preserves image quality by using lossless compression, making it ideal for images requiring transparency or high fidelity.',
      whyConvert: [
        'To preserve image quality with lossless compression',
        'To use transparency/alpha channel',
        'For images with text or line art',
        'When archiving important photos'
      ],
      tips: [
        'PNG files are typically larger than JPEGs',
        'Use PNG for images with few colors or text',
        'For photographs, consider if JPEG is sufficient'
      ],
      useCases: [
        'Web graphics with transparency',
        'Logos and icons',
        'Images with text or line art',
        'Archiving important photos'
      ],
      qualityNotes: [
        'PNG files are lossless and preserve all image data',
        'File sizes will be larger than JPEG equivalents'
      ]
    },
    '.png-to-.jpg': {
      intro: 'Converting PNG to JPEG significantly reduces file size using lossy compression, suitable for photographs and complex images.',
      whyConvert: [
        'To significantly reduce file size',
        'For web use where smaller files are preferred',
        'When transparency is not needed',
        'For email attachments with size limits'
      ],
      tips: [
        'Choose a high JPEG quality setting for better results',
        'Remove transparency before conversion',
        'Consider whether lossy compression is acceptable'
      ],
      useCases: [
        'Web photography',
        'Email attachments',
        'Social media sharing',
        'Situations with file size limits'
      ],
      qualityNotes: [
        'JPEG is lossy and will reduce image quality',
        'Transparency will be lost in conversion',
        'Repeated conversions will further degrade quality'
      ]
    },
    
    // Audio conversions
    '.mp3-to-.wav': {
      intro: 'Converting MP3 to WAV creates an uncompressed audio file, preserving audio quality but increasing file size significantly.',
      whyConvert: [
        'To achieve uncompressed audio quality',
        'For audio editing purposes',
        'To preserve original quality for archiving',
        'For use in professional audio software'
      ],
      tips: [
        'WAV files are much larger than MP3s',
        'Use this format when quality is more important than file size',
        'Consider other lossless formats like FLAC for better compression'
      ],
      useCases: [
        'Audio editing and production',
        'Professional recording',
        'Archiving high-quality audio',
        'CD burning'
      ],
      qualityNotes: [
        'Converting from MP3 to WAV does not restore lost quality',
        'Original MP3 compression artifacts will remain'
      ]
    },
    '.wav-to-.mp3': {
      intro: 'Converting WAV to MP3 reduces file size significantly using lossy compression, making files easier to store and share while maintaining good audio quality.',
      whyConvert: [
        'To reduce file size for storage or sharing',
        'For portable music players',
        'For streaming or web use',
        'When file size is more important than quality'
      ],
      tips: [
        'Choose an appropriate bitrate (192kbps or higher for good quality)',
        'Consider your specific use case when selecting quality',
        'Keep original WAV files for archival purposes'
      ],
      useCases: [
        'Portable music players',
        'Streaming services',
        'Email attachments',
        'General music listening'
      ],
      qualityNotes: [
        'MP3 is lossy and will reduce audio quality',
        'Once converted, lost quality cannot be restored',
        'Higher bitrates preserve more audio information'
      ]
    },
    
    // Video conversions
    '.mp4-to-.avi': {
      intro: 'Converting MP4 to AVI changes the container format, which may be necessary for compatibility with older software or specific video editing tools.',
      whyConvert: [
        'For compatibility with older video software',
        'Video editing with specific tools',
        'Specific platform requirements',
        'When working with legacy systems'
      ],
      tips: [
        'AVI files may be larger than MP4 equivalents',
        'Check codec compatibility after conversion',
        'Consider keeping MP4 for web streaming'
      ],
      useCases: [
        'Legacy video editing software',
        'Older media players',
        'Specific platform requirements',
        'Archival with broad compatibility'
      ],
      qualityNotes: [
        'Conversion may change compression methods',
        'File size may increase significantly',
        'Quality may vary based on codec used'
      ]
    },
    '.avi-to-.mp4': {
      intro: 'Converting AVI to MP4 provides better compression and wider compatibility with modern devices and web platforms while preserving video quality.',
      whyConvert: [
        'For better compression and smaller file sizes',
        'For compatibility with modern devices',
        'For web streaming',
        'To reduce storage requirements'
      ],
      tips: [
        'MP4 offers better compression than AVI',
        'Verify quality settings to preserve video quality',
        'Consider H.264 or H.265 for best results'
      ],
      useCases: [
        'Web video hosting',
        'Mobile device compatibility',
        'Social media sharing',
        'Reducing storage space'
      ],
      qualityNotes: [
        'MP4 typically provides better compression efficiency',
        'Quality can be maintained with appropriate settings',
        'H.264 or H.265 codecs provide the best results'
      ]
    },
    
    // Document conversions
    '.pdf-to-.doc': {
      intro: 'Converting PDF to DOC allows for editable text content, making it possible to modify and update document content.',
      whyConvert: [
        'To make documents editable',
        'For collaboration and revision',
        'To extract text content',
        'For use in word processing software'
      ],
      tips: [
        'Complex layouts may not convert perfectly',
        'Review formatting after conversion',
        'For simple text, consider text extraction instead'
      ],
      useCases: [
        'Document editing',
        'Content revision',
        'Text extraction',
        'Academic or business use'
      ],
      qualityNotes: [
        'Complex formatting may be lost during conversion',
        'Images may require separate handling',
        'Tables and layouts may need adjustment'
      ]
    },
    '.doc-to-.pdf': {
      intro: 'Converting DOC to PDF preserves document formatting across different devices and operating systems, making it ideal for distribution and printing.',
      whyConvert: [
        'To preserve document formatting',
        'For universal compatibility',
        'For secure document distribution',
        'For printing purposes'
      ],
      tips: [
        'PDFs are not editable without specific software',
        'Check formatting before finalizing',
        'Consider accessibility requirements'
      ],
      useCases: [
        'Document distribution',
        'Academic submissions',
        'Professional presentations',
        'Print-ready documents'
      ],
      qualityNotes: [
        'PDFs preserve original formatting reliably',
        'File size may be smaller or larger depending on content',
        'PDFs are more secure and harder to modify'
      ]
    }
  };
  
  // Create a key in the format "from-to" (e.g., ".jpg-to-.png")
  const key = `${from}-to-${to}`;
  
  return contentMap[key] || {};
}

/**
 * Generate FAQ content for a specific conversion
 */
export function generateFAQContent(conversionInfo: ConversionInfo): Array<{ question: string; answer: string }> {
  const { from, to } = conversionInfo;
  
  // Common questions with format-specific variations
  const commonQuestions = [
    {
      question: `What is the difference between ${from.substring(1).toUpperCase()} and ${to.substring(1).toUpperCase()}?`,
      answer: `The ${from.substring(1).toUpperCase()} format is ${getFormatDescription(from.substring(1).toUpperCase())}, while the ${to.substring(1).toUpperCase()} format is ${getFormatDescription(to.substring(1).toUpperCase())}. ${getFormatComparisonDetail(from, to)}.`
    },
    {
      question: `How long does it take to convert ${from.substring(1).toUpperCase()} to ${to.substring(1).toUpperCase()}?`,
      answer: `Conversion time varies based on file size and your device's processing power. Small files typically convert in seconds, while larger files may take several minutes. The conversion happens directly in your browser for privacy and security.`
    },
    {
      question: `Will converting ${from.substring(1).toUpperCase()} to ${to.substring(1).toUpperCase()} reduce quality?`,
      answer: getQualityImpact(from, to)
    },
    {
      question: `What is the maximum file size I can convert from ${from.substring(1).toUpperCase()} to ${to.substring(1).toUpperCase()}?`,
      answer: `Our converter can handle large files as the processing happens directly in your browser. The only limit is your device's available memory, which can be several gigabytes on modern systems.`
    },
    {
      question: `Is it safe to convert ${from.substring(1).toUpperCase()} files to ${to.substring(1).toUpperCase()} on your website?`,
      answer: `Yes, our converter is completely safe. Files are processed directly in your browser using WebAssembly technology, meaning they never leave your device. No file uploads to our servers occur, ensuring complete privacy and security.`
    }
  ];
  
  // Add format-specific questions
  const formatSpecificQuestions = getFormatSpecificFAQs(from, to);
  
  return [...commonQuestions, ...formatSpecificQuestions];
}

/**
 * Helper functions for content generation
 */
function getFormatDescription(format: string): string {
  const descriptions: Record<string, string> = {
    'JPG': 'a lossy compressed image format ideal for photographs',
    'PNG': 'a lossless compressed image format supporting transparency',
    'GIF': 'a format supporting animated images and simple graphics',
    'MP3': 'a lossy compressed audio format with small file sizes',
    'WAV': 'an uncompressed audio format preserving all audio data',
    'MP4': 'a compressed multimedia container format widely compatible',
    'AVI': 'a multimedia container format developed by Microsoft',
    'PDF': 'a document format preserving layout across platforms',
    'DOC': 'a proprietary document format for Microsoft Word',
    'DOCX': 'a modern XML-based document format for Microsoft Word'
  };
  
  return descriptions[format] || 'a common file format';
}

function getFormatComparisonDetail(from: string, to: string): string {
  const details: Record<string, string> = {
    '.jpg-.png': 'JPG uses lossy compression while PNG uses lossless compression',
    '.png-.jpg': 'PNG preserves quality but creates larger files compared to JPG',
    '.mp3-.wav': 'MP3 uses lossy compression while WAV is uncompressed',
    '.wav-.mp3': 'WAV preserves all audio data while MP3 reduces file size',
    '.mp4-.avi': 'MP4 offers better compression and cross-platform compatibility',
    '.avi-.mp4': 'MP4 provides more efficient compression than AVI',
    '.pdf-.doc': 'PDF preserves formatting while DOC allows editing',
    '.doc-.pdf': 'DOC allows editing while PDF preserves formatting across platforms'
  };
  
  const key = `${from}-${to}`;
  return details[key] || `The ${from.substring(1).toUpperCase()} format has different characteristics than ${to.substring(1).toUpperCase()}`;
}

function getQualityImpact(from: string, to: string): string {
  // Define quality impact based on format pair
  if (from === '.jpg' && to === '.png') {
    return 'Converting from JPG to PNG will not restore quality lost during the original JPG compression, but it will preserve the current quality using lossless compression.';
  } else if (from === '.png' && to === '.jpg') {
    return 'Converting from PNG to JPG will reduce quality due to JPG\'s lossy compression algorithm. The extent of quality loss depends on the JPG quality setting used during conversion.';
  } else if (from === '.mp3' && to === '.wav') {
    return 'Converting from MP3 to WAV will not restore audio quality that was lost during the original MP3 compression. WAV will preserve the current quality level but in an uncompressed format.';
  } else if (from === '.wav' && to === '.mp3') {
    return 'Converting from WAV to MP3 will reduce audio quality due to MP3\'s lossy compression. However, using higher bitrates (192kbps or above) can maintain good audio quality.';
  } else if (from === '.mp4' && to === '.avi') {
    return 'Converting from MP4 to AVI typically preserves video quality but may result in larger file sizes depending on the codec used.';
  } else if (from === '.avi' && to === '.mp4') {
    return 'Converting from AVI to MP4 typically maintains video quality while reducing file size due to MP4\'s more efficient compression.';
  }
  
  // Default response
  return `The impact on quality depends on the specific formats involved. Converting from a lossy format to another lossy format typically results in some quality loss, while converting to a lossless format preserves existing quality.`;
}

function getFormatSpecificFAQs(from: string, to: string): Array<{ question: string; answer: string }> {
  // Format-specific questions
  const formatPairs: Record<string, Array<{ question: string; answer: string }>> = {
    '.jpg-.png': [
      {
        question: 'When should I convert JPG to PNG?',
        answer: 'Convert JPG to PNG when you need to preserve image quality without compression artifacts, require transparency in your image, or are working with images that have sharp edges and text.'
      },
      {
        question: 'Will converting JPG to PNG make my file larger?',
        answer: 'Yes, PNG files are typically much larger than JPG equivalents because PNG uses lossless compression while JPG uses lossy compression. This means more data is preserved in the PNG file.'
      }
    ],
    '.png-.jpg': [
      {
        question: 'Why does my PNG with transparency look wrong when converted to JPG?',
        answer: 'JPG does not support transparency. When converting a PNG with transparency to JPG, the transparent areas will typically become white or another solid color.'
      },
      {
        question: 'What quality setting should I use when converting PNG to JPG?',
        answer: 'For web use, 80-90% quality is typically sufficient. For higher quality, use 90-95%. Setting above 95% results in significantly larger files with minimal quality improvement.'
      }
    ],
    '.mp3-.wav': [
      {
        question: 'Can I convert MP3 to WAV to restore lost audio quality?',
        answer: 'No, converting MP3 to WAV will not restore the quality that was lost during the original MP3 compression. WAV will preserve the current quality level of your MP3 file, but it cannot recover data that was discarded during compression.'
      }
    ],
    '.wav-.mp3': [
      {
        question: 'What bitrate should I use when converting WAV to MP3?',
        answer: 'For standard quality, 128 kbps is the minimum acceptable. For good quality, use 192-256 kbps. For near-CD quality, 320 kbps is optimal, though it results in larger file sizes.'
      }
    ]
  };
  
  const key = `${from}-${to}`;
  return formatPairs[key] || [];
}