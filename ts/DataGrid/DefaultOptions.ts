/* *
 *
 *  DataGrid default options
 *
 *  (c) 2009-2024 Highsoft AS
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 *  Authors:
 *  - Dawid Dragula
 *  - Sebastian Bochan
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type Options from './Options';

import Globals from './Globals.js';

/* *
 *
 *  API Options
 *
 * */

const DefaultOptions: Globals.DeepPartial<Options> = {
    accessibility: {
        enabled: true
    },
    lang: {
        accessibility: {
            cellEditing: {
                editable: 'Editable.',
                announcements: {
                    enabled: true,
                    started: 'Entered cell editing mode.',
                    edited: 'Edited cell value.',
                    cancelled: 'Editing canceled.'
                }
            },
            sorting: {
                sortable: 'Sortable column header.',
                announcements: {
                    enabled: true,
                    ascending: 'Sorted ascending.',
                    descending: 'Sorted descending.',
                    none: 'Not sorted.'
                }
            }
        },
        noData: 'No data to display'
    },
    rendering: {
        columns: {
            distribution: 'full'
        },
        rows: {
            bufferSize: 10,
            strictHeights: false
        },
        header: {
            enabled: true
        }
    },
    credits: {
        enabled: true,
        text: 'Highcharts.com',
        href: 'https://www.highcharts.com?credits',
        position: 'bottom'
    },
    columnDefaults: {
        sorting: {
            sortable: true
        },
        resizing: true
    }
};

/* *
 *
 *  Default Export
 *
 * */

export default DefaultOptions;
