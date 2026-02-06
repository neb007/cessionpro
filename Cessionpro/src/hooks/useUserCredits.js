import { useState, useEffect } from 'react';
import { supabase } from '@/api/supabaseClient';

/**
 * Hook to manage user credits and subscriptions
 * Provides methods to check, deduct, and purchase credits
 */
export const useUserCredits = () => {
  const [credits, setCredits] = useState({
    photos: 1, // Default 1 free photo per listing
    contacts: 0,
    subscriptions: {}
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userId, setUserId] = useState(null);

  // Load user credits from profile
  useEffect(() => {
    loadUserCredits();
  }, []);

  const loadUserCredits = async () => {
    try {
      setLoading(true);
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        setError('Not authenticated');
        setLoading(false);
        return;
      }

      setUserId(user.id);

      const { data, error: queryError } = await supabase
        .from('profiles')
        .select('photos_remaining_balance, contact_credits_balance, active_subscriptions')
        .eq('id', user.id)
        .single();

      if (queryError) {
        console.error('Error loading credits:', queryError);
        // Set defaults if profile doesn't exist yet
        setCredits({
          photos: 1,
          contacts: 0,
          subscriptions: {}
        });
      } else {
        setCredits({
          photos: data?.photos_remaining_balance || 1,
          contacts: data?.contact_credits_balance || 0,
          subscriptions: data?.active_subscriptions || {}
        });
      }
      setError(null);
    } catch (err) {
      console.error('Error in useUserCredits:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const deductPhotoCredit = async (count = 1) => {
    if (!userId) return false;

    try {
      const newBalance = Math.max(0, credits.photos - count);

      const { error } = await supabase
        .from('profiles')
        .update({ photos_remaining_balance: newBalance })
        .eq('id', userId);

      if (error) throw error;

      // Log the transaction
      await supabase.from('credit_logs').insert([{
        user_id: userId,
        credit_type: 'photos',
        amount_change: -count,
        previous_balance: credits.photos,
        new_balance: newBalance,
        reason: 'Photo upload'
      }]);

      setCredits(prev => ({
        ...prev,
        photos: newBalance
      }));

      return true;
    } catch (err) {
      console.error('Error deducting photo credit:', err);
      return false;
    }
  };

  const deductContactCredit = async (count = 1) => {
    if (!userId) return false;

    try {
      const newBalance = Math.max(0, credits.contacts - count);

      const { error } = await supabase
        .from('profiles')
        .update({ contact_credits_balance: newBalance })
        .eq('id', userId);

      if (error) throw error;

      // Log the transaction
      await supabase.from('credit_logs').insert([{
        user_id: userId,
        credit_type: 'contacts',
        amount_change: -count,
        previous_balance: credits.contacts,
        new_balance: newBalance,
        reason: 'Contact initiation'
      }]);

      setCredits(prev => ({
        ...prev,
        contacts: newBalance
      }));

      return true;
    } catch (err) {
      console.error('Error deducting contact credit:', err);
      return false;
    }
  };

  const addPhotoCredits = async (count, packageId, amount) => {
    if (!userId) return false;

    try {
      const newBalance = credits.photos + count;

      const { error } = await supabase
        .from('profiles')
        .update({
          photos_remaining_balance: newBalance,
          total_photos_purchased: (credits.photos - 1) + count, // -1 to exclude free photo
          last_payment_date: new Date().toISOString(),
          total_spent: new Intl.NumberFormat('en-US').format(amount) // Set correctly in implementation
        })
        .eq('id', userId);

      if (error) throw error;

      // Log transaction
      await supabase.from('credit_transactions').insert([{
        user_id: userId,
        transaction_type: 'photo_purchase',
        package_id: packageId,
        quantity: count,
        amount: amount,
        status: 'completed'
      }]);

      // Log credit
      await supabase.from('credit_logs').insert([{
        user_id: userId,
        credit_type: 'photos',
        amount_change: count,
        previous_balance: credits.photos,
        new_balance: newBalance,
        reason: packageId
      }]);

      setCredits(prev => ({
        ...prev,
        photos: newBalance
      }));

      return true;
    } catch (err) {
      console.error('Error adding photo credits:', err);
      return false;
    }
  };

  const addContactCredits = async (count, packageId, amount) => {
    if (!userId) return false;

    try {
      const newBalance = credits.contacts + count;

      const { error } = await supabase
        .from('profiles')
        .update({
          contact_credits_balance: newBalance,
          total_contacts_purchased: credits.contacts + count,
          last_payment_date: new Date().toISOString(),
          total_spent: new Intl.NumberFormat('en-US').format(amount)
        })
        .eq('id', userId);

      if (error) throw error;

      // Log transaction
      await supabase.from('credit_transactions').insert([{
        user_id: userId,
        transaction_type: 'contact_purchase',
        package_id: packageId,
        quantity: count,
        amount: amount,
        status: 'completed'
      }]);

      // Log credit
      await supabase.from('credit_logs').insert([{
        user_id: userId,
        credit_type: 'contacts',
        amount_change: count,
        previous_balance: credits.contacts,
        new_balance: newBalance,
        reason: packageId
      }]);

      setCredits(prev => ({
        ...prev,
        contacts: newBalance
      }));

      return true;
    } catch (err) {
      console.error('Error adding contact credits:', err);
      return false;
    }
  };

  const hasPhotoCredits = (required = 1) => {
    return credits.photos >= required;
  };

  const hasContactCredits = (required = 1) => {
    return credits.contacts >= required;
  };

  const hasSubscription = (subscriptionId) => {
    return credits.subscriptions && credits.subscriptions[subscriptionId] === true;
  };

  // Refresh credits from server
  const refreshCredits = async () => {
    await loadUserCredits();
  };

  return {
    // State
    credits,
    loading,
    error,
    userId,

    // Methods
    deductPhotoCredit,
    deductContactCredit,
    addPhotoCredits,
    addContactCredits,
    refreshCredits,

    // Checkers
    hasPhotoCredits,
    hasContactCredits,
    hasSubscription
  };
};

export default useUserCredits;
