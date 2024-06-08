export default function ProgressBar({ progress }) {
    let color = 'green'; // Default color for progress above 60
    if (progress <= 30) {
        color = 'red';
    } else if (progress <= 60) {
        color = 'yellow';
    }

    return (
        <div className="outer-bar">
            <div className="inner-bar" style={{ width: `${progress}%`, backgroundColor: color }}></div>
        </div>
    );
}
