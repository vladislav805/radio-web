export const leadingZero = (n: number) => `00${n}`.substr(-2);

export const toTimeFormat = (n: number) => {
    const d = [
        Math.floor(n / 60 % 60),
        Math.floor(n % 60),
    ].map(v => leadingZero(v));

    const h = Math.floor(n / 60 / 60 % 60);
    if (h) {
        h && d.unshift(String(h));
    }

    return d.join(":");
};
