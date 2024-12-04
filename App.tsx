import * as d3 from 'd3';
import { Button, StyleSheet, useWindowDimensions, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import NativeAppIconManager from './specs/NativeAppIconManager';

const data = Array.from({ length: 7 }, (_, i) => {
  const date = new Date();
  date.setDate(new Date().getDate() + i);
  date.setHours(0, 0, 0, 0);

  return {
    date: date,
    value: Math.max(250, Math.ceil(Math.random() * 2500)),
  };
});

// const linearGradientKey = 'linearGradient';
// const mainColor = '#6F90F4';
const axisWidth = 0.1;
// const axisSpacing = 20;

export default function App() {
  const { width: size } = useWindowDimensions();

  const svgDimensions = {
    width: size,
    height: size,
  };

  const svgMargins = {
    left: 16,
    top: 16,
    right: 16,
    bottom: 16,
  };

  const yAxisValueDimensions = {
    width:
      (svgDimensions.width - svgMargins.left - svgMargins.right) * axisWidth,
    height:
      (svgDimensions.height - svgMargins.top - svgMargins.bottom) *
      (1 - axisWidth),
  };

  const xAxisValueDimensions = {
    width:
      (svgDimensions.width - svgMargins.left - svgMargins.right) *
      (1 - axisWidth),
    height:
      (svgDimensions.height - svgMargins.top - svgMargins.bottom) * axisWidth,
  };

  // const chartDimensions = {
  //   width:
  //     (svgDimensions.width - svgMargins.left - svgMargins.right) *
  //     (1 - axisWidth),
  //   height:
  //     (svgDimensions.height - svgMargins.top - svgMargins.bottom) *
  //     (1 - axisWidth),
  // };

  const chartEdges = {
    left: svgMargins.left + yAxisValueDimensions.width,
    right: svgDimensions.width - svgMargins.right,
    bottom:
      svgDimensions.height - xAxisValueDimensions.height - svgMargins.bottom,
    top: svgMargins.top,
  };

  const x = d3
    .scaleTime()
    .domain(d3.extent(data, datum => datum.date) as [Date, Date])
    .range([chartEdges.left, chartEdges.right]);

  const yDomain = d3.nice(
    ...(d3.extent(data, datum => datum.value) as [number, number]),
    data.length,
  );
  d3.axisBottom(x).tickFormat(d => d.toLocaleString());
  const y = d3
    .scaleLinear()
    .domain(yDomain)
    .range([chartEdges.bottom, chartEdges.top]);

  const line = d3
    .line<(typeof data)[number]>()
    .x(d => x(d.date))
    .y(d => y(d.value))
    .curve(d3.curveBumpX)(data);

  if (!line) return null;

  return (
    <GestureHandlerRootView style={styles.rootContainer}>
      <SafeAreaProvider>
        <View style={styles.container}>
          <Button
            title="Set to default"
            onPress={() => {
              NativeAppIconManager.changeTo('default');
            }}
          />
          <Button
            title="Set to lavender"
            onPress={() => {
              NativeAppIconManager.changeTo('lavender');
            }}
          />
          <Button
            title="Set to tree"
            onPress={() => {
              NativeAppIconManager.changeTo('tree');
            }}
          />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );

  // return (
  //   <GestureHandlerRootView style={styles.rootContainer}>
  //     <SafeAreaProvider>
  //       <View style={styles.container}>
  //         <Svg
  //           viewBox={`0 0 ${svgDimensions.width} ${svgDimensions.height}`}
  //           width={svgDimensions.width}
  //           height={svgDimensions.height}>
  //           <Defs>
  //             <LinearGradient
  //               id={linearGradientKey}
  //               x1={0}
  //               y1={0}
  //               x2={0}
  //               y2={1}>
  //               <Stop offset="0" stopColor={mainColor} stopOpacity="1" />
  //               <Stop offset="1" stopColor="white" stopOpacity="1" />
  //             </LinearGradient>
  //           </Defs>

  //           <Path fill="none" stroke={mainColor} strokeWidth="4" d={line!} />

  //           <Path
  //             d={`${line!} L ${chartEdges.right} ${chartEdges.bottom} L ${
  //               chartEdges.left
  //             } ${chartEdges.bottom}`}
  //             fill={`url(#${linearGradientKey})`}
  //           />

  //           <G>
  //             {data.map((d, i) => {
  //               return (
  //                 <Fragment key={i}>
  //                   <Circle
  //                     fill="white"
  //                     stroke={mainColor}
  //                     strokeWidth="2"
  //                     cx={x(d.date)}
  //                     cy={y(d.value)}
  //                     r={`${4}`}
  //                     onPress={e => {
  //                       console.log(e.nativeEvent);
  //                     }}
  //                   />
  //                   <Text x={x(d.date)} y={y(d.value) - 8} textAnchor="middle">
  //                     {d.value}
  //                   </Text>
  //                 </Fragment>
  //               );
  //             })}
  //           </G>

  //           {/* X Axis */}
  //           <G>
  //             <Line
  //               x1={chartEdges.left}
  //               y1={chartEdges.bottom}
  //               x2={chartEdges.right}
  //               y2={chartEdges.bottom}
  //               stroke={'black'}
  //               strokeWidth={2}
  //             />
  //             {/* Render the X-axis ticks and labels */}
  //             {x.ticks(data.length).map((tick, index) => {
  //               const xTick = x(tick); // Calculate the tick position

  //               return (
  //                 <Fragment key={index}>
  //                   {/* Tick line */}
  //                   <Line
  //                     x1={xTick}
  //                     y1={chartEdges.bottom}
  //                     x2={xTick}
  //                     y2={chartEdges.bottom + 4}
  //                     stroke="black"
  //                   />
  //                   {/* Tick label */}
  //                   <Text
  //                     x={xTick}
  //                     y={chartEdges.bottom + 24}
  //                     textAnchor="middle"
  //                     fill="black">
  //                     {`${tick.getDate()}/${tick.getMonth() + 1}`}
  //                   </Text>
  //                 </Fragment>
  //               );
  //             })}
  //           </G>

  //           {/* Y Axis */}
  //           <G>
  //             <Line
  //               x1={chartEdges.left}
  //               y1={chartEdges.top}
  //               x2={chartEdges.left}
  //               y2={chartEdges.bottom}
  //               stroke={'black'}
  //               strokeWidth={2}
  //             />
  //             {/* Render the Y-axis ticks and labels */}
  //             {y.ticks(4).map((tick, index) => {
  //               const yTick = y(tick); // Calculate the tick position

  //               return (
  //                 <Fragment key={index}>
  //                   {/* Tick line */}
  //                   <Line
  //                     x1={chartEdges.left - 6}
  //                     y1={yTick}
  //                     x2={chartEdges.left}
  //                     y2={yTick}
  //                     stroke="black"
  //                   />
  //                   {/* Tick label */}
  //                   <Text
  //                     x={chartEdges.left - 8}
  //                     y={yTick + 4}
  //                     textAnchor="end"
  //                     fill="black">
  //                     {tick}
  //                   </Text>
  //                 </Fragment>
  //               );
  //             })}
  //           </G>
  //         </Svg>
  //       </View>
  //     </SafeAreaProvider>
  //   </GestureHandlerRootView>
  // );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
