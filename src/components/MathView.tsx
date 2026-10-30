import React, { useMemo } from 'react';
import katex from 'katex';

interface MathViewProps {
  math: string;
  block?: boolean;
  className?: string;
}

const SUPERSCRIPT_MAP: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '+': '⁺',
  '-': '⁻',
  '=': '⁼',
  '(': '⁽',
  ')': '⁾',
  'n': 'ⁿ',
  'i': 'ⁱ',
  'x': 'ˣ',
  'k': 'ᵏ',
};

/**
 * Replaces any remaining caret notations like x^4, 5x^7, cm^2, 10^-3 with clean Unicode superscripts
 * guaranteeing that no raw '^' character ever leaks into the UI.
 */
export function replaceCaretWithSuperscripts(text: string): string {
  if (!text || !text.includes('^')) return text;

  // Handle curly brace powers like x^{n-6} -> xⁿ⁻⁶
  let result = text.replace(/\^\{([^}]+)\}/g, (_, exp) => {
    return exp
      .split('')
      .map((ch: string) => SUPERSCRIPT_MAP[ch] || ch)
      .join('');
  });

  // Handle simple powers like x^4, 5^7, x^-1, cm^2
  result = result.replace(/\^([0-9a-zA-Z\+\-]+)/g, (_, exp) => {
    return exp
      .split('')
      .map((ch: string) => SUPERSCRIPT_MAP[ch] || ch)
      .join('');
  });

  return result;
}

/**
 * Converts common plain-text math notation into standard LaTeX
 * e.g. -3x^4 + 5x^7 - 2x^3 + 8x^9 -> -3x^{4} + 5x^{7} - 2x^{3} + 8x^{9}
 */
export function convertToLatex(input: string): string {
  if (!input) return '';
  let str = input.trim();

  // If already standard LaTeX with $, strip wrapping
  if (str.startsWith('$') && str.endsWith('$')) {
    str = str.slice(1, -1).trim();
  }

  // Replace multiplication '*' with '\cdot '
  str = str.replace(/(\d+)\s*\*\s*([a-zA-Z\\])/g, '$1 \\cdot $2');
  str = str.replace(/([a-zA-Z\)])\s*\*\s*([a-zA-Z\\])/g, '$1 \\cdot $2');
  str = str.replace(/\*/g, ' \\cdot ');

  // Replace sqrt(something) with \sqrt{something}
  str = str.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
  str = str.replace(/sqrt\{([^}]+)\}/g, '\\sqrt{$1}');

  // Replace pi with \pi
  str = str.replace(/\bpi\b/g, '\\pi');

  // Replace powers with curly braces: x^4 -> x^{4}, x^18 -> x^{18}, (x+1)^8 -> (x+1)^{8}
  str = str.replace(/\^([a-zA-Z0-9+-]+)/g, '^{$1}');

  // Replace fractions like A/B if simple
  str = str.replace(/([0-9a-zA-Z\\pi\^\{\}]+)\s*\/\s*([0-9a-zA-Z\\pi\^\{\}]+)/g, (match, num, den) => {
    if (match.includes('cm') || match.includes('m')) return match;
    return `\\frac{${num}}{${den}}`;
  });

  return str;
}

/**
 * Renders mathematical expressions cleanly using KaTeX with automatic fallback to Unicode superscripts
 */
export const MathView: React.FC<MathViewProps> = ({ math, block = false, className = '' }) => {
  const html = useMemo(() => {
    if (!math) return '';
    try {
      const latex = convertToLatex(math);
      return katex.renderToString(latex, {
        throwOnError: false,
        displayMode: block,
      });
    } catch {
      return '';
    }
  }, [math, block]);

  if (!html) {
    // Clean unicode superscript fallback
    return (
      <span className={`font-serif tracking-wide ${block ? 'block text-center my-2' : 'inline-block'} ${className}`}>
        {replaceCaretWithSuperscripts(math)}
      </span>
    );
  }

  return (
    <span
      className={`math-rendered ${block ? 'block text-center my-2' : 'inline-block'} ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

/**
 * Helper component that renders formatted text:
 * - Detects inline math expressions (e.g., P(x) = -3x^4 + 5x^7..., x^2 - 4x + 3 = 0, R^2 - r^2)
 * - Renders them with KaTeX
 * - Ensures any remaining text with carets is converted to beautiful Unicode superscripts (e.g. x⁴, cm², m³)
 */
export const FormattedMathText: React.FC<{ text: string; className?: string }> = ({ text, className = '' }) => {
  const formattedText = useMemo(() => {
    if (!text) return '';
    return replaceCaretWithSuperscripts(text);
  }, [text]);

  // If the text looks like an isolated formula (e.g. starts with P(x) = or contains math operators with powers)
  const isPureFormula = useMemo(() => {
    if (!text) return false;
    const trimmed = text.trim();
    return (
      (trimmed.startsWith('P(') || trimmed.startsWith('Q(') || trimmed.startsWith('f(')) &&
      trimmed.includes('=') &&
      !trimmed.includes('\n')
    );
  }, [text]);

  if (isPureFormula) {
    return <MathView math={text} block={false} className={className} />;
  }

  return (
    <span className={className}>
      {formattedText}
    </span>
  );
};
