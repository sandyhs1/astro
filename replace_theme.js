const fs = require('fs');
let file = fs.readFileSync('src/components/features/OnboardingModal.tsx', 'utf8');

// Replace generic dark colors to light mode variables
file = file.replace(/bg-\[\#121214\]/g, "bg-white");
file = file.replace(/border-white\/10/g, "border-gray-200");
file = file.replace(/border-white\/8/g, "border-gray-200");
file = file.replace(/border-\[\#FFD700\]\/30/g, "border-[var(--color-brand-100)]/30");
file = file.replace(/border-\[\#FFD700\]/g, "border-[var(--color-brand-100)]");
file = file.replace(/border border-\[\#C9A84C\]\/40/g, "border border-gray-200");

// Text colors
file = file.replace(/text-white/g, "text-[var(--color-text-main)]");
file = file.replace(/text-\[hsl\(40,33%,97%\)\]/g, "text-[var(--color-text-main)]");
file = file.replace(/text-gray-400/g, "text-[var(--color-text-muted)]");
file = file.replace(/text-gray-500/g, "text-[var(--color-text-muted)]");
file = file.replace(/text-white\/40/g, "text-[var(--color-text-muted)]");
file = file.replace(/text-white\/60/g, "text-[var(--color-text-muted)]");
file = file.replace(/text-white\/90/g, "text-[var(--color-text-main)]");
file = file.replace(/text-white\/30/g, "text-[var(--color-text-muted)]");

// Accents -> Brand 100 or Accent 200
file = file.replace(/text-\[\#FFD700\]/g, "text-[var(--color-brand-100)]");
file = file.replace(/bg-\[\#FFD700\]/g, "bg-[var(--color-accent-200)]");
file = file.replace(/text-\[\#C9A84C\]/g, "text-[var(--color-accent-200)]");
file = file.replace(/bg-\[\#C9A84C\]/g, "bg-[var(--color-brand-100)]");
file = file.replace(/border-\[\#C9A84C\]/g, "border-[var(--color-brand-100)]");
file = file.replace(/focus:border-\[\#C9A84C\]\/50/g, "focus:border-[var(--color-brand-100)]");

// Overlays and Wrappers
file = file.replace(/bg-black\/95/g, "bg-white/95 backdrop-blur-md");
file = file.replace(/bg-gray-100\/95/g, "bg-white/95 backdrop-blur-md");
file = file.replace(/bg-\[\#0a0a0a\]/g, "bg-[#FAFAF7]");
file = file.replace(/bg-gradient-to-b from-\[\#0a0a0a\] to-\[\#12011A\]/g, "bg-white");

file = file.replace(/bg-gradient-to-br from-\[\#FFD700\]\/10 to-\[\#FFD700\]\/5/g, "bg-[var(--color-surface)]");
file = file.replace(/bg-\[\#FFD700\]\/8 border border-\[\#FFD700\]\/25/g, "bg-[var(--color-surface)] border border-gray-200");
file = file.replace(/bg-white\/5/g, "bg-gray-50");

file = file.replace(/text-black/g, "text-white");

fs.writeFileSync('src/components/features/OnboardingModal.tsx', file);
console.log("Colors updated!");
