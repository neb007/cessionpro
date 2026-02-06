/**
 * Base44 Client with Supabase Integration
 * 
 * This client provides real database operations using Supabase
 */

import { supabase } from './supabaseClient';

/**
 * Creates a simple axios-like client for making HTTP requests
 * @param {Object} config - Configuration object
 * @param {string} config.baseURL - Base URL for the client
 * @param {Object} config.headers - Default headers
 * @param {string} config.token - Authentication token
 * @param {boolean} config.interceptResponses - Whether to intercept responses
 * @returns {Object} - Axios-like client object
 */
function createAxiosClient(config) {
  const baseURL = config.baseURL || '';
  const headers = config.headers || {};
  const token = config.token;
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return {
    get: async (url) => {
      try {
        const response = await fetch(`${baseURL}${url}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...headers
          }
        });

        const data = await response.json();

        if (!response.ok) {
          const errorObj = {
            message: data.message || 'Request failed',
            status: response.status,
            data: data
          };
          throw errorObj;
        }

        return data;
      } catch (error) {
        throw error;
      }
    },

    post: async (url, data) => {
      try {
        const response = await fetch(`${baseURL}${url}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (!response.ok) {
          const errorObj = {
            message: responseData.message || 'Request failed',
            status: response.status,
            data: responseData
          };
          throw errorObj;
        }

        return responseData;
      } catch (error) {
        throw error;
      }
    },

    put: async (url, data) => {
      try {
        const response = await fetch(`${baseURL}${url}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            ...headers
          },
          body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (!response.ok) {
          const errorObj = {
            message: responseData.message || 'Request failed',
            status: response.status,
            data: responseData
          };
          throw errorObj;
        }

        return responseData;
      } catch (error) {
        throw error;
      }
    }
  };
}

// Real base44 client with Supabase integration
const base44 = {
  auth: {
    me: async () => {
      // Return authenticated user from Supabase
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        throw { status: 401, message: 'Not authenticated' };
      }
      return {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.name || user.email
      };
    },
    logout: (redirectUrl) => {
      supabase.auth.signOut();
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_email');
      if (typeof redirectUrl === 'string' && redirectUrl.includes('http')) {
        window.location.href = redirectUrl;
      }
    },
    redirectToLogin: (redirectUrl) => {
      if (typeof redirectUrl === 'string') {
        localStorage.setItem('redirect_after_login', redirectUrl);
      }
      window.location.href = '/login';
    },
    updateMe: async (data) => {
      try {
        // Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
          throw { status: 401, message: 'Not authenticated' };
        }

        // Update profiles table with all user data
        const profileData = {
          role: data.role || data.user_type || 'user',
          company_name: data.company_name || null,
          phone: data.phone || null,
          bio: data.bio || null,
          avatar_url: data.avatar_url || null,
          // Store additional fields as JSON in a metadata column
          location: data.location || null,
          sectors_interest: data.sectors_interest || [],
          budget_min: data.budget_min || null,
          budget_max: data.budget_max || null,
          experience: data.experience || null,
          visible_in_directory: data.visible_in_directory !== false,
          preferred_language: data.preferred_language || 'fr'
        };

        console.log('Updating profile:', profileData);

        const { data: updatedProfile, error: updateError } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('id', user.id)
          .select();

        if (updateError) {
          console.error('Profile update error:', updateError);
          throw updateError;
        }

        console.log('Profile updated successfully:', updatedProfile);
        return { success: true, data: updatedProfile?.[0] };
      } catch (error) {
        console.error('Error in updateMe:', error);
        throw error;
      }
    }
  },

  entities: {
    Business: {
      list: async (sortBy = 'created_at') => {
        try {
          let query = supabase
            .from('businesses')
            .select('*')
            .order(sortBy || 'created_at', { ascending: false });

          const { data, error } = await query;
          if (error) throw error;
          return data || [];
        } catch (error) {
          console.error('Error listing businesses:', error);
          return [];
        }
      },

      filter: async (filters = {}) => {
        try {
          let query = supabase.from('businesses').select('*');

          // Apply filters
          if (filters.id) {
            query = query.eq('id', filters.id);
          }
          if (filters.seller_id) {
            query = query.eq('seller_id', filters.seller_id);
          }
          if (filters.seller_email) {
            // If email provided, we need to get the user ID first
            try {
              const { data: { user }, error } = await supabase.auth.getUser();
              if (user && user.email === filters.seller_email) {
                query = query.eq('seller_id', user.id);
              }
            } catch (e) {
              console.warn('Could not map email to seller_id');
            }
          }
          if (filters.status) {
            query = query.eq('status', filters.status);
          }
          if (filters.sector) {
            query = query.eq('sector', filters.sector);
          }
          if (filters.country) {
            query = query.eq('country', filters.country);
          }
          if (filters.minPrice && filters.maxPrice) {
            query = query.gte('asking_price', filters.minPrice)
              .lte('asking_price', filters.maxPrice);
          }
          if (filters.searchText) {
            query = query.or(`title.ilike.%${filters.searchText}%,description.ilike.%${filters.searchText}%,location.ilike.%${filters.searchText}%`);
          }

          // Apply sorting
          query = query.order('created_at', { ascending: false });

          const { data, error } = await query;
          if (error) throw error;
          return data || [];
        } catch (error) {
          console.error('Error filtering businesses:', error);
          return [];
        }
      },

      create: async (data) => {
        try {
          const { data: businessData, error } = await supabase
            .from('businesses')
            .insert([{
              ...data,
              status: data.status || 'active',
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            }])
            .select();

          if (error) throw error;
          console.log('Business created:', businessData);
          return businessData?.[0] || { id: 'new-id', ...data };
        } catch (error) {
          console.error('Error creating business:', error);
          throw error;
        }
      },

      update: async (id, data) => {
        try {
          const { data: businessData, error } = await supabase
            .from('businesses')
            .update({
              ...data,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();

          if (error) throw error;
          console.log('Business updated:', businessData);
          return businessData?.[0] || { id, ...data };
        } catch (error) {
          console.error('Error updating business:', error);
          throw error;
        }
      },

      delete: async (id) => {
        try {
          const { error } = await supabase
            .from('businesses')
            .delete()
            .eq('id', id);

          if (error) throw error;
          return { success: true };
        } catch (error) {
          console.error('Error deleting business:', error);
          throw error;
        }
      }
    },

    Lead: {
      list: async (sortBy = 'created_date') => {
        try {
          const { data, error } = await supabase
            .from('leads')
            .select('*')
            .order(sortBy || 'created_date', { ascending: false });

          if (error) throw error;
          return data || [];
        } catch (error) {
          console.error('Error listing leads:', error);
          return [];
        }
      },

      filter: async (filters = {}) => {
        try {
          let query = supabase.from('leads').select('*');

          if (filters.buyer_email) {
            query = query.eq('buyer_email', filters.buyer_email);
          }
          if (filters.seller_email) {
            query = query.eq('seller_email', filters.seller_email);
          }
          if (filters.status) {
            query = query.eq('status', filters.status);
          }

          query = query.order('created_date', { ascending: false });

          const { data, error } = await query;
          if (error) throw error;
          return data || [];
        } catch (error) {
          console.error('Error filtering leads:', error);
          return [];
        }
      },

      create: async (data) => {
        try {
          const { data: leadData, error } = await supabase
            .from('leads')
            .insert([{
              ...data,
              status: data.status || 'new',
              created_date: new Date().toISOString()
            }])
            .select();

          if (error) throw error;
          return leadData?.[0] || { id: 'new-id', ...data };
        } catch (error) {
          console.error('Error creating lead:', error);
          throw error;
        }
      },

      update: async (id, data) => {
        try {
          const { data: leadData, error } = await supabase
            .from('leads')
            .update({
              ...data,
              updated_date: new Date().toISOString()
            })
            .eq('id', id)
            .select();

          if (error) throw error;
          return leadData?.[0] || { id, ...data };
        } catch (error) {
          console.error('Error updating lead:', error);
          throw error;
        }
      },

      delete: async (id) => {
        try {
          const { error } = await supabase.from('leads').delete().eq('id', id);
          if (error) throw error;
          return { success: true };
        } catch (error) {
          console.error('Error deleting lead:', error);
          throw error;
        }
      }
    },

    Favorite: {
      list: async () => {
        try {
          const { data, error } = await supabase
            .from('favorites')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          return data || [];
        } catch (error) {
          console.error('Error listing favorites:', error);
          return [];
        }
      },

      filter: async (filters = {}) => {
        try {
          let query = supabase.from('favorites').select('*');

          if (filters.user_id) {
            query = query.eq('user_id', filters.user_id);
          }
          if (filters.user_email) {
            // If email provided, map to user_id
            try {
              const { data: { user }, error } = await supabase.auth.getUser();
              if (user && user.email === filters.user_email) {
                query = query.eq('user_id', user.id);
              }
            } catch (e) {
              console.warn('Could not map email to user_id');
            }
          }
          if (filters.business_id) {
            query = query.eq('business_id', filters.business_id);
          }

          const { data, error } = await query;
          if (error) throw error;
          return data || [];
        } catch (error) {
          console.error('Error filtering favorites:', error);
          return [];
        }
      },

      create: async (data) => {
        try {
          const { data: favData, error } = await supabase
            .from('favorites')
            .insert([{
              ...data,
              created_at: new Date().toISOString()
            }])
            .select();

          if (error) throw error;
          return favData?.[0] || { id: 'new-id', ...data };
        } catch (error) {
          console.error('Error creating favorite:', error);
          throw error;
        }
      },

      delete: async (id) => {
        try {
          const { error } = await supabase.from('favorites').delete().eq('id', id);
          if (error) throw error;
          return { success: true };
        } catch (error) {
          console.error('Error deleting favorite:', error);
          throw error;
        }
      }
    },

    Conversation: {
      list: async (sortBy = 'updated_at') => {
        try {
          const { data, error } = await supabase
            .from('conversations')
            .select('*')
            .order(sortBy || 'updated_at', { ascending: false });

          if (error) throw error;
          return data || [];
        } catch (error) {
          console.error('Error listing conversations:', error);
          return [];
        }
      },

      filter: async (filters = {}) => {
        try {
          let query = supabase.from('conversations').select('*');

          if (filters.user_email) {
            query = query.or(`sender_email.eq.${filters.user_email},recipient_email.eq.${filters.user_email}`);
          }

          query = query.order('updated_at', { ascending: false });

          const { data, error } = await query;
          if (error) throw error;
          return data || [];
        } catch (error) {
          console.error('Error filtering conversations:', error);
          return [];
        }
      },

      create: async (data) => {
        try {
          const { data: convData, error } = await supabase
            .from('conversations')
            .insert([{
              ...data,
              created_date: new Date().toISOString(),
              updated_date: new Date().toISOString()
            }])
            .select();

          if (error) throw error;
          return convData?.[0] || { id: 'new-id', ...data };
        } catch (error) {
          console.error('Error creating conversation:', error);
          throw error;
        }
      },

      update: async (id, data) => {
        try {
          const { data: convData, error } = await supabase
            .from('conversations')
            .update({
              ...data,
              updated_date: new Date().toISOString()
            })
            .eq('id', id)
            .select();

          if (error) throw error;
          return convData?.[0] || { id, ...data };
        } catch (error) {
          console.error('Error updating conversation:', error);
          throw error;
        }
      }
    },

    Message: {
      list: async () => {
        try {
          const { data, error } = await supabase
            .from('messages')
            .select('*')
            .order('created_at', { ascending: false });

          if (error) throw error;
          return data || [];
        } catch (error) {
          console.error('Error listing messages:', error);
          return [];
        }
      },

      filter: async (filters = {}) => {
        try {
          let query = supabase.from('messages').select('*');

          if (filters.conversation_id) {
            query = query.eq('conversation_id', filters.conversation_id);
          }

          query = query.order('created_at', { ascending: true });

          const { data, error } = await query;
          if (error) throw error;
          return data || [];
        } catch (error) {
          console.error('Error filtering messages:', error);
          return [];
        }
      },

      create: async (data) => {
        try {
          const { data: msgData, error } = await supabase
            .from('messages')
            .insert([{
              ...data,
              created_date: new Date().toISOString()
            }])
            .select();

          if (error) throw error;
          return msgData?.[0] || { id: 'new-id', ...data };
        } catch (error) {
          console.error('Error creating message:', error);
          throw error;
        }
      },

      update: async (id, data) => {
        try {
          const { data: msgData, error } = await supabase
            .from('messages')
            .update(data)
            .eq('id', id)
            .select();

          if (error) throw error;
          return msgData?.[0] || { id, ...data };
        } catch (error) {
          console.error('Error updating message:', error);
          throw error;
        }
      }
    },

    User: {
      list: async () => {
        try {
          const { data, error } = await supabase.auth.admin.listUsers();
          if (error) throw error;
          return data?.users || [];
        } catch (error) {
          console.error('Error listing users:', error);
          return [];
        }
      }
    }
  },

  integrations: {
    Core: {
      UploadFile: async ({ file }) => {
        try {
          const fileName = `${Date.now()}_${file.name}`;
          const { data, error } = await supabase.storage
            .from('Cession')
            .upload(fileName, file);

          if (error) throw error;

          const { data: publicUrl } = supabase.storage
            .from('Cession')
            .getPublicUrl(data.path);

          return {
            file_url: publicUrl.publicUrl
          };
        } catch (error) {
          console.error('Error uploading file:', error);
          throw error;
        }
      }
    }
  },

  appLogs: {
    logUserInApp: async (pageName) => {
      console.log('User navigated to:', pageName);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          try {
            await supabase.from('app_logs').insert([{
              user_id: user.id,
              page_name: pageName,
              created_at: new Date().toISOString()
            }]);
          } catch (logError) {
            // Silently fail if app_logs table doesn't exist or there's an error
            console.debug('App logs not available:', logError?.message);
          }
        }
      } catch (error) {
        // Silently handle auth errors
        console.debug('Could not log user activity:', error?.message);
      }
      return { success: true };
    }
  }
};

export { base44, createAxiosClient };
