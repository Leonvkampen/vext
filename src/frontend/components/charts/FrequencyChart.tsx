import React from 'react';
import { View, Text, useWindowDimensions } from 'react-native';
import Svg, { Rect, Text as SvgText, Line as SvgLine } from 'react-native-svg';

type DataPoint = { week: string; count: number };

type FrequencyChartProps = {
  data: DataPoint[];
};

export function FrequencyChart({ data }: FrequencyChartProps) {
  const { width: screenWidth } = useWindowDimensions();

  if (data.length === 0) {
    return (
      <View className="h-48 items-center justify-center rounded-xl bg-background-50">
        <Text className="text-sm text-foreground-subtle">No frequency data yet</Text>
      </View>
    );
  }
  const width = screenWidth - 64;
  const height = 180;
  const padding = { top: 20, right: 20, bottom: 30, left: 30 };
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  const maxCount = Math.max(...data.map((d) => d.count), 1);
  const barWidth = Math.min(chartWidth / data.length - 4, 30);

  return (
    <View className="rounded-xl bg-background-50 p-4">
      <Text className="text-sm font-medium text-foreground mb-2">Workouts Per Week</Text>
      <Svg width={width} height={height}>
        {/* Grid lines */}
        {Array.from({ length: maxCount + 1 }, (_, i) => {
          const y = padding.top + chartHeight * (1 - i / maxCount);
          return (
            <SvgLine key={i} x1={padding.left} y1={y} x2={width - padding.right} y2={y} stroke="rgb(38, 38, 38)" strokeWidth={1} />
          );
        })}
        {/* Bars */}
        {data.map((d, i) => {
          const barHeight = (d.count / maxCount) * chartHeight;
          const x = padding.left + (i / data.length) * chartWidth + (chartWidth / data.length - barWidth) / 2;
          const y = padding.top + chartHeight - barHeight;
          return (
            <React.Fragment key={i}>
              <Rect
                x={x}
                y={y}
                width={barWidth}
                height={barHeight}
                rx={4}
                fill="rgb(52, 211, 153)"
                opacity={0.8}
              />
              <SvgText
                x={x + barWidth / 2}
                y={y - 4}
                fontSize={10}
                fill="rgb(250, 250, 250)"
                textAnchor="middle"
              >
                {d.count}
              </SvgText>
            </React.Fragment>
          );
        })}
        {/* Bottom axis line */}
        <SvgLine x1={padding.left} y1={padding.top + chartHeight} x2={width - padding.right} y2={padding.top + chartHeight} stroke="rgb(38, 38, 38)" strokeWidth={1} />
      </Svg>
    </View>
  );
}
