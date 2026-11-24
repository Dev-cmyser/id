namespace $ {

	$mol_test({

		'land covers faces only when it has the latest time and all units of every peer'() {

			const master = new $giper_baza_face_map
			const land = new $giper_baza_face_map
			$mol_assert_equal( $bog_id_land_covers( land, master ), true )

			master.peer_time( 'peer', 2, 1 )
			$mol_assert_equal( $bog_id_land_covers( land, master ), false )

			land.peer_time( 'peer', 2, 0 )
			$mol_assert_equal( $bog_id_land_covers( land, master ), false )

			land.peer_time( 'peer', 2, 1 )
			land.peer_time( 'other', 3, 0 )
			$mol_assert_equal( $bog_id_land_covers( land, master ), true )

			master.peer_summ( 'peer', 2 )
			land.peer_summ( 'peer', 1 )
			$mol_assert_equal( $bog_id_land_covers( land, master ), false )

			land.peer_summ( 'peer', 2 )
			$mol_assert_equal( $bog_id_land_covers( land, master ), true )

		},

	})

}
