/**
 * Almanac Content Studio v0.1 — production metadata, never a publish API.
 * The contract is intentionally restrictive: a model draft is not approval,
 * and a review flag must reference the exact source-locked revision.
 */
export type ContentStatus =
  | "proposed" | "sourced" | "curriculum_mapped" | "ai_draft"
  | "automated_qa" | "expert_review" | "approved" | "published"
  | "rejected" | "needs_sources" | "needs_license" | "superseded";
export type ContentMedium = "reading" | "retrieval" | "flashcards" | "diagram" | "video" | "audio" | "simulation";

export type EvidenceSource = Readonly<{
  sourceId: string;
  title: string;
  publisher: string;
  editionOrVersion: string;
  reference: string;
  rights: "verified_licensed" | "public_domain" | "original" | "unverified";
  verifiedAt: string;
}>;

export type ContentCandidate = Readonly<{
  schemaVersion: 1;
  assetId: string;
  courseId: string;
  objectiveId: string;
  medium: ContentMedium;
  status: ContentStatus;
  title: string;
  objectives: readonly string[];
  sourceIds: readonly string[];
  evidence: readonly EvidenceSource[];
  artifactSha256: string | null;
  authorType: "human" | "ai_assisted";
  modelId: string | null;
  promptVersion: string | null;
  reviewerId: string | null;
  approvedArtifactSha256: string | null;
  approvalRecordId: string | null;
  accessibility: Readonly<{
    transcriptApproved: boolean;
    altTextApproved: boolean;
    keyboardReviewed: boolean;
  }>;
}>;

export type Validation = Readonly<{ acceptedForPublication: boolean; errors: readonly string[] }>;
const slug = (v: string) => /^[a-z0-9][a-z0-9-]{1,119}$/.test(v);
const sha = (v: unknown) => typeof v === "string" && /^[a-f0-9]{64}$/i.test(v);

export function validatePublication(candidate: ContentCandidate): Validation {
  const errors: string[] = [];
  if (candidate.schemaVersion !== 1) errors.push("unsupported_schema");
  if (![candidate.assetId, candidate.courseId, candidate.objectiveId].every(slug)) errors.push("invalid_identity");
  if (!candidate.title.trim() || !candidate.objectives.length || candidate.objectives.some(x => x.trim().length < 12))
    errors.push("unmeasurable_objective");
  if (!candidate.evidence.length || !candidate.sourceIds.length ||
    candidate.sourceIds.some(id => !candidate.evidence.some(e => e.sourceId === id)) ||
    candidate.evidence.some(e => !slug(e.sourceId) || !e.title.trim() || !e.publisher.trim() || !e.editionOrVersion.trim() ||
      !e.reference.trim() || !e.verifiedAt.trim() || e.rights === "unverified"))
    errors.push("source_or_rights_unverified");
  if (candidate.authorType === "ai_assisted" && (!candidate.modelId || !candidate.promptVersion))
    errors.push("generation_provenance_missing");
  if (candidate.status !== "approved" && candidate.status !== "published")
    errors.push("content_not_approved");
  if (!sha(candidate.artifactSha256) || candidate.artifactSha256 !== candidate.approvedArtifactSha256 ||
    !candidate.reviewerId || !candidate.approvalRecordId)
    errors.push("revision_not_approved");
  if (!candidate.accessibility.keyboardReviewed ||
    (candidate.medium === "video" || candidate.medium === "audio") && !candidate.accessibility.transcriptApproved ||
    candidate.medium === "diagram" && !candidate.accessibility.altTextApproved)
    errors.push("accessibility_not_reviewed");
  return { acceptedForPublication: errors.length === 0, errors };
}
