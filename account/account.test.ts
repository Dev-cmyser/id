namespace $ {

	$mol_test({

		'put keeps order and replaces by lord'( $ ) {

			$.$bog_id_account = class extends $.$bog_id_account {
				static override list( next = this.memory ) {
					return this.memory = next
				}
				static memory = [] as readonly $bog_id_account_data[]
			}

			const make = ( lord: string, name: string )=> ({ lord, name, key: '', vault: '' })
			const Account = $.$bog_id_account

			Account.put( make( 'a', 'Ann' ) )
			Account.put( make( 'b', 'Bob' ) )
			Account.put( make( 'a', 'Anna' ) )

			$mol_assert_equal( Account.list().map( data => data.name ), [ 'Anna', 'Bob' ] )
			$mol_assert_equal( Account.find( 'b' )!.name, 'Bob' )
			$mol_assert_equal( Account.find( 'c' ), null )

		},

	})

}
