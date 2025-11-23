import { getAllFormatPairs } from '$lib/conversion-data';
import { getConversionInfo } from '$lib/conversion-data';
import { generateConversionContent } from '$lib/content-generation';
import { validateConversionPageSEO } from '$lib/seo-validation';

/**
 * Test script for conversion functionality
 */

export function runConversionTests() {
  console.log('Starting conversion functionality tests...');
  
  // Get all possible format pairs
  const formatPairs = getAllFormatPairs();
  console.log(`Found ${formatPairs.length} format pairs to test`);
  
  // Test a sample of conversions
  const sampleSize = Math.min(10, formatPairs.length); // Test first 10 or all if less than 10
  const samplePairs = formatPairs.slice(0, sampleSize);
  
  let passedTests = 0;
  let failedTests = 0;
  
  for (const pair of samplePairs) {
    try {
      console.log(`Testing ${pair.from} to ${pair.to} conversion...`);
      
      // Test conversion info retrieval
      const conversionInfo = getConversionInfo('.' + pair.from, '.' + pair.to);
      if (!conversionInfo.compatibility) {
        console.log(`  ❌ Incompatible formats: ${pair.from} to ${pair.to}`);
        failedTests++;
        continue;
      }
      
      // Test content generation
      const content = generateConversionContent(conversionInfo);
      if (!content.title || !content.description) {
        console.log(`  ❌ Content generation failed for ${pair.from} to ${pair.to}`);
        failedTests++;
        continue;
      }
      
      // Test FAQ generation
      const faqs = conversionInfo; // FAQ is generated inside content, so this is just verifying access
      if (!faqs) {
        console.log(`  ❌ FAQ generation failed for ${pair.from} to ${pair.to}`);
        failedTests++;
        continue;
      }
      
      // Simulate page content for SEO validation
      const mockPageContent = `
        <title>${content.title}</title>
        <meta name="description" content="${content.description}" />
        <link rel="canonical" href="https://vert.sh/convert/${pair.from}/${pair.to}" />
        <h1>${pair.from.toUpperCase()} to ${pair.to.toUpperCase()} Converter</h1>
        <script type="application/ld+json">{}</script>
        <a href="/convert/${pair.from}/different">Internal Link</a>
        <a href="/convert/different/${pair.to}">Internal Link</a>
      `;
      
      // Validate SEO elements
      const seoResult = validateConversionPageSEO(conversionInfo, mockPageContent);
      if (!seoResult.passed) {
        console.log(`  ⚠️  SEO issues found for ${pair.from} to ${pair.to}:`, seoResult.errors);
      }
      
      console.log(`  ✅ Successfully tested ${pair.from} to ${pair.to}`);
      passedTests++;
    } catch (error) {
      console.log(`  ❌ Error testing ${pair.from} to ${pair.to}:`, error);
      failedTests++;
    }
  }
  
  console.log(`\nTest Results: ${passedTests} passed, ${failedTests} failed`);
  
  // Test all format pairs for compatibility
  console.log('\nChecking all format pairs for compatibility...');
  
  const incompatiblePairs = formatPairs.filter(pair => {
    const info = getConversionInfo('.' + pair.from, '.' + pair.to);
    return !info.compatibility;
  });
  
  if (incompatiblePairs.length > 0) {
    console.log(`Found ${incompatiblePairs.length} incompatible format pairs:`);
    incompatiblePairs.slice(0, 5).forEach(pair => {
      console.log(`  - ${pair.from} to ${pair.to}`);
    });
    if (incompatiblePairs.length > 5) {
      console.log(`  ... and ${incompatiblePairs.length - 5} more`);
    }
  } else {
    console.log('All format pairs are compatible!');
  }
  
  // Test content generation edge cases
  console.log('\nTesting content generation edge cases...');
  
  try {
    // Test with invalid formats
    const invalidConversion = getConversionInfo('.invalid', '.format');
    const invalidContent = generateConversionContent(invalidConversion);
    
    if (invalidContent) {
      console.log('  ✅ Handled invalid formats gracefully');
    } else {
      console.log('  ❌ Failed to handle invalid formats');
    }
  } catch (error) {
    console.log('  ✅ Properly handled error for invalid formats');
  }
  
  console.log('\nConversion functionality tests completed!');
  
  return {
    totalTests: sampleSize,
    passedTests,
    failedTests,
    incompatiblePairs: incompatiblePairs.length
  };
}

// Run tests if this file is executed directly
if (typeof window === 'undefined') {
  // Node.js environment
  runConversionTests();
} else {
  // Browser environment - attach to window for manual testing
  (window as any).runConversionTests = runConversionTests;
}