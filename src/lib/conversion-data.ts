import type { Categories } from "$lib/types";
import type { Converter, FormatInfo } from "$lib/converters/converter.svelte";
import { converters, getConverterByFormat } from "$lib/converters";

// Extended format information with additional SEO-focused properties
export interface ExtendedFormatInfo extends FormatInfo {
	displayName?: string;
	description?: string;
	mimeType?: string;
	useCases?: string[];
	pros?: string[];
	cons?: string[];
}

// Information about a specific conversion
export interface ConversionInfo {
	from: string;
	to: string;
	converter: Converter | null;
	fromFormat: ExtendedFormatInfo | null;
	toFormat: ExtendedFormatInfo | null;
	allFormats: string[];
	compatibility: boolean;
	description: string;
	keywords: string;
}

/**
 * Get enhanced conversion information for SEO-optimized pages
 */
export function getConversionInfo(from: string, to: string): ConversionInfo {
	// Ensure formats start with a dot
	const normalizedFrom = from.startsWith('.') ? from : `.${from}`;
	const normalizedTo = to.startsWith('.') ? to : `.${to}`;
	
	const converter = getConverterByFormat(normalizedFrom);
	
	// Find format information for both source and target formats
	const fromFormat = converter?.supportedFormats.find(f => f.name === normalizedFrom) as ExtendedFormatInfo | undefined;
	const toFormat = converter?.supportedFormats.find(f => f.name === normalizedTo) as ExtendedFormatInfo | undefined;
	
	// Add extended information to formats if available
	extendFormatInfo(fromFormat);
	extendFormatInfo(toFormat);
	
	// Get all available formats for this converter
	const allFormats = converter?.formatStrings() || [];
	
	const conversionInfo: ConversionInfo = {
		from: normalizedFrom,
		to: normalizedTo,
		converter,
		fromFormat: fromFormat || null,
		toFormat: toFormat || null,
		allFormats,
		compatibility: !!fromFormat && !!toFormat,
		description: `Convert ${normalizedFrom.substring(1).toUpperCase()} files to ${normalizedTo.substring(1).toUpperCase()} online. Fast, secure, and free file conversion using client-side processing.`,
		keywords: `${normalizedFrom.substring(1)}, ${normalizedTo.substring(1)}, conversion, converter, file conversion, ${normalizedFrom.substring(1)} to ${normalizedTo.substring(1)}, online tool`
	};
	
	return conversionInfo;
}

/**
 * Extend format information with SEO-focused properties
 */
function extendFormatInfo(format?: ExtendedFormatInfo): void {
	if (!format) return;

	// Comprehensive format descriptions with SEO-focused content
	const formatDescriptions: Record<string, Partial<ExtendedFormatInfo>> = {
		'.jpg': {
			displayName: 'Joint Photographic Experts Group',
			description: 'JPEG (Joint Photographic Experts Group) is a widely used method of lossy compression for digital images. It\'s commonly used for photographs and complex images with many colors, offering high compression ratios with relatively minimal quality loss.',
			mimeType: 'image/jpeg',
			useCases: [
				'Photography and digital art',
				'Web images with limited file size',
				'Social media sharing',
				'Digital publishing',
				'Email attachments'
			],
			pros: [
				'Excellent compression ratios',
				'Widely supported across platforms',
				'Smaller file sizes compared to alternatives',
				'Good quality for photographic content'
			],
			cons: [
				'Lossy compression results in quality loss',
				'Not suitable for images with text or line art',
				'No support for transparency',
				'Artifacts may appear at high compression levels'
			]
		},
		'.png': {
			displayName: 'Portable Network Graphics',
			description: 'PNG (Portable Network Graphics) is a raster graphics file format that supports lossless data compression. It was created as an improved, non-patented replacement for GIF and is well-suited for images with text, line art, and graphics with transparency.',
			mimeType: 'image/png',
			useCases: [
				'Web graphics and logos',
				'Images requiring transparency',
				'Graphics with sharp edges and text',
				'Archival of images where quality is paramount',
				'Screenshots with text'
			],
			pros: [
				'Lossless compression preserving all image data',
				'Supports transparency and alpha channels',
				'Better color representation than GIF',
				'No compression artifacts'
			],
			cons: [
				'Larger file sizes compared to JPEG',
				'No animation support (unlike GIF)',
				'Slower processing compared to other formats'
			]
		},
		'.gif': {
			displayName: 'Graphics Interchange Format',
			description: 'GIF (Graphics Interchange Format) is a bitmap image format supporting both static and animated images. It uses lossless compression and is limited to an 8-bit palette, meaning it supports a maximum of 256 colors.',
			mimeType: 'image/gif',
			useCases: [
				'Simple animations and short clips',
				'Low-color graphics with limited palette',
				'Web graphics with simple colors',
				'Basic animated logos or buttons',
				'Memes and simple visual content'
			],
			pros: [
				'Animation support',
				'Small file sizes for simple graphics',
				'Supports transparency',
				'Universal web browser support',
				'Suitable for simple animations'
			],
			cons: [
				'Limited to 256 colors per frame',
				'Inefficient for complex images or photographs',
				'No support for semi-transparent pixels',
				'Large file sizes for detailed animations'
			]
		},
		'.mp3': {
			displayName: 'MPEG Audio Layer III',
			description: 'MP3 (MPEG Audio Layer III) is a coding format for digital audio which uses lossy data compression. It\'s the most common audio format for consumer audio streaming and storage, offering high compression ratios with good quality.',
			mimeType: 'audio/mpeg',
			useCases: [
				'Music streaming and storage',
				'Audio books',
				'Podcasts',
				'Portable music players',
				'Social media audio clips'
			],
			pros: [
				'High compression ratios',
				'Widely supported across devices and platforms',
				'Good quality at moderate bitrates',
				'Smaller file sizes than uncompressed formats'
			],
			cons: [
				'Lossy compression results in quality loss',
				'Quality loss is permanent',
				'Not suitable for professional audio editing',
				'Quality may be insufficient for audiophiles'
			]
		},
		'.wav': {
			displayName: 'Waveform Audio File Format',
			description: 'WAV (Waveform Audio File Format) is an audio file format standard developed by Microsoft and IBM. It\'s an uncompressed format that preserves all audio data, resulting in high quality but large file sizes.',
			mimeType: 'audio/wav',
			useCases: [
				'Professional audio editing',
				'CD audio recording',
				'High-quality audio archival',
				'Audio production and mastering',
				'Audio sample libraries'
			],
			pros: [
				'Uncompressed audio preserving all data',
				'High quality with no compression artifacts',
				'Compatible with most audio editing software',
				'Lossless format maintaining original quality'
			],
			cons: [
				'Very large file sizes',
				'Not suitable for streaming due to size',
				'Larger bandwidth requirements',
				'May be unnecessary for casual listening'
			]
		},
		'.mp4': {
			displayName: 'MPEG-4 Part 14',
			description: 'MP4 (MPEG-4 Part 14) is a digital multimedia container format most commonly used to store video and audio. It\'s widely supported and offers good compression while maintaining quality, making it ideal for web streaming.',
			mimeType: 'video/mp4',
			useCases: [
				'Web video streaming',
				'Mobile video playback',
				'Social media video sharing',
				'Digital video distribution',
				'Video messaging'
			],
			pros: [
				'Good compression with quality retention',
				'Wide compatibility across devices and browsers',
				'Support for subtitles and multiple audio tracks',
				'Efficient for streaming'
			],
			cons: [
				'Lossy compression may affect quality',
				'Can be proprietary requiring licensing',
				'More complex than older formats',
				'May require specific codecs for playback'
			]
		},
		'.avi': {
			displayName: 'Audio Video Interleave',
			description: 'AVI (Audio Video Interleave) is a multimedia container format introduced by Microsoft in 1992. It\'s a simple format that stores audio and video data with various codecs, offering good compatibility with older systems.',
			mimeType: 'video/x-msvideo',
			useCases: [
				'Video storage on older systems',
				'Cross-platform video sharing',
				'Basic video editing',
				'Legacy system compatibility',
				'When simple container format is needed'
			],
			pros: [
				'Simple and well-understood format',
				'Good compatibility with older software',
				'Flexible codec support',
				'Direct streaming capability'
			],
			cons: [
				'Larger file sizes compared to modern formats',
				'Less efficient compression than newer formats',
				'Less web-friendly than MP4',
				'Limited support for modern features like subtitles'
			]
		},
		'.pdf': {
			displayName: 'Portable Document Format',
			description: 'PDF (Portable Document Format) is a file format developed by Adobe to present documents in a manner independent of application software, hardware, and operating systems. It preserves formatting across platforms and is widely used for document sharing.',
			mimeType: 'application/pdf',
			useCases: [
				'Official documents and forms',
				'Academic papers and research',
				'Business presentations',
				'E-books and digital publications',
				'Print-ready documents'
			],
			pros: [
				'Preserves document formatting across platforms',
				'Universal support across devices',
				'Security features (password protection, encryption)',
				'Contains both text and images efficiently',
				'Compresses well for text-heavy documents'
			],
			cons: [
				'Not easily editable without specific software',
				'Can be difficult to extract text from',
				'Potential security vulnerabilities',
				'May require specific software to create'
			]
		},
		'.doc': {
			displayName: 'Microsoft Word Document',
			description: 'DOC is the legacy file format used by Microsoft Word for word processing documents. While largely replaced by the newer DOCX format, it remains compatible with many systems and applications.',
			mimeType: 'application/msword',
			useCases: [
				'Legacy document compatibility',
				'When working with older systems',
				'Basic word processing tasks',
				'Sharing with systems that don\'t support DOCX',
				'Archived documents'
			],
			pros: [
				'Widely supported by word processors',
				'Compatible with older versions of Word',
				'Good for basic text formatting',
				'Established standard'
			],
			cons: [
				'Larger file sizes than DOCX',
				'Less advanced formatting options',
				'Proprietary format requiring licensing',
				'Potential compatibility issues with non-Microsoft software'
			]
		},
		'.docx': {
			displayName: 'Microsoft Word Open XML Document',
			description: 'DOCX is the modern Office Open XML format for Microsoft Word documents. It provides better compression than the older DOC format and supports more advanced formatting options.',
			mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
			useCases: [
				'Professional word processing',
				'Complex documents with advanced formatting',
				'Modern document sharing',
				'Academic and business documents',
				'When advanced formatting features are needed'
			],
			pros: [
				'Better compression than DOC format',
				'More advanced formatting options',
				'Open standard with published specifications',
				'Better data recovery features',
				'Support for macros and advanced features'
			],
			cons: [
				'Requires newer software versions',
				'Complex internal format',
				'Potential compatibility issues with older systems',
				'Larger file sizes for simple documents compared to plain text'
			]
		}
	};

	// Apply extended information if available
	const extendedInfo = formatDescriptions[format.name];
	if (extendedInfo) {
		Object.assign(format, extendedInfo);
	}
}

/**
 * Get all possible conversions for a given format
 */
export function getPossibleConversions(format: string): string[] {
	const converter = getConverterByFormat(format);
	if (!converter) return [];
	
	const formatObj = converter.supportedFormats.find(f => f.name === format);
	if (!formatObj) return [];
	
	return converter.supportedFormats
		.filter(f => f.name !== format && f.toSupported)
		.map(f => f.name);
}

/**
 * Get all format pairs for static generation
 */
export function getAllFormatPairs(): { from: string; to: string }[] {
	const pairs: { from: string; to: string }[] = [];
	
	for (const converter of converters) {
		const formats = converter.supportedFormats.filter(f => f.fromSupported);
		
		for (const fromFormat of formats) {
			const toFormats = converter.supportedFormats
				.filter(f => f.name !== fromFormat.name && f.toSupported);
			
			for (const toFormat of toFormats) {
				pairs.push({
					from: fromFormat.name.substring(1), // Remove the dot
					to: toFormat.name.substring(1)      // Remove the dot
				});
			}
		}
	}
	
	return pairs;
}