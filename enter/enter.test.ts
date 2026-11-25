namespace $.$$ {

	async function stand( $: $ ) {

		const own = await $.$giper_baza_auth._generate()
		const other = await $.$giper_baza_auth._generate()
		const key_of = ( auth: $giper_baza_auth )=> auth.toString() + auth.toStringPrivate()

		const state = {
			memory: new Map< string, any >(),
			key: null as string | null,
			delivered: true,
			put: [] as string[],
			applied: [] as string[],
			started: [] as string[],
		}

		const context = $.$mol_ambient({
			$giper_baza_auth: class extends $giper_baza_auth {
				static override current() { return own }
				static override grab() { return other }
			},
			$mol_state_local: {
				value: ( name: string, next?: any )=> {
					if( next !== undefined ) state.memory.set( name, next )
					return state.memory.get( name ) ?? null
				},
			} as any,
			$bog_id_key_peek: ()=> state.key,
			$bog_id_key_put: async ( pointer: string, key: string )=> {
				state.put.push( key )
				return state.delivered
			},
		})

		const make = ()=> $bog_id_enter.make({
			$: context,
			apply: ( next?: string )=> {
				if( next ) state.applied.push( next )
				return ''
			},
			apply_fresh: ( next?: string )=> {
				if( next ) state.started.push( next )
				return ''
			},
		})

		const login = ( done?: string )=> state.memory.set( 'bog_id_enter', { lord: 'L', name: 'Ann', pointer: 'P', done } )

		return {
			state, make, login,
			own: key_of( own ), own_lord: own.pass().lord().str,
			other: key_of( other ), other_lord: other.pass().lord().str,
		}
	}

	$mol_test({

		async 'same key joins, other key changes nothing until confirmed twice and own key is kept'( $ ) {

			const { state, make, login, own, own_lord, other, other_lord } = await stand( $ )

			const out = make()
			$mol_assert_equal( out.parts(), [ out.Enter(), out.Hint() ] )

			login()
			const waiting = make()
			$mol_assert_equal( waiting.status(), waiting.wait() )
			$mol_assert_equal( waiting.parts(), [ waiting.Status(), waiting.Change() ] )

			state.key = own
			const same = make()
			$mol_assert_equal( same.conflicted(), false )
			$mol_assert_unique( same.joining(), null )

			state.key = other
			const clash = make()
			$mol_assert_equal( clash.joining(), null )
			$mol_assert_equal( clash.parts(), [ clash.Status(), clash.Replace(), clash.Change() ] )

			clash.replace()
			$mol_assert_equal( state.applied, [] )
			clash.replace()
			$mol_assert_equal( state.applied, [ other ] )
			$mol_assert_equal( state.memory.get( 'bog_id_enter_prev' ), [ own ] )
			$mol_assert_equal( state.memory.get( 'bog_id_enter' ).done, other_lord )

			login( own_lord )
			const joined = make()
			$mol_assert_equal( joined.parts(), [ joined.Status(), joined.Change() ] )

		},

		async 'vacant ID gets key only by choice'( $ ) {

			const { state, make, login, own, own_lord } = await stand( $ )
			login()
			state.key = ''

			const enter = make()
			$mol_assert_equal( enter.parts(), [ enter.Status(), enter.Save(), enter.Fresh(), enter.Change() ] )
			enter.joining()
			$mol_assert_equal( state.put, [] )

			await enter.save()
			$mol_assert_equal( state.put, [ own ] )
			$mol_assert_equal( state.memory.get( 'bog_id_enter' ).done, own_lord )
			$mol_assert_equal( [ ... state.applied, ... state.started ], [] )

		},

		async 'new account starts after second click and only when master has its key'( $ ) {

			const { state, make, login, own, other, other_lord } = await stand( $ )
			login()
			state.key = ''
			state.delivered = false

			const enter = make()
			await enter.fresh()
			$mol_assert_equal( state.put, [] )

			await enter.fresh()
			$mol_assert_equal( state.put, [ other ] )
			$mol_assert_equal( state.started, [] )
			$mol_assert_equal( enter.error(), enter.error_sent() )
			$mol_assert_equal( state.memory.get( 'bog_id_enter' ).done, undefined )

			state.delivered = true
			await enter.fresh()
			$mol_assert_equal( state.started, [ other ] )
			$mol_assert_equal( state.applied, [] )
			$mol_assert_equal( state.memory.get( 'bog_id_enter_prev' ), [ own ] )
			$mol_assert_equal( state.memory.get( 'bog_id_enter' ).done, other_lord )

		},

	})

}
