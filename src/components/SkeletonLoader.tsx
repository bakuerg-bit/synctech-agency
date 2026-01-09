const SkeletonCard = () => {
    return (
        <div className="animate-pulse">
            <div className="bg-muted/50 h-48 rounded-lg mb-4"></div>
            <div className="h-4 bg-muted/50 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-muted/50 rounded w-1/2"></div>
        </div>
    );
};

export const PortfolioSkeleton = () => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
};

export const BlogSkeleton = () => {
    return (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, i) => (
                <SkeletonCard key={i} />
            ))}
        </div>
    );
};

export default SkeletonCard;
