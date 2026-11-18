namespace $ {

	$mol_test({

		async 'vault opens with same key only'( $ ) {

			const auth = await $.$giper_baza_auth._generate()
			const key = $mol_crypto2_nonce()
			const other = $mol_crypto2_nonce()

			const vault = await $bog_id_vault.seal( auth, key )

			$mol_assert_equal( await $bog_id_vault.open( vault, key ), auth.toString() + auth.toStringPrivate() )
			$mol_assert_unique( await $bog_id_vault.open( vault, other ), auth.toString() + auth.toStringPrivate() )

		},

	})

}
