namespace $ {

	export class $bog_id_yard extends $giper_baza_yard {

		static knock_limit = 4000
		static knock_pause = 3000

		@ $mol_mem
		static override masters() {

			const override = this.masters_override()
			if( override ) return override

			const links = this.masters_seeded() ?? this.masters_default
			const first = $mol_wire_sync( this ).first_alive( ... links ) as unknown as string

			return first ? [ first, ... links.filter( link => link !== first ) ] : links
		}

		static async first_alive( ... links: readonly string[] ) {
			while( links.length ) {
				for( const link of links ) if( await this.knock( link ) ) return link
				await new Promise( done => setTimeout( done, this.knock_pause ) )
			}
			return ''
		}

		static knock( link: string ) {
			return new Promise< boolean >( done => {

				const socket = new $mol_dom_context.WebSocket( link.replace( /^http/, 'ws' ), [ '$giper_baza_yard_2' ] )

				const finish = ( alive: boolean )=> {
					clearTimeout( timer )
					socket.onopen = socket.onerror = null
					socket.close()
					done( alive )
				}

				const timer = setTimeout( ()=> finish( false ), this.knock_limit )
				socket.onopen = ()=> finish( true )
				socket.onerror = ()=> finish( false )

			} )
		}

	}

	$.$giper_baza_yard = $bog_id_yard

}
