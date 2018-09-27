function getDueTimeLabelByDate(date) {
    const now = new Date();
    const timeDifference = date - now;
    const timeDifferenceSeconds = timeDifference / 1000;
    const timeDifferenceMinutes = Math.round(timeDifference / 60000);
    const timeDifferenceHours = Math.round(timeDifference / 3600000);
    const timeDifferenceDays = Math.round(timeDifference / 86400000);

    if (timeDifferenceSeconds < 100) {
        return 'jetzt';
    } else if (timeDifferenceSeconds < 300) {
        return 'in weniger als 5 Minuten';
    } else if (timeDifferenceSeconds < 3600) {
        return `in etwa ${timeDifferenceMinutes} Minuten`;
    } else if (timeDifferenceHours < 24) {
        return `in etwa ${timeDifferenceHours} Stunden`;
    } else {
        return `in etwa ${timeDifferenceDays} Tagen`;
    }
}

module.exports = {
    getDueTimeLabelByDate: getDueTimeLabelByDate
};