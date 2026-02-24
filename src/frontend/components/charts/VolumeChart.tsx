import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import Svg, { Polyline, Line as SvgLine, Circle, Text as SvgText } from 'react-native-svg';

type DataPoint = { week: string; volume: number };

type VolumeChartProps = {
  data: DataPoint[];
};

export function VolumeChart({ data }: VolumeChartProps) {
  const { width: screenWidth } = useWindowDimensions();

  if (data.length === 0) {
    return (
      <View className="h-48 items-center justify-center rounded-xl bg-background-50">
        <Text className="text-sm text-foreground-subtle">No volume data yet</Text>
      </View>
    );
  }
  const width = screenWidth - 64; // account for px-4 padding + card padding
  const height = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 50 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxVolume = Math.max(...data.map((d) => d.volume), 1);
  const minVolume = 0;

  const points = data.map((d, i) => {
    const x = padding.left + (i / Math.max(data.length - 1, 1)) * chartWidth;
    const y = padding.top + chartHeight - ((d.volume - minVolume) / (maxVolume - minVolume)) * chartHeight;
    return { x, y, ...d };
  });

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ');

  return (
    <View className="rounded-xl bg-background-50 p-4">
      <Text className="text-sm font-medium text-foreground mb-2">Volume Over Time</Text>
      <Svg width={width} height={height}>
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = padding.top + chartHeight * (1 - pct);
          return (
            <SvgLine key={pct} x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgb(38, 38, 38)" strokeWidth={1} />
          );
        })}
        {/* Y-axis labels */}
        {[0, 0.5, 1].map((pct) => {
          const y = padding.top + chartHeight * (1 - pct);
          const val = Math.round(minVolume + (maxVolume - minVolume) * pct);
          return (
            <SvgText key={`label-${pct}`} x={padding.left - 8} y={y + 4} fontSize={10} fill="rgb(115, 115, 115)" textAnchor="end">
              {val >= 1000 ? `${(val / 1000).toFixed(1)}k` : val}
            </SvgText>
          );
        })}
        {/* Line */}
        <Polyline points={polylinePoints} fill="none" stroke="rgb(52, 211, 153)" strokeWidth={2} />
        {/* Dots */}
        {points.map((p, i) => (
          <Circle key={i} cx={p.x} cy={p.y} r={3} fill="rgb(52, 211, 153)" />
        ))}
        {/* X-axis labels (first and last) */}
        {data.length > 0 && (
          <>
            <SvgText x={points[0].x} y={height - 5} fontSize={9} fill="rgb(115, 115, 115)" textAnchor="start">
              {data[0].week}
            </SvgText>
            <SvgText x={points[points.length - 1].x} y={height - 5} fontSize={9} fill="rgb(115, 115, 115)" textAnchor="end">
              {data[data.length - 1].week}
            </SvgText>
          </>
        )}
      </Svg>
    </View>
  );
}
