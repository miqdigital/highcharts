/*
 * Copyright (C) Highsoft AS
 */

const gulp = require('gulp');

/**
 * Checks if docs are pointing to existing samples/docs.
 * @async
 * @return {Promise<void>}
 */
async function checkDocsConsistency() {
    const FS = require('fs');
    const FSLib = require('../libs/fs');
    const glob = require('glob');
    const LogLib = require('../libs/log');

    function checkSample(sample, file, error404s, reason) {
        let rewrite;

        if (sample.startsWith('grid/')) {
            rewrite = sample.replace(/^grid\//, 'grid*/');
        }
        const files = glob.globSync(`samples/${rewrite ?? sample}/demo.{js,mjs,ts}`);
        if (files.length < 1) {
            error404s.push({ file, sample, reason, rewrite });
        }
    }

    // Check links and references to samples
    LogLib.message('Checking links to samples in *.ts files...');
    const tsFiles = glob.sync('./ts/**/*.ts');
    if (!tsFiles.length) {
        throw new Error(
            'No .ts files found!'
        );
    }
    tsFiles.forEach(file => {
        file = FSLib.path(file, true);
        const md = FS.readFileSync(file),
            demoPattern = /(https:\/\/jsfiddle.net\/gh\/get\/library\/pure\/highcharts\/highcharts\/tree\/master\/samples|https:\/\/www.highcharts.com\/samples\/embed)\/([a-z0-9\-]+\/[a-z0-9\-]+\/[a-z0-9\-]+)/gu,
            requiresPattern = /@requires[ ]*([a-z0-9\-\/\.:]+)/gu,
            samplePattern = /@sample[ ]*(\{(highcharts|highstock|highmaps|gantt)\})? ([a-z0-9\-]+\/[a-z0-9\-]+\/[a-z0-9\-]+)/gu,
            error404s = [];

        let match;
        while ((match = demoPattern.exec(md))) {
            const sample = match[2].replace(/\/$/u, '');

            checkSample(sample, file, error404s, 'demo');
        }

        while ((match = requiresPattern.exec(md))) {
            let requires = match[1]
                .replace(/^(stock|maps|gantt)\//u, '');

            // The @require tags in the master files are relative to the npm
            // package root (#21470)
            if (
                file.startsWith('ts/masters/') &&
                requires !== 'highcharts'
            ) {
                if (requires.startsWith('highcharts/')) {
                    requires = requires.replace('highcharts/', '');
                } else {
                    error404s.push({ file, requires });
                }
            }

            try {
                FS.statSync(`ts/masters/${requires}.src.ts`);
            } catch (e1) {
                try {
                    FS.statSync(`ts/masters-dashboards/${requires}.src.ts`);
                } catch (e2) {
                    error404s.push({ file, requires });
                }
            }
        }

        while ((match = samplePattern.exec(md))) {
            const sample = match[3].replace(/\/$/u, '');
            checkSample(sample, file, error404s, '@sample');
        }
        if (error404s.length) {
            throw new Error(
                'Rotten links\n' + JSON.stringify(error404s, null, '  ')
            );
        }
    });

    LogLib.message('Checking links to samples in *.md files...');
    const mdFiles = glob.sync('./docs/**/*.md');
    if (!mdFiles.length) {
        throw new Error(
            'No .md files found!'
        );
    }
    mdFiles.forEach(file => {
        const md = FS.readFileSync(file),
            demoPattern = /(https:\/\/jsfiddle.net\/gh\/get\/library\/pure\/highcharts\/highcharts\/tree\/master\/samples|https:\/\/www.highcharts.com\/samples\/embed)\/([a-z0-9\-]+\/[a-z0-9\-]+\/[a-z0-9\-]+)/gu,
            docsPattern = /https:\/\/(www\.)?highcharts.com\/docs\/((?:[\w-]+\/)+[\w-]+)/gu,
            // Catch unsafe and relative links. Ignore links within the same
            // document and images.
            badLinkPattern = /[^!]\[(.*?)\]\((?!https:\/\/|#)(.*?)\)/gu,
            error404s = [];

        let match;
        while ((match = demoPattern.exec(md))) {
            const sample = match[2].replace(/\/$/u, '');
            checkSample(sample, file, error404s, 'demo');
        }

        while ((match = docsPattern.exec(md))) {
            const sample = match[2].replace(/\/$/u, '');
            try {
                FS.statSync(`docs/${sample}.md`);
            } catch (error) {
                error404s.push({ file, docs: sample });
            }
        }

        while ((match = badLinkPattern.exec(md))) {
            error404s.push({
                file,
                link: match[2],
                reason: 'unsafe, relative, or bad format'
            });
        }

        if (error404s.length) {
            throw new Error(
                'Rotten links\n' + JSON.stringify(error404s, null, '  ')
            );
        }
    });
}

gulp.task('test-docs', checkDocsConsistency);
