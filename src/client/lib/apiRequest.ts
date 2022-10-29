const endpoint = process.env.NODE_ENV === 'production' ? './' : `https://radio.velu.ga/`;

export async function apiRequest<T>(method: string, params: Record<string, string>): Promise<T> {
    const strParams = new URLSearchParams(params).toString();
    const response = await fetch(`${endpoint}api/${method}?${strParams}`);
    const json = await response.json();

    return json.result as T;
}
