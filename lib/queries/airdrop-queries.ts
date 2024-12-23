import { prisma } from '../prisma';

// Query to get all eligible users for an airdrop
export async function getEligibleUsers() {
  return prisma.$queryRaw`
    SELECT 
        u.id, 
        w.id AS wallet_id
    FROM 
        "public"."User" u
    JOIN 
        "public"."Wallet" w ON u.id = w.userId
    JOIN 
        "public"."Eligibility" e ON u.id = e.userId
    WHERE 
        e.isEligible = true;
  `;
}

// Query to get all pending claims for a specific airdrop
export async function getPendingClaims(airdropId: number) {
  return prisma.$queryRaw`
    SELECT 
        c.id, 
        c.userId, 
        c.createdAt
    FROM 
        "public"."Claim" c
    WHERE 
        c.airdropId = ${airdropId} 
        AND c.status = 'PENDING';
  `;
}

// Query to update claim status
export async function updateClaimStatus(claimId: number, newStatus: string) {
  return prisma.$executeRaw`
    UPDATE 
        "public"."Claim"
    SET 
        status = ${newStatus}
    WHERE 
        id = ${claimId};
  `;
}

// Query to get airdrop statistics
export async function getAirdropStats() {
  return prisma.$queryRaw`
    SELECT 
        a.id AS airdrop_id,
        COUNT(c.id) AS total_claims,
        SUM(CASE WHEN c.status = 'CLAIMED' THEN 1 ELSE 0 END) AS successful_claims,
        SUM(CASE WHEN c.status = 'FAILED' THEN 1 ELSE 0 END) AS failed_claims,
        SUM(CASE WHEN c.status = 'PENDING' THEN 1 ELSE 0 END) AS pending_claims
    FROM 
        "public"."Airdrop" a
    LEFT JOIN 
        "public"."Claim" c ON a.id = c.airdropId
    GROUP BY 
        a.id;
  `;
}
