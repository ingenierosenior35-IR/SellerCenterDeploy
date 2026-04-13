import { isMarkdownContent } from './html-to-markdown';

describe('isMarkdownContent', () => {
  it('detects heading patterns', () => {
    expect(isMarkdownContent('# Hello World')).toBe(true);
    expect(isMarkdownContent('## Section')).toBe(true);
  });

  it('detects list patterns', () => {
    expect(isMarkdownContent('* item one')).toBe(true);
    expect(isMarkdownContent('- item two')).toBe(true);
    expect(isMarkdownContent('1. first item')).toBe(true);
  });

  it('detects code block patterns', () => {
    expect(isMarkdownContent('```javascript\ncode here\n```')).toBe(true);
  });

  it('detects table patterns', () => {
    expect(isMarkdownContent('| col1 | col2 |')).toBe(true);
  });

  it('detects link patterns', () => {
    expect(isMarkdownContent('[click here](https://example.com)')).toBe(true);
  });

  it('detects image patterns', () => {
    expect(isMarkdownContent('![alt text](image.png)')).toBe(true);
  });

  it('returns false for plain text', () => {
    expect(isMarkdownContent('just plain text')).toBe(false);
    expect(isMarkdownContent('no markdown here at all')).toBe(false);
  });

  it('returns false for empty string', () => {
    expect(isMarkdownContent('')).toBe(false);
  });
});
