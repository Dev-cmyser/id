namespace $ {

	export class $bog_id_path_auth extends $giper_baza_auth {

		static storage_key() {
			const dir = $mol_dom_context.location.pathname.replace( /[^/]*$/, '' )
			if( dir === '/' ) return '$giper_baza_auth'
			return `$giper_baza_auth:${ dir }`
		}

		@ $mol_mem
		static override current( next?: $giper_baza_auth | null ) {

			$mol_wire_solid()

			const key = this.storage_key()

			if( next === undefined ) {
				const str = String( $mol_state_local.value( key ) ?? '' )
				if( str ) {
					const auth = this.from( str )
					if( auth.byteLength === 128 ) return auth
				}
			}

			if( !next ) next = this.grab()

			$mol_state_local.value( key, next.toString() + next.toStringPrivate() )

			return next
		}

	}

	$.$giper_baza_auth = $bog_id_path_auth

}
