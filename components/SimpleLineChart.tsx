interface DataPoint {
  date: string;
  value: number;
}

interface SimpleLineChartProps {
  data: DataPoint[];
  color: string;
  label: string;
  valueFormatter?: (value: number) => string;
}

export default function SimpleLineChart({
  data,
  color,
  label,
  valueFormatter = (v) => v.toString(),
}: SimpleLineChartProps) {
  if (data.length === 0) return null;

  const values = data.map(d => d.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const range = maxValue - minValue || 1;

  const points = data.map((point, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 100 - ((point.value - minValue) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  // Show every Nth label to avoid crowding
  const labelInterval = Math.ceil(data.length / 6);

  return (
    <div className="w-full">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-gray-700">{label}</h3>
        <div className="text-xs text-gray-500">Last 30 Days</div>
      </div>

      <div className="relative bg-white rounded-lg border border-gray-200 p-4">
        {/* Chart SVG */}
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-40"
        >
          {/* Grid lines */}
          <line x1="0" y1="0" x2="100" y2="0" stroke="#e5e7eb" strokeWidth="0.5" />
          <line x1="0" y1="25" x2="100" y2="25" stroke="#e5e7eb" strokeWidth="0.5" />
          <line x1="0" y1="50" x2="100" y2="50" stroke="#e5e7eb" strokeWidth="0.5" />
          <line x1="0" y1="75" x2="100" y2="75" stroke="#e5e7eb" strokeWidth="0.5" />
          <line x1="0" y1="100" x2="100" y2="100" stroke="#e5e7eb" strokeWidth="0.5" />

          {/* Line chart */}
          <polyline
            points={points}
            fill="none"
            stroke={color}
            strokeWidth="2"
            vectorEffect="non-scaling-stroke"
          />

          {/* Data points */}
          {data.map((point, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = 100 - ((point.value - minValue) / range) * 100;
            return (
              <circle
                key={index}
                cx={x}
                cy={y}
                r="1.5"
                fill={color}
                vectorEffect="non-scaling-stroke"
              />
            );
          })}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-gray-500">
          {data.map((point, index) => {
            if (index % labelInterval !== 0 && index !== data.length - 1) {
              return <span key={index} className="invisible">-</span>;
            }
            return <span key={index}>{point.date}</span>;
          })}
        </div>

        {/* Min/Max indicators */}
        <div className="mt-2 flex justify-between text-xs">
          <span className="text-gray-500">
            Min: <span className="font-semibold text-gray-700">{valueFormatter(minValue)}</span>
          </span>
          <span className="text-gray-500">
            Current: <span className="font-semibold text-gray-900">{valueFormatter(values[values.length - 1])}</span>
          </span>
          <span className="text-gray-500">
            Max: <span className="font-semibold text-gray-700">{valueFormatter(maxValue)}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
