namespace $ {

	export class $bog_id_grant extends $giper_baza_dict.with({
		Origin: $giper_baza_atom_text,
		Scope: $giper_baza_atom_text,
		Land: $giper_baza_atom_text,
		Apps: $giper_baza_list_str,
		Revoked: $giper_baza_atom_bool,
	}) {}

	export class $bog_id_store extends $giper_baza_dict.with({
		Grants: $giper_baza_list_link_to( ()=> $bog_id_grant ),
	}) {}

}
