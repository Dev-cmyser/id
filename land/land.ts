namespace $ {

	/** Resolves Pointer from Giper ID grant to current data Land */
	export function $bog_id_land( this: $, pointer: string ) {

		const glob = this.$giper_baza_glob
		const link = glob.Land( new $giper_baza_link( pointer ) ).Data( $giper_baza_atom_text ).val()

		return link ? glob.Land( new $giper_baza_link( link ) ) : null
	}

}
