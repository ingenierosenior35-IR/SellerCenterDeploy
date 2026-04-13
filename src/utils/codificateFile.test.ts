import { fileToBase64 } from './codificateFile';

describe('fileToBase64', () => {
  it('converts a file to a base64 string', async () => {
    const content = 'Hello, World!';
    const file = new File([content], 'test.txt', { type: 'text/plain' });
    const result = await fileToBase64(file);
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('decodes back to original content', async () => {
    const content = 'test content 123';
    const file = new File([content], 'file.txt', { type: 'text/plain' });
    const base64 = await fileToBase64(file);
    const decoded = atob(base64);
    expect(decoded).toBe(content);
  });

  it('handles empty file', async () => {
    const file = new File([], 'empty.txt', { type: 'text/plain' });
    const result = await fileToBase64(file);
    expect(result).toBe('');
  });
});
