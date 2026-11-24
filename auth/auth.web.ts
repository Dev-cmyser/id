namespace $ {

	const key_own = 'bog_id_auth'
	const key_shared = '$giper_baza_auth'
	const key_size = 128

	/** Giper ID key in own slot. Shared key of domain is only read */
	export class $bog_id_auth extends $giper_baza_auth {

		static restore( slot: string ) {

			const str = String( $mol_state_local.value( slot ) ?? '' )
			if( !str ) return null

			try {
				const auth = this.from( str )
				return auth.byteLength === key_size ? auth : null
			} catch( error ) {
				if( $mol_promise_like( error ) ) $mol_fail_hidden( error )
				return null
			}

		}

		/** Was this key already used as Giper ID account on this device */
		static used( lord: string ) {
			if( $bog_id_account.find( lord ) ) return true
			const grants = [ 'bog_merchquarium_grant', 'bog_molefy_grant' ]
			return grants.some( key => ( $mol_state_local.value( key ) as any )?.lord === lord )
		}

		static first() {

			const shared = this.restore( key_shared )
			if( !shared ) return this.grab()

			const lord = shared.pass().lord().str
			if( this.used( lord ) ) return shared

			const next = this.grab()
			$bog_id_account.put({ lord, name: '', key: shared.toString() + shared.toStringPrivate(), vault: '' })

			return next
		}

		@ $mol_mem
		static override current( next?: $giper_baza_auth | null ) {

			$mol_wire_solid()

			if( next === undefined ) {
				const own = this.restore( key_own )
				if( own ) return own
			}

			if( !next ) next = this.first()

			$mol_state_local.value( key_own, next.toString() + next.toStringPrivate() )

			return next
		}

	}

	$.$giper_baza_auth = $bog_id_auth

}
