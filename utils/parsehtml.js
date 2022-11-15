import TurndownService from 'turndown';
import * as DOMPurify from 'isomorphic-dompurify';
import * as turndownPluginGfm from '@guyplusplus/turndown-plugin-gfm';

export async function parseHtmlContent(content) {
  const gfm = turndownPluginGfm.gfm;
  const turndownService = new TurndownService({
    headingStyle: 'atx',
    hr: '---',
    bulletListMarker: '-',
    codeBlockStyle: 'fenced',
    emDelimiter: '*',
  });
  turndownService.use(gfm);
  const articleContent = turndownService.turndown(content);

  return articleContent;
}