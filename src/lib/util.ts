export function convertKorToDayNum(str: string) {
    switch (str) {
        case '월':
            return 1;
        case '화':
            return 2;
        case '수':
            return 3;
        case '목':
            return 4;
        case '금':
            return 5;
        case '토':
            return 6;
        case '일':
            return 7;
    }
}

export function convertKorToWeekNum(str: string) {
    switch (str) {
        case '첫':
            return 1;
        case '둘':
            return 2;
        case '셋':
            return 3;
        case '넷':
            return 4;
    }
}

export function rangeDateStr(str: string) {
    const dateStartYear = str.substring(1, 5);
    const dateStartMonth = str.substring(6, 8);
    const dateStartDay = str.substring(9, 11);
    const dateEndYear = str.substring(12, 16);
    const dateEndMonth = str.substring(17, 19);
    const dateEndDay = str.substring(20, 22);

    return {
        start: dateStartYear + '-' + dateStartMonth + '-' + dateStartDay,
        end: dateEndYear + '-' + dateEndMonth + '-' + dateEndDay,
    };
}
