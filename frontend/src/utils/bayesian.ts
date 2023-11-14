interface BayesianRatingProps {
    averageRatingScore: number;
    totalMembersOfRating: number;
    globalAverageRating: number;
    totalRatingMembers: number;
}

function bayesianRating(bayesianRating: BayesianRatingProps): number {
    const { averageRatingScore, totalMembersOfRating, globalAverageRating, totalRatingMembers } = bayesianRating;

    if (averageRatingScore === 0 && totalMembersOfRating === 0 && globalAverageRating === 0 && totalRatingMembers === 0) {
        return 0;
    }

    const bayesian = ((averageRatingScore * totalMembersOfRating) + (globalAverageRating * totalRatingMembers)) /
        (totalMembersOfRating + totalRatingMembers);

    return bayesian;
}

export { bayesianRating };
export type { BayesianRatingProps };
