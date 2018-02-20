namespace ZwermAPI {
    interface Team {
        id: number;
        owner_id: number;
        name: string;
        slug: string;
        photo_url: string;
        stripe_id: string;
        current_billing_plan: string;
        vat_id: string;
        trial_ends_at: string;
        created_at: string;
        updated_at: string;
        pivot: {
            user_id: number;
            team_id: number;
            role: string;
        },
        subscriptions: Array;
        tax_rate: number;
    }

    interface User {
        id: number;
        name: string;
        email: string;
        photo_url: string;
        uses_two_factor_auth: boolean;
        country_code: string;
        phone: string;
        two_factor_reset_code: string,
        current_team_id: number;
        stripe_id: string;
        current_billing_plan: string;
        card_brand: string;
        card_last_four: string;
        card_country: string;
        billing_address: string;
        billing_address_line_2: string;
        billing_city: string;
        billing_state: string;
        billing_zip: string;
        billing_country: string;
        vat_id: string;
        extra_billing_information: string;
        trial_ends_at: string;
        last_read_announcements_at: string;
        created_at: string;
        updated_at: string;
        subscriptions: Array,
        owned_teams: Array,
        teams: Array<Team>,
        tax_rate: number;
    }

    // not needed due to the type, but helps WebStorm until a bug gets fixed
    interface PartialUser {
        id?: number;
        name?: string;
        email?: string;
        photo_url?: string;
        uses_two_factor_auth?: boolean;
        country_code?: string;
        phone?: string;
        two_factor_reset_code?: string,
        current_team_id?: number;
        stripe_id?: string;
        current_billing_plan?: string;
        card_brand?: string;
        card_last_four?: string;
        card_country?: string;
        billing_address?: string;
        billing_address_line_2?: string;
        billing_city?: string;
        billing_state?: string;
        billing_zip?: string;
        billing_country?: string;
        vat_id?: string;
        extra_billing_information?: string;
        trial_ends_at?: string;
        last_read_announcements_at?: string;
        created_at?: string;
        updated_at?: string;
        subscriptions?: Array,
        owned_teams?: Array,
        teams?: Array<Team>,
        tax_rate?: number;
    }

    type PartialUser = Partial<User>
}
