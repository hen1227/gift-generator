

export const UUID = () => {
    // Random uppercase, lowercase, and numbers 32 characters long
    // xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx
    let uuid = '';
    for(let i = 0; i < 32; i++) {
        uuid += Math.floor(Math.random() * 16).toString(16);
        if(i === 7 || i === 11 || i === 15 || i === 19) {
            uuid += '-';
        }
    }
    return uuid;
}
