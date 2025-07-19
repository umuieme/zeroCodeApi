

export function isObject(data: any) { 
    return data && typeof data === 'object' && !Array.isArray(data);
}