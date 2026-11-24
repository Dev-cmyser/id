namespace $ {

	/** Resolves Pointer from Giper ID grant to current data Land */
	export function $bog_id_land( this: $, pointer: string ) {

		const glob = this.$giper_baza_glob
		const link = glob.Land( new $giper_baza_link( pointer ) ).Data( $giper_baza_atom_text ).val()

		return link ? glob.Land( new $giper_baza_link( link ) ) : null
	}

	/** Has Land got everything that master knows */
	export function $bog_id_land_synced( this: $, str: string ) {

		const link = new $giper_baza_link( str )
		const glob = this.$giper_baza_glob
		const land = glob.Land( link )
		land.sync()

		const faces = glob.yard().masters().map( port => glob.yard().face_port_land([ port, link ]) )
		this.$mol_state_time.now( 500 )

		return faces.some( map => map && $bog_id_land_covers( land.faces, map ) )
	}

	/** What master really has for Land, asked by separate connection */
	export function $bog_id_land_ask( this: $, master: string, land: $giper_baza_land ) {
		return new Promise< $giper_baza_face_map | null >( done => {

			const socket = new $mol_dom_context.WebSocket( master.replace( /^http/, 'ws' ), [ '$giper_baza_yard_2' ] )
			socket.binaryType = 'arraybuffer'

			const finish = ( faces: $giper_baza_face_map | null )=> {
				clearTimeout( timer )
				socket.onopen = socket.onerror = socket.onmessage = null
				socket.close()
				done( faces )
			}

			const timer = setTimeout( ()=> finish( null ), 6000 )
			socket.onopen = ()=> socket.send( land.face_pack().asArray() )
			socket.onerror = ()=> finish( null )

			socket.onmessage = event => {
				if( !event.data?.byteLength ) return
				const pack = new $giper_baza_pack( event.data )
				const part = new Map( pack.parts() ).get( land.link().str )
				if( part ) finish( part.faces )
			}

		} )
	}

	/** Sends Lands to master and checks that it really has them */
	export async function $bog_id_land_push( this: $, lands: readonly $giper_baza_land[] ) {

		const yard = this.$giper_baza_glob.yard()

		for( let i = 0; i < 4; ++i ) {

			await Promise.all( lands.map( land => $mol_wire_async( land ).units_saving() ) )

			const master = await $mol_wire_async( yard ).master_current()
			const faces = await Promise.all( lands.map( land => this.$bog_id_land_ask( master, land ) ) )
			if( lands.every( ( land, at )=> faces[ at ] && $bog_id_land_covers( faces[ at ], land.faces ) ) ) return true

			if( !faces.every( Boolean ) ) await $mol_wire_async( yard ).master_next()
			else if( i ) yard.reconnects( null )
			await new Promise( done => setTimeout( done, 800 ) )

		}

		return false
	}

	export function $bog_id_land_covers( left: $giper_baza_face_map, right: $giper_baza_face_map ) {
		return [ ... right ].every( ([ peer, face ])=> {
			const own = left.get( peer )
			return ( own?.time_tick ?? 0 ) >= face.time_tick && ( own?.summ ?? 0 ) >= face.summ
		} )
	}

}
