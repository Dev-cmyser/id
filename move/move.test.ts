namespace $.$$ {

	$mol_test({

		async 'key is taken from text and from link, broken one is rejected'( $ ) {

			const auth = await $.$giper_baza_auth._generate()
			const alien = await $.$giper_baza_auth._generate()
			const key = auth.toString() + auth.toStringPrivate()

			$mol_assert_equal( await $.$bog_id_move_key( ` ${ key }\n` ), key )
			$mol_assert_equal( await $.$bog_id_move_key( `https://x.y/#!account=${ encodeURIComponent( key ) }` ), key )

			$mol_assert_equal( await $.$bog_id_move_key( '' ), '' )
			$mol_assert_equal( await $.$bog_id_move_key( 'не ключ' ), '' )
			$mol_assert_equal( await $.$bog_id_move_key( key.slice( 0, -8 ) ), '' )
			$mol_assert_equal( await $.$bog_id_move_key( auth.toString() + alien.toStringPrivate() ), '' )

		},

		async 'scanned key is applied, alien code gives error'( $ ) {

			const auth = await $.$giper_baza_auth._generate()
			const key = auth.toString() + auth.toStringPrivate()
			const applied = [] as string[]
			const move = $bog_id_move.make({ $, apply: ( next?: string )=> {
				if( next ) applied.push( next )
				return ''
			} })

			await move.enter( 'https://example.org/' )
			$mol_assert_equal( move.status(), move.status_bad() )

			await move.enter( key )
			$mol_assert_equal( move.status(), '' )
			$mol_assert_equal( applied, [ key ] )

		},

	})

}
