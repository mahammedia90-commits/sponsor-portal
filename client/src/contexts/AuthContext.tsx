/**
 * AuthContext — Manus OAuth + tRPC integration
 * Provides authentication state and sponsor data from the real API
 */
import React, { createContext, useContext, useMemo } from 'react';
import { useAuth as useCoreAuth } from '@/_core/hooks/useAuth';
import { trpc } from '@/lib/trpc';

// Re-export types for backward compatibility
export interface Sponsor {
  id: number;
  companyName: string;
  brandName: string;
  contactPerson: string;
  email: string;
  phone: string;
  country: string;
  industry: string;
  companySize: string;
  marketingBudget: string;
  targetMarket: string;
  website: string;
  linkedIn: string;
  avatar?: string;
  verificationStatus: 'pending' | 'submitted' | 'under_review' | 'verified' | 'rejected';
  role: 'sponsor';
}

interface AuthContextType {
  // Auth state
  user: any;
  loading: boolean;
  isAuthenticated: boolean;
  logout: () => Promise<void>;
  // Sponsor profile
  sponsor: Sponsor | null;
  // Notification count
  unreadCount: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated, logout } = useCoreAuth();

  // Fetch sponsor profile if authenticated
  const { data: profileData } = trpc.profile.get.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
    refetchOnWindowFocus: false,
  });

  // Fetch unread notification count
  const { data: notifData } = trpc.notifications.unreadCount.useQuery(undefined, {
    enabled: isAuthenticated,
    retry: false,
    refetchOnWindowFocus: false,
    refetchInterval: 30000, // Refresh every 30s
  });

  const sponsor = useMemo<Sponsor | null>(() => {
    if (!profileData) return null;
    return {
      id: profileData.id ?? 0,
      companyName: profileData.companyNameAr || profileData.companyNameEn || '',
      brandName: profileData.brandName || '',
      contactPerson: profileData.contactPerson || user?.name || '',
      email: user?.email || '',
      phone: profileData.phone || '',
      country: profileData.country || '',
      industry: profileData.industry || '',
      companySize: profileData.companySize || '',
      marketingBudget: profileData.marketingBudget || '',
      targetMarket: profileData.targetMarket || '',
      website: profileData.website || '',
      linkedIn: profileData.linkedIn || '',
      logoUrl: profileData.logoUrl || '',
      verificationStatus: profileData.verificationStatus || 'pending',
      role: 'sponsor',
    } as Sponsor;
  }, [profileData, user]);

  const unreadCount = typeof notifData === 'number' ? notifData : (notifData as any)?.count ?? 0;

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      isAuthenticated,
      logout,
      sponsor,
      unreadCount,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
