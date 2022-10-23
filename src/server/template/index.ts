export interface IBlock {
    tag?: string;
    attrs?: Record<string, string | number | undefined>;
    content?: IBlockContent;
}

type IBlockContent = string | number | IBlock | undefined | IBlockContent[];

const unaryTags = new Set<string>(['br', 'meta', 'link']);

export function template(block: IBlockContent): string {
    if (block === undefined) return '';
    if (Array.isArray(block)) return block.map(template).join('');
    if (typeof block === 'string' || typeof block === 'number') return String(block);



    const tag = block.tag ?? 'div';

    const attrs = block.attrs
        ? Object.entries(block.attrs).map(([key, value]) => `${key}="${String(value).replace(/"/g, "&quot;")}"`)
        : '';

    const close = unaryTags.has(tag) ? '' : `</${tag}>`;

    return `<${tag}${attrs}>${template(block.content)}${close}`;
}

