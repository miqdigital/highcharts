/* *
 *
 *  (c) 2010-2025 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type {
    AlignObject,
    AlignValue,
    VerticalAlignValue
} from '../Renderer/AlignObject';
import type AnimationOptions from '../Animation/AnimationOptions';
import type AxisOptions from '../Axis/AxisOptions';
import type AxisType from '../Axis/AxisType';
import type BBoxObject from '../Renderer/BBoxObject';
import type {
    CSSObject,
    CursorValue
} from '../Renderer/CSSObject';
import type { EventCallback } from '../Callback';
import type {
    NumberFormatterCallbackFunction,
    Options
} from '../Options';
import type ChartLike from './ChartLike';
import type ChartOptions from './ChartOptions';
import type {
    ChartPanningOptions,
    ChartZoomingOptions
} from './ChartOptions';
import type ColorAxis from '../Axis/Color/ColorAxis';
import type Point from '../Series/Point';
import type PointerEvent from '../PointerEvent';
import type SeriesOptions from '../Series/SeriesOptions';
import type {
    SeriesTypeOptions
} from '../Series/SeriesType';
import type { HTMLDOMElement } from '../Renderer/DOMElementType';
import type SVGAttributes from '../Renderer/SVG/SVGAttributes';

import A from '../Animation/AnimationUtilities.js';
const {
    animate,
    animObject,
    setAnimation
} = A;
import Axis from '../Axis/Axis.js';
import D from '../Defaults.js';
const {
    defaultOptions
} = D;
import Templating from '../Templating.js';
const { numberFormat } = Templating;
import Foundation from '../Foundation.js';
const { registerEventOptions } = Foundation;
import H from '../Globals.js';
const {
    charts,
    doc,
    marginNames,
    svg,
    win
} = H;
import Pointer from '../Pointer.js';
import RendererRegistry from '../Renderer/RendererRegistry.js';
import Series from '../Series/Series.js';
import SeriesRegistry from '../Series/SeriesRegistry.js';
const { seriesTypes } = SeriesRegistry;
import SVGElement from '../Renderer/SVG/SVGElement';
import SVGRenderer from '../Renderer/SVG/SVGRenderer.js';
import Time from '../Time.js';
import U from '../Utilities.js';
import AST from '../Renderer/HTML/AST.js';
import { AxisCollectionKey } from '../Axis/AxisOptions';
import Tick from '../Axis/Tick.js';
const {
    addEvent,
    attr,
    createElement,
    css,
    defined,
    diffObjects,
    discardElement,
    erase,
    error,
    extend,
    find,
    fireEvent,
    getAlignFactor,
    getStyle,
    isArray,
    isNumber,
    isObject,
    isString,
    merge,
    objectEach,
    pick,
    pInt,
    relativeLength,
    removeEvent,
    splat,
    syncTimeout,
    uniqueKey
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../Axis/AxisLike' {
    interface AxisLike {
        extKey?: string;
        index?: number;
        touched?: boolean;
    }
}

declare module './ChartLike' {
    interface ChartLike {
        resetZoomButton?: SVGElement;
        pan(e: PointerEvent, panning: boolean|ChartPanningOptions): void;
        showResetZoom(): void;
        zoomOut(): void;
    }
}

declare module './ChartOptions' {
    interface ChartOptions {
        forExport?: boolean;
        renderer?: string;
        skipClone?: boolean;
    }
}

declare module '../Options' {
    interface Options {
        chart: ChartOptions;
        caption?: Chart.CaptionOptions;
        credits?: Chart.CreditsOptions;
        subtitle?: Chart.SubtitleOptions;
        series?: Array<SeriesTypeOptions>;
        title?: Chart.TitleOptions;
    }
}

declare module '../Series/PointLike' {
    interface PointLike {
        touched?: boolean;
    }
}

declare module '../Series/SeriesLike' {
    interface SeriesLike {
        index?: number;
        touched?: boolean;
    }
}

/* *
 *
 *  Class
 *
 * */

/* eslint-disable no-invalid-this, valid-jsdoc */

/**
 * The Chart class. The recommended constructor is {@link Highcharts#chart}.
 *
 * @example
 * let chart = Highcharts.chart('container', {
 *        title: {
 *               text: 'My chart'
 *        },
 *        series: [{
 *            data: [1, 3, 2, 4]
 *        }]
 * })
 *
 * @class
 * @name Highcharts.Chart
 *
 * @param {string|Highcharts.HTMLDOMElement} [renderTo]
 *        The DOM element to render to, or its id.
 *
 * @param {Highcharts.Options} options
 *        The chart options structure.
 *
 * @param {Highcharts.ChartCallbackFunction} [callback]
 *        Function to run when the chart has loaded and all external images
 *        are loaded. Defining a
 *        [chart.events.load](https://api.highcharts.com/highcharts/chart.events.load)
 *        handler is equivalent.
 */
class Chart {

    /* *
     *
     *  Static Functions
     *
     * */

    public static chart(
        options: Partial<Options>,
        callback?: Chart.CallbackFunction
    ): Chart;
    public static chart(
        renderTo: (string|globalThis.HTMLElement),
        options: Partial<Options>,
        callback?: Chart.CallbackFunction
    ): Chart;
    /**
     * Factory function for basic charts.
     *
     * @example
     * // Render a chart in to div#container
     * let chart = Highcharts.chart('container', {
     *     title: {
     *         text: 'My chart'
     *     },
     *     series: [{
     *         data: [1, 3, 2, 4]
     *     }]
     * });
     *
     * @function Highcharts.chart
     *
     * @param {string|Highcharts.HTMLDOMElement} [renderTo]
     * The DOM element to render to, or its id.
     *
     * @param {Highcharts.Options} options
     * The chart options structure.
     *
     * @param {Highcharts.ChartCallbackFunction} [callback]
     * Function to run when the chart has loaded and all external images are
     * loaded. Defining a
     * [chart.events.load](https://api.highcharts.com/highcharts/chart.events.load)
     * handler is equivalent.
     *
     * @return {Highcharts.Chart}
     * Returns the Chart object.
     */
    public static chart(
        a: (string|globalThis.HTMLElement|Partial<Options>),
        b?: (Chart.CallbackFunction|Partial<Options>),
        c?: Chart.CallbackFunction
    ): Chart {
        return new Chart(a as any, b as any, c);
    }

    /* *
     *
     *  Constructors
     *
     * */

    // Definitions
    public constructor(
        options: Partial<Options>,
        callback?: Chart.CallbackFunction
    );
    public constructor(
        renderTo: (string|globalThis.HTMLElement),
        options: Partial<Options>,
        callback?: Chart.CallbackFunction
    );

    // Implementation
    public constructor(
        a: (string|globalThis.HTMLElement|Partial<Options>),
        /* eslint-disable @typescript-eslint/no-unused-vars */
        b?: (Chart.CallbackFunction|Partial<Options>),
        c?: Chart.CallbackFunction
        /* eslint-enable @typescript-eslint/no-unused-vars */
    ) {
        const args = [
            // ES5 builds fail unless we cast it to an Array
            ...arguments as unknown as Array<any>
        ];

        // Remove the optional first argument, renderTo, and set it on this.
        if (isString(a) || (a as globalThis.HTMLElement).nodeName) {
            this.renderTo = args.shift();
        }

        this.init(args[0], args[1]);
    }

    /* *
     *
     *  Properties
     *
     * */

    public _cursor?: (CursorValue|null);
    public axes!: Array<AxisType>;
    public axisOffset!: Array<number>;
    public callback?: Chart.CallbackFunction;
    public chartBackground?: SVGElement;
    public chartHeight!: number;
    public chartWidth!: number;
    public clipBox!: BBoxObject;
    public clipOffset?: [number, number, number, number];
    public clipRect?: SVGElement;
    public colorCounter!: number;
    public container!: globalThis.HTMLElement;
    public containerBox?: { height: number, width: number };
    public credits?: SVGElement;
    public caption?: SVGElement;
    public dataLabelsGroup?: SVGElement;
    public eventOptions!: Record<string, EventCallback<Series, Event>>;
    public hasCartesianSeries?: boolean;
    public hasLoaded?: boolean;
    public hasRendered?: boolean;
    public index!: number;
    public isDirtyBox?: boolean;
    public isDirtyLegend?: boolean;
    public isResizing!: number;
    public labelCollectors!: Array<Chart.LabelCollectorFunction>;
    public loadingDiv?: HTMLDOMElement;
    public loadingShown?: boolean;
    public loadingSpan?: HTMLDOMElement;
    public locale?: string|Array<string>;
    public margin!: Array<number>;
    public marginBottom?: number;
    public numberFormatter!: NumberFormatterCallbackFunction;
    public oldChartHeight?: number;
    public oldChartWidth?: number;
    public options!: Options;
    public plotBackground?: SVGElement;
    public plotBGImage?: SVGElement;
    public plotBorder?: SVGElement;
    public plotBorderWidth?: number;
    public plotBox!: BBoxObject;
    public plotHeight!: number;
    public plotLeft!: number;
    public plotSizeX?: number;
    public plotSizeY?: number;
    public plotTop!: number;
    public plotWidth!: number;
    public pointCount!: number;
    public pointer?: Pointer;
    public reflowTimeout?: number;
    public renderer!: Chart.Renderer;
    public renderTo!: globalThis.HTMLElement;
    public series!: Array<Series>;
    public seriesGroup?: SVGElement;
    public sharedClips: Record<string, (SVGElement|undefined)> = {};
    public spacing!: Array<number>;
    public spacingBox!: BBoxObject;
    public styledMode?: boolean;
    public subtitle?: SVGElement;
    public symbolCounter!: number;
    public time!: Time;
    public title?: SVGElement;
    public titleOffset!: Array<number>;
    public userOptions!: Partial<Options>;
    public xAxis!: Array<AxisType>;
    public yAxis!: Array<AxisType>;
    public zooming!: ChartZoomingOptions;
    public zoomClipRect?: SVGElement;

    /* *
     *
     *  Functions
     *
     * */

    /**
     * Function setting zoom options after chart init and after chart update.
     * Offers support for deprecated options.
     *
     * @private
     * @function Highcharts.Chart#setZoomOptions
     */
    public setZoomOptions(): void {
        const chart = this,
            options = chart.options.chart,
            zooming = options.zooming;

        chart.zooming = {
            ...zooming,
            type: pick(options.zoomType, zooming.type),
            key: pick(options.zoomKey, zooming.key),
            pinchType: pick(options.pinchType, zooming.pinchType),
            singleTouch: pick(
                options.zoomBySingleTouch,
                zooming.singleTouch,
                false
            ),
            resetButton: merge(
                zooming.resetButton,
                options.resetZoomButton
            )
        };
    }

    /**
     * Overridable function that initializes the chart. The constructor's
     * arguments are passed on directly.
     *
     * @function Highcharts.Chart#init
     *
     * @param {Highcharts.Options} userOptions
     *        Custom options.
     *
     * @param {Function} [callback]
     *        Function to run when the chart has loaded and all external
     *        images are loaded.
     *
     *
     * @emits Highcharts.Chart#event:init
     * @emits Highcharts.Chart#event:afterInit
     */
    public init(
        userOptions: Partial<Options>,
        callback?: Chart.CallbackFunction
    ): void {

        // Fire the event with a default function
        fireEvent(this, 'init', { args: arguments }, function (): void {

            const options = merge(defaultOptions, userOptions), // Do the merge
                optionsChart = options.chart,
                renderTo = this.renderTo || optionsChart.renderTo;

            /**
             * The original options given to the constructor or a chart factory
             * like {@link Highcharts.chart} and {@link Highcharts.stockChart}.
             * The original options are shallow copied to avoid mutation. The
             * copy, `chart.userOptions`, may later be mutated to reflect
             * updated options throughout the lifetime of the chart.
             *
             * For collections, like `series`, `xAxis` and `yAxis`, the chart
             * user options should always be reflected by the item user option,
             * so for example the following should always be true:
             *
             * `chart.xAxis[0].userOptions === chart.userOptions.xAxis[0]`
             *
             * @name Highcharts.Chart#userOptions
             * @type {Highcharts.Options}
             */
            this.userOptions = extend<Partial<Options>>({}, userOptions);

            if (!(
                this.renderTo = (
                    isString(renderTo) ?
                        doc.getElementById(renderTo) :
                        renderTo
                ) as HTMLDOMElement
            )) {
                // Display an error if the renderTo is wrong
                error(13, true, this);
            }

            this.margin = [];
            this.spacing = [];

            // An array of functions that returns labels that should be
            // considered for anti-collision
            this.labelCollectors = [];

            this.callback = callback;
            this.isResizing = 0;

            /**
             * The options structure for the chart after merging
             * {@link #defaultOptions} and {@link #userOptions}. It contains
             * members for the sub elements like series, legend, tooltip etc.
             *
             * @name Highcharts.Chart#options
             * @type {Highcharts.Options}
             */
            this.options = options;

            /**
             * All the axes in the chart.
             *
             * @see  Highcharts.Chart.xAxis
             * @see  Highcharts.Chart.yAxis
             *
             * @name Highcharts.Chart#axes
             * @type {Array<Highcharts.Axis>}
             */
            this.axes = [];

            /**
             * All the current series in the chart.
             *
             * @name Highcharts.Chart#series
             * @type {Array<Highcharts.Series>}
             */
            this.series = [];

            this.locale = options.lang.locale ??
                (this.renderTo.closest('[lang]') as HTMLDOMElement|null)?.lang;

            /**
             * The `Time` object associated with the chart. Since v6.0.5,
             * time settings can be applied individually for each chart. If
             * no individual settings apply, the `Time` object is shared by
             * all instances.
             *
             * @name Highcharts.Chart#time
             * @type {Highcharts.Time}
             */
            this.time = new Time(
                extend(
                    options.time || {},
                    {
                        locale: this.locale
                    }
                ),
                options.lang
            );
            options.time = this.time.options;

            /**
             * Callback function to override the default function that formats
             * all the numbers in the chart. Returns a string with the formatted
             * number.
             *
             * @name Highcharts.Chart#numberFormatter
             * @type {Highcharts.NumberFormatterCallbackFunction}
             */
            this.numberFormatter = (
                optionsChart.numberFormatter || numberFormat
            ).bind(this);

            /**
             * Whether the chart is in styled mode, meaning all presentational
             * attributes are avoided.
             *
             * @name Highcharts.Chart#styledMode
             * @type {boolean}
             */
            this.styledMode = optionsChart.styledMode;
            this.hasCartesianSeries = optionsChart.showAxes;

            const chart = this;

            /**
             * Index position of the chart in the {@link Highcharts#charts}
             * property.
             *
             * @name Highcharts.Chart#index
             * @type {number}
             * @readonly
             */
            chart.index = charts.length; // Add the chart to the global lookup

            charts.push(chart);
            H.chartCount++;

            // Chart event handlers
            registerEventOptions(this, optionsChart);

            /**
             * A collection of the X axes in the chart.
             *
             * @name Highcharts.Chart#xAxis
             * @type {Array<Highcharts.Axis>}
             */
            chart.xAxis = [];

            /**
             * A collection of the Y axes in the chart.
             *
             * @name Highcharts.Chart#yAxis
             * @type {Array<Highcharts.Axis>}
             *
             * @todo
             * Make events official: Fire the event `afterInit`.
             */
            chart.yAxis = [];

            chart.pointCount = chart.colorCounter = chart.symbolCounter = 0;

            this.setZoomOptions();

            // Fire after init but before first render, before axes and series
            // have been initialized.
            fireEvent(chart, 'afterInit');

            chart.firstRender();
        });
    }

    /**
     * Internal function to unitialize an individual series.
     *
     * @private
     * @function Highcharts.Chart#initSeries
     */
    public initSeries(options: SeriesOptions): Series {
        const chart = this,
            optionsChart = chart.options.chart,
            type = (
                options.type ||
                optionsChart.type
            ) as string,
            SeriesClass = seriesTypes[type];

        // No such series type
        if (!SeriesClass) {
            error(17, true, chart as any, { missingModuleFor: type });
        }

        const series = new SeriesClass();

        if (typeof series.init === 'function') {
            series.init(chart, options);
        }
        return series;
    }

    /**
     * Internal function to set data for all series with enabled sorting.
     *
     * @private
     * @function Highcharts.Chart#setSortedData
     */
    public setSortedData(): void {
        this.getSeriesOrderByLinks().forEach(function (series): void {
            // We need to set data for series with sorting after series init
            if (!series.points && !series.data && series.enabledDataSorting) {
                series.setData(series.options.data as any, false);
            }
        });
    }

    /**
     * Sort and return chart series in order depending on the number of linked
     * series.
     *
     * @private
     * @function Highcharts.Series#getSeriesOrderByLinks
     */
    public getSeriesOrderByLinks(): Array<Series> {
        return this.series.concat().sort(function (a, b): number {
            if (a.linkedSeries.length || b.linkedSeries.length) {
                return b.linkedSeries.length - a.linkedSeries.length;
            }
            return 0;
        });
    }

    /**
     * Order all series or axes above a given index. When series or axes are
     * added and ordered by configuration, only the last series is handled
     * (#248, #1123, #2456, #6112). This function is called on series and axis
     * initialization and destroy.
     *
     * @private
     * @function Highcharts.Chart#orderItems
     * @param {string} coll The collection name
     * @param {number} [fromIndex=0]
     * If this is given, only the series above this index are handled.
     */
    public orderItems(
        coll: ('colorAxis'|'series'|'xAxis'|'yAxis'|'zAxis'),
        fromIndex = 0
    ): void {
        const collection = this[coll],

            // Item options should be reflected in chart.options.series,
            // chart.options.yAxis etc
            optionsArray = this.options[coll] = splat(this.options[coll] as any)
                .slice(),
            userOptionsArray = this.userOptions[coll] = this.userOptions[coll] ?
                splat(this.userOptions[coll] as any).slice() :
                [];

        if (this.hasRendered) {
            // Remove all above index
            optionsArray.splice(fromIndex);
            userOptionsArray.splice(fromIndex);
        }

        if (collection) {
            for (let i = fromIndex, iEnd = collection.length; i < iEnd; ++i) {
                const item = collection[i];
                if (item) {
                    /**
                     * Contains the series' index in the `Chart.series` array.
                     *
                     * @name Highcharts.Series#index
                     * @type {number}
                     * @readonly
                     */
                    item.index = i;

                    if (item instanceof Series) {
                        item.name = item.getName();
                    }

                    if (!item.options.isInternal) {
                        optionsArray[i] = item.options;
                        userOptionsArray[i] = item.userOptions;
                    }
                }
            }
        }
    }

    /**
     * Get the clipping for a series. Could be called for a series to initialate
     * animating the clip or to set the final clip (only width and x).
     *
     * @private
     * @function Highcharts.Chart#getClipBox
     */
    public getClipBox(series?: Series, chartCoords?: boolean): BBoxObject {

        const inverted = this.inverted,
            { xAxis, yAxis } = series || {};

        // If no axes on the series, or series undefined, use global clipBox
        let { x, y, width, height } = merge(this.clipBox);

        if (series) {
            // Otherwise, use clipBox.width which is corrected for
            // plotBorderWidth and clipOffset
            if (xAxis && xAxis.len !== this.plotSizeX) {
                width = xAxis.len;
            }

            if (yAxis && yAxis.len !== this.plotSizeY) {
                height = yAxis.len;
            }

            // If the chart is inverted and the series is not invertible, the
            // chart clip box should be inverted, but not the series clip box
            // (#20264)
            if (inverted && !series.invertible) {
                [width, height] = [height, width];
            }
        }

        if (chartCoords) {
            x += (inverted ? yAxis : xAxis)?.pos ?? this.plotLeft;
            y += (inverted ? xAxis : yAxis)?.pos ?? this.plotTop;
        }

        return { x, y, width, height };
    }

    /**
     * Check whether a given point is within the plot area.
     *
     * @function Highcharts.Chart#isInsidePlot
     *
     * @param {number} plotX
     * Pixel x relative to the plot area.
     *
     * @param {number} plotY
     * Pixel y relative to the plot area.
     *
     * @param {Highcharts.ChartIsInsideOptionsObject} [options]
     * Options object.
     *
     * @return {boolean}
     * Returns true if the given point is inside the plot area.
     */
    public isInsidePlot(
        plotX: number,
        plotY: number,
        options: Chart.IsInsideOptionsObject = {}
    ): boolean {
        const {
                inverted,
                plotBox,
                plotLeft,
                plotTop,
                scrollablePlotBox
            } = this,
            { scrollLeft = 0, scrollTop = 0 } = (
                options.visiblePlotOnly &&
                this.scrollablePlotArea?.scrollingContainer
            ) || {},
            series = options.series,
            box = (options.visiblePlotOnly && scrollablePlotBox) || plotBox,
            x = options.inverted ? plotY : plotX,
            y = options.inverted ? plotX : plotY,
            e = {
                x,
                y,
                isInsidePlot: true,
                options
            };

        if (!options.ignoreX) {
            const xAxis = (
                series &&
                (inverted && !this.polar ? series.yAxis : series.xAxis)
            ) || {
                pos: plotLeft,
                len: Infinity
            };

            const chartX = options.paneCoordinates ?
                xAxis.pos + x : plotLeft + x;

            if (!(
                chartX >= Math.max(
                    scrollLeft + plotLeft,
                    xAxis.pos
                ) &&
                chartX <= Math.min(
                    scrollLeft + plotLeft + box.width,
                    xAxis.pos + xAxis.len
                )
            )) {
                e.isInsidePlot = false;
            }
        }

        if (!options.ignoreY && e.isInsidePlot) {
            const yAxis = (
                !inverted && options.axis &&
                !options.axis.isXAxis && options.axis
            ) || (
                series && (inverted ? series.xAxis : series.yAxis)
            ) || {
                pos: plotTop,
                len: Infinity
            };

            const chartY = options.paneCoordinates ?
                yAxis.pos + y : plotTop + y;

            if (!(
                chartY >= Math.max(
                    scrollTop + plotTop,
                    yAxis.pos
                ) &&
                chartY <= Math.min(
                    scrollTop + plotTop + box.height,
                    yAxis.pos + yAxis.len
                )
            )) {
                e.isInsidePlot = false;
            }
        }

        fireEvent(this, 'afterIsInsidePlot', e);

        return e.isInsidePlot;
    }

    /**
     * Redraw the chart after changes have been done to the data, axis extremes
     * chart size or chart elements. All methods for updating axes, series or
     * points have a parameter for redrawing the chart. This is `true` by
     * default. But in many cases you want to do more than one operation on the
     * chart before redrawing, for example add a number of points. In those
     * cases it is a waste of resources to redraw the chart for each new point
     * added. So you add the points and call `chart.redraw()` after.
     *
     * @function Highcharts.Chart#redraw
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     * If or how to apply animation to the redraw. When `undefined`, it applies
     * the animation that is set in the `chart.animation` option.
     *
     * @emits Highcharts.Chart#event:afterSetExtremes
     * @emits Highcharts.Chart#event:beforeRedraw
     * @emits Highcharts.Chart#event:predraw
     * @emits Highcharts.Chart#event:redraw
     * @emits Highcharts.Chart#event:render
     * @emits Highcharts.Chart#event:updatedData
     */
    public redraw(animation?: (boolean|Partial<AnimationOptions>)): void {

        fireEvent(this, 'beforeRedraw');

        const chart = this,
            axes: Array<Axis> = chart.hasCartesianSeries ? chart.axes : chart.colorAxis || [],
            series = chart.series,
            pointer = chart.pointer,
            legend = chart.legend,
            legendUserOptions = chart.userOptions.legend,
            renderer = chart.renderer,
            isHiddenChart = renderer.isHidden(),
            afterRedraw = [] as Array<Function>;

        let hasDirtyStacks: (boolean|undefined),
            hasStackedSeries: (boolean|undefined),
            i: number,
            isDirtyBox = chart.isDirtyBox,
            redrawLegend = chart.isDirtyLegend,
            serie: Series;

        renderer.rootFontSize = renderer.boxWrapper.getStyle('font-size');

        // Handle responsive rules, not only on resize (#6130)
        if (chart.setResponsive) {
            chart.setResponsive(false);
        }

        // Set the global animation. When chart.hasRendered is not true, the
        // redraw call comes from a responsive rule and animation should not
        // occur.
        setAnimation(chart.hasRendered ? animation : false, chart);

        if (isHiddenChart) {
            chart.temporaryDisplay();
        }

        // Adjust title layout (reflow multiline text)
        chart.layOutTitles(false);

        // Link stacked series
        i = series.length;
        while (i--) {
            serie = series[i];

            if (serie.options.stacking || serie.options.centerInCategory) {
                hasStackedSeries = true;

                if (serie.isDirty) {
                    hasDirtyStacks = true;
                    break;
                }
            }
        }
        if (hasDirtyStacks) { // Mark others as dirty
            i = series.length;
            while (i--) {
                serie = series[i];
                if (serie.options.stacking) {
                    serie.isDirty = true;
                }
            }
        }

        // Handle updated data in the series
        series.forEach(function (serie): void {
            if (serie.isDirty) {
                if (serie.options.legendType === 'point') {
                    if (typeof serie.updateTotals === 'function') {
                        serie.updateTotals();
                    }
                    redrawLegend = true;
                } else if (
                    legendUserOptions &&
                    (
                        !!legendUserOptions.labelFormatter ||
                        legendUserOptions.labelFormat
                    )
                ) {
                    redrawLegend = true; // #2165
                }
            }
            if (serie.isDirtyData) {
                fireEvent(serie, 'updatedData');
            }
        });

        // Handle added or removed series
        if (redrawLegend && legend && legend.options.enabled) {
            // Draw legend graphics
            legend.render();

            chart.isDirtyLegend = false;
        }

        // Reset stacks
        if (hasStackedSeries) {
            chart.getStacks();
        }


        // Set axes scales
        axes.forEach(function (axis): void {
            axis.updateNames();
            axis.setScale();
        });

        chart.getMargins(); // #3098

        // If one axis is dirty, all axes must be redrawn (#792, #2169)
        axes.forEach(function (axis): void {
            if (axis.isDirty) {
                isDirtyBox = true;
            }
        });

        // Redraw axes
        axes.forEach(function (axis): void {

            // Fire 'afterSetExtremes' only if extremes are set
            const key = axis.min + ',' + axis.max;

            if (axis.extKey !== key) { // #821, #4452
                axis.extKey = key;

                // Prevent a recursive call to chart.redraw() (#1119)
                afterRedraw.push(function (): void {
                    fireEvent(
                        axis,
                        'afterSetExtremes',
                        extend(axis.eventArgs, axis.getExtremes())
                    ); // #747, #751
                    delete axis.eventArgs;
                });
            }
            if (isDirtyBox || hasStackedSeries) {
                axis.redraw();
            }
        });

        // The plot areas size has changed
        if (isDirtyBox) {
            chart.drawChartBox();
        }

        // Fire an event before redrawing series, used by the boost module to
        // clear previous series renderings.
        fireEvent(chart, 'predraw');

        // Redraw affected series
        series.forEach(function (serie): void {
            if ((isDirtyBox || serie.isDirty) && serie.visible) {
                serie.redraw();
            }
            // Set it here, otherwise we will have unlimited 'updatedData' calls
            // for a hidden series after setData(). Fixes #6012
            serie.isDirtyData = false;
        });

        // Move tooltip or reset
        if (pointer) {
            pointer.reset(true);
        }

        // Redraw if canvas
        renderer.draw();

        // Fire the events
        fireEvent(chart, 'redraw');
        fireEvent(chart, 'render');

        if (isHiddenChart) {
            chart.temporaryDisplay(true);
        }

        // Fire callbacks that are put on hold until after the redraw
        afterRedraw.forEach(function (callback): void {
            (callback.call as any)();
        });
    }

    /**
     * Get an axis, series or point object by `id` as given in the configuration
     * options. Returns `undefined` if no item is found.
     *
     * @sample highcharts/plotoptions/series-id/
     *         Get series by id
     *
     * @function Highcharts.Chart#get
     *
     * @param {string} id
     * The id as given in the configuration options.
     *
     * @return {Highcharts.Axis|Highcharts.Series|Highcharts.Point|undefined}
     * The retrieved item.
     */
    public get(id: string): (Axis|Series|Point|undefined) {
        const series = this.series;

        /**
         * @private
         */
        function itemById(item: (Axis|Series)): boolean {
            return (
                (item as Series).id === id ||
                (item.options && item.options.id === id)
            );
        }

        let ret: (Axis|Series|Point|undefined) =
            // Search axes
            find(this.axes, itemById) ||

            // Search series
            find(this.series, itemById);

        // Search points
        for (let i = 0; !ret && i < series.length; i++) {
            ret = find((series[i].points as any) || [], itemById);
        }

        return ret;
    }

    /**
     * Create the Axis instances based on the config options.
     *
     * @private
     * @function Highcharts.Chart#createAxes
     * @emits Highcharts.Chart#event:afterCreateAxes
     * @emits Highcharts.Chart#event:createAxes
     */
    public createAxes(): void {
        const options = this.userOptions;

        fireEvent(this, 'createAxes');

        for (const coll of ['xAxis', 'yAxis'] as Array<'xAxis'|'yAxis'>) {
            const arr = options[coll] = splat(
                options[coll] || {}
            );
            for (const axisOptions of arr) {
                // eslint-disable-next-line no-new
                new Axis(this, axisOptions, coll);
            }
        }

        fireEvent(this, 'afterCreateAxes');
    }

    /**
     * Returns an array of all currently selected points in the chart. Points
     * can be selected by clicking or programmatically by the
     * {@link Highcharts.Point#select}
     * function.
     *
     * @sample highcharts/plotoptions/series-allowpointselect-line/
     *         Get selected points
     * @sample highcharts/members/point-select-lasso/
     *         Lasso selection
     * @sample highcharts/chart/events-selection-points/
     *         Rectangle selection
     *
     * @function Highcharts.Chart#getSelectedPoints
     *
     * @return {Array<Highcharts.Point>}
     *         The currently selected points.
     */
    public getSelectedPoints(): Array<Point> {
        return this.series.reduce((acc: Point[], series): Point[] => {
            // For one-to-one points inspect series.data in order to retrieve
            // points outside the visible range (#6445). For grouped data,
            // inspect the generated series.points.
            series.getPointsCollection()
                .forEach((point): void => {
                    if (pick(point.selectedStaging, point.selected)) {
                        acc.push(point);
                    }
                });
            return acc;
        }, []);
    }

    /**
     * Returns an array of all currently selected series in the chart. Series
     * can be selected either programmatically by the
     * {@link Highcharts.Series#select}
     * function or by checking the checkbox next to the legend item if
     * [series.showCheckBox](https://api.highcharts.com/highcharts/plotOptions.series.showCheckbox)
     * is true.
     *
     * @sample highcharts/members/chart-getselectedseries/
     *         Get selected series
     *
     * @function Highcharts.Chart#getSelectedSeries
     *
     * @return {Array<Highcharts.Series>}
     *         The currently selected series.
     */
    public getSelectedSeries(): Array<Series> {
        return this.series.filter((s): (boolean|undefined) => s.selected);
    }

    /**
     * Set a new title or subtitle for the chart.
     *
     * @sample highcharts/members/chart-settitle/
     *         Set title text and styles
     *
     * @function Highcharts.Chart#setTitle
     *
     * @param {Highcharts.TitleOptions} [titleOptions]
     *        New title options. The title text itself is set by the
     *        `titleOptions.text` property.
     *
     * @param {Highcharts.SubtitleOptions} [subtitleOptions]
     *        New subtitle options. The subtitle text itself is set by the
     *        `subtitleOptions.text` property.
     *
     * @param {boolean} [redraw]
     *        Whether to redraw the chart or wait for a later call to
     *        `chart.redraw()`.
     */
    public setTitle(
        titleOptions?: Chart.TitleOptions,
        subtitleOptions?: Chart.SubtitleOptions,
        redraw?: boolean
    ): void {

        this.applyDescription('title', titleOptions);
        this.applyDescription('subtitle', subtitleOptions);

        // The initial call also adds the caption. On update, chart.update will
        // relay to Chart.setCaption.
        this.applyDescription('caption', void 0);

        this.layOutTitles(redraw);
    }

    /**
     * Apply a title, subtitle or caption for the chart
     *
     * @private
     * @function Highcharts.Chart#applyDescription
     * @param key {string}
     * Either title, subtitle or caption
     * @param {Highcharts.TitleOptions|Highcharts.SubtitleOptions|Highcharts.CaptionOptions|undefined} explicitOptions
     * The options to set, will be merged with default options.
     */
    public applyDescription(
        key: Chart.DescriptionKey,
        explicitOptions?: Chart.DescriptionOptionsType
    ): void {
        const chart = this;

        // Merge default options with explicit options
        const options = this.options[key] = merge(
            this.options[key],
            explicitOptions
        );

        let elem = this[key];

        if (elem && explicitOptions) {
            this[key] = elem = elem.destroy(); // Remove old
        }

        if (options && !elem) {
            elem = this.renderer.text(
                options.text,
                0,
                0,
                options.useHTML
            )
                .attr({
                    align: options.align,
                    'class': 'highcharts-' + key,
                    zIndex: options.zIndex || 4
                })
                .css({
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                })
                .add();

            // Update methods, relay to `applyDescription`
            elem.update = function (
                updateOptions: (Chart.DescriptionOptionsType),
                redraw?: boolean
            ): void {
                chart.applyDescription(key, updateOptions);
                chart.layOutTitles(redraw);
            };

            // Presentational
            if (!this.styledMode) {
                elem.css(extend<CSSObject>(
                    key === 'title' ? {
                        // #2944
                        fontSize: this.options.isStock ? '1em' : '1.2em'
                    } : {},
                    options.style
                ));
            }

            // Get unwrapped text length and reset
            elem.textPxLength = elem.getBBox().width;
            elem.css({ whiteSpace: options.style?.whiteSpace });

            /**
             * The chart title. The title has an `update` method that allows
             * modifying the options directly or indirectly via
             * `chart.update`.
             *
             * @sample highcharts/members/title-update/
             *         Updating titles
             *
             * @name Highcharts.Chart#title
             * @type {Highcharts.TitleObject}
             */

            /**
             * The chart subtitle. The subtitle has an `update` method that
             * allows modifying the options directly or indirectly via
             * `chart.update`.
             *
             * @name Highcharts.Chart#subtitle
             * @type {Highcharts.SubtitleObject}
             */
            this[key] = elem;
        }

    }

    /**
     * Internal function to lay out the chart title, subtitle and caption, and
     * cache the full offset height for use in `getMargins`. The result is
     * stored in `this.titleOffset`.
     *
     * @private
     * @function Highcharts.Chart#layOutTitles
     *
     * @param {boolean} [redraw=true]
     * @emits Highcharts.Chart#event:afterLayOutTitles
     */
    public layOutTitles(redraw = true): void {
        const titleOffset = [0, 0, 0],
            { options, renderer, spacingBox } = this;

        // Lay out the title, subtitle and caption respectively
        (
            ['title', 'subtitle', 'caption'] as Chart.DescriptionKey[]
        ).forEach((key): void => {
            const desc = this[key],
                descOptions = this.options[key],
                alignTo = merge(spacingBox),
                textPxLength = desc?.textPxLength || 0;

            if (desc && descOptions) {

                // Provide a hook for the exporting button to shift the title
                fireEvent(
                    this,
                    'layOutTitle',
                    { alignTo, key, textPxLength }
                );

                const fontMetrics = renderer.fontMetrics(desc),
                    baseline = fontMetrics.b,
                    lineHeight = fontMetrics.h,
                    verticalAlign = descOptions.verticalAlign || 'top',
                    topAligned = verticalAlign === 'top',
                    // Use minScale only for top-aligned titles. It is not
                    // likely that we will need scaling for other positions, but
                    // if it is requested, we need to adjust the vertical
                    // position to the scale.
                    minScale = topAligned && (
                        descOptions as Chart.TitleOptions
                    ).minScale || 1,
                    offset = key === 'title' ?
                        topAligned ? -3 : 0 :
                        // Floating subtitle (#6574)
                        topAligned ? titleOffset[0] + 2 : 0,
                    uncappedScale = Math.min(alignTo.width / textPxLength, 1),
                    scale = Math.max(minScale, uncappedScale),
                    alignAttr: SVGAttributes = merge(
                        {
                            y: verticalAlign === 'bottom' ?
                                baseline :
                                offset + baseline
                        },
                        {
                            align: key === 'title' ?
                                // Title defaults to center for short titles,
                                // left for word-wrapped titles
                                (uncappedScale < minScale ? 'left' : 'center') :
                                // Subtitle defaults to the title.align
                                this.title?.alignValue
                        },
                        descOptions
                    ),
                    width = (descOptions.width || (
                        (
                            uncappedScale > minScale ?
                                // One line
                                this.chartWidth :
                                // Allow word wrap
                                alignTo.width
                        ) / scale
                    )) + 'px';

                // No animation when switching alignment
                if (desc.alignValue !== alignAttr.align) {
                    desc.placed = false;
                }
                // Set the width and read the height
                const height = Math.round(
                    desc
                        .css({ width })
                        // Skip the cache for HTML (#3481, #11666)
                        .getBBox(descOptions.useHTML).height
                );
                alignAttr.height = height;

                // Perform scaling and alignment
                desc
                    .align(alignAttr, false, alignTo)
                    .attr({
                        align: alignAttr.align,
                        scaleX: scale,
                        scaleY: scale,
                        'transform-origin': `${
                            alignTo.x +
                            textPxLength *
                            scale *
                            getAlignFactor(alignAttr.align)
                        } ${lineHeight}`
                    });

                // Adjust the rendered title offset
                if (!descOptions.floating) {
                    const offset = height * (
                        // When scaling down the title, preserve the offset as
                        // long as it's only one line, but scale down the offset
                        // if the title wraps to multiple lines.
                        height < lineHeight * 1.2 ? 1 : scale
                    );
                    if (verticalAlign === 'top') {

                        titleOffset[0] = Math.ceil(
                            titleOffset[0] + offset
                        );

                    } else if (verticalAlign === 'bottom') {
                        titleOffset[2] = Math.ceil(
                            titleOffset[2] + offset
                        );
                    }
                }
            }
        }, this);

        // Handle title.margin and caption.margin
        if (
            titleOffset[0] &&
            (options.title?.verticalAlign || 'top') === 'top'
        ) {
            titleOffset[0] += options.title?.margin || 0;
        }
        if (
            titleOffset[2] &&
            options.caption?.verticalAlign === 'bottom'
        ) {
            titleOffset[2] += options.caption?.margin || 0;
        }

        const requiresDirtyBox = (
            !this.titleOffset ||
            this.titleOffset.join(',') !== titleOffset.join(',')
        );

        // Used in getMargins
        this.titleOffset = titleOffset;

        fireEvent(this, 'afterLayOutTitles');

        if (!this.isDirtyBox && requiresDirtyBox) {
            this.isDirtyBox = this.isDirtyLegend = requiresDirtyBox;
            // Redraw if necessary (#2719, #2744)
            if (this.hasRendered && redraw && this.isDirtyBox) {
                this.redraw();
            }
        }
    }

    /**
     * Internal function to get the available size of the container element
     *
     * @private
     * @function Highcharts.Chart#getContainerBox
     */
    public getContainerBox(): { width: number, height: number } {
        // Temporarily hide support divs from a11y and others, #21888
        const nonContainers = [].map.call(
                this.renderTo.children,
                (child: HTMLDOMElement): [HTMLElement, string] | undefined => {
                    if (child !== this.container) {
                        const display = child.style.display;
                        child.style.display = 'none';
                        return [child, display];
                    }
                }
            ) as Array<[HTMLElement, string]>,
            box = {
                width: getStyle(this.renderTo, 'width', true) || 0,
                height: (getStyle(this.renderTo, 'height', true) || 0)
            };

        // Restore the non-containers
        nonContainers.filter(Boolean).forEach(
            ([div, display]): void => {
                div.style.display = display;
            }
        );

        return box;
    }

    /**
     * Internal function to get the chart width and height according to options
     * and container size. Sets {@link Chart.chartWidth} and
     * {@link Chart.chartHeight}.
     *
     * @private
     * @function Highcharts.Chart#getChartSize
     */
    public getChartSize(): void {
        const chart = this,
            optionsChart = chart.options.chart,
            widthOption = optionsChart.width,
            heightOption = optionsChart.height,
            containerBox = chart.getContainerBox(),
            enableDefaultHeight = containerBox.height <= 1 ||
                ( // #21510, prevent infinite reflow
                    !chart.renderTo.parentElement?.style.height &&
                    chart.renderTo.style.height === '100%'
                );
        /**
         * The current pixel width of the chart.
         *
         * @name Highcharts.Chart#chartWidth
         * @type {number}
         */
        chart.chartWidth = Math.max( // #1393
            0,
            widthOption || containerBox.width || 600 // #1460
        );
        /**
         * The current pixel height of the chart.
         *
         * @name Highcharts.Chart#chartHeight
         * @type {number}
         */
        chart.chartHeight = Math.max(
            0,
            relativeLength(
                heightOption as any,
                chart.chartWidth
            ) ||
            (enableDefaultHeight ? 400 : containerBox.height)
        );

        chart.containerBox = containerBox;
    }

    /**
     * If the renderTo element has no offsetWidth, most likely one or more of
     * its parents are hidden. Loop up the DOM tree to temporarily display the
     * parents, then save the original display properties, and when the true
     * size is retrieved, reset them. Used on first render and on redraws.
     *
     * @private
     * @function Highcharts.Chart#temporaryDisplay
     *
     * @param {boolean} [revert]
     * Revert to the saved original styles.
     */
    public temporaryDisplay(revert?: boolean): void {
        let node = this.renderTo,
            tempStyle: CSSObject;

        if (!revert) {
            while (node?.style) {

                // When rendering to a detached node, it needs to be temporarily
                // attached in order to read styling and bounding boxes (#5783,
                // #7024).
                if (!doc.body.contains(node) && !node.parentNode) {
                    (node as any).hcOrigDetached = true;
                    doc.body.appendChild(node);
                }
                if (
                    getStyle(node, 'display', false) === 'none' ||
                    (node as any).hcOricDetached
                ) {
                    (node as any).hcOrigStyle = {
                        display: node.style.display,
                        height: node.style.height,
                        overflow: node.style.overflow
                    };
                    tempStyle = {
                        display: 'block',
                        overflow: 'hidden'
                    };
                    if (node !== this.renderTo) {
                        tempStyle.height = 0;
                    }

                    css(node, tempStyle);

                    // If it still doesn't have an offset width after setting
                    // display to block, it probably has an !important priority
                    // #2631, 6803
                    if (!node.offsetWidth) {
                        node.style.setProperty('display', 'block', 'important');
                    }
                }
                node = node.parentNode as any;

                if (node === doc.body) {
                    break;
                }
            }
        } else {
            while (node?.style) {
                if ((node as any).hcOrigStyle) {
                    css(node, (node as any).hcOrigStyle);
                    delete (node as any).hcOrigStyle;
                }
                if ((node as any).hcOrigDetached) {
                    doc.body.removeChild(node);
                    (node as any).hcOrigDetached = false;
                }
                node = node.parentNode as any;
            }
        }
    }

    /**
     * Set the {@link Chart.container|chart container's} class name, in
     * addition to `highcharts-container`.
     *
     * @function Highcharts.Chart#setClassName
     *
     * @param {string} [className]
     * The additional class name.
     */
    public setClassName(className?: string): void {
        this.container.className = 'highcharts-container ' + (className || '');
    }

    /**
     * Get the containing element, determine the size and create the inner
     * container div to hold the chart.
     *
     * @private
     * @function Highcharts.Chart#afterGetContainer
     * @emits Highcharts.Chart#event:afterGetContainer
     */
    public getContainer(): void {
        const chart = this,
            options = chart.options,
            optionsChart = options.chart,
            indexAttrName = 'data-highcharts-chart',
            containerId = uniqueKey(),
            renderTo = chart.renderTo;

        let containerStyle: (CSSObject|undefined);

        // If the container already holds a chart, destroy it. The check for
        // hasRendered is there because web pages that are saved to disk from
        // the browser, will preserve the data-highcharts-chart attribute and
        // the SVG contents, but not an interactive chart. So in this case,
        // charts[oldChartIndex] will point to the wrong chart if any (#2609).
        const oldChartIndex = pInt(attr(renderTo, indexAttrName));
        if (
            isNumber(oldChartIndex) &&
            charts[oldChartIndex] &&
            (charts[oldChartIndex] as any).hasRendered
        ) {
            (charts[oldChartIndex] as any).destroy();
        }

        // Make a reference to the chart from the div
        attr(renderTo, indexAttrName, chart.index);

        // Remove previous chart
        renderTo.innerHTML = AST.emptyHTML;

        // If the container doesn't have an offsetWidth, it has or is a child of
        // a node that has display:none. We need to temporarily move it out to a
        // visible state to determine the size, else the legend and tooltips
        // won't render properly. The skipClone option is used in sparklines as
        // a micro optimization, saving about 1-2 ms each chart.
        if (!optionsChart.skipClone && !renderTo.offsetWidth) {
            chart.temporaryDisplay();
        }

        // Get the width and height
        chart.getChartSize();
        const chartHeight = chart.chartHeight;
        let chartWidth = chart.chartWidth;

        // Allow table cells and flex-boxes to shrink without the chart blocking
        // them out (#6427)
        css(renderTo, { overflow: 'hidden' });

        // Create the inner container
        if (!chart.styledMode) {
            containerStyle = extend<CSSObject>({
                position: 'relative',
                // Needed for context menu (avoidscrollbars) and content
                // overflow in IE
                overflow: 'hidden',
                width: chartWidth + 'px',
                height: chartHeight + 'px',
                textAlign: 'left',
                lineHeight: 'normal', // #427
                zIndex: 0, // #1072
                '-webkit-tap-highlight-color': 'rgba(0,0,0,0)',
                userSelect: 'none', // #13503
                'touch-action': 'manipulation',
                outline: 'none',
                padding: '0px'
            }, optionsChart.style || {});
        }

        /**
         * The containing HTML element of the chart. The container is
         * dynamically inserted into the element given as the `renderTo`
         * parameter in the {@link Highcharts#chart} constructor.
         *
         * @name Highcharts.Chart#container
         * @type {Highcharts.HTMLDOMElement}
         */
        const container = createElement(
            'div',
            {
                id: containerId
            },
            containerStyle,
            renderTo
        );
        chart.container = container;

        // Adjust width if setting height affected it (#20334)
        chart.getChartSize();
        if (chartWidth !== chart.chartWidth) {
            chartWidth = chart.chartWidth;
            if (!chart.styledMode) {
                css(container, {
                    width: pick(optionsChart.style?.width, chartWidth + 'px')
                });
            }
        }
        chart.containerBox = chart.getContainerBox();

        // Cache the cursor (#1650)
        chart._cursor = container.style.cursor as CursorValue;

        // Initialize the renderer
        const Renderer = optionsChart.renderer || !svg ?
            RendererRegistry.getRendererType(optionsChart.renderer) :
            SVGRenderer;

        /**
         * The renderer instance of the chart. Each chart instance has only one
         * associated renderer.
         *
         * @name Highcharts.Chart#renderer
         * @type {Highcharts.SVGRenderer}
         */
        chart.renderer = new Renderer(
            container,
            chartWidth,
            chartHeight,
            void 0,
            optionsChart.forExport,
            options.exporting?.allowHTML,
            chart.styledMode
        ) as Chart.Renderer;

        // Set the initial animation from the options
        setAnimation(void 0, chart);


        chart.setClassName(optionsChart.className);
        if (!chart.styledMode) {
            chart.renderer.setStyle(optionsChart.style as any);
        } else {
            // Initialize definitions
            for (const key in options.defs) { // eslint-disable-line guard-for-in
                this.renderer.definition((options.defs as any)[key]);
            }
        }

        // Add a reference to the charts index
        chart.renderer.chartIndex = chart.index;

        fireEvent(this, 'afterGetContainer');
    }

    /**
     * Calculate margins by rendering axis labels in a preliminary position.
     * Title, subtitle and legend have already been rendered at this stage, but
     * will be moved into their final positions.
     *
     * @private
     * @function Highcharts.Chart#getMargins
     * @emits Highcharts.Chart#event:getMargins
     */
    public getMargins(skipAxes?: boolean): void {
        const { spacing, margin, titleOffset } = this;

        this.resetMargins();

        // Adjust for title and subtitle
        if (titleOffset[0] && !defined(margin[0])) {
            this.plotTop = Math.max(
                this.plotTop,
                titleOffset[0] + spacing[0]
            );
        }

        if (titleOffset[2] && !defined(margin[2])) {
            this.marginBottom = Math.max(
                this.marginBottom as any,
                titleOffset[2] + spacing[2]
            );
        }

        // Adjust for legend
        if (this.legend?.display) {
            this.legend.adjustMargins(margin, spacing);
        }

        fireEvent(this, 'getMargins');

        if (!skipAxes) {
            this.getAxisMargins();
        }
    }

    /**
     * @private
     * @function Highcharts.Chart#getAxisMargins
     */
    public getAxisMargins(): void {
        const chart = this,
            // [top, right, bottom, left]
            axisOffset = chart.axisOffset = [0, 0, 0, 0],
            colorAxis = chart.colorAxis,
            margin = chart.margin,
            getOffset = function (axes: Array<Axis>): void {
                axes.forEach(function (axis): void {
                    if (axis.visible) {
                        axis.getOffset();
                    }
                });
            };

        // Pre-render axes to get labels offset width
        if (chart.hasCartesianSeries) {
            getOffset(chart.axes);

        } else if (colorAxis?.length) {
            getOffset(colorAxis);
        }

        // Add the axis offsets
        marginNames.forEach(function (m: string, side: number): void {
            if (!defined(margin[side])) {
                (chart as any)[m] += axisOffset[side];
            }
        });

        chart.setChartSize();

    }

    /**
     * Return the current options of the chart, but only those that differ from
     * default options. Items that can be either an object or an array of
     * objects, like `series`, `xAxis` and `yAxis`, are always returned as
     * array.
     *
     * @sample highcharts/members/chart-getoptions
     *
     * @function Highcharts.Chart#getOptions
     *
     * @since 11.1.0
     */
    public getOptions(): DeepPartial<Options> {
        return diffObjects(this.userOptions, defaultOptions);
    }

    /**
     * Reflows the chart to its container. By default, the Resize Observer is
     * attached to the chart's div which allows to reflows the chart
     * automatically to its container, as per the
     * [chart.reflow](https://api.highcharts.com/highcharts/chart.reflow)
     * option.
     *
     * @sample highcharts/chart/events-container/
     *         Pop up and reflow
     *
     * @function Highcharts.Chart#reflow
     *
     * @param {global.Event} [e]
     *        Event arguments. Used primarily when the function is called
     *        internally as a response to window resize.
     */
    public reflow(e?: Event): void {
        const chart = this,
            oldBox = chart.containerBox,
            containerBox = chart.getContainerBox();

        delete chart.pointer?.chartPosition;

        // Width and height checks for display:none. Target is doc in Opera
        // and win in Firefox, Chrome and IE9.
        if (
            !chart.exporting?.isPrinting &&
            !chart.isResizing &&
            oldBox &&
            // When fired by resize observer inside hidden container
            containerBox.width
        ) {
            if (
                containerBox.width !== oldBox.width ||
                containerBox.height !== oldBox.height
            ) {
                U.clearTimeout(chart.reflowTimeout);
                // When called from window.resize, e is set, else it's called
                // directly (#2224)
                chart.reflowTimeout = syncTimeout(function (): void {
                    // Set size, it may have been destroyed in the meantime
                    // (#1257)
                    if (chart.container) {
                        chart.setSize(void 0, void 0, false);
                    }
                }, e ? 100 : 0);
            }
            chart.containerBox = containerBox;
        }
    }

    /**
     * Toggle the event handlers necessary for auto resizing, depending on the
     * `chart.reflow` option.
     *
     * @private
     * @function Highcharts.Chart#setReflow
     */
    public setReflow(): void {
        const chart = this;

        const runReflow = (e: any): void => {
            if (chart.options?.chart.reflow && chart.hasLoaded) {
                chart.reflow(e);
            }
        };

        if (typeof ResizeObserver === 'function') {
            (new ResizeObserver(runReflow)).observe(chart.renderTo);

        // Fallback for more legacy browser versions.
        } else {
            const unbind = addEvent(win, 'resize', runReflow);
            addEvent(this, 'destroy', unbind);
        }
    }

    /**
     * Resize the chart to a given width and height. In order to set the width
     * only, the height argument may be skipped. To set the height only, pass
     * `undefined` for the width.
     *
     * @sample highcharts/members/chart-setsize-button/
     *         Test resizing from buttons
     * @sample highcharts/members/chart-setsize-jquery-resizable/
     *         Add a jQuery UI resizable
     * @sample stock/members/chart-setsize/
     *         Highcharts Stock with UI resizable
     *
     * @function Highcharts.Chart#setSize
     *
     * @param {number|null} [width]
     *        The new pixel width of the chart. Since v4.2.6, the argument can
     *        be `undefined` in order to preserve the current value (when
     *        setting height only), or `null` to adapt to the width of the
     *        containing element.
     *
     * @param {number|null} [height]
     *        The new pixel height of the chart. Since v4.2.6, the argument can
     *        be `undefined` in order to preserve the current value, or `null`
     *        in order to adapt to the height of the containing element.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        Whether and how to apply animation. When `undefined`, it applies
     *        the animation that is set in the `chart.animation` option.
     *
     *
     * @emits Highcharts.Chart#event:endResize
     * @emits Highcharts.Chart#event:resize
     */
    public setSize(
        width?: (number|null),
        height?: (number|null),
        animation?: (boolean|Partial<AnimationOptions>)
    ): void {
        const chart = this,
            renderer = chart.renderer;

        // Handle the isResizing counter
        chart.isResizing += 1;

        // Set the animation for the current process
        setAnimation(animation, chart);
        const globalAnimation = renderer.globalAnimation;

        chart.oldChartHeight = chart.chartHeight;
        chart.oldChartWidth = chart.chartWidth;
        if (typeof width !== 'undefined') {
            chart.options.chart.width = width;
        }
        if (typeof height !== 'undefined') {
            chart.options.chart.height = height;
        }
        chart.getChartSize();

        const {
            chartWidth,
            chartHeight,
            scrollablePixelsX = 0,
            scrollablePixelsY = 0
        } = chart;

        // Avoid expensive redrawing if the computed size didn't change
        if (
            chart.isDirtyBox ||
            chartWidth !== chart.oldChartWidth ||
            chartHeight !== chart.oldChartHeight
        ) {

            // Resize the container with the global animation applied if enabled
            // (#2503)
            if (!chart.styledMode) {
                (globalAnimation ? animate : css)(chart.container, {
                    width: `${chartWidth + scrollablePixelsX}px`,
                    height: `${chartHeight + scrollablePixelsY}px`
                }, globalAnimation);
            }

            chart.setChartSize(true);
            renderer.setSize(chartWidth, chartHeight, globalAnimation);

            // Handle axes
            chart.axes.forEach(function (axis): void {
                axis.isDirty = true;
                axis.setScale();
            });

            chart.isDirtyLegend = true; // Force legend redraw
            chart.isDirtyBox = true; // Force redraw of plot and chart border

            chart.layOutTitles(); // #2857
            chart.getMargins();

            chart.redraw(globalAnimation);


            chart.oldChartHeight = void 0;
            fireEvent(chart, 'resize');

            // Fire endResize and set isResizing back. If animation is disabled,
            // fire without delay, but in a new thread to avoid triggering the
            // resize observer (#19027).
            setTimeout((): void => {
                if (chart) {
                    fireEvent(chart, 'endResize');
                }
            }, animObject(globalAnimation).duration);
        }

        // Handle resizing counter even if we've re-rendered or not (#20548).
        chart.isResizing -= 1;
    }

    /**
     * Set the public chart properties. This is done before and after the
     * pre-render to determine margin sizes.
     *
     * @private
     * @function Highcharts.Chart#setChartSize
     * @emits Highcharts.Chart#event:afterSetChartSize
     */
    public setChartSize(skipAxes?: boolean): void {
        const chart = this,
            {
                chartHeight,
                chartWidth,
                inverted,
                spacing,
                renderer
            } = chart,
            clipOffset = chart.clipOffset,
            clipRoundFunc = Math[inverted ? 'floor' : 'round'];

        let plotLeft,
            plotTop,
            plotWidth,
            plotHeight;

        /**
         * The current left position of the plot area in pixels.
         *
         * @name Highcharts.Chart#plotLeft
         * @type {number}
         */
        chart.plotLeft = plotLeft = Math.round(chart.plotLeft);

        /**
         * The current top position of the plot area in pixels.
         *
         * @name Highcharts.Chart#plotTop
         * @type {number}
         */
        chart.plotTop = plotTop = Math.round(chart.plotTop);

        /**
         * The current width of the plot area in pixels.
         *
         * @name Highcharts.Chart#plotWidth
         * @type {number}
         */
        chart.plotWidth = plotWidth = Math.max(
            0,
            Math.round(chartWidth - plotLeft - (chart.marginRight ?? 0))
        );

        /**
         * The current height of the plot area in pixels.
         *
         * @name Highcharts.Chart#plotHeight
         * @type {number}
         */
        chart.plotHeight = plotHeight = Math.max(
            0,
            Math.round(chartHeight - plotTop - (chart.marginBottom ?? 0))
        );

        chart.plotSizeX = inverted ? plotHeight : plotWidth;
        chart.plotSizeY = inverted ? plotWidth : plotHeight;

        // Set boxes used for alignment
        chart.spacingBox = renderer.spacingBox = {
            x: spacing[3],
            y: spacing[0],
            width: chartWidth - spacing[3] - spacing[1],
            height: chartHeight - spacing[0] - spacing[2]
        };
        chart.plotBox = renderer.plotBox = {
            x: plotLeft,
            y: plotTop,
            width: plotWidth,
            height: plotHeight
        };

        // Compute the clipping box
        if (clipOffset) {
            chart.clipBox = {
                x: clipRoundFunc(clipOffset[3]),
                y: clipRoundFunc(clipOffset[0]),
                width: clipRoundFunc(
                    chart.plotSizeX - clipOffset[1] - clipOffset[3]
                ),
                height: clipRoundFunc(
                    chart.plotSizeY - clipOffset[0] - clipOffset[2]
                )
            };
        }

        if (!skipAxes) {
            chart.axes.forEach(function (axis): void {
                axis.setAxisSize();
                axis.setAxisTranslation();
            });
            renderer.alignElements();
        }


        fireEvent(chart, 'afterSetChartSize', { skipAxes: skipAxes });
    }

    /**
     * Initial margins before auto size margins are applied.
     *
     * @private
     * @function Highcharts.Chart#resetMargins
     */
    public resetMargins(): void {

        fireEvent(this, 'resetMargins');

        const chart = this,
            chartOptions = chart.options.chart,
            plotBorderWidth = chartOptions.plotBorderWidth || 0,
            halfWidth = Math.round(plotBorderWidth) / 2;

        // Create margin and spacing array
        ['margin', 'spacing'].forEach(function splashArrays(
            target: string
        ): void {
            const value = (chartOptions as any)[target],
                values = isObject(value) ? value : [value, value, value, value];

            [
                'Top',
                'Right',
                'Bottom',
                'Left'
            ].forEach(function (sideName: string, side: number): void {
                (chart as any)[target][side] = pick(
                    (chartOptions as any)[target + sideName],
                    values[side]
                );
            });
        });

        // Set margin names like chart.plotTop, chart.plotLeft,
        // chart.marginRight, chart.marginBottom.
        marginNames.forEach(function (m: string, side: number): void {
            (chart as any)[m] = pick(chart.margin[side], chart.spacing[side]);
        });
        chart.axisOffset = [0, 0, 0, 0]; // Top, right, bottom, left
        chart.clipOffset = [
            halfWidth,
            halfWidth,
            halfWidth,
            halfWidth
        ];
        chart.plotBorderWidth = plotBorderWidth;

    }

    /**
     * Internal function to draw or redraw the borders and backgrounds for chart
     * and plot area.
     *
     * @private
     * @function Highcharts.Chart#drawChartBox
     * @emits Highcharts.Chart#event:afterDrawChartBox
     */
    public drawChartBox(): void {
        const chart = this,
            optionsChart = chart.options.chart,
            renderer = chart.renderer,
            chartWidth = chart.chartWidth,
            chartHeight = chart.chartHeight,
            styledMode = chart.styledMode,
            plotBGImage = chart.plotBGImage,
            chartBackgroundColor = optionsChart.backgroundColor,
            plotBackgroundColor = optionsChart.plotBackgroundColor,
            plotBackgroundImage = optionsChart.plotBackgroundImage,
            plotLeft = chart.plotLeft,
            plotTop = chart.plotTop,
            plotWidth = chart.plotWidth,
            plotHeight = chart.plotHeight,
            plotBox = chart.plotBox,
            clipRect = chart.clipRect,
            clipBox = chart.clipBox;

        let chartBackground = chart.chartBackground,
            plotBackground = chart.plotBackground,
            plotBorder = chart.plotBorder,
            chartBorderWidth,
            mgn,
            bgAttr: SVGAttributes,
            verb = 'animate';

        // Chart area
        if (!chartBackground) {
            chart.chartBackground = chartBackground = renderer.rect()
                .addClass('highcharts-background')
                .add();
            verb = 'attr';
        }

        if (!styledMode) {
            // Presentational
            chartBorderWidth = optionsChart.borderWidth || 0;
            mgn = chartBorderWidth + (optionsChart.shadow ? 8 : 0);

            bgAttr = {
                fill: chartBackgroundColor || 'none'
            };

            if (chartBorderWidth || chartBackground['stroke-width']) { // #980
                bgAttr.stroke = optionsChart.borderColor;
                bgAttr['stroke-width'] = chartBorderWidth;
            }
            chartBackground
                .attr(bgAttr)
                .shadow(optionsChart.shadow);
        } else {
            chartBorderWidth = mgn = chartBackground.strokeWidth();
        }


        chartBackground[verb]({
            x: mgn / 2,
            y: mgn / 2,
            width: (chartWidth as any) - mgn - chartBorderWidth % 2,
            height: (chartHeight as any) - mgn - chartBorderWidth % 2,
            r: optionsChart.borderRadius
        });

        // Plot background
        verb = 'animate';
        if (!plotBackground) {
            verb = 'attr';
            chart.plotBackground = plotBackground = renderer.rect()
                .addClass('highcharts-plot-background')
                .add();
        }
        plotBackground[verb](plotBox);

        if (!styledMode) {
            // Presentational attributes for the background
            plotBackground
                .attr({
                    fill: plotBackgroundColor || 'none'
                })
                .shadow(optionsChart.plotShadow);

            // Create the background image
            if (plotBackgroundImage) {
                if (!plotBGImage) {
                    chart.plotBGImage = renderer.image(
                        plotBackgroundImage,
                        plotLeft,
                        plotTop,
                        plotWidth,
                        plotHeight
                    ).add();
                } else {
                    if (plotBackgroundImage !== plotBGImage.attr('href')) {
                        plotBGImage.attr('href', plotBackgroundImage);
                    }

                    plotBGImage.animate(plotBox as SVGAttributes);
                }
            }
        }

        // Plot clip
        if (!clipRect) {
            chart.clipRect = renderer.clipRect(clipBox);
        } else {
            clipRect.animate({
                width: clipBox.width,
                height: clipBox.height
            });
        }

        // Plot area border
        verb = 'animate';
        if (!plotBorder) {
            verb = 'attr';
            chart.plotBorder = plotBorder = renderer.rect()
                .addClass('highcharts-plot-border')
                .attr({
                    zIndex: 1 // Above the grid
                })
                .add();
        }

        if (!styledMode) {
            // Presentational
            plotBorder.attr({
                stroke: optionsChart.plotBorderColor,
                'stroke-width': optionsChart.plotBorderWidth || 0,
                fill: 'none'
            });
        }

        plotBorder[verb](plotBorder.crisp(
            plotBox,
            // #3282 plotBorder should be negative
            -plotBorder.strokeWidth()
        ));

        // Reset
        chart.isDirtyBox = false;

        fireEvent(this, 'afterDrawChartBox');
    }

    /**
     * Detect whether a certain chart property is needed based on inspecting its
     * options and series. This mainly applies to the chart.inverted property,
     * and in extensions to the chart.angular and chart.polar properties.
     *
     * @private
     * @function Highcharts.Chart#propFromSeries
     */
    public propFromSeries(): void {
        const chart = this,
            optionsChart = chart.options.chart,
            seriesOptions: Array<SeriesOptions> = chart.options.series as any;

        let i,
            klass,
            value;

        /**
         * The flag is set to `true` if a series of the chart is inverted.
         *
         * @name Highcharts.Chart#inverted
         * @type {boolean|undefined}
         */
        ['inverted', 'angular', 'polar'].forEach(function (key: string): void {

            // The default series type's class
            klass = seriesTypes[
                optionsChart.type as any
            ];

            // Get the value from available chart-wide properties
            value =
                // It is set in the options:
                (optionsChart as any)[key] ||
                // The default series class:
                (klass && (klass.prototype as any)[key]);
            // Requires it

            // 4. Check if any the chart's series require it
            i = seriesOptions?.length;
            while (!value && i--) {
                klass = seriesTypes[seriesOptions[i].type as any];
                if (klass && (klass.prototype as any)[key]) {
                    value = true;
                }
            }

            // Set the chart property
            (chart as any)[key] = value;
        });

    }

    /**
     * Internal function to link two or more series together, based on the
     * `linkedTo` option. This is done from `Chart.render`, and after
     * `Chart.addSeries` and `Series.remove`.
     *
     * @private
     * @function Highcharts.Chart#linkSeries
     * @emits Highcharts.Chart#event:afterLinkSeries
     */
    public linkSeries(isUpdating?:boolean): void {
        const chart = this,
            chartSeries = chart.series;

        // Reset links
        chartSeries.forEach(function (series): void {
            series.linkedSeries.length = 0;
        });

        // Apply new links
        chartSeries.forEach(function (series): void {
            const { linkedTo } = series.options;

            if (isString(linkedTo)) {
                let linkedParent: Series | undefined;
                if (linkedTo === ':previous') {
                    linkedParent = chart.series[series.index - 1];
                } else {
                    linkedParent = chart.get(linkedTo) as Series | undefined;
                }
                // #3341 avoid mutual linking
                if (
                    linkedParent &&
                    linkedParent.linkedParent !== series
                ) {
                    linkedParent.linkedSeries.push(series);
                    /**
                     * The parent series of the current series, if the current
                     * series has a [linkedTo](https://api.highcharts.com/highcharts/series.line.linkedTo)
                     * setting.
                     *
                     * @name Highcharts.Series#linkedParent
                     * @type {Highcharts.Series}
                     * @readonly
                     */
                    series.linkedParent = linkedParent;

                    if (linkedParent.enabledDataSorting) {
                        series.setDataSortingOptions();
                    }

                    series.visible = pick(
                        series.options.visible,
                        linkedParent.options.visible,
                        series.visible
                    ); // #3879
                }
            }
        });

        fireEvent(this, 'afterLinkSeries', { isUpdating });
    }

    /**
     * Render series for the chart.
     *
     * @private
     * @function Highcharts.Chart#renderSeries
     */
    public renderSeries(): void {
        this.series.forEach(function (serie): void {
            serie.translate();
            serie.render();
        });
    }

    /**
     * Render all graphics for the chart. Runs internally on initialization.
     *
     * @private
     * @function Highcharts.Chart#render
     */
    public render(): void {
        const chart = this,
            axes = chart.axes,
            colorAxis = chart.colorAxis,
            renderer = chart.renderer,
            axisLayoutRuns = chart.options.chart.axisLayoutRuns || 2,
            renderAxes = (axes: Array<Axis>): void => {
                axes.forEach((axis): void => {
                    if (axis.visible) {
                        axis.render();
                    }
                });
            };

        let expectedSpace = 0, // Correction for X axis labels
            // If the plot area size has changed significantly, calculate tick
            // positions again
            redoHorizontal = true,
            redoVertical: boolean|undefined,
            run = 0;

        // Title
        chart.setTitle();

        // Fire an event before the margins are computed. This is where the
        // legend is assigned.
        fireEvent(chart, 'beforeMargins');

        // Get stacks
        chart.getStacks?.();

        // Get chart margins
        chart.getMargins(true);
        chart.setChartSize();

        for (const axis of axes) {
            const { options } = axis,
                { labels } = options;

            if (
                chart.hasCartesianSeries && // #20948
                axis.horiz &&
                axis.visible &&
                labels.enabled &&
                axis.series.length &&
                axis.coll !== 'colorAxis' &&
                !chart.polar
            ) {

                expectedSpace = options.tickLength;
                axis.createGroups();

                // Calculate expected space based on dummy tick
                const mockTick = new Tick(axis, 0, '', true),
                    label = mockTick.createLabel('x', labels);
                mockTick.destroy();
                if (
                    label &&
                    pick(
                        labels.reserveSpace,
                        !isNumber(options.crossing)
                    )
                ) {
                    expectedSpace = label.getBBox().height +
                        labels.distance +
                        Math.max(options.offset || 0, 0);
                }

                if (expectedSpace) {
                    label?.destroy();
                    break;
                }
            }
        }

        // Use Math.max to prevent negative plotHeight
        chart.plotHeight = Math.max(chart.plotHeight - expectedSpace, 0);

        while (
            (redoHorizontal || redoVertical || axisLayoutRuns > 1) &&
            run < axisLayoutRuns // #19794
        ) {

            const tempWidth = chart.plotWidth,
                tempHeight = chart.plotHeight;

            for (const axis of axes) {
                if (run === 0) {
                    // Get margins by pre-rendering axes
                    axis.setScale();

                } else if (
                    (axis.horiz && redoHorizontal) ||
                    (!axis.horiz && redoVertical)
                ) {
                    // Update to reflect the new margins
                    axis.setTickInterval(true);
                }
            }
            if (run === 0) {
                chart.getAxisMargins();
            } else {
                // Check again for new, rotated or moved labels
                chart.getMargins();
            }

            redoHorizontal = (tempWidth / chart.plotWidth) > (run ? 1 : 1.1);
            redoVertical = (tempHeight / chart.plotHeight) > (run ? 1 : 1.05);

            run++;
        }

        // Draw the borders and backgrounds
        chart.drawChartBox();

        // Axes
        if (chart.hasCartesianSeries) {
            renderAxes(axes);

        } else if (colorAxis?.length) {
            renderAxes(colorAxis);
        }

        // The series
        chart.seriesGroup ||= renderer.g('series-group')
            .attr({ zIndex: 3 })
            .shadow(chart.options.chart.seriesGroupShadow)
            .add();

        chart.dataLabelsGroup ||= renderer.g('datalabels-group')
            .attr({ zIndex: 6 })
            .add();

        chart.renderSeries();

        // Credits
        chart.addCredits();

        // Handle responsiveness
        if (chart.setResponsive) {
            chart.setResponsive();
        }

        // Set flag
        chart.hasRendered = true;
    }

    /**
     * Set a new credits label for the chart.
     *
     * @sample highcharts/credits/credits-update/
     *         Add and update credits
     *
     * @function Highcharts.Chart#addCredits
     *
     * @param {Highcharts.CreditsOptions} [credits]
     * A configuration object for the new credits.
     */
    public addCredits(credits?: Chart.CreditsOptions): void {
        const chart = this,
            creds = merge(
                true, this.options.credits as Chart.CreditsOptions, credits
            );
        if (creds.enabled && !this.credits) {

            /**
             * The chart's credits label. The label has an `update` method that
             * allows setting new options as per the
             * [credits options set](https://api.highcharts.com/highcharts/credits).
             *
             * @name Highcharts.Chart#credits
             * @type {Highcharts.SVGElement}
             */
            this.credits = this.renderer.text(
                creds.text + (this.mapCredits || ''),
                0,
                0
            )
                .addClass('highcharts-credits')
                .on('click', function (): void {
                    if (creds.href) {
                        win.location.href = creds.href;
                    }
                })
                .attr({
                    align: (creds.position as any).align,
                    zIndex: 8
                });


            if (!chart.styledMode) {
                this.credits.css(creds.style);
            }

            this.credits
                .add()
                .align(creds.position);

            // Dynamically update
            this.credits.update = function (
                options: Chart.CreditsOptions
            ): void {
                chart.credits = (chart.credits as any).destroy();
                chart.addCredits(options);
            };
        }
    }

    /**
     * Remove the chart and purge memory. This method is called internally
     * before adding a second chart into the same container, as well as on
     * window unload to prevent leaks.
     *
     * @sample highcharts/members/chart-destroy/
     *         Destroy the chart from a button
     * @sample stock/members/chart-destroy/
     *         Destroy with Highcharts Stock
     *
     * @function Highcharts.Chart#destroy
     *
     * @emits Highcharts.Chart#event:destroy
     */
    public destroy(): void {
        const chart = this,
            axes = chart.axes,
            series = chart.series,
            container = chart.container,
            parentNode = container?.parentNode;

        let i: number;

        // Fire the chart.destroy event
        fireEvent(chart, 'destroy');

        // Delete the chart from charts lookup array
        if (chart.renderer.forExport) {
            erase(charts, chart); // #6569
        } else {
            charts[chart.index] = void 0;
        }
        H.chartCount--;
        chart.renderTo.removeAttribute('data-highcharts-chart');

        // Remove events
        removeEvent(chart);

        // ==== Destroy collections:
        // Destroy axes
        i = axes.length;
        while (i--) {
            axes[i] = axes[i].destroy() as any;
        }

        // Destroy scroller & scroller series before destroying base series
        this.scroller?.destroy?.();

        // Destroy each series
        i = series.length;
        while (i--) {
            series[i] = series[i].destroy() as any;
        }

        // ==== Destroy chart properties:
        [
            'title', 'subtitle', 'chartBackground', 'plotBackground',
            'plotBGImage', 'plotBorder', 'seriesGroup', 'clipRect', 'credits',
            'pointer', 'rangeSelector', 'legend', 'resetZoomButton', 'tooltip',
            'renderer'
        ].forEach((name: string): void => {
            (chart as any)[name] = (chart as any)[name]?.destroy?.();
        });

        // Remove container and all SVG, check container as it can break in IE
        // when destroyed before finished loading
        if (container) {
            container.innerHTML = AST.emptyHTML;
            removeEvent(container);
            if (parentNode) {
                discardElement(container);
            }

        }

        // Clean it all up
        objectEach(chart, function (val: any, key: string): void {
            delete (chart as any)[key];
        });

    }

    /**
     * Prepare for first rendering after all data are loaded.
     *
     * @private
     * @function Highcharts.Chart#firstRender
     * @emits Highcharts.Chart#event:beforeRender
     */
    public firstRender(): void {
        const chart = this,
            options = chart.options;

        // Create the container
        chart.getContainer();

        chart.resetMargins();
        chart.setChartSize();

        // Set the common chart properties (mainly invert) from the given series
        chart.propFromSeries();

        // Get axes
        chart.createAxes();

        // Initialize the series
        const series = isArray(options.series) ? options.series : [];
        options.series = []; // Avoid mutation
        series.forEach(
            // #9680
            function (serieOptions): void {
                chart.initSeries(serieOptions);
            }
        );

        chart.linkSeries();
        chart.setSortedData();

        // Run an event after axes and series are initialized, but before
        // render. At this stage, the series data is indexed and cached in the
        // xData and yData arrays, so we can access those before rendering. Used
        // in Highcharts Stock.
        fireEvent(chart, 'beforeRender');

        chart.render();
        chart.pointer?.getChartPosition(); // #14973

        // Fire the load event if there are no external images
        if (!chart.renderer.imgCount && !chart.hasLoaded) {
            chart.onload();
        }

        // If the chart was rendered outside the top container, put it back in
        // (#3679)
        chart.temporaryDisplay(true);

    }

    /**
     * Internal function that runs on chart load, async if any images are loaded
     * in the chart. Runs the callbacks and triggers the `load` and `render`
     * events.
     *
     * @private
     * @function Highcharts.Chart#onload
     * @emits Highcharts.Chart#event:load
     * @emits Highcharts.Chart#event:render
     */
    public onload(): void {

        // Run callbacks, first the ones registered by modules, then user's one
        this.callbacks.concat([this.callback as any]).forEach(function (
            this: Chart,
            fn: (Chart.CallbackFunction|undefined)
        ): void {
            // Chart destroyed in its own callback (#3600)
            if (fn && typeof this.index !== 'undefined') {
                fn.apply(this, [this]);
            }
        }, this);

        fireEvent(this, 'load');
        fireEvent(this, 'render');

        // Set up auto resize, check for not destroyed (#6068)
        if (defined(this.index)) {
            this.setReflow();
        }

        this.warnIfA11yModuleNotLoaded();

        // Don't run again
        this.hasLoaded = true;
    }


    /**
     * Emit console warning if the a11y module is not loaded.
     * @private
     */
    public warnIfA11yModuleNotLoaded(): void {
        const { options, title } = this;
        if (options && !this.accessibility) {
            // Make chart behave as an image with the title as alt text
            this.renderer.boxWrapper.attr({
                role: 'img',
                'aria-label': (
                    title?.element.textContent || ''
                // #17753, < is not allowed in SVG attributes
                ).replace(/</g, '&lt;')
            });

            if (!(
                options.accessibility && options.accessibility.enabled === false
            )) {
                error(
                    'Highcharts warning: Consider including the ' +
                    '"accessibility.js" module to make your chart more ' +
                    'usable for people with disabilities. Set the ' +
                    '"accessibility.enabled" option to false to remove this ' +
                    'warning. See https://www.highcharts.com/docs/accessibility/accessibility-module.',
                    false, this
                );
            }
        }
    }


    /**
     * Add a series to the chart after render time. Note that this method should
     * never be used when adding data synchronously at chart render time, as it
     * adds expense to the calculations and rendering. When adding data at the
     * same time as the chart is initialized, add the series as a configuration
     * option instead. With multiple axes, the `offset` is dynamically adjusted.
     *
     * @sample highcharts/members/chart-addseries/
     *         Add a series from a button
     * @sample stock/members/chart-addseries/
     *         Add a series in Highcharts Stock
     *
     * @function Highcharts.Chart#addSeries
     *
     * @param {Highcharts.SeriesOptionsType} options
     *        The config options for the series.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after adding.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        Whether to apply animation, and optionally animation
     *        configuration. When `undefined`, it applies the animation that is
     *        set in the `chart.animation` option.
     *
     * @return {Highcharts.Series}
     *         The newly created series object.
     *
     * @emits Highcharts.Chart#event:addSeries
     * @emits Highcharts.Chart#event:afterAddSeries
     */
    public addSeries(
        options: SeriesTypeOptions,
        redraw?: boolean,
        animation?: (boolean|Partial<AnimationOptions>)
    ): Series {
        const chart = this;

        let series: (Series|undefined);

        if (options) { // <- not necessary
            redraw = pick(redraw, true); // Defaults to true

            fireEvent(
                chart,
                'addSeries',
                { options: options },
                function (): void {
                    series = chart.initSeries(options);

                    chart.isDirtyLegend = true;
                    chart.linkSeries();

                    if (series.enabledDataSorting) {
                        // We need to call `setData` after `linkSeries`
                        series.setData(options.data as any, false);
                    }

                    fireEvent(chart, 'afterAddSeries', { series: series });

                    if (redraw) {
                        chart.redraw(animation);
                    }
                }
            );
        }

        return series as any;
    }

    /**
     * Add an axis to the chart after render time. Note that this method should
     * never be used when adding data synchronously at chart render time, as it
     * adds expense to the calculations and rendering. When adding data at the
     * same time as the chart is initialized, add the axis as a configuration
     * option instead.
     *
     * @sample highcharts/members/chart-addaxis/
     *         Add and remove axes
     *
     * @function Highcharts.Chart#addAxis
     *
     * @param {Highcharts.AxisOptions} options
     *        The axis options.
     *
     * @param {boolean} [isX=false]
     *        Whether it is an X axis or a value axis.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after adding.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        Whether and how to apply animation in the redraw. When
     *        `undefined`, it applies the animation that is set in the
     *        `chart.animation` option.
     *
     * @return {Highcharts.Axis}
     *         The newly generated Axis object.
     */
    public addAxis(
        options: DeepPartial<AxisOptions>,
        isX?: boolean,
        redraw?: boolean,
        animation?: boolean
    ): Axis {
        return this.createAxis(
            isX ? 'xAxis' : 'yAxis',
            { axis: options, redraw: redraw, animation: animation }
        );
    }

    /**
     * Add a color axis to the chart after render time. Note that this method
     * should never be used when adding data synchronously at chart render time,
     * as it adds expense to the calculations and rendering. When adding data at
     * the same time as the chart is initialized, add the axis as a
     * configuration option instead.
     *
     * @sample highcharts/members/chart-addaxis/
     *         Add and remove axes
     *
     * @function Highcharts.Chart#addColorAxis
     *
     * @param {Highcharts.ColorAxisOptions} options
     *        The axis options.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart after adding.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        Whether and how to apply animation in the redraw. When
     *        `undefined`, it applies the animation that is set in the
     *        `chart.animation` option.
     *
     * @return {Highcharts.Axis}
     *         The newly generated Axis object.
     */
    public addColorAxis(
        options: ColorAxis.Options,
        redraw?: boolean,
        animation?: boolean
    ): Axis {
        return this.createAxis(
            'colorAxis',
            { axis: options, redraw: redraw, animation: animation }
        );
    }

    /**
     * Factory for creating different axis types.
     *
     * @private
     * @function Highcharts.Chart#createAxis
     *
     * @param {string} coll
     *        An axis type.
     *
     * @param {...Array<*>} arguments
     *        All arguments for the constructor.
     *
     * @return {Highcharts.Axis}
     *         The newly generated Axis object.
     */
    public createAxis(
        coll: AxisCollectionKey,
        options: Chart.CreateAxisOptionsObject
    ): Axis {
        const axis = new Axis(this, options.axis, coll);

        if (pick(options.redraw, true)) {
            this.redraw(options.animation);
        }

        return axis;
    }

    /**
     * Dim the chart and show a loading text or symbol. Options for the loading
     * screen are defined in {@link
     * https://api.highcharts.com/highcharts/loading|the loading options}.
     *
     * @sample highcharts/members/chart-hideloading/
     *         Show and hide loading from a button
     * @sample highcharts/members/chart-showloading/
     *         Apply different text labels
     * @sample stock/members/chart-show-hide-loading/
     *         Toggle loading in Highcharts Stock
     *
     * @function Highcharts.Chart#showLoading
     *
     * @param {string} [str]
     *        An optional text to show in the loading label instead of the
     *        default one. The default text is set in
     *        [lang.loading](https://api.highcharts.com/highcharts/lang.loading).
     */
    public showLoading(str?: string): void {
        const chart = this,
            options = chart.options,
            loadingOptions = options.loading,
            setLoadingSize = function (): void {
                if (loadingDiv) {
                    css(loadingDiv, {
                        left: chart.plotLeft + 'px',
                        top: chart.plotTop + 'px',
                        width: chart.plotWidth + 'px',
                        height: chart.plotHeight + 'px'
                    });
                }
            };

        let loadingDiv = chart.loadingDiv,
            loadingSpan = chart.loadingSpan;

        // Create the layer at the first call
        if (!loadingDiv) {
            chart.loadingDiv = loadingDiv = createElement('div', {
                className: 'highcharts-loading highcharts-loading-hidden'
            }, null as any, chart.container);
        }

        if (!loadingSpan) {
            chart.loadingSpan = loadingSpan = createElement(
                'span',
                { className: 'highcharts-loading-inner' },
                null as any,
                loadingDiv
            );
            addEvent(chart, 'redraw', setLoadingSize); // #1080
        }

        loadingDiv.className = 'highcharts-loading';

        // Update text
        AST.setElementHTML(
            loadingSpan,
            pick(str, options.lang.loading, '')
        );

        if (!chart.styledMode) {
            // Update visuals
            css(loadingDiv, extend((loadingOptions as any).style, {
                zIndex: 10
            }));
            css(loadingSpan, (loadingOptions as any).labelStyle);

            // Show it
            if (!chart.loadingShown) {
                css(loadingDiv, {
                    opacity: 0,
                    display: ''
                });
                animate(loadingDiv, {
                    opacity: (loadingOptions as any).style.opacity || 0.5
                }, {
                    duration: (loadingOptions as any).showDuration || 0
                });
            }
        }

        chart.loadingShown = true;
        setLoadingSize();
    }

    /**
     * Hide the loading layer.
     *
     * @see Highcharts.Chart#showLoading
     *
     * @sample highcharts/members/chart-hideloading/
     *         Show and hide loading from a button
     * @sample stock/members/chart-show-hide-loading/
     *         Toggle loading in Highcharts Stock
     *
     * @function Highcharts.Chart#hideLoading
     */
    public hideLoading(): void {
        const options = this.options,
            loadingDiv = this.loadingDiv;

        if (loadingDiv) {
            loadingDiv.className =
                'highcharts-loading highcharts-loading-hidden';

            if (!this.styledMode) {
                animate(loadingDiv, {
                    opacity: 0
                }, {
                    duration: (options.loading as any).hideDuration || 100,
                    complete: function (): void {
                        css(loadingDiv as any, { display: 'none' });
                    }
                });
            }
        }

        this.loadingShown = false;
    }

    /**
     * A generic function to update any element of the chart. Elements can be
     * enabled and disabled, moved, re-styled, re-formatted etc.
     *
     * A special case is configuration objects that take arrays, for example
     * [xAxis](https://api.highcharts.com/highcharts/xAxis),
     * [yAxis](https://api.highcharts.com/highcharts/yAxis) or
     * [series](https://api.highcharts.com/highcharts/series). For these
     * collections, an `id` option is used to map the new option set to an
     * existing object. If an existing object of the same id is not found, the
     * corresponding item is updated. So for example, running `chart.update`
     * with a series item without an id, will cause the existing chart's series
     * with the same index in the series array to be updated. When the
     * `oneToOne` parameter is true, `chart.update` will also take care of
     * adding and removing items from the collection. Read more under the
     * parameter description below.
     *
     * Note that when changing series data, `chart.update` may mutate the passed
     * data options.
     *
     * See also the
     * [responsive option set](https://api.highcharts.com/highcharts/responsive).
     * Switching between `responsive.rules` basically runs `chart.update` under
     * the hood.
     *
     * @sample highcharts/members/chart-update/
     *         Update chart geometry
     *
     * @function Highcharts.Chart#update
     *
     * @param {Highcharts.Options} options
     *        A configuration object for the new chart options.
     *
     * @param {boolean} [redraw=true]
     *        Whether to redraw the chart.
     *
     * @param {boolean} [oneToOne=false]
     *        When `true`, the `series`, `xAxis`, `yAxis` and `annotations`
     *        collections will be updated one to one, and items will be either
     *        added or removed to match the new updated options. For example,
     *        if the chart has two series and we call `chart.update` with a
     *        configuration containing three series, one will be added. If we
     *        call `chart.update` with one series, one will be removed. Setting
     *        an empty `series` array will remove all series, but leaving out
     *        the`series` property will leave all series untouched. If the
     *        series have id's, the new series options will be matched by id,
     *        and the remaining ones removed.
     *
     * @param {boolean|Partial<Highcharts.AnimationOptionsObject>} [animation]
     *        Whether to apply animation, and optionally animation
     *        configuration. When `undefined`, it applies the animation that is
     *        set in the `chart.animation` option.
     *
     * @emits Highcharts.Chart#event:update
     * @emits Highcharts.Chart#event:afterUpdate
     */
    public update(
        options: Partial<Options>,
        redraw?: boolean,
        oneToOne?: boolean,
        animation?: (boolean|Partial<AnimationOptions>)
    ): void {
        const chart = this,
            adders = {
                credits: 'addCredits',
                title: 'setTitle',
                subtitle: 'setSubtitle',
                caption: 'setCaption'
            } as Record<string, string>,
            isResponsiveOptions = options.isResponsiveOptions,
            itemsForRemoval = [] as Array<string>;

        let updateAllAxes,
            updateAllSeries,
            runSetSize;

        fireEvent(chart, 'update', { options: options });

        // If there are responsive rules in action, undo the responsive rules
        // before we apply the updated options and replay the responsive rules
        // on top from the chart.redraw function (#9617).
        if (!isResponsiveOptions) {
            chart.setResponsive(false, true);
        }

        options = diffObjects(options, chart.options);

        chart.userOptions = merge(chart.userOptions, options);

        // If the top-level chart option is present, some special updates are
        // required
        const optionsChart = options.chart;

        if (optionsChart) {
            merge(true, chart.options.chart, optionsChart);

            // Add support for deprecated zooming options like zoomType, #17861
            this.setZoomOptions();

            // Setter function
            if ('className' in optionsChart) {
                chart.setClassName(optionsChart.className);
            }

            if (
                'inverted' in optionsChart ||
                'polar' in optionsChart ||
                'type' in optionsChart
            ) {
                // Parse options.chart.inverted and options.chart.polar together
                // with the available series.
                chart.propFromSeries();
                updateAllAxes = true;
            }

            if ('alignTicks' in optionsChart) { // #6452
                updateAllAxes = true;
            }

            if ('events' in optionsChart) {
                // Chart event handlers
                registerEventOptions(this, optionsChart);
            }

            objectEach(optionsChart, function (val: any, key: string): void {
                if (
                    chart.propsRequireUpdateSeries.indexOf('chart.' + key) !==
                    -1
                ) {
                    updateAllSeries = true;
                }
                // Only dirty box
                if (chart.propsRequireDirtyBox.indexOf(key) !== -1) {
                    chart.isDirtyBox = true;
                }
                // Chart setSize
                if (
                    chart.propsRequireReflow.indexOf(key) !== -1
                ) {
                    chart.isDirtyBox = true;
                    if (!isResponsiveOptions) {
                        runSetSize = true;
                    }
                }
            });

            if (!chart.styledMode && optionsChart.style) {
                chart.renderer.setStyle(chart.options.chart.style || {});
            }
        }

        // Moved up, because tooltip needs updated plotOptions (#6218)
        if (!chart.styledMode && options.colors) {
            this.options.colors = options.colors;
        }

        // Some option structures correspond one-to-one to chart objects that
        // have update methods, for example
        // options.credits => chart.credits
        // options.legend => chart.legend
        // options.title => chart.title
        // options.tooltip => chart.tooltip
        // options.subtitle => chart.subtitle
        // options.mapNavigation => chart.mapNavigation
        // options.navigator => chart.navigator
        // options.scrollbar => chart.scrollbar
        objectEach(options, function (val, key): void {
            if (
                (chart as any)[key] &&
                typeof (chart as any)[key].update === 'function'
            ) {
                (chart as any)[key].update(val, false);

            // If a one-to-one object does not exist, look for an adder function
            } else if (typeof (chart as any)[adders[key]] === 'function') {
                (chart as any)[adders[key]](val);

            // Else, just merge the options. For nodes like loading, noData,
            // plotOptions
            } else if (
                key !== 'colors' &&
                chart.collectionsWithUpdate.indexOf(key) === -1
            ) {
                merge(true, (chart.options as any)[key], (options as any)[key]);
            }

            if (
                key !== 'chart' &&
                chart.propsRequireUpdateSeries.indexOf(key) !== -1
            ) {
                updateAllSeries = true;
            }
        });

        // Setters for collections. For axes and series, each item is referred
        // by an id. If the id is not found, it defaults to the corresponding
        // item in the collection, so setting one series without an id, will
        // update the first series in the chart. Setting two series without
        // an id will update the first and the second respectively (#6019)
        // chart.update and responsive.
        this.collectionsWithUpdate.forEach(function (coll: string): void {

            if ((options as any)[coll]) {

                splat((options as any)[coll]).forEach(function (
                    newOptions,
                    i
                ): void {
                    const hasId = defined(newOptions.id);
                    let item: (Axis|Series|Point|undefined);

                    // Match by id
                    if (hasId) {
                        item = chart.get(newOptions.id);
                    }

                    // No match by id found, match by index instead
                    if (!item && (chart as any)[coll]) {
                        item = (chart as any)[coll][pick(newOptions.index, i)];

                        // Check if we grabbed an item with an existing but
                        // different id (#13541). Check that the item in this
                        // position is not internal (navigator).
                        if (
                            item && (
                                (hasId && defined(item.options.id)) ||
                                (item as Axis|Series).options.isInternal
                            )
                        ) {
                            item = void 0;
                        }
                    }

                    if (item && (item as Axis|Series).coll === coll) {
                        item.update(newOptions, false);

                        if (oneToOne) {
                            item.touched = true;
                        }
                    }

                    // If oneToOne and no matching item is found, add one
                    if (!item && oneToOne && chart.collectionsWithInit[coll]) {
                        chart.collectionsWithInit[coll][0].apply(
                            chart,
                            // [newOptions, ...extraArguments, redraw=false]
                            [
                                newOptions
                            ].concat(
                                // Not all initializers require extra args
                                chart.collectionsWithInit[coll][1] || []
                            ).concat([
                                false
                            ])
                        ).touched = true;
                    }

                });

                // Add items for removal
                if (oneToOne) {
                    (chart as any)[coll].forEach(function (item: any): void {
                        if (!item.touched && !item.options.isInternal) {
                            itemsForRemoval.push(item);
                        } else {
                            delete item.touched;
                        }
                    });
                }


            }
        });

        itemsForRemoval.forEach(function (item: any): void {
            if (item.chart && item.remove) { // #9097, avoid removing twice
                item.remove(false);
            }
        });

        if (updateAllAxes) {
            chart.axes.forEach(function (axis): void {
                axis.update({}, false);
            });
        }

        // Certain options require the whole series structure to be thrown away
        // and rebuilt
        if (updateAllSeries) {
            chart.getSeriesOrderByLinks().forEach(function (series): void {
                // Avoid removed navigator series
                if (series.chart) {
                    series.update({}, false);
                }
            }, this);
        }

        // Update size. Redraw is forced.
        const newWidth = optionsChart?.width;
        const newHeight = optionsChart && (
            isString(optionsChart.height) ?
                relativeLength(
                    optionsChart.height,
                    newWidth || chart.chartWidth
                ) :
                optionsChart.height
        );

        if (
            // In this case, run chart.setSize with newWidth and newHeight which
            // are undefined, only for reflowing chart elements because margin
            // or spacing has been set (#8190)
            runSetSize ||

            // In this case, the size is actually set
            (isNumber(newWidth) && newWidth !== chart.chartWidth) ||
            (isNumber(newHeight) && newHeight !== chart.chartHeight)
        ) {
            chart.setSize(newWidth as number, newHeight as number, animation);
        } else if (pick(redraw, true)) {
            chart.redraw(animation);
        }

        fireEvent(chart, 'afterUpdate', {
            options: options,
            redraw: redraw,
            animation: animation
        });

    }

    /**
     * Shortcut to set the subtitle options. This can also be done from {@link
     * Chart#update} or {@link Chart#setTitle}.
     *
     * @function Highcharts.Chart#setSubtitle
     *
     * @param {Highcharts.SubtitleOptions} options
     *        New subtitle options. The subtitle text itself is set by the
     *        `options.text` property.
     */
    public setSubtitle(
        options: Chart.SubtitleOptions,
        redraw?: boolean
    ): void {
        this.applyDescription('subtitle', options);
        this.layOutTitles(redraw);
    }

    /**
     * Set the caption options. This can also be done from {@link
     * Chart#update}.
     *
     * @function Highcharts.Chart#setCaption
     *
     * @param {Highcharts.CaptionOptions} options
     *        New caption options. The caption text itself is set by the
     *        `options.text` property.
     */
    public setCaption(
        options: Chart.CaptionOptions,
        redraw?: boolean
    ): void {
        this.applyDescription('caption', options);
        this.layOutTitles(redraw);
    }

    /**
     * Display the zoom button, so users can reset zoom to the default view
     * settings.
     *
     * @function Highcharts.Chart#showResetZoom
     *
     * @emits Highcharts.Chart#event:afterShowResetZoom
     * @emits Highcharts.Chart#event:beforeShowResetZoom
     */
    public showResetZoom(): void {

        const chart = this,
            lang = defaultOptions.lang,
            btnOptions = chart.zooming.resetButton as any,
            theme = btnOptions.theme,
            alignTo = (
                btnOptions.relativeTo === 'chart' ||
                btnOptions.relativeTo === 'spacingBox' ?
                    null :
                    'plotBox'
            );

        /**
         * @private
         */
        function zoomOut(): void {
            chart.zoomOut();
        }

        fireEvent(this, 'beforeShowResetZoom', null as any, function (): void {
            chart.resetZoomButton = chart.renderer
                .button(
                    lang.resetZoom,
                    null as any,
                    null as any,
                    zoomOut,
                    theme
                )
                .attr({
                    align: btnOptions.position.align,
                    title: lang.resetZoomTitle
                })
                .addClass('highcharts-reset-zoom')
                .add()
                .align(btnOptions.position, false, alignTo as any);
        });

        fireEvent(this, 'afterShowResetZoom');
    }

    /**
     * Zoom the chart out after a user has zoomed in. See also
     * [Axis.setExtremes](/class-reference/Highcharts.Axis#setExtremes).
     *
     * @function Highcharts.Chart#zoomOut
     *
     * @emits Highcharts.Chart#event:selection
     */
    public zoomOut(): void {
        fireEvent(
            this,
            'selection',
            { resetSelection: true },
            (): boolean => this.transform({ reset: true, trigger: 'zoom' })
        );
    }

    /**
     * Pan the chart by dragging the mouse across the pane. This function is
     * called on mouse move, and the distance to pan is computed from chartX
     * compared to the first chartX position in the dragging operation.
     *
     * @private
     * @function Highcharts.Chart#pan
     * @param {Highcharts.PointerEventObject} event
     * @param {string} panning
     */
    public pan(
        event: PointerEvent,
        panning: ChartPanningOptions|boolean
    ): void {
        const chart = this,
            panningOptions: ChartPanningOptions = (
                typeof panning === 'object' ?
                    panning :
                    {
                        enabled: panning,
                        type: 'x'
                    }
            ),
            type = panningOptions.type,
            axes = type && chart[{
                x: 'xAxis',
                xy: 'axes',
                y: 'yAxis'
            }[type] as ('axes'|'xAxis'|'yAxis')]
                .filter((axis): boolean =>
                    axis.options.panningEnabled && !axis.options.isInternal
                ),
            chartOptions = chart.options.chart;

        if (chartOptions?.panning) {
            chartOptions.panning = panningOptions;
        }

        fireEvent(this, 'pan', { originalEvent: event }, (): void => {
            chart.transform({
                axes,
                event,
                to: {
                    x: event.chartX - (chart.mouseDownX || 0),
                    y: event.chartY - (chart.mouseDownY || 0)
                },
                trigger: 'pan'
            });
            css(chart.container, { cursor: 'move' });
        });
    }

    /**
     * Pan and scale the chart. Used internally by mouse-pan, touch-pan,
     * touch-zoom, and mousewheel zoom.
     *
     * The main positioning logic is created around two imaginary boxes. What is
     * currently within the `from` rectangle, should be transformed to fill up
     * the `to` rectangle.
     * - In a mouse zoom, the `from` rectangle is the selection, while the `to`
     *   rectangle is the full plot area.
     * - In a touch zoom, the `from` rectangle is made up of the last two-finger
     *   touch, while the `to`` rectangle is the current touch.
     * - In a mousewheel zoom, the `to` rectangle is a 10x10 px square,
     *   while the `to` rectangle reflects the scale around that.
     *
     * @private
     * @function Highcharts.Chart#transform
     */
    public transform(params: Chart.ChartTransformParams): boolean {
        const {
                axes = this.axes,
                event,
                from = {},
                reset,
                selection,
                to = {},
                trigger
            } = params,
            { inverted, time } = this;

        // Remove active points for shared tooltip
        this.hoverPoints?.forEach((point): void => point.setState());

        fireEvent(this, 'transform', params);

        let hasZoomed = params.hasZoomed || false,
            displayButton: boolean|undefined,
            isAnyAxisPanning: true|undefined;

        for (const axis of axes) {
            const {
                    horiz,
                    len,
                    minPointOffset = 0,
                    options,
                    reversed
                } = axis,
                wh = horiz ? 'width' : 'height',
                xy = horiz ? 'x' : 'y',
                toLength = pick(to[wh], axis.len),
                fromLength = pick(from[wh], axis.len),
                // If fingers pinched very close on this axis, treat as pan
                scale = Math.abs(toLength) < 10 ?
                    1 :
                    toLength / fromLength,
                fromCenter = (from[xy] || 0) + fromLength / 2 - axis.pos,
                toCenter = (to[xy] ?? axis.pos) +
                    toLength / 2 - axis.pos,
                move = fromCenter - toCenter / scale,
                pointRangeDirection =
                    (reversed && !inverted) ||
                    (!reversed && inverted) ?
                        -1 :
                        1,
                minPx = move;

            // Zooming in multiple panes, zoom only in the pane that receives
            // the input
            if (!reset && (fromCenter < 0 || fromCenter > axis.len)) {
                continue;
            }

            // Adjust offset to ensure selection zoom triggers correctly
            // (#22945)
            const offset = (axis.chart.polar || axis.isOrdinal) ?
                    0 :
                    (minPointOffset * pointRangeDirection || 0),
                eventMin = axis.toValue(minPx, true),
                eventMax = axis.toValue(minPx + len / scale, true);

            let newMin = eventMin + offset,
                newMax = eventMax - offset,
                allExtremes = axis.allExtremes;

            if (selection) {
                selection[axis.coll as 'xAxis' | 'yAxis'].push({
                    axis,
                    min: Math.min(eventMin, eventMax),
                    max: Math.max(eventMin, eventMax)
                });
            }

            if (newMin > newMax) {
                [newMin, newMax] = [newMax, newMin];
            }

            // General calculations of the full data extremes. It is calculated
            // on the first call to transform, then reused for subsequent
            // touch/pan calls. (#11315).
            if (
                scale === 1 &&
                !reset &&
                axis.coll === 'yAxis' &&
                !allExtremes
            ) {
                for (const series of axis.series) {
                    const seriesExtremes = series.getExtremes(
                        series.getProcessedData(true).modified
                            .getColumn('y') as Array<number> || [],
                        true
                    );

                    allExtremes ??= {
                        dataMin: Number.MAX_VALUE,
                        dataMax: -Number.MAX_VALUE
                    };

                    if (
                        isNumber(seriesExtremes.dataMin) &&
                        isNumber(seriesExtremes.dataMax)
                    ) {
                        allExtremes.dataMin = Math.min(
                            seriesExtremes.dataMin,
                            allExtremes.dataMin
                        );
                        allExtremes.dataMax = Math.max(
                            seriesExtremes.dataMax,
                            allExtremes.dataMax
                        );
                    }
                }
                axis.allExtremes = allExtremes;
            }

            const { dataMin, dataMax, min, max } = extend(
                    axis.getExtremes(),
                    allExtremes || {}
                ),

                optionsMin = time.parse(options.min),
                optionsMax = time.parse(options.max),

                // For boosted chart where data extremes are skipped
                safeDataMin = dataMin ?? optionsMin,
                safeDataMax = dataMax ?? optionsMax,

                range = newMax - newMin,
                padRange = axis.categories ? 0 : Math.min(
                    range,
                    safeDataMax - safeDataMin
                ),
                paddedMin = safeDataMin - padRange * (
                    defined(optionsMin) ? 0 : options.minPadding
                ),
                paddedMax = safeDataMax + padRange * (
                    defined(optionsMax) ? 0 : options.maxPadding
                ),

                // We're allowed to zoom outside the data extremes if we're
                // dealing with a bubble chart, if we're panning, or if we're
                // pinching or mousewheeling in.
                allowZoomOutside = axis.allowZoomOutside ||
                    scale === 1 ||
                    (trigger !== 'zoom' && scale > 1),

                // Calculate the floor and the ceiling
                floor = Math.min(
                    optionsMin ?? paddedMin,
                    paddedMin,
                    allowZoomOutside ? min : paddedMin
                ),
                ceiling = Math.max(
                    optionsMax ?? paddedMax,
                    paddedMax,
                    allowZoomOutside ? max : paddedMax
                );

            // It is not necessary to calculate extremes on ordinal axis,
            // because they are already calculated, so we don't want to override
            // them.
            if (!axis.isOrdinal || scale !== 1 || reset) {
                // If the new range spills over, either to the min or max,
                // adjust it.
                if (newMin < floor) {
                    newMin = floor;
                    if (scale >= 1) {
                        newMax = newMin + range;
                    }
                }

                if (newMax > ceiling) {
                    newMax = ceiling;
                    if (scale >= 1) {
                        newMin = newMax - range;
                    }
                }

                // Set new extremes if they are actually new
                if (
                    reset || (
                        axis.series.length &&
                        (newMin !== min || newMax !== max) &&
                        newMin >= floor &&
                        newMax <= ceiling
                    )
                ) {
                    if (selection) {
                        selection[axis.coll as 'xAxis'|'yAxis'].push({
                            axis,
                            min: newMin,
                            max: newMax
                        });
                    } else {

                        // Temporarily flag the axis as `isPanning` in order to
                        // disallow certain axis padding options that would make
                        // panning/zooming hard. Reset and redraw after the
                        // operation has finished.
                        axis.isPanning = trigger !== 'zoom';

                        if (axis.isPanning) {
                            isAnyAxisPanning = true; // #21319
                        }

                        axis.setExtremes(
                            reset ? void 0 : newMin,
                            reset ? void 0 : newMax,
                            false,
                            false,
                            { move, trigger, scale }
                        );

                        if (
                            !reset &&
                            (newMin > floor || newMax < ceiling) &&
                            trigger !== 'mousewheel'
                        ) {
                            displayButton = true;
                        }
                    }

                    hasZoomed = true;
                }

                // Show the resetZoom button for non-cartesian series,
                // except when triggered by mouse wheel zoom
                if (
                    !this.hasCartesianSeries &&
                    !reset &&
                    trigger !== 'mousewheel'
                ) {
                    displayButton = true;
                }

                if (event) {
                    this[horiz ? 'mouseDownX' : 'mouseDownY'] =
                        event[horiz ? 'chartX' : 'chartY'];
                }
            }
        }

        if (hasZoomed) {
            if (selection) {
                fireEvent(
                    this,
                    'selection',
                    selection,
                    // Run transform again, this time without the selection data
                    // so that the transform is applied.
                    (): void => {
                        delete params.selection;
                        params.trigger = 'zoom';
                        this.transform(params);
                    }
                );
            } else {

                // Show or hide the Reset zoom button, but not while panning
                if (
                    displayButton &&
                    !isAnyAxisPanning &&
                    !this.resetZoomButton
                ) {
                    this.showResetZoom();
                } else if (!displayButton && this.resetZoomButton) {
                    this.resetZoomButton = this.resetZoomButton.destroy();
                }

                this.redraw(
                    trigger === 'zoom' &&
                    (this.options.chart.animation ?? this.pointCount < 100)
                );
            }
        }
        return hasZoomed;
    }

}

/* *
 *
 *  Class Prototype
 *
 * */

interface Chart extends ChartLike {
    callbacks: Array<Chart.CallbackFunction>;
    collectionsWithInit: Record<string, [Function, Array<any>?]>;
    collectionsWithUpdate: Array<string>;
    propsRequireDirtyBox: Array<string>;
    propsRequireReflow: Array<string>;
    propsRequireUpdateSeries: Array<string>;
}
extend(Chart.prototype, {
    // Hook for adding callbacks in modules
    callbacks: [],

    /**
     * These collections (arrays) implement `Chart.addSomething` method used in
     * chart.update() to create new object in the collection. Equivalent for
     * deleting is resolved by simple `Something.remove()`.
     *
     * Note: We need to define these references after initializers are bound to
     * chart's prototype.
     *
     * @private
     */
    collectionsWithInit: {
        // CollectionName: [ initializingMethod, [extraArguments] ]
        xAxis: [Chart.prototype.addAxis, [true]],
        yAxis: [Chart.prototype.addAxis, [false]],
        series: [Chart.prototype.addSeries]
    },

    /**
     * These collections (arrays) implement update() methods with support for
     * one-to-one option.
     * @private
     */
    collectionsWithUpdate: [
        'xAxis',
        'yAxis',
        'series'
    ],

    /**
     * These properties cause isDirtyBox to be set to true when updating. Can be
     * extended from plugins.
     * @private
     */
    propsRequireDirtyBox: [
        'backgroundColor',
        'borderColor',
        'borderWidth',
        'borderRadius',
        'plotBackgroundColor',
        'plotBackgroundImage',
        'plotBorderColor',
        'plotBorderWidth',
        'plotShadow',
        'shadow'
    ],

    /**
     * These properties require a full reflow of chart elements, best
     * implemented through running `Chart.setSize` internally (#8190).
     * @private
     */
    propsRequireReflow: [
        'margin',
        'marginTop',
        'marginRight',
        'marginBottom',
        'marginLeft',
        'spacing',
        'spacingTop',
        'spacingRight',
        'spacingBottom',
        'spacingLeft'
    ],

    /**
     * These properties cause all series to be updated when updating. Can be
     * extended from plugins.
     * @private
     */
    propsRequireUpdateSeries: [
        'chart.inverted',
        'chart.polar',
        'chart.ignoreHiddenSeries',
        'chart.type',
        'colors',
        'plotOptions',
        'time',
        'tooltip'
    ]
});

/* *
 *
 *  Class Namespace
 *
 * */

namespace Chart {

    export interface AfterUpdateEventObject {
        animation: (boolean|Partial<AnimationOptions>);
        options: Options;
        redraw: boolean;
    }

    export interface CallbackFunction {
        (this: Chart, chart: Chart): void;
    }

    export interface CaptionOptions {
        align?: AlignValue;
        floating?: boolean;
        margin?: number;
        style: CSSObject;
        text?: string;
        useHTML?: boolean;
        verticalAlign?: VerticalAlignValue;
        width?: number;
        x?: number;
        y?: number;
        zIndex?: number;
    }

    export interface ChartTransformParams {
        axes?: Array<Axis>;
        event?: PointerEvent;
        to?: Partial<BBoxObject>;
        reset?: boolean;
        selection?: Pointer.SelectEventObject;
        from?: Partial<BBoxObject>;
        trigger?: string;
        hasZoomed?: boolean;
    }

    export interface CreateAxisOptionsObject {
        animation: (undefined|boolean|Partial<AnimationOptions>);
        axis: (DeepPartial<AxisOptions>|DeepPartial<ColorAxis.Options>);
        redraw: (undefined|boolean);
    }

    export interface CreditsOptions {
        enabled?: boolean;
        href?: string;
        mapText?: string;
        mapTextFull?: string;
        position?: AlignObject;
        style: CSSObject;
        text?: string;
    }

    export type DescriptionOptionsType = (
        TitleOptions|SubtitleOptions|CaptionOptions
    );

    export type DescriptionKey = 'title'|'subtitle'|'caption';

    export interface IsInsideOptionsObject {
        axis?: Axis;
        ignoreX?: boolean;
        ignoreY?: boolean;
        inverted?: boolean;
        paneCoordinates?: boolean;
        series?: Series;
        visiblePlotOnly?: boolean;
    }

    export interface LabelCollectorFunction {
        (): (Array<(SVGElement|undefined)>|undefined);
    }

    export interface LayoutTitleEventObject {
        alignTo: BBoxObject;
        key: Chart.DescriptionKey;
        textPxLength: number;
    }
    export interface Renderer extends SVGRenderer {
        plotBox: BBoxObject;
        spacingBox: BBoxObject;
    }

    export interface SubtitleOptions {
        align?: AlignValue;
        floating?: boolean;
        style: CSSObject;
        text?: string;
        useHTML?: boolean;
        verticalAlign?: VerticalAlignValue;
        width?: number;
        x?: number;
        y?: number;
        zIndex?: number;
    }

    export interface TitleOptions {
        align?: AlignValue;
        floating?: boolean;
        margin?: number;
        minScale?: number;
        style: CSSObject;
        text?: string;
        useHTML?: boolean;
        verticalAlign?: VerticalAlignValue;
        width?: number;
        x?: number;
        y?: number;
        zIndex?: number;
    }
}

/* *
 *
 *  Default Export
 *
 * */

export default Chart;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Callback for chart constructors.
 *
 * @callback Highcharts.ChartCallbackFunction
 *
 * @param {Highcharts.Chart} chart
 *        Created chart.
 */

/**
 * Format a number and return a string based on input settings.
 *
 * @callback Highcharts.NumberFormatterCallbackFunction
 *
 * @param {number} number
 *        The input number to format.
 *
 * @param {number} decimals
 *        The amount of decimals. A value of -1 preserves the amount in the
 *        input number.
 *
 * @param {string} [decimalPoint]
 *        The decimal point, defaults to the one given in the lang options, or
 *        a dot.
 *
 * @param {string} [thousandsSep]
 *        The thousands separator, defaults to the one given in the lang
 *        options, or a space character.
 *
 * @return {string} The formatted number.
 */

/**
 * The chart title. The title has an `update` method that allows modifying the
 * options directly or indirectly via `chart.update`.
 *
 * @interface Highcharts.TitleObject
 * @extends Highcharts.SVGElement
 *//**
 * Modify options for the title.
 *
 * @function Highcharts.TitleObject#update
 *
 * @param {Highcharts.TitleOptions} titleOptions
 *        Options to modify.
 *
 * @param {boolean} [redraw=true]
 *        Whether to redraw the chart after the title is altered. If doing more
 *        operations on the chart, it is a good idea to set redraw to false and
 *        call {@link Chart#redraw} after.
 */

/**
 * The chart subtitle. The subtitle has an `update` method that
 * allows modifying the options directly or indirectly via
 * `chart.update`.
 *
 * @interface Highcharts.SubtitleObject
 * @extends Highcharts.SVGElement
 *//**
 * Modify options for the subtitle.
 *
 * @function Highcharts.SubtitleObject#update
 *
 * @param {Highcharts.SubtitleOptions} subtitleOptions
 *        Options to modify.
 *
 * @param {boolean} [redraw=true]
 *        Whether to redraw the chart after the subtitle is altered. If doing
 *        more operations on the chart, it is a good idea to set redraw to false
 *        and call {@link Chart#redraw} after.
 */

/**
 * The chart caption. The caption has an `update` method that
 * allows modifying the options directly or indirectly via
 * `chart.update`.
 *
 * @interface Highcharts.CaptionObject
 * @extends Highcharts.SVGElement
 *//**
 * Modify options for the caption.
 *
 * @function Highcharts.CaptionObject#update
 *
 * @param {Highcharts.CaptionOptions} captionOptions
 *        Options to modify.
 *
 * @param {boolean} [redraw=true]
 *        Whether to redraw the chart after the caption is altered. If doing
 *        more operations on the chart, it is a good idea to set redraw to false
 *        and call {@link Chart#redraw} after.
 */

/**
 * @interface Highcharts.ChartIsInsideOptionsObject
 *//**
 * @name Highcharts.ChartIsInsideOptionsObject#axis
 * @type {Highcharts.Axis|undefined}
 *//**
 * @name Highcharts.ChartIsInsideOptionsObject#ignoreX
 * @type {boolean|undefined}
 *//**
 * @name Highcharts.ChartIsInsideOptionsObject#ignoreY
 * @type {boolean|undefined}
 *//**
 * @name Highcharts.ChartIsInsideOptionsObject#inverted
 * @type {boolean|undefined}
 *//**
 * @name Highcharts.ChartIsInsideOptionsObject#paneCoordinates
 * @type {boolean|undefined}
 *//**
 * @name Highcharts.ChartIsInsideOptionsObject#series
 * @type {Highcharts.Series|undefined}
 *//**
 * @name Highcharts.ChartIsInsideOptionsObject#visiblePlotOnly
 * @type {boolean|undefined}
 */

''; // Keeps doclets above in JS file
