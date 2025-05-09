// lib/DB/profileSync.ts

import { User } from '@supabase/supabase-js';
import { serverSupabase } from './supabaseCLient'; // Use the server-side client

/**
 * Syncs OAuth user data into your custom "user" table in Supabase.
 */
export async function syncUserFromOAuth(user: User) {
  if (!user?.id) {
    console.error('No valid user provided to syncUserFromOAuth');
    return null;
  }

  try {
    const { id, email, user_metadata, app_metadata, identities } = user;

    // Extract Google OAuth specific data
    const googleIdentity = identities?.find(identity => identity.provider === 'google');
    const googleData = googleIdentity?.identity_data || {};

    console.log('Syncing user data:', {
      id,
      email,
      provider: app_metadata?.provider,
      hasGoogleData: !!googleData
    });

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
    const { data: existingUser, error: fetchError } = await serverSupabase
      .from('user')
      .select('id, google_id')
      .eq('id', id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching existing user:', fetchError);
      throw fetchError;
    }

    if (!existingUser) {
      console.log('Creating new user record');
      // Insert new user
      const { error: insertError } = await serverSupabase
        .from('user')
        .insert([{ ...userData, created_at: new Date().toISOString() }]);

      if (insertError) {
        console.error('Error inserting new user:', insertError);
        throw insertError;
      }
      console.log('Successfully created new user record');
    } else {
      console.log('Updating existing user record');
      // Update existing user, but preserve google_id if it exists
      const updateData = {
        ...userData,
        google_id: existingUser.google_id || userData.google_id
      };
      
      const { error: updateError } = await serverSupabase
        .from('user')
        .update(updateData)
        .eq('id', id);

      if (updateError) {
        console.error('Error updating user:', updateError);
        throw updateError;
      }
      console.log('Successfully updated user record');
    }

    return true;
  } catch (error) {
    console.error('Error in syncUserFromOAuth:', error);
    // Log the full error details
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    return null;
  }
}