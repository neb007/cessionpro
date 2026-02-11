/**
 * Smart Matching Service
 * Service pour gérer les critères et scores du Smart Matching
 */

import { supabase } from '@/api/supabaseClient';
import { calculateSmartMatchScore } from './smartMatchingEngine';

/**
 * Sauvegarde les critères de recherche de l'utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @param {Object} criteria - Critères d'recherche
 * @returns {Promise<Object>} Les critères sauvegardés
 */
export async function saveUserCriteria(userId, criteria) {
  try {
    const { data, error } = await supabase
      .from('smart_matching_criteria')
      .upsert(
        {
          user_id: userId,
          ...criteria,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'user_id' }
      )
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving criteria:', error);
    throw error;
  }
}

/**
 * Récupère les critères de l'utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<Object>} Les critères utilisateur
 */
export async function getUserCriteria(userId) {
  try {
    const { data, error } = await supabase
      .from('smart_matching_criteria')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code === 'PGRST116') {
      // No rows found - return null
      return null;
    }

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching criteria:', error);
    throw error;
  }
}

/**
 * Calcule les scores pour tous les listings vs critères utilisateur
 * @param {string} buyerId - ID de l'acheteur
 * @param {Array} listings - Tableau des annonces
 * @param {Object} criteria - Critères de recherche
 * @returns {Promise<Array>} Tableau des scores
 */
export async function calculateAndSaveScores(buyerId, listings, criteria) {
  try {
    const scores = [];

    // Calculer le score pour chaque listing
    for (const listing of listings) {
      const matchResult = calculateSmartMatchScore(listing, criteria);

      scores.push({
        buyer_id: buyerId,
        listing_id: listing.id,
        score: matchResult.score,
        score_breakdown: matchResult.breakdown,
        explanation: matchResult.explanation,
        criteria_matched: matchResult.criteriaMatched,
      });
    }

    // Sauvegarder tous les scores en DB
    if (scores.length > 0) {
      const { error } = await supabase
        .from('smart_matching_scores')
        .upsert(scores, { onConflict: 'buyer_id, listing_id' });

      if (error) throw error;
    }

    return scores;
  } catch (error) {
    console.error('Error calculating scores:', error);
    throw error;
  }
}

/**
 * Récupère les scores pour un acheteur
 * @param {string} buyerId - ID de l'acheteur
 * @returns {Promise<Array>} Tableau des scores
 */
export async function getScoresForBuyer(buyerId) {
  try {
    const { data, error } = await supabase
      .from('smart_matching_scores')
      .select('*')
      .eq('buyer_id', buyerId)
      .order('score', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching scores:', error);
    throw error;
  }
}

/**
 * Récupère le score pour une combination buyer/listing
 * @param {string} buyerId - ID de l'acheteur
 * @param {string} listingId - ID de l'annonce
 * @returns {Promise<Object>} Le score
 */
export async function getScore(buyerId, listingId) {
  try {
    const { data, error } = await supabase
      .from('smart_matching_scores')
      .select('*')
      .eq('buyer_id', buyerId)
      .eq('listing_id', listingId)
      .single();

    if (error && error.code === 'PGRST116') {
      return null;
    }

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error fetching score:', error);
    throw error;
  }
}

/**
 * Récupère les listings avec leurs scores pour un acheteur
 * @param {string} buyerId - ID de l'acheteur
 * @param {Array} listings - Tableau des annonces
 * @returns {Promise<Array>} Listings enrichis avec scores
 */
export async function getListingsWithScores(buyerId, listings) {
  try {
    const scores = await getScoresForBuyer(buyerId);
    const scoreMap = {};

    scores.forEach((score) => {
      scoreMap[score.listing_id] = score;
    });

    // Enrichir les listings avec les scores
    const enrichedListings = listings.map((listing) => ({
      ...listing,
      smartMatchScore: scoreMap[listing.id] || {
        score: 0,
        explanation: [],
        criteria_matched: 0,
      },
    }));

    // Trier par score décroissant
    return enrichedListings.sort(
      (a, b) => b.smartMatchScore.score - a.smartMatchScore.score
    );
  } catch (error) {
    console.error('Error getting listings with scores:', error);
    throw error;
  }
}

/**
 * Supprime les scores pour un utilisateur
 * @param {string} buyerId - ID de l'acheteur
 * @returns {Promise<void>}
 */
export async function deleteScoresForBuyer(buyerId) {
  try {
    const { error } = await supabase
      .from('smart_matching_scores')
      .delete()
      .eq('buyer_id', buyerId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting scores:', error);
    throw error;
  }
}

/**
 * Réinitialise les critères de l'utilisateur
 * @param {string} userId - ID de l'utilisateur
 * @returns {Promise<void>}
 */
export async function resetUserCriteria(userId) {
  try {
    const { error } = await supabase
      .from('smart_matching_criteria')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error resetting criteria:', error);
    throw error;
  }
}

/**
 * Récupère les listings avec scores filtrés par score minimum
 * @param {string} buyerId - ID de l'acheteur
 * @param {Array} listings - Tableau des annonces
 * @param {number} minScore - Score minimum (0-100)
 * @returns {Promise<Array>} Listings filtrés et triés
 */
export async function getTopMatchingListings(
  buyerId,
  listings,
  minScore = 50
) {
  try {
    const enrichedListings = await getListingsWithScores(buyerId, listings);
    return enrichedListings.filter(
      (listing) => listing.smartMatchScore.score >= minScore
    );
  } catch (error) {
    console.error('Error getting top matching listings:', error);
    throw error;
  }
}
