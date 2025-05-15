export async function apiRequest<T>(method: string, params: Record<string, string>): Promise<T> {
    const strParams = new URLSearchParams(params).toString();
    const response = await fetch(`./api/${method}?${strParams}`);
    const json = await response.json();

    return json.result as T;
}
