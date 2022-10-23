export const e = (
    tag: string,
    attrs: Record<string, string | number | boolean | (<T extends Event>(event: T) => unknown)> = null,
    content: string | HTMLElement | HTMLElement[] = null
) => {
    const node = document.createElement(tag);

    attrs && Object.keys(attrs).forEach(name => {
        const isEvent = name.startsWith('on');

        if (isEvent) {
            node.addEventListener(name.substring(2).toLowerCase(), attrs[name] as () => never);
        } else {
            node.setAttribute(name, attrs[name] as string);
        }
    });

    if (content) {
        if (typeof content === 'string') {
            node.textContent = content;
        } else if ('nodeType' in content && content.nodeType) {
            node.appendChild(content)
        } else if (Array.isArray(content)) {
            content.forEach(child => node.appendChild(child));
        }
    }

    return node;
};

export const g = <T extends HTMLElement>(i: string): T => document.getElementById(i) as T;

export const emptyNode = (n: HTMLElement) => {
    while (n.lastChild) {
        n.removeChild(n.lastChild);
    }
    return n;
};

export const getBody = (): HTMLBodyElement => (document.body || document.getElementsByTagName("body")[0]) as unknown as HTMLBodyElement;

export const setTextClipboard = (content: string) => {
    const tmpEl = document.createElement('div');
    tmpEl.style.opacity = '0';
    tmpEl.style.position = 'absolute';
    tmpEl.style.pointerEvents = 'none';
    tmpEl.style.zIndex = '-1';
    tmpEl.textContent = content;

    getBody().appendChild(tmpEl);

    const range = document.createRange();
    range.selectNode(tmpEl);
    window.getSelection().addRange(range);
    document.execCommand('copy');
    getBody().removeChild(tmpEl);
};

export const setDocumentTitle = (title: string) => document.title = title;

export const dropClassForAllNodes = (className: string) => Array.from(document.querySelectorAll(`.${className}`)).forEach(node => node.classList.remove(className));
