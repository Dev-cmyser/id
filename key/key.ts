namespace $ {

	export class $bog_id_key_store extends $giper_baza_dict.with({
		Key: $giper_baza_atom_text,
	}) {}

	/** Store of app key in granted Land. Null while Land is not synced or not writable */
	export function $bog_id_key_ready( this: $, pointer: string ) {

		const land = this.$bog_id_land( pointer )
		if( !land ) return null

		const tines = land.Tine().items_vary()
			.map( tine => $giper_baza_link_schema.cast( tine! )?.str )
			.filter( $mol_guard_defined )

		const synced = [ pointer, land.link().str, ... tines ].map( link => this.$bog_id_land_synced( link ) )
		if( !synced.every( Boolean ) ) return null

		const rank = land.lord_rank( land.auth().pass().lord() )
		if( rank < $giper_baza_rank_post( 'late' ) ) return null

		return land.Data( $bog_id_key_store )
	}

	/** Own key of app, the same on all devices: the first device puts it to granted Land. Empty while Land is not synced */
	export function $bog_id_key( this: $, pointer: string, own: string ) {

		const store = this.$bog_id_key_ready( pointer )
		if( !store ) return ''

		const key = store.Key()?.val()
		if( key ) return key

		store.Key( 'auto' )!.val( own )
		store.land().units_saving()

		return own
	}

	/** Key of app from granted Land without putting own one. Null while Land is not synced, empty when there is no key yet */
	export function $bog_id_key_peek( this: $, pointer: string ) {
		const store = this.$bog_id_key_ready( pointer )
		return store && ( store.Key()?.val() ?? '' )
	}

	/** Puts key to granted Land if it is vacant, waits for master and tells whether it has the key */
	export async function $bog_id_key_put( this: $, pointer: string, key: string ) {

		const actual = await $mol_wire_async( this ).$bog_id_key( pointer, key )
		if( actual !== key ) return false

		const land = await $mol_wire_async( this ).$bog_id_land( pointer )
		return this.$bog_id_land_push([ land! ])
	}

}
