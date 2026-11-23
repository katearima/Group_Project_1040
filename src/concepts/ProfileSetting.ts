import { randomUUID } from "node:crypto";

export type User = string;
export type Profile = string;
export type Role = "FOUNDER" | "BUILDER";
export type Entries = string[];

export interface ProfileRow {
  profile: Profile;
  owner: User;
  role: Role;
  name: string;
  university: string;
  major: string;
  graduationYear: number;
  skills: Entries;
  experience: string;
  interests: Entries;
  location: string;
  latitude: number;
  longitude: number;
  availability: number;
  startupPitch?: string;
  visible: boolean;
}

/** The editable fields shared by createProfile and updateProfile. */
export interface ProfileFields {
  name: string;
  university: string;
  major: string;
  graduationYear: number;
  skills: Entries;
  experience: string;
  interests: Entries;
  location: string;
  latitude: number;
  longitude: number;
  availability: number;
}

export type GetProfileRow = Omit<ProfileRow, "owner">;

export interface RecommendationDataRow {
  role: Role;
  visible: boolean;
  skills: Entries;
  interests: Entries;
  university: string;
  latitude: number;
  longitude: number;
  availability: number;
}

export interface CandidateRow {
  candidate: User;
  skills: Entries;
  interests: Entries;
  university: string;
  latitude: number;
  longitude: number;
  availability: number;
}

export const PROFILE_ALREADY_EXISTS_DETAIL = "You already have a profile.";
export const INVALID_PROFILE_DETAIL =
  "Graduation year, coordinates, availability, skills, and interests must be valid.";
export const PITCH_PROFILE_NOT_FOUND_DETAIL = "Create a profile first.";
export const PITCH_NOT_FOUNDER_DETAIL = "Only founders can have a startup pitch.";
export const EMPTY_PITCH_DETAIL = "A startup pitch must not be empty.";
export const UPDATE_PROFILE_NOT_FOUND_DETAIL = "Create a profile first.";
export const INVALID_PROFILE_UPDATE_DETAIL =
  "Graduation year, coordinates, availability, skills, and interests must be valid.";
export const UPDATE_WOULD_UNPUBLISH_DETAIL =
  "A visible profile must stay complete; hide it before removing required details.";
export const PUBLISH_PROFILE_NOT_FOUND_DETAIL = "Create a profile first.";
export const PROFILE_INCOMPLETE_DETAIL =
  "Add a name, location, at least one skill and interest, and, for founders, a startup pitch before publishing.";
export const PROFILE_NOT_VISIBLE_DETAIL = "You do not have a visible profile.";

/** Refusal PROFILE_ALREADY_EXISTS. */
export class ProfileAlreadyExists extends Error {}
/** Refusal INVALID_PROFILE. */
export class InvalidProfile extends Error {}
/** Refusal PITCH_PROFILE_NOT_FOUND. */
export class PitchProfileNotFound extends Error {}
/** Refusal PITCH_NOT_FOUNDER. */
export class PitchNotFounder extends Error {}
/** Refusal EMPTY_PITCH. */
export class EmptyPitch extends Error {}
/** Refusal UPDATE_PROFILE_NOT_FOUND. */
export class UpdateProfileNotFound extends Error {}
/** Refusal INVALID_PROFILE_UPDATE. */
export class InvalidProfileUpdate extends Error {}
/** Refusal UPDATE_WOULD_UNPUBLISH. */
export class UpdateWouldUnpublish extends Error {}
/** Refusal PUBLISH_PROFILE_NOT_FOUND. */
export class PublishProfileNotFound extends Error {}
/** Refusal PROFILE_INCOMPLETE. */
export class ProfileIncomplete extends Error {}
/** Refusal PROFILE_NOT_VISIBLE. */
export class ProfileNotVisible extends Error {}

function isBlank(text: string): boolean {
  return text.trim().length === 0;
}

function validEntries(entries: unknown): entries is Entries {
  return (
    Array.isArray(entries) &&
    entries.every((entry) => typeof entry === "string" && !isBlank(entry))
  );
}

/** The profile data is valid (State rule: graduation year, coordinates, availability, entries). */
function validData(fields: ProfileFields): boolean {
  return (
    Number.isInteger(fields.graduationYear) &&
    fields.graduationYear > 0 &&
    Number.isFinite(fields.latitude) &&
    fields.latitude >= -90 &&
    fields.latitude <= 90 &&
    Number.isFinite(fields.longitude) &&
    fields.longitude >= -180 &&
    fields.longitude <= 180 &&
    Number.isFinite(fields.availability) &&
    fields.availability >= 0 &&
    validEntries(fields.skills) &&
    validEntries(fields.interests)
  );
}

/** The profile is complete enough to be visible. */
function complete(row: {
  role: Role;
  name: string;
  location: string;
  skills: Entries;
  interests: Entries;
  startupPitch?: string;
}): boolean {
  return (
    !isBlank(row.name) &&
    !isBlank(row.location) &&
    row.skills.length > 0 &&
    row.interests.length > 0 &&
    (row.role !== "FOUNDER" || row.startupPitch !== undefined)
  );
}

function pickFields(fields: ProfileFields): ProfileFields {
  return {
    name: fields.name,
    university: fields.university,
    major: fields.major,
    graduationYear: fields.graduationYear,
    skills: [...fields.skills],
    experience: fields.experience,
    interests: [...fields.interests],
    location: fields.location,
    latitude: fields.latitude,
    longitude: fields.longitude,
    availability: fields.availability,
  };
}

export interface ProfileSettingDependencies {
  /** Source of fresh opaque Profile identities. */
  freshProfile?: () => Profile;
  initial?: Iterable<ProfileRow>;
}

export class ProfileSettingConcept {
  readonly #freshProfile: () => Profile;
  /** Profiles in creation order. */
  #profiles: ProfileRow[] = [];
  #byOwner = new Map<User, ProfileRow>();

  constructor({ freshProfile = randomUUID, initial = [] }: ProfileSettingDependencies = {}) {
    this.#freshProfile = freshProfile;
    for (const row of initial) {
      const copy: ProfileRow = { ...row, skills: [...row.skills], interests: [...row.interests] };
      this.#profiles.push(copy);
      this.#byOwner.set(copy.owner, copy);
    }
  }

  createProfile(
    input: { user: User; role: Role } & ProfileFields,
  ): { profile: Profile } {
    if (this.#byOwner.has(input.user)) {
      throw new ProfileAlreadyExists(PROFILE_ALREADY_EXISTS_DETAIL);
    }
    if ((input.role !== "FOUNDER" && input.role !== "BUILDER") || !validData(input)) {
      throw new InvalidProfile(INVALID_PROFILE_DETAIL);
    }
    const row: ProfileRow = {
      profile: this.#freshProfile(),
      owner: input.user,
      role: input.role,
      ...pickFields(input),
      visible: false,
    };
    this.#profiles.push(row);
    this.#byOwner.set(row.owner, row);
    return { profile: row.profile };
  }

  setStartupPitch({ user, pitch }: { user: User; pitch: string }): Record<string, never> {
    const row = this.#byOwner.get(user);
    if (row === undefined) throw new PitchProfileNotFound(PITCH_PROFILE_NOT_FOUND_DETAIL);
    if (row.role !== "FOUNDER") throw new PitchNotFounder(PITCH_NOT_FOUNDER_DETAIL);
    if (typeof pitch !== "string" || isBlank(pitch)) throw new EmptyPitch(EMPTY_PITCH_DETAIL);
    row.startupPitch = pitch;
    return {};
  }

  updateProfile(input: { user: User } & ProfileFields): Record<string, never> {
    const row = this.#byOwner.get(input.user);
    if (row === undefined) throw new UpdateProfileNotFound(UPDATE_PROFILE_NOT_FOUND_DETAIL);
    if (!validData(input)) throw new InvalidProfileUpdate(INVALID_PROFILE_UPDATE_DETAIL);
    const fields = pickFields(input);
    if (row.visible && !complete({ ...fields, role: row.role, startupPitch: row.startupPitch })) {
      throw new UpdateWouldUnpublish(UPDATE_WOULD_UNPUBLISH_DETAIL);
    }
    Object.assign(row, fields);
    return {};
  }

  publishProfile({ user }: { user: User }): Record<string, never> {
    const row = this.#byOwner.get(user);
    if (row === undefined) throw new PublishProfileNotFound(PUBLISH_PROFILE_NOT_FOUND_DETAIL);
    if (!complete(row)) throw new ProfileIncomplete(PROFILE_INCOMPLETE_DETAIL);
    row.visible = true;
    return {};
  }

  hideProfile({ user }: { user: User }): Record<string, never> {
    const row = this.#byOwner.get(user);
    if (row === undefined || !row.visible) throw new ProfileNotVisible(PROFILE_NOT_VISIBLE_DETAIL);
    row.visible = false;
    return {};
  }

  _getProfile({ user }: { user: User }): GetProfileRow[] {
    const row = this.#byOwner.get(user);
    if (row === undefined) return [];
    const { owner: _owner, ...rest } = row;
    const result: GetProfileRow = {
      ...rest,
      skills: [...row.skills],
      interests: [...row.interests],
    };
    if (row.startupPitch === undefined) delete result.startupPitch;
    return [result];
  }

  _getVisibleProfiles(): Array<{ profile: Profile; owner: User }> {
    return this.#profiles
      .filter((row) => row.visible)
      .map((row) => ({ profile: row.profile, owner: row.owner }));
  }

  _recommendationData({ user }: { user: User }): RecommendationDataRow[] {
    const row = this.#byOwner.get(user);
    if (row === undefined) return [];
    return [
      {
        role: row.role,
        visible: row.visible,
        skills: [...row.skills],
        interests: [...row.interests],
        university: row.university,
        latitude: row.latitude,
        longitude: row.longitude,
        availability: row.availability,
      },
    ];
  }

  _visibleCandidates({ user }: { user: User }): CandidateRow[] {
    const own = this.#byOwner.get(user);
    if (own === undefined) return [];
    return this.#profiles
      .filter((row) => row.visible && row.role !== own.role)
      .map((row) => ({
        candidate: row.owner,
        skills: [...row.skills],
        interests: [...row.interests],
        university: row.university,
        latitude: row.latitude,
        longitude: row.longitude,
        availability: row.availability,
      }));
  }
}
