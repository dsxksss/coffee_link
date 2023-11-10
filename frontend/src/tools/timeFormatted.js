function timeFormatted(timeString){
    // 创建一个 Date 对象
    const utcDate = new Date(timeString);

    // 使用 toLocaleString 方法将 UTC 时间转换为中国上海时区的时间
    const shanghaiTime = utcDate.toLocaleString("zh-CN", {
        timeZone: "Asia/Shanghai",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });

    return shanghaiTime
}

export default timeFormatted;