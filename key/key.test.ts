namespace $ {

	$mol_test({

		async 'first device puts own key, second device takes it, unsynced land gives nothing'( $ ) {

			const grab = ( name: string )=> $mol_wire_async( ()=> {
				const land = $.$giper_baza_glob.land_grab([[ null, $giper_baza_rank_deny ]])
				new $mol_wire_atom( name, ()=> $.$giper_baza_glob.Land( land.link() ) ).fresh()
				return land
			} )()

			const pointer = await grab( 'bog_id_key_test_pointer' )
			const land = await grab( 'bog_id_key_test_land' )
			await $mol_wire_async( pointer.Data( $giper_baza_atom_text ) ).val( land.link().str )

			let synced = false
			const context = $.$mol_ambient({ $bog_id_land_synced: ()=> synced })
			const ask = ( own: string )=> $mol_wire_async( context ).$bog_id_key( pointer.link().str, own )

			$mol_assert_equal( await ask( 'one' ), '' )

			synced = true
			$mol_assert_equal( await ask( 'one' ), 'one' )
			$mol_assert_equal( await ask( 'two' ), 'one' )

		},

	})

}
