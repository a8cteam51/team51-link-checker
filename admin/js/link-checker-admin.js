/* global wpRestNonce */
( function ( $ ) {
    'use strict';

    /**
     * All of the code for your admin-facing JavaScript source
     * should reside in this file.
     *
     * Note: It has been assumed you will write jQuery code here, so the
     * $ function reference has been prepared for usage within the scope
     * of this function.
     *
     * This enables you to define handlers, for when the DOM is ready:
     *
     * $(function() {
     *
     * });
     *
     * When the window is loaded:
     *
     * $( window ).load(function() {
     *
     * });
     *
     * ...and/or other possibilities.
     *
     * Ideally, it is not considered best practise to attach more than a
     * single DOM-ready or window-load handler for a particular page.
     * Although scripts in the WordPress core, Plugins and Themes may be
     * practising this, we should strive to set a better example in our own work.
     */

    $( function () {
        init();
        function init () {
            pullLastData();
        }

        function pullLastData () {
            
            $.ajax( `/wp-content/plugins/team51-link-checker/link-checker-last-result.json?v=${ Date.now() }` )
                .complete( ( data ) => {
                   
                    if ( !vm ) {
                        var vm = new Vue( {
                            el: '.link-checker__vue_app',
                            data: ( data.date ) ? data :{
                                date: 'Not run yet',
                                results: []
                            },
                            filters: {
                                humanDate: function ( date ) {
                                    
                                    if ( !date ) return '';

                                    return fromNow( date );
                                }
                            }
                        } );
                    }

                    vm.date = data.date;
                    vm.results = data.results;
                 } );
        }

        /**
         * Human readable elapsed or remaining time (example: 3 minutes ago)
         * @param  {Date|Number|String} date A Date object, timestamp or string parsable with Date.parse()
         * @param  {Date|Number|String} [nowDate] A Date object, timestamp or string parsable with Date.parse()
         * @param  {Intl.RelativeTimeFormat} [trf] A Intl formater
         * @return {string} Human readable elapsed or remaining time
         * @author github.com/victornpb
         * @see https://stackoverflow.com/a/67338038/938822
         */
        function fromNow ( date, nowDate = Date.now(), rft = new Intl.RelativeTimeFormat( 'en-US', { numeric: "auto" } ) ) {
            const SECOND = 1000;
            const MINUTE = 60 * SECOND;
            const HOUR = 60 * MINUTE;
            const DAY = 24 * HOUR;
            const WEEK = 7 * DAY;
            const MONTH = 30 * DAY;
            const YEAR = 365 * DAY;
            const intervals = [
                { ge: YEAR, divisor: YEAR, unit: 'year' },
                { ge: MONTH, divisor: MONTH, unit: 'month' },
                { ge: WEEK, divisor: WEEK, unit: 'week' },
                { ge: DAY, divisor: DAY, unit: 'day' },
                { ge: HOUR, divisor: HOUR, unit: 'hour' },
                { ge: MINUTE, divisor: MINUTE, unit: 'minute' },
                { ge: 30 * SECOND, divisor: SECOND, unit: 'seconds' },
                { ge: 0, divisor: 1, text: 'just now' },
            ];
            const offset = typeof date === 'object' ? date.getTimezoneOffset() : new Date( date ).getTimezoneOffset();
            const trueOffset = offset * 60 * 1000;
            const now = typeof nowDate === 'object' ? nowDate.getTime() + trueOffset : new Date( nowDate ).getTime() + trueOffset;
            const diff = now - ( typeof date === 'object' ? date: new Date( date ) ).getTime();
            const diffAbs = Math.abs( diff );
            for ( const interval of intervals ) {
                if ( diffAbs >= interval.ge ) {
                    const x = Math.round( Math.abs( diff ) / interval.divisor );
                    const isFuture = diff < 0;
                    return interval.unit ? rft.format( isFuture ? x : -x, interval.unit ) : interval.text;
                }
            }
        }

        // Events. TODO: Move this to VueJS event
        $( document ).on( 'click', '.link-checker__btn-start', function () {
            $( '.link-checker__btn-start' ).attr( 'disabled', 1 );
            $.ajax( { 
                url: '/wp-json/linkchecker/v1/check',
                method: 'GET',
                headers: {
                    'X-WP-Nonce': wpRestNonce,
                }
            } ).done( () => {
                $( '.link-checker__btn-start' ).removeAttr( 'disabled' );
                // TODO: re-render Vue template
                // pullLastData();
                location.reload();
            } );
        } );
    } );

} )( jQuery );
