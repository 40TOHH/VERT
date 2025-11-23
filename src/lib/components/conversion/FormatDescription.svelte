<script lang="ts">
    import type { ExtendedFormatInfo } from '$lib/conversion-data';
    import Panel from '$lib/components/visual/Panel.svelte';

    let { format, isLoading = false }: { format: ExtendedFormatInfo; isLoading?: boolean } = $props();
</script>

{#if isLoading}
    <Panel class="p-6">
        <div class="animate-pulse">
            <div class="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6 mb-4"></div>
            <div class="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
            <div class="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
        </div>
    </Panel>
{:else}
    <Panel class="p-6">
        <h2 class="text-xl font-bold mb-4">{format.displayName || format.name.substring(1).toUpperCase()}</h2>
        
        {#if format.description}
            <p class="mb-4">{format.description}</p>
        {/if}
        
        <div class="grid grid-cols-2 gap-4 mb-4">
            {#if format.mimeType}
                <div>
                    <p class="font-semibold">MIME Type:</p>
                    <p>{format.mimeType}</p>
                </div>
            {/if}
            
            {#if format.useCases && format.useCases.length > 0}
                <div>
                    <p class="font-semibold">Common Uses:</p>
                    <p>{format.useCases.join(', ')}</p>
                </div>
            {/if}
        </div>
        
        {#if format.pros || format.cons}
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                {#if format.pros && format.pros.length > 0}
                    <div>
                        <p class="font-semibold text-success mb-2">Advantages:</p>
                        <ul class="list-disc pl-5">
                            {#each format.pros as pro}
                                <li>{pro}</li>
                            {/each}
                        </ul>
                    </div>
                {/if}
                
                {#if format.cons && format.cons.length > 0}
                    <div>
                        <p class="font-semibold text-failure mb-2">Disadvantages:</p>
                        <ul class="list-disc pl-5">
                            {#each format.cons as con}
                                <li>{con}</li>
                            {/each}
                        </ul>
                    </div>
                {/if}
            </div>
        {/if}
    </Panel>
{/if}