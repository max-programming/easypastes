import { env } from "@/env.mjs";

import { createClient } from "@supabase/supabase-js";

export function createSupabaseClient(supabaseAccessToken: string) {
	return createClient(
		env.NEXT_PUBLIC_SUPABASE_URL,
		env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			global: {
				headers: {
					Authorization: `Bearer ${supabaseAccessToken}`,
				},
			},
		},
	);
}
