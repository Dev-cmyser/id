namespace $ {

	/** Seals Giper Baza Auth with passkey secret */
	export class $bog_id_vault extends $mol_object2 {

		static secret( key: Uint8Array< ArrayBuffer > ) {
			return $mol_crypto2_secret.from( key.slice( 0, $mol_crypto2_secret.size ) )
		}

		static async seal( auth: $giper_baza_auth, key: Uint8Array< ArrayBuffer > ) {

			const nonce = $mol_crypto2_nonce()
			const open = $mol_charset_encode( auth.toString() + auth.toStringPrivate() )
			const closed = await this.secret( key ).encrypt( open, nonce )

			return $mol_base64_url_encode( nonce ) + '.' + $mol_base64_url_encode( closed )
		}

		static async open( vault: string, key: Uint8Array< ArrayBuffer > ) {

			const [ nonce, closed ] = vault.split( '.' ).map( chunk => $mol_base64_url_decode( chunk ) )
			const open = await this.secret( key ).decrypt( closed, nonce )

			return $mol_charset_decode( open )
		}

	}

}
