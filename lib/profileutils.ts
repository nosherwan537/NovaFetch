import { User } from '@supabase/supabase-js';
import { supabase } from './DB/db';

/**
 * Syncs OAuth user data into your custom "user" table in Supabase.
 */
export async function syncUserFromOAuth(user: User) {
  if (!user) return null;

  try {
    const { id, email, user_metadata, app_metadata, identities } = user;

    // Extract Google OAuth specific data
    const googleIdentity = identities?.find(identity => identity.provider === 'google');
    const googleData = googleIdentity?.identity_data || {};

    const userData = {
      id,
      email,
      full_name: user_metadata?.full_name || user_metadata?.name || googleData.name || '',
      avatar_url: user_metadata?.avatar_url || user_metadata?.picture || googleData.picture || '',
      provider: app_metadata?.provider || 'email',
      google_id: googleData.sub || null,
      google_email: googleData.email || email,
      google_picture: googleData.picture || null,
      google_locale: googleData.locale || null,
      updated_at: new Date().toISOString(),
    };

    // Check if the user already exists in the "user" table
    const { data: existingUser, error: fetchError } = await supabase
      .from('user')
      .select('id, google_id')
      .eq('id', id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    if (!existingUser) {
      // Insert new user
      const { error: insertError } = await supabase
        .from('user')
        .insert([{ ...userData, created_at: new Date().toISOString() }]);

      if (insertError) throw insertError;
      console.log('Created new user with Google OAuth data');
    } else {
      // Update existing user, but preserve google_id if it exists
      const updateData = {
        ...userData,
        google_id: existingUser.google_id || userData.google_id
      };
      
      const { error: updateError } = await supabase
        .from('user')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;
      console.log('Updated existing user with Google OAuth data');
    }

    return true;
  } catch (error) {
    console.error('Error syncing OAuth user to custom user table:', error);
    return null;
  }
} 