import { supabase } from './DB/db';

export const signOut = async () => {
  try {
    await supabase.auth.signOut();
    return { success: true };
  } catch (error) {
    return { error };
  }
};