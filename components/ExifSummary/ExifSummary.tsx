

const formatFNumber = (fNumber: string | number): string => {
    const num = typeof fNumber === 'string' ? parseFloat(fNumber) : fNumber;
    return isNaN(num) ? fNumber.toString() : num.toFixed(1);
};

const formatExposureTime = (exposureTime: string | number): JSX.Element | string => {
    const time = typeof exposureTime === 'string' ? parseFloat(exposureTime) : exposureTime;
    if (isNaN(time)) return exposureTime.toString();
    return time < 1 ? (
        <span className="diagonal-fractions">
      1/{Math.round(1 / time)}
    </span>
    ) : time.toString();
};

export default function ExifSummary({ exif }) {
    return (
        <span>
      {exif.Make} {exif.Model}, ƒ{formatFNumber(exif.FNumber)},{" "}
            {formatExposureTime(exif.ExposureTime)} sec, {exif.FocalLength}mm ({exif.FocalLengthIn35mmFormat}mm), ISO{" "}
            {exif.ISO}
    </span>
    );
}

export function ExifSummaryExposure({ exif }) {
    return (
        <span>
      {exif.FocalLength}mm ({exif.FocalLengthIn35mmFormat}mm), ƒ
            {formatFNumber(exif.FNumber)},{" "}
            {formatExposureTime(exif.ExposureTime)} sec, ISO {exif.ISO}
    </span>
    );
}