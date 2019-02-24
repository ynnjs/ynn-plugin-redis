const Redis = require( 'ioredis' );

const REDIS = Symbol( 'redis' );

module.exports = ( app, options = {} ) => {
    const config = options.redis || app.config( 'redis' );

    Object.defineProperty( app, options.name || 'redis', {
        get() {
            if( app[ REDIS ] ) return app[ REDIS ];
            if( config.cluster === true ) {
                app[ REDIS ] = new Redis.Cluster( config.nodes, config );
            } else {
                app[ REDIS ] = new Redis( config );
            }
            app[ REDIS ].on( 'error', e => {
                app.output.error( e );
                throw e;
            } );

            app[ REDIS ].on( 'connect', () => {
                app.output.info( '[plugin redis] connect' );
            } );
            return app[ REDIS ];
        },

        set( r ) {
            app[ REDIS ] = r;
        }
    } );
};
