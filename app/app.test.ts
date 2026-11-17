namespace $.$$ {

	$mol_test({

		async 'approve gives post to app, revoke denies'( $ ) {

			const app = $bog_id_app.make({ $ })
			new $mol_wire_atom( 'bog_id_app_test_keep', ()=> app.store() ).fresh()

			const guest = await $.$giper_baza_auth._generate()
			const pass = guest.pass()

			app.request({ origin: 'https://example.org', pass: pass.toString(), scope: 'notes' })
			const sent = await $mol_wire_async( app ).grant_save()

			const land = $.$giper_baza_glob.Land( new $giper_baza_link( sent.land ) )
			new $mol_wire_atom( 'bog_id_app_test_land', ()=> $.$giper_baza_glob.Land( new $giper_baza_link( sent.land ) ) ).fresh()

			$mol_assert_equal( sent.origin, 'https://example.org' )
			$mol_assert_equal( land.lord_rank( pass.lord() ), $giper_baza_rank_post( 'just' ) )

			const again = await $mol_wire_async( app ).grant_save()
			$mol_assert_equal( again.land, sent.land )
			$mol_assert_equal( app.grants().length, 1 )

			const id = app.grants()[ 0 ].link().str
			await $mol_wire_async( app ).revoke( id )

			$mol_assert_equal( land.lord_rank( pass.lord() ), $giper_baza_rank_deny )
			$mol_assert_equal( app.grant_active( id ), false )

		},

	})

}
