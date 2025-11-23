<script lang="ts">
  import { page } from '$app/stores';
  import { base } from '$app/paths';
  import { locales, baseLocale, localizeHref } from '$lib/paraglide/runtime';

  interface HreflangLink {
    hreflang: string;
    href: string;
  }

  let hreflangLinks: HreflangLink[] = [];

  $: {
    // Update hreflang links when page changes
    hreflangLinks = locales.map(locale => {
      // Use Paraglide's localizeHref to generate localized URLs
      const href = localizeHref($page.url.pathname, { locale });

      return {
        hreflang: locale,
        href
      };
    });
  }
</script>

{#each hreflangLinks as { hreflang, href }}
  <link rel="alternate" {hreflang} href={href} />
{/each}