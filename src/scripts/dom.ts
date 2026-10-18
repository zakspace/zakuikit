/**
 * ZAKUIKit Docs — DOM utilities shared by the client scripts.
 */

/**
 * Replace an element's children with trusted, parsed HTML.
 * Uses DOMParser instead of an innerHTML sink so markup is adopted through
 * the document parser rather than injected as a string.
 */
export function setHtml(element: Element, html: string): void {
  const parsed = new DOMParser().parseFromString(html, 'text/html');
  element.replaceChildren(...Array.from(parsed.body.childNodes));
}

/** Copy text to the clipboard with a fallback for insecure contexts. */
export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    area.value = text;
    area.setAttribute('readonly', '');
    area.style.position = 'fixed';
    area.style.opacity = '0';
    document.body.append(area);
    area.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      ok = false;
    }
    area.remove();
    return ok;
  }
}
