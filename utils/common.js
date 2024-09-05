export function convertSize(sizeInKB) {
    let size = sizeInKB;
    let unit = 'KB';

    if (size >= 1024) {
        size = size / 1024;
        unit = 'MB';
        if (size >= 1024) {
            size = size / 1024;
            unit = 'GB';
        }
    }

    return size.toFixed(2) + ' ' + unit;
}


