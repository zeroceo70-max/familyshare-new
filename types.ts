
export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  avatarUrl?: string;
  onboardingCompleted: boolean;
}

export interface FamilyCircle {
  id: string;
  name: string;
  members: CircleMember[];
  creatorId: string;
}

export interface CircleMember {
  userId: string;
  name: string;
  avatarUrl?: string;
  isSharingLocation: boolean;
  lastLocation?: LatLng;
  lastSeen?: string; // ISO string
}

export interface LatLng {
  lat: number;
  lng: number;
}

export enum CheckInRequestStatus {
  Pending = 'pending',
  Approved = 'approved',
  Declined = 'declined',
}

export enum CheckInShareDuration {
  Once = 'once',
  OneHour = 'one_hour',
}

export interface CheckInRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  targetId: string;
  targetName: string;
  status: CheckInRequestStatus;
  createdAt: string; // ISO string
  respondedAt?: string; // ISO string
  location?: LatLng;
  photoUrl?: string;
  duration?: CheckInShareDuration;
}

export enum PublicAlertType {
  MissingPerson = 'missing_person',
  LostPet = 'lost_pet',
  CommunitySafety = 'community_safety',
}

export interface PublicAlert {
  id: string;
  type: PublicAlertType;
  title: string;
  description: string;
  location: LatLng;
  locationDescription: string;
  lastSeenClothing?: string;
  createdAt: string; // ISO string
  creatorId: string;
  creatorName: string;
  status: 'active' | 'resolved' | 'pending_moderation';
}

export interface SightingReport {
  id: string;
  alertId: string;
  reporterId: string; // anonymized
  message: string;
  photoUrl?: string;
  createdAt: string; // ISO string
}

export interface SupervisedDevice {
  id: string;
  childId: string;
  childName: string;
  childAvatarUrl?: string;
  status: 'active' | 'pending' | 'revoked';
  lastLocation?: LatLng;
  lastSeen?: string; // ISO string
  screenTimeLimit: number; // in minutes
  approvedApps: string[];
}
