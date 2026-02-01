declare module 'react-charts' {
  import type { ReactElement } from 'react';

  export type ScaleType = 'linear' | 'band' | 'time' | 'log';
  export type AxisPosition = 'left' | 'right' | 'top' | 'bottom';

  export type AxisOptions<TDatum> = {
    getValue: (datum: TDatum) => number | string | Date;
    scaleType?: ScaleType;
    position?: AxisPosition;
    padding?: number | { top?: number; bottom?: number; left?: number; right?: number };
    min?: number;
    max?: number;
  };

  export type Series<TDatum> = {
    data: TDatum[];
  };

  export type TooltipOptions = {
    show?: boolean;
  };

  export type ChartOptions<TDatum> = {
    data: Series<TDatum>[];
    primaryAxis: AxisOptions<TDatum>;
    secondaryAxes: AxisOptions<TDatum>[];
    type?: 'bar' | 'line' | 'area' | 'bubble';
    defaultColors?: string[];
    tooltip?: TooltipOptions;
  };

  export type ChartProps<TDatum> = {
    options: ChartOptions<TDatum>;
  };

  export const Chart: <TDatum>(props: ChartProps<TDatum>) => ReactElement | null;
}
