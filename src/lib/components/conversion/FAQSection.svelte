<script lang="ts">
    import type { ConversionInfo } from '$lib/conversion-data';
    import { generateFAQContent } from '$lib/content-generation';
    import { getLocale } from '$lib/paraglide/runtime';
    import type { AvailableLanguageTag } from '$lib/paraglide/runtime';
    import Panel from '$lib/components/visual/Panel.svelte';

    let { conversionInfo, isLoading = false }: { conversionInfo: ConversionInfo; isLoading?: boolean } = $props();

    // Extract language tag from the current locale
    const languageTag: AvailableLanguageTag = $derived(getLocale());

    let faqs = $derived(generateFAQContent(conversionInfo, languageTag));
</script>

{#if isLoading}
    <Panel class="p-6">
        <div class="animate-pulse">
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
            <div class="space-y-4">
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 mb-6"></div>
                
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
                <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
            </div>
        </div>
    </Panel>
{:else}
    <Panel class="p-6">
        <h2 class="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
        <div class="space-y-6">
            {#each faqs as faq, i}
                <div class="border-b pb-6 last:border-0 last:pb-0">
                    <h3 class="text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
                    <p class="text-muted">{faq.answer}</p>
                </div>
            {/each}
        </div>
    </Panel>
{/if}