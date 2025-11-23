<script lang="ts">
    import { categories } from '$lib/converters';
    import type { ConversionInfo } from '$lib/conversion-data';

    let { conversionInfo }: { conversionInfo: ConversionInfo } = $props();
    
    // Get related conversions for internal linking
    const relatedConversions = $derived(() => {
        const { from, to, converter } = conversionInfo;
        
        if (!converter) return [];
        
        // Determine category based on converter name
        let category: string | undefined;
        if (converter.name === 'imagemagick') category = 'image';
        else if (converter.name === 'ffmpeg') category = 'audio';
        else if (converter.name === 'vertd') category = 'video';
        else if (converter.name === 'pandoc') category = 'doc';
        
        if (!category) return [];
        
        const categoryFormats = categories[category]?.formats || [];
        return categoryFormats
            .filter(format => format !== from && format !== to)
            .slice(0, 6) // Limit to 6 related formats
            .map(format => ({
                from,
                to: format
            }));
    });
    
    // Get common conversions for this category
    const commonConversions = $derived(() => {
        const { from, converter } = conversionInfo;
        
        if (!converter) return [];
        
        // Determine category based on converter name
        let category: string | undefined;
        if (converter.name === 'imagemagick') category = 'image';
        else if (converter.name === 'ffmpeg') category = 'audio';
        else if (converter.name === 'vertd') category = 'video';
        else if (converter.name === 'pandoc') category = 'doc';
        
        if (!category) return [];
        
        // Define common target formats for each category
        const commonTargets: Record<string, string[]> = {
            'image': ['.jpg', '.png', '.gif', '.webp'],
            'audio': ['.mp3', '.wav', '.flac', '.aac'],
            'video': ['.mp4', '.avi', '.mov', '.mkv'],
            'doc': ['.pdf', '.docx', '.txt', '.rtf']
        };
        
        return commonTargets[category]
            .filter(format => format !== from)
            .slice(0, 4)
            .map(target => ({
                from,
                to: target
            }));
    });
</script>

{#if relatedConversions.length > 0 || commonConversions.length > 0}
    <div class="mb-12">
        <h2 class="text-2xl font-bold mb-6">Related Conversions</h2>
        
        {#if commonConversions.length > 0}
            <div class="mb-8">
                <h3 class="text-xl font-semibold mb-4">Common Conversions</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {#each commonConversions as conversion}
                        <a 
                            href="/convert/{conversion.from.substring(1)}/{conversion.to.substring(1)}" 
                            class="block p-4 border rounded-lg hover:bg-panel-alt transition-colors text-center"
                        >
                            {conversion.from.substring(1).toUpperCase()} to {conversion.to.substring(1).toUpperCase()}
                        </a>
                    {/each}
                </div>
            </div>
        {/if}
        
        {#if relatedConversions.length > 0}
            <div>
                <h3 class="text-xl font-semibold mb-4">Other {conversionInfo.from.substring(1).toUpperCase()} Conversions</h3>
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {#each relatedConversions as conversion}
                        <a 
                            href="/convert/{conversion.from.substring(1)}/{conversion.to.substring(1)}" 
                            class="block p-4 border rounded-lg hover:bg-panel-alt transition-colors text-center"
                        >
                            {conversion.from.substring(1).toUpperCase()} to {conversion.to.substring(1).toUpperCase()}
                        </a>
                    {/each}
                </div>
            </div>
        {/if}
    </div>
{/if}