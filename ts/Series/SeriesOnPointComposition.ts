/* *
 *
 *  (c) 2010-2022 Rafal Sebestjanski, Piotr Madej
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

import type SVGAttributes from '../Core/Renderer/SVG/SVGAttributes';

import Point from '../Core/Series/Point.js';
import Series from '../Core/Series/Series.js';
import SeriesRegistry from '../Core/Series/SeriesRegistry.js';
import SVGRenderer from '../Core/Renderer/SVG/SVGRenderer.js';

const { bubble, pie, sunburst } = SeriesRegistry.seriesTypes;
import CU from './CenteredUtilities.js';
const { getCenter } = CU;

const drawPointsFunctions = {
    pieDrawPoints: pie.prototype.drawPoints,
    sunburstDrawPoints: sunburst && sunburst.prototype.drawPoints
};

const translateFunctions = {
    pieTranslate: pie.prototype.translate,
    sunburstTranslate: sunburst && sunburst.prototype.translate
};

import U from '../Core/Utilities.js';
import Chart from '../Core/Chart/Chart';
const {
    addEvent,
    defined,
    isNumber
} = U;

/* *
 *
 *  Declarations
 *
 * */

type BubblePxExtremes = { minPxSize: number; maxPxSize: number };
type BubbleZExtremes = { zMin: number; zMax: number };

declare module '../Core/Series/SeriesLike' {
    interface SeriesLike {
        onPoint?: SeriesOnPointComposition.Additions;
        getConnectorAttributes(): SVGAttributes|void;
        getRadii(
            zMin: number,
            zMax: number,
            minSize: number,
            maxSize: number
        ): void;
        getRadius(
            zMin: number,
            zMax: number,
            minSize: number,
            maxSize: number,
            value: (number|null|undefined),
            yValue?: (number|null|undefined)
        ): (number|null);
        getPxExtremes(): BubblePxExtremes;
        getZExtremes(): BubbleZExtremes|undefined;
        seriesDrawConnector(): void;
    }
}

declare module '../Core/Series/SeriesOptions' {
    interface SeriesOptions {
        onPoint?: OnPoint;
    }
}

interface OnPoint {
    connectorOptions?: SVGAttributes;
    id: string;
    position?: Position;
    z?: number;
}

interface Position {
    x?: number
    y?: number;
    offsetX?: number;
    offsetY?: number;
}

/* *
 *
 *  Composition
 *
 * */

namespace SeriesOnPointComposition {

    /* *
     *
     *  Declarations
     *
     * */

    export declare class SeriesComposition extends Series {
        onPoint: Additions;
    }

    /* *
     *
     *  Constants
     *
     * */

    const composedClasses: Array<Function> = [];

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Extends the series with a small addition.
     *
     * @private
     *
     * @param SeriesClass
     * Series class to use.
     *
     * @param ChartClass
     * Chart class to use.
     */
    export function compose<T extends typeof Series>(
        SeriesClass: T,
        ChartClass: typeof Chart
    ): (typeof SeriesComposition&T) {
        if (composedClasses.indexOf(SeriesClass) === -1) {
            composedClasses.push(SeriesClass);

            const seriesProto = SeriesClass.prototype as SeriesComposition,
                bubbleProto = bubble.prototype;

            seriesProto.getConnectorAttributes = getConnectorAttributes;
            seriesProto.seriesDrawConnector = seriesDrawConnector;

            pie.prototype.getCenter = seriesGetCenter;
            pie.prototype.drawPoints = seriesDrawPoints;
            pie.prototype.translate = seriesTranslate;
            pie.prototype.bubblePadding = true;
            pie.prototype.useMapGeometry = true;
            pie.prototype.getRadius = bubbleProto.getRadius;
            pie.prototype.getRadii = bubbleProto.getRadii;
            pie.prototype.getZExtremes = bubbleProto.getZExtremes;
            pie.prototype.getPxExtremes = bubbleProto.getPxExtremes;

            if (sunburst) {
                sunburst.prototype.getCenter = seriesGetCenter;
                sunburst.prototype.drawPoints = seriesDrawPoints;
                sunburst.prototype.translate = seriesTranslate;
                sunburst.prototype.bubblePadding = true;
                sunburst.prototype.useMapGeometry = true;
                sunburst.prototype.getRadius = bubbleProto.getRadius;
                sunburst.prototype.getRadii = bubbleProto.getRadii;
                sunburst.prototype.getZExtremes = bubbleProto.getZExtremes;
                sunburst.prototype.getPxExtremes = bubbleProto.getPxExtremes;
            }

            addEvent(SeriesClass, 'afterInit', afterInit);
            addEvent(SeriesClass, 'update', update);
        }

        if (composedClasses.indexOf(ChartClass) === -1) {
            composedClasses.push(ChartClass);

            addEvent(ChartClass, 'beforeRender', getZData);
            addEvent(ChartClass, 'beforeRedraw', getZData);
        }

        return SeriesClass as (typeof SeriesComposition&T);
    }

    /**
     * @ignore
     * @function Highcharts.Chart#getZData
     */
    function getZData(this: Chart): void {
        const zData: Array<number|null> = [];

        this.series.forEach((series: Series): void => {
            const onPointOpts = series.options.onPoint;

            zData.push(onPointOpts && onPointOpts.z ? onPointOpts.z : null);
        });

        this.series.forEach((series: Series): void => {
            // Save z values of all the series
            series.zData = zData;
        });
    }

    /**
     * Clear bubbleZExtremes to reset z calculations on update.
     *
     * @ignore
    */
    function update(this: Series): void {
        delete this.chart.bubbleZExtremes;
    }

    /**
     * Initialize Series on point on series init.
     *
     * @ignore
    */
    function afterInit(this: Series): void {
        if (this.options.onPoint) {
            this.onPoint = new Additions(this as SeriesComposition);
        }
    }

    /**
     * Fire series.getRadii method to calculate required z data before original
     * translate.
     *
     * @ignore
     * @function Highcharts.Series#translate
    */
    function seriesTranslate(this: Series): void {
        this.getRadii(0, 0, 0, 0);

        (translateFunctions as any)[this.type + 'Translate'].call(this);
    }

    /**
     * Recalculate series.center (x, y and size).
     *
     * @ignore
     * @function Highcharts.Series#getCenter
    */
    function seriesGetCenter(this: Series): Array<number> {
        const onPointOptions = this.options.onPoint;

        let ret = getCenter.call(this);

        if (onPointOptions) {
            const connectedPoint = this.chart.get(onPointOptions.id);

            if (
                connectedPoint instanceof Point &&
                defined(connectedPoint.plotX) &&
                defined(connectedPoint.plotY)
            ) {
                ret[0] = connectedPoint.plotX;
                ret[1] = connectedPoint.plotY;
            }

            const position = onPointOptions.position;

            if (position) {
                if (defined(position.x)) {
                    ret[0] = position.x;
                }

                if (defined(position.y)) {
                    ret[1] = position.y;
                }

                if (position.offsetX) {
                    ret[0] += position.offsetX;
                }

                if (position.offsetY) {
                    ret[1] += position.offsetY;
                }
            }
        }

        // Get and set the size
        const radius = this.radii && this.radii[this.index];

        if (isNumber(radius)) {
            ret[2] = radius * 2;
        }

        return ret;
    }

    /**
     * Get connector line path and styles that connects series and point.
     *
     * @private
     *
     * @return {Highcharts.SVGAttributes} attribs - the path and styles.
     */
    function getConnectorAttributes(this: Series): SVGAttributes|void {
        const chart = this.chart,
            onPointOptions = this.options.onPoint;

        if (onPointOptions) {
            const connectorOpts = onPointOptions.connectorOptions,
                position = onPointOptions.position,
                connectedPoint = chart.get(onPointOptions.id);

            if (
                connectedPoint instanceof Point &&
                position &&
                defined(connectedPoint.plotX) &&
                defined(connectedPoint.plotY)
            ) {
                const xFrom = defined(position.x) ?
                        position.x :
                        connectedPoint.plotX,
                    yFrom = defined(position.y) ?
                        position.y :
                        connectedPoint.plotY,
                    xTo = xFrom + (position.offsetX || 0),
                    yTo = yFrom + (position.offsetY || 0),
                    width = (connectorOpts && connectorOpts.width) || 1,
                    color =
                        (connectorOpts && (connectorOpts as any).color) ||
                        this.color,
                    dashStyle =
                        connectorOpts && (connectorOpts as any).dashStyle;

                let attribs: SVGAttributes = {
                    d: SVGRenderer.prototype.crispLine([
                        ['M', xFrom, yFrom],
                        ['L', xTo, yTo]
                    ], width, 'ceil')
                };

                attribs['stroke-width'] = width;

                if (!chart.styledMode) {
                    attribs.stroke = color;
                    attribs.dashstyle = dashStyle;
                }

                return attribs;
            }
        }
    }

    /**
     * Draw connector line that connects series and initial point's position.
     * @private
     */
    function seriesDrawConnector(this: Series): void {
        if (this.onPoint) {
            if (!this.onPoint.connector) {
                (this.onPoint.connector as any) = this.chart.renderer.path()
                    .addClass('highcharts-connector-seriespoint')
                    .attr({
                        zIndex: -1
                    })
                    .add(this.markerGroup);
            }

            const attribs = this.getConnectorAttributes();
            if (this.onPoint.connector) {
                (this.onPoint.connector as any)['attr'](attribs);
            }
        }
    }

    function seriesDrawPoints(this: Series): void {
        (drawPointsFunctions as any)[this.type + 'DrawPoints'].call(this);

        this.seriesDrawConnector();
    }

    /* *
     *
     *  Classes
     *
     * */

    /**
     * @private
     */
    export class Additions {

        /* *
         *
         *  Constructors
         *
         * */

        /**
         * @private
         */
        public constructor(series: SeriesComposition) {
            this.series = series;
            this.options = series.options.onPoint;
        }

        /* *
         *
         *  Properties
         *
         * */

        public series: SeriesComposition;

        public connector?: SVGElement = void 0 as any;

        public options?: OnPoint;
    }

}

/* *
 *
 *  Default Export
 *
 * */

export default SeriesOnPointComposition;

/* *
 *
 *  API Options
 *
 * */

/**
 * Color of a connector line. By default it's the series' color.
 *
 * @requires    modules/series-on-point
 * @since       next
 * @type        {string}
 * @apioption   plotOptions.series.onPoint.connectorOptions.color
 */

/**
 * A name for the dash style to use for connector.
 *
 * @requires    modules/series-on-point
 * @since       next
 * @type        string
 * @apioption   plotOptions.series.onPoint.connectorOptions.dashStyle
 */

/**
 * Pixel width of a connector line.
 *
 * @default     1
 * @requires    modules/series-on-point
 * @type        {number}
 * @since       next
 * @product     highcharts highstock
 * @apioption   plotOptions.series.onPoint.connectorOptions.width
*/

/**
 * An id of the point that we connect series to.

 * @requires   modules/series-on-point
 * @since      next
 * @type       {string}
 * @apioption  plotOptions.series.onPoint.id
 */

/**
 * Series center offset from the original x position. If defined, the connector
 * line is drawn connecting original position with new position.
 *
 * @requires   modules/series-on-point
 * @since      next
 * @type       {number}
 * @apioption  plotOptions.series.onPoint.position.offsetX
 */

/**
 * Series center offset from the original y position. If defined, the connector
 * line is drawn from original position to a new position.
 *
 * @requires   modules/series-on-point
 * @since      next
 * @type       {number}
 * @apioption  plotOptions.series.onPoint.position.offsetY
 */

/**
 * X position of the series center. By default, the series is displayed on a
 * point that it's connected to.
 *
 * @requires   modules/series-on-point
 * @since      next
 * @type       {number}
 * @apioption  plotOptions.series.onPoint.position.x
 */

/**
 * Y position of the series center. By default, the series is displayed on a
 * point that it's connected to.
 *
 * @requires   modules/series-on-point
 * @since      next
 * @type       {number}
 * @apioption  plotOptions.series.onPoint.position.y
 */

''; // keeps doclets above in transpiled file
