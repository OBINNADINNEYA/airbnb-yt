import { supabase } from './supabase';
import { useState } from 'react';
import { useRouter } from 'next/router';

export type User = {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
};

export type Space = {
  id: string;
  title: string;
  description?: string;
  price_per_hour: number;
  location?: string;
  images?: string[];
  is_available: boolean;
  user_id?: string;
  created_at: string;
  space_type?: string;
  room_type?: string;
  linen_service?: boolean;
  reception_area?: boolean;
  user?: User;
  bookings?: Booking[];
};

export type Favorite = {
  id: string;
  userId?: string;
  spaceId?: string;
  createAt: string;
};

export type Booking = {
  id: string;
  space_id: string;
  user_id: string;
  start_time: string;
  end_time: string;
  total_price?: number;
  status: string;
  created_at: string;
};

type SpaceFilters = {
  location?: string;
  space_type?: string;
  room_type?: string;
  linen_service?: boolean;
  reception_area?: boolean;
  min_price?: number;
  max_price?: number;
  category?: string;
};


export const db = {
  // User operations
  async getUser(id: string) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data as User;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  },

  async createUser(user: Omit<User, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .insert(user)
        .select()
        .single();
      
      if (error) throw error;
      return data as User;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Space operations
 // Updated getSpaces function with filtering

 async getSpaces(filters: SpaceFilters = {}) {
  try {
    let query = supabase
      .from("spaces")
      .select("*, space_categories!inner(categories!inner(name))");

    if (filters.category) {
      query = query.eq("space_categories.categories.name", filters.category);
    }
    if (filters.location) {
      query = query.ilike("location", `%${filters.location}%`);
    }

    if (filters.space_type) {
      query.eq("space_type", filters.space_type);
    }

    if (filters.room_type) {
      query.eq("room_type", filters.room_type);
    }

    if (filters.linen_service !== undefined) {
      query.eq("linen_service", filters.linen_service);
    }

    if (filters.reception_area !== undefined) {
      query.eq("reception_area", filters.reception_area);
    }

    if (filters.min_price !== undefined) {
      query.gte("price_per_hour", filters.min_price);
    }

    if (filters.max_price !== undefined) {
      query.lte("price_per_hour", filters.max_price);
    }

    const { data, error } = await query;

    if (error) throw error;

    const mappedSpaces = (data ?? []).map((space) => ({
      ...space,
      categoryNames:
        space.space_categories?.map((sc: any) => sc.categories?.name) ?? [],
    }));

    return mappedSpaces as (Space & { categoryNames?: string[] })[];
  } catch (error) {
    console.error("Error fetching spaces:", error);
    throw error;
  }
},


async getSpace(id: string) {
  try {
    const { data, error } = await supabase
      .from('spaces')
      .select('*, user:users(*), bookings(*), space_categories:space_categories!inner(category:categories(name, icon))')
      .eq('id', id)
      .single();

    if (error) throw error;

    // Extract category name(s)
    const categoryNames = data?.space_categories?.map((sc: any) => sc.category?.name) ?? [];

    return {
      ...data,
      categoryNames, // or categoryName: categoryNames[0] if you only want one
    };
  } catch (error) {
    console.error('Error fetching space:', error);
    throw error;
  }
},

  async createSpace(space: Omit<Space, 'id' | 'created_at'>) {
    try {
      const { data, error } = await supabase
        .from('spaces')
        .insert({ ...space, created_at: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data as Space;
    } catch (error) {
      console.error('Error creating space:', error);
      throw error;
    }
  },

  async updateSpace(id: string, updates: Partial<Space>) {
    try {
      const { data, error } = await supabase
        .from('spaces')
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return data as Space;
    } catch (error) {
      console.error('Error updating space:', error);
      throw error;
    }
  },

  // Favorite operations
  async getFavorites(userId: string) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select('*, spaces(*)')
        .eq('userId', userId);
      
      if (error) throw error;
      return data as (Favorite & { spaces: Space })[];
    } catch (error) {
      console.error('Error fetching favorites:', error);
      throw error;
    }
  },

  async createFavorite(favorite: Omit<Favorite, 'id' | 'createAt'>) {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({ ...favorite, createAt: new Date().toISOString() })
        .select()
        .single();
      
      if (error) throw error;
      return data as Favorite;
    } catch (error) {
      console.error('Error creating favorite:', error);
      throw error;
    }
  },

  async deleteFavorite(id: string) {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    } catch (error) {
      console.error('Error deleting favorite:', error);
      throw error;
    }
  },

  // Booking operations
  async getBookings(userId: string) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .select('*, spaces(*)')
        .eq('user_id', userId);
      
      if (error) throw error;
      return data as (Booking & { spaces: Space })[];
    } catch (error) {
      console.error('Error fetching bookings:', error);
      throw error;
    }
  },

  async createBooking(booking: Omit<Booking, 'id' | 'created_at' | 'status'>) {
    try {
      const { data, error } = await supabase
        .from('bookings')
        .insert({ 
          ...booking, 
          created_at: new Date().toISOString(),
          status: 'pending'
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as Booking;
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }
};
