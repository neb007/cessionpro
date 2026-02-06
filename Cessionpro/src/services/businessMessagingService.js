import { base44 } from '@/api/base44Client';

/**
 * Shared helper to send a message about a business.
 * Handles conversation creation/update, message creation, and lead tracking.
 */
export async function sendBusinessMessage({ business, buyerEmail, buyerName, message }) {
  if (!business?.id) {
    throw new Error('Business information is required');
  }
  if (!business?.seller_email) {
    throw new Error('Business seller email is missing');
  }
  if (!buyerEmail) {
    throw new Error('Buyer email is required');
  }
  const trimmedMessage = message?.trim();
  if (!trimmedMessage) {
    throw new Error('Message content is empty');
  }

  // Fetch existing conversations once to reuse the same logic everywhere.
  const conversations = await base44.entities.Conversation.list();
  let conversation = conversations.find(
    (c) =>
      c.business_id === business.id &&
      c.participant_emails?.includes(buyerEmail) &&
      c.participant_emails?.includes(business.seller_email)
  );

  if (!conversation) {
    conversation = await base44.entities.Conversation.create({
      participant_emails: [buyerEmail, business.seller_email],
      business_id: business.id,
      business_title: business.title,
      last_message: trimmedMessage,
      last_message_date: new Date().toISOString(),
      unread_count: { [business.seller_email]: 1 },
    });
  } else {
    await base44.entities.Conversation.update(conversation.id, {
      last_message: trimmedMessage,
      last_message_date: new Date().toISOString(),
      unread_count: {
        ...conversation.unread_count,
        [business.seller_email]: (conversation.unread_count?.[business.seller_email] || 0) + 1,
      },
    });
  }

  await base44.entities.Message.create({
    conversation_id: conversation.id,
    sender_email: buyerEmail,
    receiver_email: business.seller_email,
    content: trimmedMessage,
    business_id: business.id,
    read: false,
  });

  const existingLeads = await base44.entities.Lead.filter({
    business_id: business.id,
    buyer_email: buyerEmail,
  });

  if (existingLeads.length === 0) {
    await base44.entities.Lead.create({
      business_id: business.id,
      buyer_email: buyerEmail,
      buyer_name: buyerName || buyerEmail,
      status: 'new',
      source: 'message',
      last_contact_date: new Date().toISOString(),
    });
  } else {
    await base44.entities.Lead.update(existingLeads[0].id, {
      last_contact_date: new Date().toISOString(),
      status: 'contacted',
    });
  }

  return {
    conversationId: conversation.id,
  };
}

export default {
  sendBusinessMessage,
};