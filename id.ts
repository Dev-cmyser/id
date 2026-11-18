namespace $ {

	export class $bog_id_grant extends $giper_baza_dict.with({
		App: $giper_baza_atom_text,
		Scope: $giper_baza_atom_text,
		Pointer: $giper_baza_atom_text,
		Land: $giper_baza_atom_text,
		Lands: $giper_baza_list_str,
		Apps: $giper_baza_list_str,
	}) {}

	export class $bog_id_store extends $giper_baza_dict.with({
		Grants: $giper_baza_list_link_to( ()=> $bog_id_grant ),
	}) {}

	export class $bog_id_profile extends $giper_baza_dict.with({
		Name: $giper_baza_atom_text,
		Vault: $giper_baza_atom_text,
		Stores: $giper_baza_list_str,
	}) {}

}
