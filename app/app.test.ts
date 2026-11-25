namespace $.$$ {

	$mol_test({

		async 'signed out account stays in list and asks for passkey'( $ ) {

			$.$bog_id_account = class extends $.$bog_id_account {
				static override list( next = this.memory ) {
					return this.memory = next
				}
				static memory = [] as readonly $bog_id_account_data[]
			}

			const app = $bog_id_app.make({ $ })
			const other = { lord: 'other', name: 'Анна', key: '', vault: 'vault' }
			let entered = 0
			app.passkey_enter = ()=> { ++ entered }

			$.$bog_id_account.put( other )
			$mol_assert_equal( app.account_rows().length, 2 )
			$mol_assert_equal( app.account_name( 'other' ), 'Анна' )
			$mol_assert_equal( app.account_current( app.lord() ), true )

			app.account_open( 'other' )
			$mol_assert_equal( entered, 1 )

			app.account_open( app.lord() )
			$mol_assert_equal( entered, 1 )

		},

		async 'revoke of one device rotates land and keeps data for others'( $ ) {

			const app = $bog_id_app.make({ $ })
			const keep = ( name: string, task: ()=> unknown )=> new $mol_wire_atom( name, task ).fresh()
			keep( 'bog_id_app_test_profile', ()=> app.profile() )

			const one = ( await $.$giper_baza_auth._generate() ).pass()
			const two = ( await $.$giper_baza_auth._generate() ).pass()
			const ask = ( pass: $giper_baza_auth_pass )=> app.request({
				origin: 'https://example.org',
				app: 'https://example.org/notes/',
				pass: pass.toString(),
				scope: 'notes',
			})

			await $mol_wire_async( app ).name( 'Кирилл' )

			ask( one )
			const first = await $mol_wire_async( app ).grant_save()
			ask( two )
			const second = await $mol_wire_async( app ).grant_save()

			$mol_assert_equal( first.name, 'Кирилл' )
			$mol_assert_equal( $.$bog_id_profile_of( app.lord() )?.Name()?.val(), 'Кирилл' )
			$mol_assert_equal( $.$giper_baza_glob.home().land().Data( $bog_id_profile ).Name()?.val() ?? '', '' )
			$mol_assert_equal( second.pointer, first.pointer )
			$mol_assert_equal( app.grants().length, 1 )

			const grant = app.grants()[ 0 ]
			const pointer = app.grant_pointer( grant )
			const old = app.grant_land( grant )
			keep( 'bog_id_app_test_pointer', ()=> app.grant_pointer( grant ) )
			keep( 'bog_id_app_test_old', ()=> $.$giper_baza_glob.Land( old.link() ) )

			$mol_assert_equal( old.lord_rank( one.lord() ), $giper_baza_rank_post( 'just' ) )
			$mol_assert_equal( old.lord_rank( two.lord() ), $giper_baza_rank_post( 'just' ) )

			await $mol_wire_async( old.Data( $giper_baza_atom_text ) ).val( 'hello' )
			await $mol_wire_async( app ).rotate( grant.link().str, [ one.toString() ] )

			const next = app.grant_land( grant )
			keep( 'bog_id_app_test_next', ()=> $.$giper_baza_glob.Land( next.link() ) )

			$mol_assert_unique( next.link().str, old.link().str )
			$mol_assert_equal( $.$bog_id_land( first.pointer )!.link().str, next.link().str )

			$mol_assert_equal( next.lord_rank( two.lord() ), $giper_baza_rank_post( 'just' ) )
			$mol_assert_equal( next.lord_rank( one.lord() ), $giper_baza_rank_deny )
			$mol_assert_equal( old.lord_rank( one.lord() ), $giper_baza_rank_deny )
			$mol_assert_equal( pointer.lord_rank( one.lord() ), $giper_baza_rank_deny )

			$mol_assert_equal( next.Data( $giper_baza_atom_text ).val(), 'hello' )
			$mol_assert_equal( app.grant_apps( grant ), [ two.toString() ] )

		},

		'moved key switches account, own key is not applied'( $ ) {

			const app = $bog_id_app.make({ $ })
			const switched = [] as string[]
			app.account_switch = key => { switched.push( key ) }

			$mol_assert_equal( app.add_rows().includes( app.Move() ), false )
			app.move_toggle()
			$mol_assert_equal( app.add_rows().includes( app.Move() ), true )

			app.move_apply( app.key() )
			$mol_assert_equal( app.Move().status(), app.move_same() )
			$mol_assert_equal( switched, [] )

			app.move_apply( 'other' )
			$mol_assert_equal( switched, [ 'other' ] )

		},

	})

}
