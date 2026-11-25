namespace $.$$ {

	$mol_test({

		async 'same key joins, other key changes nothing until confirmed twice and own key is kept'( $ ) {

			const own = await $.$giper_baza_auth._generate()
			const other = await $.$giper_baza_auth._generate()
			const key_of = ( auth: $giper_baza_auth )=> auth.toString() + auth.toStringPrivate()

			const memory = new Map< string, any >()
			let key = ''
			const applied = [] as string[]

			const context = $.$mol_ambient({
				$giper_baza_auth: class extends $giper_baza_auth {
					static override current() { return own }
				},
				$mol_state_local: {
					value: ( name: string, next?: any )=> {
						if( next !== undefined ) memory.set( name, next )
						return memory.get( name ) ?? null
					},
				} as any,
				$bog_id_key: ()=> key,
			})

			const make = ()=> $bog_id_enter.make({
				$: context,
				apply: ( next?: string )=> {
					if( next ) applied.push( next )
					return ''
				},
			})

			const fresh = make()
			$mol_assert_equal( fresh.parts(), [ fresh.Enter(), fresh.Hint() ] )

			memory.set( 'bog_id_enter', { lord: 'L', name: 'Ann', pointer: 'P' } )
			$mol_assert_equal( make().status(), fresh.wait() )

			key = key_of( other )
			const clash = make()
			$mol_assert_equal( clash.conflicted(), true )
			$mol_assert_equal( clash.joining(), null )

			clash.replace()
			$mol_assert_equal( applied, [] )
			clash.replace()
			$mol_assert_equal( applied, [ key ] )
			$mol_assert_equal( memory.get( 'bog_id_enter_prev' ), [ key_of( own ) ] )

			key = key_of( own )
			const same = make()
			$mol_assert_equal( same.conflicted(), false )
			$mol_assert_unique( same.joining(), null )

			memory.set( 'bog_id_enter', { lord: 'L', name: 'Ann', pointer: 'P', done: own.pass().lord().str } )
			const joined = make()
			$mol_assert_equal( joined.parts(), [ joined.Status() ] )

		},

	})

}
