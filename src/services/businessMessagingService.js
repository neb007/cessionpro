import { supabase } from '@/api/supabaseClient';
import { messageService } from '@/services/messageService';
import { leadService } from '@/services/leadService';

/**
 * Shared helper to send a message about a business.
 * Handles conversation creation/update, message creation, and lead tracking.
 */
export async function sendBusinessMessage({ business, buyerEmail, buyerName, message }) {
  if (!business?.id) {
    throw new Error('Business information is required');
  }
  if (!buyerEmail) {
    throw new Error('Buyer email is required');
  }
  const trimmedMessage = message?.trim();
  if (!trimmedMessage) {
    throw new Error('Message content is empty');
  }

  let sellerEmail = business?.seller_email || null;
  let sellerId = business?.seller_id || business?.seller?.id || business?.seller?.user_id || null;

  if (!sellerEmail && business?.seller?.email) {
    sellerEmail = business.seller.email;
  }

  if (!sellerEmail && sellerId) {
    const { data: sellerProfile, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', sellerId)
      .maybeSingle();
    if (error) {
      console.warn('Failed to fetch seller profile email:', error.message);
    }
    sellerEmail = sellerProfile?.email || null;
  }

  if (!sellerEmail && business?.id) {
    const { data: businessRow, error } = await supabase
      .from('businesses')
      .select('seller_id, seller_email')
      .eq('id', business.id)
      .maybeSingle();
    if (error) {
      console.warn('Failed to fetch business seller info:', error.message);
    }
    if (!sellerEmail) {
      sellerEmail = businessRow?.seller_email || null;
    }
    if (!sellerId) {
      sellerId = businessRow?.seller_id || null;
    }
  }

  if (!sellerEmail && sellerId) {
    const { data: sellerProfile, error } = await supabase
      .from('profiles')
      .select('email')
      .eq('id', sellerId)
      .maybeSingle();
    if (error) {
      console.warn('Failed to fetch seller profile email (fallback):', error.message);
    }
    sellerEmail = sellerProfile?.email || null;
  }

  if (!sellerEmail) {
    throw new Error('Business seller email is missing');
  }

  const { data: { user: authUser } } = await supabase.auth.getUser();
  const buyerId = authUser?.id || null;
  if (!buyerId) {
    throw new Error('Buyer user id is missing');
  }

  if (!sellerId && business?.seller_id) {
    sellerId = business.seller_id;
  }

  if (!sellerId) {
    const { data: sellerProfile, error } = await supabase
      .from('profiles')
      .select('id')
      .eq('email', sellerEmail)
      .maybeSingle();
    if (error) {
      console.warn('Failed to fetch seller profile id:', error.message);
    }
    sellerId = sellerProfile?.id || null;
  }

  let conversationRecord = null;
  if (sellerId) {
    const { data: existingConversation, error: conversationError } = await supabase
      .from('conversations')
      .select('*')
      .eq('business_id', business.id)
      .or(
        `and(participant_1_id.eq.${buyerId},participant_2_id.eq.${sellerId}),and(participant_1_id.eq.${sellerId},participant_2_id.eq.${buyerId})`
      )
      .maybeSingle();

    if (conversationError) {
      console.warn('Failed to fetch conversation:', conversationError.message);
    }

    if (!existingConversation) {
      const { data: newConversation, error: conversationInsertError } = await supabase
        .from('conversations')
        .insert([
          {
            participant_1_id: buyerId,
            participant_2_id: sellerId,
            business_id: business.id,
            subject: business.title || 'Conversation',
            last_message: trimmedMessage,
            last_message_date: new Date().toISOString(),
            unread_count: { [sellerId]: 1 },
            contact_status: 'pending',
            accepted_at: null,
            accepted_by: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }
        ])
        .select('*')
        .maybeSingle();

      if (conversationInsertError) {
        console.warn('Failed to create conversation:', conversationInsertError.message);
      }
      conversationRecord = newConversation || null;
    } else {
      const normalizedUnread = { ...(existingConversation.unread_count || {}) };
      const updatedUnread = {
        ...normalizedUnread,
        [sellerId]: (normalizedUnread?.[sellerId] || 0) + 1,
      };
      const { data: updatedConversation, error: conversationUpdateError } = await supabase
        .from('conversations')
        .update({
          last_message: trimmedMessage,
          last_message_date: new Date().toISOString(),
          unread_count: updatedUnread,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingConversation.id)
        .select('*')
        .maybeSingle();

      if (conversationUpdateError) {
        console.warn('Failed to update conversation:', conversationUpdateError.message);
      }

      conversationRecord = updatedConversation || existingConversation;
    }

    if (conversationRecord?.id) {
      try {
        await messageService.sendMessage({
          conversation_id: conversationRecord.id,
          receiver_id: sellerId,
          content: trimmedMessage,
          read: false,
        });
      } catch (error) {
        console.warn('Failed to insert message into messaging inbox:', error?.message || error);
      }
    }
  }

  const existingLeads = await leadService.listLeads({
    businessId: business.id,
    buyerId,
  });

  if (existingLeads.length === 0) {
    await leadService.createLead({
      business_id: business.id,
      buyer_email: buyerEmail,
      buyer_name: buyerName || buyerEmail,
      status: 'new',
      source: 'message',
      last_contact_date: new Date().toISOString(),
    });
  } else {
    await leadService.updateLead(existingLeads[0].id, {
      last_contact_date: new Date().toISOString(),
      status: 'contacted',
    });
  }

  return {
    conversationId: conversationRecord?.id || null,
  };
}

export default {
  sendBusinessMessage,
};