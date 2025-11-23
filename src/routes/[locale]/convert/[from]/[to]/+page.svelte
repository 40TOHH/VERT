<script lang="ts">
	import { onMount } from 'svelte';
	import type { PageData } from './$types';
	import ConversionPanel from '$lib/components/functional/ConversionPanel.svelte';
	import FormatDropdown from '$lib/components/functional/FormatDropdown.svelte';
	import Uploader from '$lib/components/functional/Uploader.svelte';
	import Panel from '$lib/components/visual/Panel.svelte';
	import ProgressBar from '$lib/components/visual/ProgressBar.svelte';
	import Tooltip from '$lib/components/visual/Tooltip.svelte';
	import FormatDescription from '$lib/components/conversion/FormatDescription.svelte';
	import FAQSection from '$lib/components/conversion/FAQSection.svelte';
	import InternalLinking from '$lib/components/conversion/InternalLinking.svelte';
	import { categories, converters } from '$lib/converters';
	import { files } from '$lib/store/index.svelte';
	import {
		AudioLines,
		BookText,
		DownloadIcon,
		FileMusicIcon,
		FileQuestionIcon,
		FileVideo2,
		FilmIcon,
		ImageIcon,
		ImageOffIcon,
		RotateCwIcon,
		XIcon,
		InfoIcon
	} from 'lucide-svelte';
	import { m } from '$lib/paraglide/messages';
	import { Settings } from '$lib/sections/settings/index.svelte';
	import { generateConversionContent } from '$lib/content-generation';

	let { data }: { data: PageData } = $props();

	let processedFileIds = $state(new Set<string>());

	// Initialize format selection based on URL parameters
	$effect(() => {
		if (!Settings.instance.settings || files.files.length === 0) return;

		files.files.forEach((file) => {
			if (processedFileIds.has(file.id)) return;

			const { from, to } = data.conversionInfo;
			// If the uploaded file matches our source format, set the target format
			if (file.from === from) {
				file.to = to;
				processedFileIds.add(file.id);
			}
		});
	});

	const { from, to, converter: converterName, fromFormat, toFormat, description } = data.conversionInfo;

	// Generate conversion-specific content
	const content = generateConversionContent(data.conversionInfo);

	let pageTitle = content.title;
	let pageDescription = content.description;

	// Determine category for styling
	let category: string | undefined;
	if (converterName === 'imagemagick') category = 'image';
	else if (converterName === 'ffmpeg') category = 'audio';
	else if (converterName === 'vertd') category = 'video';
	else if (converterName === 'pandoc') category = 'doc';

	function getFormatIcon() {
		switch(category) {
			case 'image': return ImageIcon;
			case 'audio': return AudioLines;
			case 'video': return FilmIcon;
			case 'doc': return BookText;
			default: return FileQuestionIcon;
		}
	}

	const FormatIcon = getFormatIcon();

	// Get related conversions for internal linking
	const relatedConversions = $derived(() => {
		if (!category) return [];

		const categoryFormats = categories[category]?.formats || [];
		return categoryFormats
			.filter(format => format !== from && format !== to)
			.slice(0, 5) // Limit to 5 related formats
			.map(format => ({
				from,
				to: format
			}));
	});

	// Get schema application category based on format type
	function getSchemaApplicationCategory() {
		switch(category) {
			case 'image': return 'GraphicsApplication';
			case 'audio': return 'MusicApplication';
			case 'video': return 'VideoApplication';
			case 'doc': return 'BusinessApplication';
			default: return 'UtilityApplication';
		}
	}
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content="{pageDescription}" />
	<meta name="keywords" content="{data.conversionInfo.keywords}" />
	<meta property="og:title" content="{pageTitle}" />
	<meta property="og:description" content="{pageDescription}" />
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://vert.sh/convert/{from.substring(1)}/{to.substring(1)}" />
	<meta name="twitter:card" content="summary_large_image" />
	<link rel="canonical" href="https://vert.sh/convert/{from.substring(1)}/{to.substring(1)}" />

	<script type="application/ld+json">
		{JSON.stringify({
			"@context": "https://schema.org",
			"@type": "SoftwareApplication",
			"name": pageTitle,
			"applicationCategory": getSchemaApplicationCategory(),
			"operatingSystem": "Web Browser",
			"description": pageDescription,
			"offers": {
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD"
			},
			"featureList": [
				"No file size limits",
				"Client-side processing",
				`${from.substring(1).toUpperCase()} to ${to.substring(1).toUpperCase()} conversion`,
				"Fast processing",
				"Secure (files never leave device)"
			],
			"softwareVersion": "1.0",
			"applicationSubCategory": [
				"UtilityApp",
				"FileConversionTool"
			]
		})}
	</script>
</svelte:head>

<div class="max-w-4xl mx-auto px-4 py-8">
	<div class="mb-12 text-center">
		<div class="flex items-center justify-center gap-4 mb-4">
			<FormatIcon size="32" class="text-blue-500" />
			<h1 class="text-3xl md:text-4xl font-bold">
				{from.substring(1).toUpperCase()} to {to.substring(1).toUpperCase()} Converter
			</h1>
		</div>

		<p class="text-lg text-muted max-w-2xl mx-auto">
			{content.intro}
		</p>
	</div>

	{#if fromFormat && toFormat}
		<div class="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
			<FormatDescription format={fromFormat} />
			<FormatDescription format={toFormat} />
		</div>
	{:else}
		<div class="alert alert-warning mb-12">
			<p>Information about the {from} or {to} format is not available at this time.</p>
		</div>
	{/if}

	<div class="mb-12">
		<h2 class="text-2xl font-bold mb-6 text-center">Convert Your Files</h2>
		<div class="max-w-2xl mx-auto">
			<ConversionPanel />
		</div>
	</div>

	<InternalLinking conversionInfo={data.conversionInfo} />

	<div class="prose max-w-none mb-12">
		<h2>About {from.substring(1).toUpperCase()} to {to.substring(1).toUpperCase()} Conversion</h2>
		<p>{content.intro}</p>

		<h3>Why Convert {from.substring(1).toUpperCase()} to {to.substring(1).toUpperCase()}?</h3>
		<ul>
			{#each content.whyConvert as reason}
				<li>{reason}</li>
			{/each}
		</ul>

		<h3>How to Convert {from.substring(1).toUpperCase()} to {to.substring(1).toUpperCase()}</h3>
		<ol>
			{#each content.howToConvert as step}
				<li>{step}</li>
			{/each}
		</ol>

		{#if content.tips && content.tips.length > 0}
			<h3>Tips for Best Results</h3>
			<ul>
				{#each content.tips as tip}
					<li>{tip}</li>
				{/each}
			</ul>
		{/if}
	</div>

	<FAQSection conversionInfo={data.conversionInfo} />
</div>