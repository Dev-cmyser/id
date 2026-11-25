namespace $ {

	/** Account key from text, QR or link. Empty when it is not a working key */
	export async function $bog_id_move_key( this: $, text: string ) {

		const raw = text.trim().match( /account=([^\/&\s]+)/ )?.[ 1 ] ?? text.trim()

		try {

			const key = decodeURIComponent( raw )
			const auth = this.$giper_baza_auth.from( key )
			if( auth.byteLength !== 128 || auth.uint8( 0 ) !== 0xFF ) return ''

			const data = new Uint8Array([ 1, 2, 3 ])
			const sign = await auth.signer().sign( data )

			return await auth.pass().auditor().verify( data, sign ) ? auth.toString() + auth.toStringPrivate() : ''

		} catch( error ) {
			return ''
		}

	}

}
